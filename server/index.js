import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json({ limit: "3mb" }));

// =========================
// FILE UPLOAD
// =========================

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});


// =========================
// STOP WORDS
// =========================

const STOP = new Set([
  "and",
  "the",
  "for",
  "with",
  "that",
  "this",
  "from",
  "your",
  "you",
  "are",
  "will",
  "our",
  "their",
  "have",
  "has",
  "into",
  "using",
  "use",
  "job",
  "work",
  "team",
  "years",
  "year",
  "role",
  "skills",
  "skill",
  "experience",
  "developer",
  "engineer",
  "software",
  "required",
  "preferred",
  "ability",
  "strong",
]);


// =========================
// TOKENIZER
// =========================

const tokens = (text) => {
  return [
    ...new Set(
      (
        text
          .toLowerCase()
          .match(/[a-z][a-z0-9+#./-]{2,}/g) || []
      )
        .map((x) =>
          x.replace(/[.,;:()]/g, "")
        )
        .filter(
          (x) =>
            !STOP.has(x) &&
            !/^[0-9]+$/.test(x)
        )
    ),
  ];
};


// =========================
// RESUME TEXT EXTRACTION
// =========================

async function extract(file) {
  if (!file) {
    return "";
  }

  if (
    file.originalname
      .toLowerCase()
      .endsWith(".pdf")
  ) {
    const data = await pdfParse(
      fs.readFileSync(file.path)
    );

    return data.text;
  }

  if (
    file.originalname
      .toLowerCase()
      .endsWith(".docx")
  ) {
    const data =
      await mammoth.extractRawText({
        path: file.path,
      });

    return data.value;
  }

  return "";
}


// =========================
// AI ANALYSIS
// =========================

async function ai(resume, job) {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
Analyze this resume against this job as an ATS.

Return ONLY JSON with:

jobTitle,
score,
matchedKeywords,
missingKeywords,
missingSkills,
strengths,
recommendations,
sections

Do not invent experience.

RESUME:
${resume.slice(0, 18000)}

JOB:
${job.slice(0, 12000)}
`;

  const response =
    await client.chat.completions.create({
      model:
        process.env.OPENAI_MODEL ||
        "gpt-4o-mini",

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content:
            "Return strict JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

  return JSON.parse(
    response.choices[0].message.content
  );
}


// =========================
// LOCAL ATS ANALYSIS
// =========================

function local(resume, job) {
  const resumeTokens = tokens(resume);
  const jobTokens = tokens(job);

  const matched = jobTokens
    .filter((x) =>
      resumeTokens.includes(x)
    )
    .slice(0, 25);

  const missing = jobTokens
    .filter(
      (x) =>
        !resumeTokens.includes(x)
    )
    .slice(0, 25);

  const score = Math.max(
    35,
    Math.min(
      97,
      Math.round(
        (matched.length /
          Math.max(jobTokens.length, 1)) *
          100
      )
    )
  );

  const map = {
    docker:
      "Docker and containerization",

    aws:
      "Cloud deployment platforms such as AWS/GCP/Azure",

    gcp:
      "Cloud deployment platforms such as AWS/GCP/Azure",

    azure:
      "Cloud deployment platforms such as AWS/GCP/Azure",

    postgresql:
      "PostgreSQL",

    testing:
      "Automated backend testing",

    system:
      "System design for backend services",

    logging:
      "Logging, monitoring, and debugging practices",
  };

  const missingSkills = [
    ...new Set(
      Object.entries(map)
        .filter(
          ([key]) =>
            jobTokens.includes(key) &&
            !resumeTokens.includes(key)
        )
        .map(([, value]) => value)
    ),
  ];

  return {
    jobTitle:
      job.split(/\n/)[0]?.trim() ||
      "Job Fit Analysis",

    score,

    matchedKeywords: matched,

    missingKeywords: missing,

    missingSkills,

    strengths: [
      `Technical stack directly matches ${matched
        .slice(0, 6)
        .join(", ")}.`,

      "Projects provide evidence of hands-on development.",

      "Entry-level profile is suitable for software engineering roles.",
    ],

    recommendations: [
      missingSkills.length
        ? `Only add these missing skills if you genuinely know them: ${missingSkills.join(
            ", "
          )}.`
        : "Keep the skills section focused on technologies used in real projects.",

      "Add measurable outcomes to project bullets where possible.",

      "Use job-description terminology naturally in relevant project and experience bullets.",

      "Keep formatting simple, ATS-readable, and consistent.",
    ],

    sections: {
      Summary:
        "Strong entry-level software engineering profile with practical project experience.",

      Skills: matched
        .slice(0, 15)
        .join(", "),

      Projects:
        "Show technology, problem solved, implementation, and measurable result.",

      Education:
        "B.Tech / Computer Science and Engineering",
    },
  };
}


// =========================
// ANALYZE API
// =========================

app.post(
  "/api/analyze",
  upload.single("resume"),
  async (req, res) => {
    try {
      const text = await extract(req.file);

      const job =
        req.body.jobDescription || "";

      if (!text.trim()) {
        return res.status(400).json({
          error:
            "Could not extract resume text. Use a text-based PDF or DOCX.",
        });
      }

      if (!job.trim()) {
        return res.status(400).json({
          error:
            "Job description is required.",
        });
      }

      let output = await ai(
        text,
        job
      );

      if (!output) {
        output = local(
          text,
          job
        );
      }

      output.resumeText = text;

      output.mode =
        process.env.OPENAI_API_KEY
          ? "AI"
          : "Local";

      if (req.file) {
        fs.unlink(
          req.file.path,
          () => {}
        );
      }

      res.json(output);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Analysis failed: " +
          error.message,
      });
    }
  }
);


// =========================
// COVER LETTER API
// =========================

app.post(
  "/api/cover-letter",
  async (req, res) => {

    try {
      const {
        resumeText,
        jobDescription,
        analysis,
      } = req.body;

      // AI cover letter
      if (process.env.OPENAI_API_KEY) {

        const client =
          new OpenAI({
            apiKey:
              process.env.OPENAI_API_KEY,
          });

        const response =
          await client.chat.completions.create({
            model:
              process.env.OPENAI_MODEL ||
              "gpt-4o-mini",

            messages: [
              {
                role: "user",

                content: `
Write a concise professional cover letter.

Do not invent experience.

Resume:
${String(resumeText).slice(
  0,
  10000
)}

Job:
${String(jobDescription).slice(
  0,
  8000
)}

Analysis:
${JSON.stringify(analysis)}
`,
              },
            ],
          });

        return res.json({
          coverLetter:
            response.choices[0]
              .message.content,
        });
      }

      // Local fallback
      res.json({
        coverLetter: `Dear Hiring Manager,

I am excited to apply for the ${
          analysis?.jobTitle ||
          "Software Engineer"
        } position. My background in software development and hands-on projects has helped me build practical skills aligned with the role.

I would welcome the opportunity to discuss how my technical skills, problem-solving ability, and project experience can contribute to your team.

Sincerely,
Mohammad Sami`,
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Cover letter generation failed: " +
          error.message,
      });
    }
  }
);


// =========================
// HEALTH CHECK
// =========================

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      ok: true,
    });
  }
);


// =========================
// START SERVER
// =========================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      `RezumeAI API running on http://localhost:${PORT}`
    );
  }
);