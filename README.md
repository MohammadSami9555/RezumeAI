# 🚀 RezumeAI — AI-Powered ATS Resume Analyzer

<p align="center">
  <strong>Beat the bots. Land the interview.</strong>
</p>

<p align="center">
  An AI-powered resume analysis platform that helps candidates optimize their resumes for Applicant Tracking Systems (ATS) and specific job descriptions.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/OpenAI-Powered-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

---

## 📌 Overview

**RezumeAI** is a full-stack AI-powered Resume / ATS Analyzer built with **React + Vite** on the frontend and **Node.js + Express.js** on the backend.

The application allows users to upload a resume, paste a target job description, and receive an ATS-style analysis containing:

- 🎯 ATS compatibility score
- 🔍 Matched keywords
- ⚠️ Missing keywords
- 🛠️ Missing technical skills
- 💪 Resume strengths
- 💡 Actionable recommendations
- 📊 Resume section analysis
- ✉️ AI-generated cover letter
- 📥 Downloadable ATS report
- 🕘 Previous analysis history

RezumeAI also includes a **local keyword-based fallback engine**, allowing basic resume analysis even when an OpenAI API key is not configured.

> **Note:** The ATS score is an estimated optimization score and does not represent the official scoring system of any particular ATS or employer.

---

# ✨ Features

## 📄 Resume Upload

Upload your resume in:

- PDF
- DOCX

The backend automatically extracts resume text before performing the analysis.

---

## 🎯 ATS Score

Get an estimated ATS compatibility score out of **100** based on the alignment between your resume and the target job description.

The score considers relevant keywords and technologies detected in both the resume and job description.

---

## 🔍 Keyword Analysis

RezumeAI compares the resume with the target job description and identifies relevant terminology.

### ✅ Matched Keywords

Technologies, tools, skills, and terminology already detected in the resume.

### ❌ Missing Keywords

Important terms from the job description that are not detected in the resume.

### 🛠️ Missing Skills

Potential technical skills that could improve alignment with the target role.

> Missing skills should only be added to a resume when the candidate genuinely possesses those skills.

---

## 💡 Resume Recommendations

Get actionable suggestions for improving your resume, including:

- Adding relevant job-specific terminology
- Improving project descriptions
- Adding measurable outcomes
- Improving skills-section relevance
- Using consistent ATS-friendly formatting
- Aligning project and experience descriptions with the target role

---

## 📊 Resume Section Analysis

RezumeAI provides analysis of important resume sections such as:

- Summary
- Skills
- Projects
- Education

The analysis is based on the target job description and detected resume content.

---

## 🤖 AI-Powered Analysis

When an OpenAI API key is configured, RezumeAI can perform more contextual resume analysis.

AI mode can provide:

- Job-specific analysis
- Context-aware recommendations
- Structured ATS results
- Resume strengths
- Missing skills
- Tailored cover letters

The application is designed to avoid intentionally inventing experience that is not present in the supplied resume.

---

## 🧠 Local ATS Fallback

No OpenAI API key?

**No problem.**

RezumeAI automatically falls back to a local keyword-based analysis engine.

This allows the application to provide basic ATS analysis without requiring an external AI API.

The fallback can provide:

- ATS score
- Matched keywords
- Missing keywords
- Missing skills
- Recommendations
- Basic resume section analysis

---

## ✉️ AI Cover Letter Generator

Generate a professional cover letter based on:

- Resume content
- Target job description
- ATS analysis

The generated cover letter can be edited and copied directly from the application.

---

## 🕘 Analysis History

Recent analyses are stored locally in the browser using `localStorage`.

The history includes:

- Job title
- ATS score
- Analysis date

The latest **10 analyses** are retained.

> Analysis history is browser-specific and is not stored in a cloud database.

---

## 📥 Download ATS Report

Generate and download a text-based ATS report containing:

- Job title
- ATS score
- Matched keywords
- Missing keywords
- Recommendations

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React 18 | User interface |
| Vite | Frontend tooling |
| JavaScript | Application logic |
| CSS3 | Styling and responsive UI |
| Lucide React | UI icons |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API |
| Multer | Resume file uploads |
| pdf-parse | PDF text extraction |
| Mammoth | DOCX text extraction |
| CORS | Frontend/backend communication |
| dotenv | Environment variable management |

## AI

| Technology | Purpose |
|---|---|
| OpenAI API | AI-powered resume analysis |
| GPT-4o-mini | Default AI model |
| Local keyword engine | No-AI fallback |

---

# 🏗️ Project Architecture

```text
                         ┌─────────────────────┐
                         │        User         │
                         │ Resume + Job JD     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    React + Vite     │
                         │      Frontend       │
                         └──────────┬──────────┘
                                    │
                              REST API
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  Express.js Backend  │
                         └──────────┬──────────┘
                                    │
                   ┌────────────────┴────────────────┐
                   │                                 │
                   ▼                                 ▼
          ┌─────────────────┐              ┌─────────────────┐
          │  Resume Parser  │              │    OpenAI API   │
          │   PDF / DOCX    │              │   AI Analysis   │
          └────────┬────────┘              └────────┬────────┘
                   │                                │
                   └────────────────┬───────────────┘
                                    ▼
                         ┌─────────────────────┐
                         │    ATS Analysis     │
                         │ Score + Keywords    │
                         │ Skills + Suggestions│
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  Results Dashboard  │
                         │ Cover Letter + Report│
                         └─────────────────────┘
```

