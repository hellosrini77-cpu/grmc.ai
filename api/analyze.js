import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const COMBINED_PROMPT = `You are a legal compliance expert specializing in data privacy, security, financial, and AI governance regulations.

Analyze the following contract text and evaluate its compliance with ALL ELEVEN frameworks:
1. GDPR Article 28 (Data Processing Agreement requirements)
2. SOC 2 (Vendor security requirements)
3. CCPA/CPRA (California Consumer Privacy Act)
4. HIPAA (Health Insurance Portability and Accountability Act - if applicable)
5. ISO 27001 (Information Security Management System requirements)
6. SOX (Sarbanes-Oxley Act - if applicable to financial controls)
7. CMMC (Cybersecurity Maturity Model Certification - if applicable to defense/federal contracts)
8. NIST 800-171 (Protecting Controlled Unclassified Information - if applicable)
9. PCI DSS (Payment Card Industry Data Security Standard - if applicable)
10. FedRAMP (Federal Risk and Authorization Management Program - if applicable)
11. NIST AI RMF (NIST AI Risk Management Framework - if applicable to contracts involving AI systems)

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

**CMMC (Cybersecurity Maturity Model Certification) Contract Requirements:**
- CMMC level requirement explicitly stated (Level 1, 2, or 3)
- Protection of Federal Contract Information (FCI) obligations
- Protection of Controlled Unclassified Information (CUI) obligations
- Incident reporting to US-CERT within 72 hours
- Flow-down of CMMC requirements to subcontractors
- Access control requirements (limit access to authorized users)
- Identification and authentication requirements (MFA)
- Configuration management obligations
- Audit and accountability (log generation and review)
- Risk assessment obligations
- Security assessment and monitoring requirements
- System and communications protection (encryption of CUI in transit)
- System and information integrity (malware protection, patching)
- Media protection for CUI
- Personnel security obligations
- Physical protection of systems handling CUI
- Right to audit CMMC compliance
- CMMC certification or self-assessment requirement referenced

**NIST 800-171 Contract Requirements:**
- Explicit reference to NIST SP 800-171 or CUI protection obligations
- Access control (3.1): Limit system access to authorized users
- Awareness and training (3.2): Security awareness training obligations
- Audit and accountability (3.3): Audit log generation and review
- Configuration management (3.4): Baseline configurations, change control
- Identification and authentication (3.5): MFA for privileged accounts
- Incident response (3.6): Incident response plan, reporting obligations
- Maintenance (3.7): Controlled system maintenance
- Media protection (3.8): Protection and sanitization of CUI media
- Personnel security (3.9): Screening, termination procedures
- Physical protection (3.10): Limit physical access to CUI systems
- Risk assessment (3.11): Periodic risk assessments
- Security assessment (3.12): Periodic control assessments
- System and communications protection (3.13): Encryption of CUI in transit and at rest
- System and information integrity (3.14): Malware protection, security alerts, patching
- System Security Plan (SSP) requirement
- Plan of Action and Milestones (POA&M) requirement
- Flow-down of NIST 800-171 to subcontractors handling CUI

**PCI DSS (Payment Card Industry Data Security Standard) Contract Requirements:**
- Explicit reference to PCI DSS compliance obligations
- Cardholder data protection requirements (encryption, masking)
- Prohibition on storing sensitive authentication data (CVV, full track data)
- Access controls for cardholder data environment (CDE)
- Network segmentation of CDE from other systems
- Vulnerability management and patch obligations
- Security monitoring and logging (Requirement 10)
- Annual PCI DSS assessment or self-assessment questionnaire (SAQ) requirement
- Penetration testing obligations
- Incident response plan for cardholder data breaches
- Immediate breach notification for cardholder data compromise
- Subcontractor PCI DSS flow-down requirements
- Data retention and secure deletion of cardholder data

**FedRAMP (Federal Risk and Authorization Management Program) Contract Requirements:**
- Explicit reference to FedRAMP authorization requirement (Tailored, Low, Moderate, or High)
- FedRAMP Authorization to Operate (ATO) or Provisional ATO (P-ATO) referenced
- NIST SP 800-53 control implementation obligations
- Continuous monitoring program requirements (ConMon)
- Monthly vulnerability scanning obligations
- Annual penetration testing requirement
- Incident reporting to US-CERT within 1 hour for major incidents
- Plan of Action and Milestones (POA&M) maintenance
- System Security Plan (SSP) maintenance and updates
- Federal data sovereignty and data residency requirements (US soil)
- Right to audit FedRAMP compliance by agency or third-party assessor (3PAO)
- Supply chain risk management obligations
- Personnel security and background check requirements
- Encryption of federal data at rest and in transit (FIPS 140-2/3 validated)
- Multi-factor authentication for all privileged and non-privileged accounts
- Configuration management and change control (CM plan)
- Contingency planning and disaster recovery (FIPS-compliant backups)
- Flow-down of FedRAMP requirements to subcontractors and CSPs

**NIST AI RMF (AI Risk Management Framework) Contract Requirements:**
- Explicit reference to NIST AI RMF or AI governance obligations
- AI transparency and explainability: vendor must document and disclose how AI systems make decisions affecting the customer
- Bias and fairness testing: obligations to test AI outputs for bias, discrimination, or disparate impact, and remediate findings
- Human oversight and accountability: requirement for human review, override capability, or kill-switch mechanisms for material AI decisions
- AI incident reporting: obligation to notify customer of AI system failures, unexpected behaviors, or harmful outputs (typically within 24-72 hours)
- Data governance for AI: addressing data quality, provenance, consent, and permitted use for AI training and inference
- AI risk documentation: vendor must maintain and provide upon request AI risk assessments, model cards, or system documentation
- Prohibition on unauthorized AI use: vendor may not use customer data to train AI models without explicit written consent

For each gap identified, you must:
1. Extract the CURRENT clause text verbatim from the contract. If no clause exists on that topic, set currentClause to "None found."
2. Draft a REPLACEMENT clause in formal legal drafting style suitable for a professional DPA, MSA, BAA, or vendor agreement. The replacement must be complete, standalone, and ready to insert into the contract without further editing.

Respond with a JSON object (no markdown, just pure JSON):
{
  "overallScore": <number 0-100>,
  "gdpr": {
    "score": <number 0-100>,
    "applicable": <true/false based on whether contract involves EU data>,
    "checklist": [{"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}],
    "gaps": [{"issue": "<missing or deficient element>", "currentClause": "<verbatim current clause text, or 'None found.' if absent>", "replacementClause": "<complete, formal legal drafting style replacement clause, ready to insert into the contract>"}]
  },
  "soc2": {
    "score": <number 0-100>,
    "applicable": true,
    "checklist": [{"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}],
    "gaps": [{"issue": "<missing or deficient element>", "currentClause": "<verbatim current clause text, or 'None found.' if absent>", "replacementClause": "<complete, formal legal drafting style replacement clause, ready to insert into the contract>"}]
  },
  "ccpa": {
    "score": <number 0-100>,
    "applicable": <true/false based on whether contract involves California consumers>,
    "checklist": [{"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}],
    "gaps": [{"issue": "<missing or deficient element>", "currentClause": "<verbatim current clause text, or 'None found.' if absent>", "replacementClause": "<complete, formal legal drafting style replacement clause, ready to insert into the contract>"}]
  },
  "hipaa": {
    "score": <number 0-100>,
    "applicable": <true/false based on whether contract involves PHI/healthcare>,
    "checklist": [{"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}],
    "gaps": [{"issue": "<missing or deficient element>", "currentClause": "<verbatim current clause text, or 'None found.' if absent>", "replacementClause": "<complete, formal legal drafting style replacement clause, ready to insert into the contract>"}]
  },
  "iso27001": {
    "score": <number 0-100>,
    "applicable": <true/false based on whether contract involves information security obligations>,
    "checklist": [{"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}],
    "gaps": [{"issue": "<missing or deficient element>", "currentClause": "<verbatim current clause text, or 'None found.' if absent>", "replacementClause": "<complete, formal legal drafting style replacement clause, ready to insert into the contract>"}]
  },
  "sox": {
    "score": <number 0-100>,
    "applicable": <true/false based on whether contract involves financial systems or reporting>,
    "checklist": [{"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}],
    "gaps": [{"issue": "<missing or deficient element>", "currentClause": "<verbatim current clause text, or 'None found.' if absent>", "replacementClause": "<complete, formal legal drafting style replacement clause, ready to insert into the contract>"}]
  },
  "cmmc": {
    "score": <number 0-100>,
    "applicable": <true/false based on whether contract involves federal/defense work or CUI/FCI>,
    "checklist": [{"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}],
    "gaps": [{"issue": "<missing or deficient element>", "currentClause": "<verbatim current clause text, or 'None found.' if absent>", "replacementClause": "<complete, formal legal drafting style replacement clause, ready to insert into the contract>"}]
  },
  "nist171": {
    "score": <number 0-100>,
    "applicable": <true/false based on whether contract involves CUI or federal information systems>,
    "checklist": [{"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}],
    "gaps": [{"issue": "<missing or deficient element>", "currentClause": "<verbatim current clause text, or 'None found.' if absent>", "replacementClause": "<complete, formal legal drafting style replacement clause, ready to insert into the contract>"}]
  },
  "pcidss": {
    "score": <number 0-100>,
    "applicable": <true/false based on whether contract involves payment card data or cardholder data environment>,
    "checklist": [{"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}],
    "gaps": [{"issue": "<missing or deficient element>", "currentClause": "<verbatim current clause text, or 'None found.' if absent>", "replacementClause": "<complete, formal legal drafting style replacement clause, ready to insert into the contract>"}]
  },
  "fedramp": {
    "score": <number 0-100>,
    "applicable": <true/false based on whether contract involves cloud services to federal agencies or federal data>,
    "checklist": [{"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}],
    "gaps": [{"issue": "<missing or deficient element>", "currentClause": "<verbatim current clause text, or 'None found.' if absent>", "replacementClause": "<complete, formal legal drafting style replacement clause, ready to insert into the contract>"}]
  },
  "nistaimrf": {
    "score": <number 0-100>,
    "applicable": <true/false based on whether contract involves AI systems, automated decision-making, or machine learning>,
    "checklist": [{"requirement": "<requirement>", "present": <true/false>, "note": "<brief note>"}],
    "gaps": [{"issue": "<missing or deficient element>", "currentClause": "<verbatim current clause text, or 'None found.' if absent>", "replacementClause": "<complete, formal legal drafting style replacement clause, ready to insert into the contract>"}]
  },
  "summary": "<2-3 sentence overall assessment covering applicable frameworks>"
}

Note: Set "applicable" to false for frameworks that don't apply to this contract type (e.g., HIPAA for non-healthcare contracts, SOX for non-public-company vendors, CMMC/NIST 800-171 for non-federal/non-defense contracts, PCI DSS for non-payment contracts, FedRAMP for non-federal cloud contracts, NIST AI RMF for contracts with no AI or automated decision-making components). Still analyze if unclear, but note low applicability.

CONTRACT TEXT:
`;

export default async function handler(req, res) {
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
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
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
