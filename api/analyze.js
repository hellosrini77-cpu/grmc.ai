import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const COMBINED_PROMPT = `You are a legal compliance expert specializing in data privacy, security, and financial regulations.

Analyze the following contract text and evaluate its compliance with ALL SIX frameworks:
1. GDPR Article 28 (Data Processing Agreement requirements)
2. SOC 2 (Vendor security requirements)
3. CCPA/CPRA (California Consumer Privacy Act)
4. HIPAA (Health Insurance Portability and Accountability Act - if applicable)
5. ISO 27001 (Information Security Management System requirements)
6. SOX (Sarbanes-Oxley Act - if applicable to financial controls)

**GDPR Article 28 Requirements:**
- Processing scope and purpose clearly defined
- Duration of processing specified
- Types of personal data and data subjects identified
- Security measures (Article 32 compliance)
- Sub-processor requirements (prior authorization, flow-down)
- Assistance with data subject rights
- Deletion/return of data at contract end
- Audit rights for the controller
- Breach notification (typically 72 hours)
- Processing only on documented instructions

**SOC 2 Contract Requirements:**
- Annual SOC 2 Type II report requirement
- Security incident notification
- Confidentiality and data protection
- Encryption requirements (at rest and in transit)
- Access controls and authentication
- Business continuity/disaster recovery
- Right to audit or assess security
- Subcontractor security flow-down
- Data retention and destruction

**CCPA/CPRA Requirements:**
- Definition of "sale" and "sharing" of personal information
- Consumer rights acknowledgment (access, deletion, opt-out)
- Service provider/contractor obligations defined
- Prohibition on selling/sharing PI without consent
- Purpose limitation (use only for contracted services)
- Compliance certification requirement
- Right to audit/verify compliance
- Breach notification requirements
- Data minimization principles
- Retention limitations

**HIPAA Business Associate Agreement (BAA) Requirements:**
- Permitted uses and disclosures of PHI defined
- Safeguards to prevent unauthorized use/disclosure
- Reporting of unauthorized uses/disclosures
- Subcontractor flow-down requirements
- Access to PHI for individual rights requests
- Amendment of PHI upon request
- Accounting of disclosures
- Compliance with Security Rule
- Return or destruction of PHI at termination
- Breach notification (within 60 days)

**ISO 27001 Contract Requirements:**
- Information security obligations explicitly referenced
- Annex A controls or equivalent security framework referenced
- Asset management and classification requirements
- Access control policy requirements (least privilege, role-based)
- Cryptography and encryption standards specified
- Physical and environmental security obligations
- Operations security (change management, logging, monitoring)
- Supplier relationship security (ISO 27001 flow-down or equivalent)
- Incident management and response obligations
- Business continuity and resilience requirements
- Compliance with applicable laws and regulations
- Right to audit for ISO 27001 compliance verification
- Certification requirement (ISO 27001 certificate or equivalent)
- Risk assessment and treatment obligations

**SOX (Sarbanes-Oxley) Contract Requirements:**
- Internal controls over financial reporting (ICFR) obligations
- Access controls for financial systems and data
- Audit trail and logging for financial transactions
- Segregation of duties requirements
- Change management controls for financial systems
- Data integrity and accuracy obligations
- Right to audit financial controls (Section 302/404)
- Retention of financial records (7-year minimum)
- Whistleblower protections referenced
- Management certification of controls (Section 302)
- Timely disclosure of material weaknesses
- IT general controls (ITGC) requirements

For each gap identified, you must:
1. Extract the CURRENT clause text verbatim from the contract. If no clause exists on that topic, set currentClause to "None found."
2. Draft a REPLACEMENT clause in formal legal drafting style suitable for a professional DPA, MSA, BAA, or vendor agreement. The replacement must be complete, standalone, and ready to insert into the contract without further editing.

Respond with a JSON object (no markdown, just pure JSON):
{
  "overallScore": <number 0-100>,
  "gdpr": {
    "score": <number 0-100>,
    "applicable": <true/false based on whether contract involves EU data>,
    "checklist": [
      {"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}
    ],
    "gaps": [
      {
        "issue": "<missing or deficient element>",
        "currentClause": "<verbatim current clause text, or 'None found.' if absent>",
        "replacementClause": "<complete, formal legal drafting style replacement clause, ready to insert into the contract>"
      }
    ]
  },
  "soc2": {
    "score": <number 0-100>,
    "applicable": true,
    "checklist": [
      {"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}
    ],
    "gaps": [
      {
        "issue": "<missing or deficient element>",
        "currentClause": "<verbatim current clause text, or 'None found.' if absent>",
        "replacementClause": "<complete, formal legal drafting style replacement clause, ready to insert into the contract>"
      }
    ]
  },
  "ccpa": {
    "score": <number 0-100>,
    "applicable": <true/false based on whether contract involves California consumers>,
    "checklist": [
      {"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}
    ],
    "gaps": [
      {
        "issue": "<missing or deficient element>",
        "currentClause": "<verbatim current clause text, or 'None found.' if absent>",
        "replacementClause": "<complete, formal legal drafting style replacement clause, ready to insert into the contract>"
      }
    ]
  },
  "hipaa": {
    "score": <number 0-100>,
    "applicable": <true/false based on whether contract involves PHI/healthcare>,
    "checklist": [
      {"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}
    ],
    "gaps": [
      {
        "issue": "<missing or deficient element>",
        "currentClause": "<verbatim current clause text, or 'None found.' if absent>",
        "replacementClause": "<complete, formal legal drafting style replacement clause, ready to insert into the contract>"
      }
    ]
  },
  "iso27001": {
    "score": <number 0-100>,
    "applicable": <true/false based on whether contract involves information security obligations>,
    "checklist": [
      {"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}
    ],
    "gaps": [
      {
        "issue": "<missing or deficient element>",
        "currentClause": "<verbatim current clause text, or 'None found.' if absent>",
        "replacementClause": "<complete, formal legal drafting style replacement clause, ready to insert into the contract>"
      }
    ]
  },
  "sox": {
    "score": <number 0-100>,
    "applicable": <true/false based on whether contract involves financial systems or reporting>,
    "checklist": [
      {"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}
    ],
    "gaps": [
      {
        "issue": "<missing or deficient element>",
        "currentClause": "<verbatim current clause text, or 'None found.' if absent>",
        "replacementClause": "<complete, formal legal drafting style replacement clause, ready to insert into the contract>"
      }
    ]
  },
  "summary": "<2-3 sentence overall assessment covering applicable frameworks>"
}

Note: Set "applicable" to false for frameworks that don't apply to this contract type (e.g., HIPAA for non-healthcare contracts, SOX for non-public-company vendors). Still analyze if unclear, but note low applicability.

CONTRACT TEXT:
`;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { contractText } = req.body;

  if (!contractText) {
    return res.status(400).json({ error: 'Contract text is required' });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: COMBINED_PROMPT + contractText
        }
      ]
    });

    const responseText = message.content[0].text;
    
    // Parse JSON from response
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      // Try to extract JSON from response if wrapped in other text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse response');
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
}