---

# 📁 Project Structure

```text
rezumeai/
│
├── client/
│   ├── src/
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── index.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# ⚙️ Installation

## Prerequisites

Make sure you have installed:

- Node.js 18+
- npm
- Git

Check your versions:

```bash
node -v
npm -v
git --version
```

---

## 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd rezumeai
```

---

## 2. Install Dependencies

Install root dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
npm --prefix client install
```

Install backend dependencies:

```bash
npm --prefix server install
```

---

# 🔐 Environment Variables

RezumeAI supports optional OpenAI-powered analysis.

Create the following file:

```text
server/.env
```

Add:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
PORT=5000
```

### 🔒 Security Notice

**Never commit your `.env` file or API key to GitHub.**

The repository includes:

```text
server/.env.example
```

as a safe configuration template.

Your actual:

```text
server/.env
```

should remain local.

---

# ▶️ Run the Application

From the project root:

```bash
npm run dev
```

This starts both the frontend and backend simultaneously.

### Frontend

```text
http://localhost:5173
```

### Backend

```text
http://localhost:5000
```

### Backend Health Check

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "ok": true
}
```

---

# 🔌 API Endpoints

## Analyze Resume

```http
POST /api/analyze
```

Accepts:

- Resume file
- Job description

Returns:

- ATS score
- Matched keywords
- Missing keywords
- Missing skills
- Strengths
- Recommendations
- Section analysis

---

## Generate Cover Letter

```http
POST /api/cover-letter
```

Uses:

- Resume content
- Job description
- ATS analysis

Returns a tailored cover letter.

---

## Health Check

```http
GET /api/health
```

Returns:

```json
{
  "ok": true
}
```

---

# 🤖 AI Mode vs Local Mode

| Feature | AI Mode | Local Mode |
|---|:---:|:---:|
| ATS Score | ✅ | ✅ |
| Keyword Matching | ✅ | ✅ |
| Missing Keywords | ✅ | ✅ |
| Missing Skills | ✅ | ✅ |
| Recommendations | ✅ | ✅ |
| Section Analysis | ✅ | ✅ |
| Contextual Analysis | ✅ | ❌ |
| AI Cover Letter | ✅ | Basic fallback |
| OpenAI API Required | ✅ | ❌ |

---

# 🧪 Production Build

Create the frontend production build:

```bash
npm run build
```

Preview the production build:

```bash
npm --prefix client run preview
```

---

# 🔒 Security & Privacy

RezumeAI is designed to keep sensitive configuration out of source control.

The following files/directories should never be committed:

```text
.env
node_modules/
server/uploads/
client/dist/
```

### API Key Safety

Never expose your OpenAI API key in:

- GitHub repositories
- Frontend JavaScript
- Screenshots
- README files
- Public deployment logs
- Client-side environment variables

The OpenAI API key should only be used by the backend.

---

# ⚠️ Limitations

RezumeAI provides an **estimated ATS optimization score** rather than the actual score used by a specific company's ATS.

Different Applicant Tracking Systems may use different:

- Parsing methods
- Ranking algorithms
- Keyword weighting
- Formatting rules
- Candidate-ranking systems

Therefore, the results should be treated as optimization guidance rather than a guarantee of interview selection.

---

# 🔮 Future Improvements

Planned improvements include:

- 🤖 AI-powered resume rewriting
- ✍️ Inline resume improvement suggestions
- 📄 Professional resume templates
- 📑 PDF ATS report generation
- 🧠 Advanced semantic skill matching
- 👤 User authentication
- ☁️ Cloud-based analysis history
- 📈 Resume scoring history charts
- 🔗 LinkedIn profile analysis
- 💼 Job recommendation system
- 📤 Drag-and-drop resume upload
- 🔎 Advanced ATS formatting checker
- 🗂️ Multiple resume versions
- 🎯 Job-specific resume optimization

---

# 📈 Why RezumeAI?

Traditional resume review often focuses primarily on appearance.

RezumeAI focuses on **job-specific relevance**.

Instead of only asking:

> "Does my resume look good?"

RezumeAI helps answer:

> **"How well does my resume match this specific job?"**

This makes it useful for:

- 🎓 Students
- 👨‍💻 Freshers
- 💻 Software developers
- 🔎 Job seekers
- 💼 Internship applicants
- 🔄 Career switchers

---

# 🎯 Project Goals

RezumeAI was built to demonstrate practical experience with:

- Full-stack web development
- React application development
- REST API design
- File upload handling
- PDF/DOCX parsing
- AI API integration
- Natural language processing concepts
- ATS keyword analysis
- Responsive UI development
- Client-side state management
- Secure environment-variable handling

---

# 👨‍💻 Author

## Mohammad Sami

**Computer Science & Engineering Student | Software Developer | AI/ML Enthusiast**

### Connect

- GitHub: `github.com/MohammadSami9555`
- LinkedIn: `linkedin.com/in/mohammadsami96`

---

# ⭐ Support

If you find RezumeAI useful or interesting, consider giving the repository a **⭐ Star** on GitHub.

---

## 📜 License

This project is available under the **MIT License**.