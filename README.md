# GRMC.ai - Contract Compliance Intelligence

AI-powered contract compliance analysis for GDPR Article 28 and SOC 2 requirements.

## Features

- **PDF Upload**: Extract text from contract PDFs automatically
- **GDPR Article 28 Analysis**: Check DPA compliance against all mandatory requirements
- **SOC 2 Analysis**: Verify vendor contracts meet security requirements
- **Compliance Score**: Get a percentage score with detailed breakdown
- **Gap Analysis**: See exactly what's missing and how to fix it
- **Remediation Suggestions**: Get specific language to add to contracts

## Tech Stack

- React + Vite (Frontend)
- Tailwind CSS (Styling)
- PDF.js (PDF text extraction)
- Claude API (AI analysis)
- Vercel (Hosting + Serverless functions)

## Setup

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxx
   ```

4. Run locally:
   ```bash
   npm run dev
   ```

## Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy!

## API Endpoint

`POST /api/analyze`

Request body:
```json
{
  "contractText": "Your contract text here...",
  "framework": "gdpr" | "soc2"
}
```

Response:
```json
{
  "score": 75,
  "checklist": [
    {"requirement": "Processing scope defined", "present": true, "note": "Clearly stated in Section 2"},
    {"requirement": "Breach notification", "present": false, "note": "No timeline specified"}
  ],
  "gaps": [
    {"issue": "Missing breach notification timeline", "remediation": "Add: Processor shall notify Controller within 72 hours of becoming aware of a personal data breach."}
  ],
  "summary": "This DPA covers most GDPR Article 28 requirements but is missing critical breach notification provisions."
}
```

## License

MIT
