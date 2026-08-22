# RezumeAI — AI Resume / ATS Analyzer

Portfolio-ready React + Express ATS resume analyzer inspired by the app built in Emergent.

## Features
- PDF/DOCX resume upload
- Job description input
- ATS score / matched keywords / missing keywords
- Missing skills and recommendations
- Section analysis
- Cover-letter generator
- Browser history
- Downloadable ATS report
- Local keyword fallback without an AI key
- Optional OpenAI-powered analysis

## Run
```bash
npm install
npm --prefix client install
npm --prefix server install
npm run dev
```
Frontend: http://localhost:5173
Backend: http://localhost:5000

For AI mode, copy `server/.env.example` to `server/.env` and add your API key. Never commit `.env`.

## GitHub
```bash
git init
git add .
git commit -m "Build RezumeAI ATS analyzer"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```
