import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const COMBINED_PROMPT = `You are a legal compliance expert specializing in data privacy and security regulations.

Analyze the following contract text and evaluate its compliance with ALL FOUR frameworks:
1. GDPR Article 28 (Data Processing Agreement requirements)
2. SOC 2 (Vendor security requirements)
3. CCPA/CPRA (California Consumer Privacy Act)
4. HIPAA (Health Insurance Portability and Accountability Act - if applicable)

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
      {"issue": "<missing element>", "remediation": "<specific language to add>"}
    ]
  },
  "soc2": {
    "score": <number 0-100>,
    "applicable": true,
    "checklist": [
      {"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}
    ],
    "gaps": [
      {"issue": "<missing element>", "remediation": "<specific language to add>"}
    ]
  },
  "ccpa": {
    "score": <number 0-100>,
    "applicable": <true/false based on whether contract involves California consumers>,
    "checklist": [
      {"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}
    ],
    "gaps": [
      {"issue": "<missing element>", "remediation": "<specific language to add>"}
    ]
  },
  "hipaa": {
    "score": <number 0-100>,
    "applicable": <true/false based on whether contract involves PHI/healthcare>,
    "checklist": [
      {"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}
    ],
    "gaps": [
      {"issue": "<missing element>", "remediation": "<specific language to add>"}
    ]
  },
  "summary": "<2-3 sentence overall assessment covering applicable frameworks>"
}

Note: Set "applicable" to false for frameworks that don't apply to this contract type (e.g., HIPAA for non-healthcare contracts). Still analyze if unclear, but note low applicability.

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
