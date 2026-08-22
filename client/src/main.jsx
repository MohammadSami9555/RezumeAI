import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Upload,
  Sparkles,
  FileText,
  History,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Download,
  Copy,
  RotateCcw,
} from "lucide-react";

import "./styles.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Card({ title, children }) {
  return (
    <section className="card">
      <h3>{title}</h3>

      <div className="cardBody">{children}</div>
    </section>
  );
}

function App() {
  const [file, setFile] = useState(null);
  const [job, setJob] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("keywords");
  const [cover, setCover] = useState("");

  const [history, setHistory] = useState(() =>
    JSON.parse(localStorage.getItem("rezume-history") || "[]")
  );

  useEffect(() => {
    localStorage.setItem(
      "rezume-history",
      JSON.stringify(history)
    );
  }, [history]);

  // ================= ANALYZE =================

  async function analyze() {
    setError("");

    if (!job.trim()) {
      return setError(
        "Please paste the full job description."
      );
    }

    if (!file) {
      return setError(
        "Please upload a PDF/DOCX resume."
      );
    }

    setLoading(true);

    try {
      const fd = new FormData();

      fd.append("resume", file);
      fd.append("jobDescription", job);

      const r = await fetch(`${API}/api/analyze`, {
        method: "POST",
        body: fd,
      });

      const d = await r.json();

      if (!r.ok) {
        throw new Error(
          d.error || "Something went wrong."
        );
      }

      setResult(d);
      setTab("keywords");

      setHistory((h) =>
        [
          {
            id: Date.now(),
            title: d.jobTitle,
            score: d.score,
            date: new Date().toLocaleString(),
          },
          ...h,
        ].slice(0, 10)
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // ================= COVER LETTER =================

  async function generateCover() {
    if (!result) return;

    setError("");
    setLoading(true);

    try {
      const r = await fetch(
        `${API}/api/cover-letter`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            resumeText: result.resumeText,
            jobDescription: job,
            analysis: result,
          }),
        }
      );

      const d = await r.json();

      if (!r.ok) {
        throw new Error(
          d.error || "Cover letter generation failed."
        );
      }

      setCover(d.coverLetter);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // ================= REPORT =================

  function report() {
    if (!result) return;

    const t = [
      "REZUMEAI ATS REPORT",
      "Job: " + result.jobTitle,
      "ATS Score: " + result.score + "/100",
      "",
      "MATCHED: " +
        result.matchedKeywords.join(", "),
      "",
      "MISSING: " +
        result.missingKeywords.join(", "),
      "",
      "RECOMMENDATIONS:",

      ...result.recommendations.map(
        (x, i) => `${i + 1}. ${x}`
      ),
    ].join("\n");

    const blob = new Blob([t], {
      type: "text/plain",
    });

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "rezumeai-ats-report.txt";

    a.click();

    URL.revokeObjectURL(a.href);
  }

  // ================= UI =================

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <header className="nav">

        <div className="brand">

          <span className="brandIcon">
            <Sparkles size={18} />
          </span>

          RezumeAI

        </div>

        <nav>
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#faq">FAQ</a>
        </nav>

        <button className="primary">
          Get started
        </button>

      </header>

      {!result ? (

        /* ================= HOME ================= */

        <main className="hero">

          <div className="eyebrow">
            <Sparkles size={15} />
            AI-powered ATS analysis
          </div>

          <h1>
            Beat the bots.
            <br />
            <span>Land the interview.</span>
          </h1>

          <p className="subtitle">
            Upload your resume, paste a job description,
            and get an ATS score with matched keywords,
            missing skills, and actionable recommendations.
          </p>

          <section className="analyzerCard">

            {/* Resume */}

            <div className="field">

              <label>RESUME FILE</label>

              <label className="uploadBox">

                <Upload size={28} />

                <strong>
                  {file
                    ? file.name
                    : "Upload your resume"}
                </strong>

                <small>
                  PDF or DOCX
                </small>

                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) =>
                    setFile(e.target.files[0])
                  }
                />

              </label>

            </div>

            {/* Job Description */}

            <div className="field">

              <label>
                JOB DESCRIPTION
              </label>

              <textarea
                value={job}
                onChange={(e) =>
                  setJob(e.target.value)
                }
                placeholder="Paste the full job description here — responsibilities, requirements, and preferred skills..."
              />

            </div>

            {/* Actions */}

            <div className="actions">

              <button
                className="secondary"
                onClick={() =>
                  setJob(
                    `Software Engineer / Backend Developer
Requirements: Python, JavaScript, SQL, REST API, Node.js/Express.js, PostgreSQL, Docker, AWS, system design, unit testing, integration testing, Git, CI/CD.`
                  )
                }
              >
                Use demo JD
              </button>

              <button
                className="primary large"
                onClick={analyze}
                disabled={loading}
              >

                {loading ? (
                  "Analyzing..."
                ) : (
                  <>
                    Analyze my resume
                    <ArrowRight size={18} />
                  </>
                )}

              </button>

            </div>

            {error && (
              <div className="error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

          </section>

        </main>

      ) : (

        /* ================= DASHBOARD ================= */

        <main className="dashboard">

          {/* New Analysis */}

          <button
            className="back"
            onClick={() => {
              setResult(null);
              setError("");
            }}
          >
            <RotateCcw size={16} />
            New analysis
          </button>

          {/* Analysis Header */}

          <div className="analysisHead">

            <div>

              <div className="eyebrow">
                ANALYSIS
              </div>

              <h1>
                {result.jobTitle}
              </h1>

              <p>
                <FileText size={16} />

                {file?.name || "Resume"}

                {" · "}

                {new Date().toLocaleString()}
              </p>

            </div>

            {/* Score */}

            <div className="scoreCard">

              <span>
                ATS SCORE
              </span>

              <b>
                {result.score}
              </b>

              <small>
                OUT OF 100
              </small>

            </div>

          </div>

          {/* Tabs */}

          <div className="tabs">

            {[
              ["keywords", "Keywords"],
              [
                "recommendations",
                "Recommendations",
              ],
              ["sections", "Sections"],
              ["cover", "Cover Letter"],
              ["history", "History"],
            ].map(([k, n]) => (

              <button
                key={k}
                className={
                  tab === k
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setTab(k)
                }
              >

                {k === "history" && (
                  <History size={15} />
                )}

                {n}

              </button>

            ))}

          </div>

          {/* ================= KEYWORDS ================= */}

          {tab === "keywords" && (

            <div className="grid">

              <Card title="Matched keywords">

                {result.matchedKeywords.map(
                  (x) => (
                    <span
                      className="pill good"
                      key={x}
                    >
                      {x}
                    </span>
                  )
                )}

              </Card>

              <Card title="Missing keywords">

                {result.missingKeywords.map(
                  (x) => (
                    <span
                      className="pill bad"
                      key={x}
                    >
                      {x}
                    </span>
                  )
                )}

              </Card>

              <Card title="Missing skills">

                {result.missingSkills.map(
                  (x) => (
                    <span
                      className="pill bad"
                      key={x}
                    >
                      {x}
                    </span>
                  )
                )}

              </Card>

              <Card title="Strengths">

                {result.strengths.map(
                  (x) => (

                    <div
                      className="line"
                      key={x}
                    >
                      <CheckCircle2 size={17} />
                      {x}
                    </div>

                  )
                )}

              </Card>

            </div>

          )}

          {/* ================= RECOMMENDATIONS ================= */}

          {tab === "recommendations" && (

            <div className="panel">

              <h2>
                What to improve
              </h2>

              {result.recommendations.map(
                (x, i) => (

                  <div
                    className="recommend"
                    key={i}
                  >
                    <b>
                      {i + 1}
                    </b>

                    <span>
                      {x}
                    </span>
                  </div>

                )
              )}

            </div>

          )}

          {/* ================= SECTIONS ================= */}

          {tab === "sections" && (

            <div className="grid">

              {Object.entries(
                result.sections
              ).map(([k, v]) => (

                <Card
                  title={k}
                  key={k}
                >
                  <div className="sectionText">
                    {v}
                  </div>
                </Card>

              ))}

            </div>

          )}

          {/* ================= COVER LETTER ================= */}

          {tab === "cover" && (

            <div className="panel">

              <div className="panelTitle">

                <h2>
                  Tailored cover letter
                </h2>

                <button
                  className="primary"
                  onClick={
                    generateCover
                  }
                  disabled={loading}
                >
                  {loading
                    ? "Generating..."
                    : "Generate"}
                </button>

              </div>

              <textarea
                className="cover"
                value={cover}
                onChange={(e) =>
                  setCover(e.target.value)
                }
                placeholder="Generate a tailored cover letter."
              />

              {cover && (

                <button
                  className="secondary"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      cover
                    )
                  }
                >
                  <Copy size={15} />
                  Copy
                </button>

              )}

            </div>

          )}

          {/* ================= HISTORY ================= */}

          {tab === "history" && (

            <div className="panel">

              <h2>
                Past analyses
              </h2>

              {history.length === 0 ? (

                <p>
                  No previous analyses found.
                </p>

              ) : (

                history.map((h) => (

                  <div
                    className="historyRow"
                    key={h.id}
                  >

                    <span>
                      {h.title}
                    </span>

                    <strong>
                      {h.score}/100
                    </strong>

                    <small>
                      {h.date}
                    </small>

                  </div>

                ))

              )}

            </div>

          )}

          {/* ================= DOWNLOAD ================= */}

          <div className="bottomActions">

            <button
              className="secondary"
              onClick={report}
            >
              <Download size={16} />
              Download report
            </button>

          </div>

          {error && (
            <div className="error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

        </main>

      )}

    </div>
  );
}

// ================= REACT ROOT =================

createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);