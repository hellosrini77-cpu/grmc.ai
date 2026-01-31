import React from 'react';
import { Link } from 'react-router-dom';

export default function Post5() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="GRMC.ai" className="h-10 bg-white rounded p-1" />
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">
              Analyze
            </Link>
            <Link to="/blog" className="text-white font-medium">
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link to="/blog" className="text-blue-400 hover:text-blue-300 text-sm mb-8 inline-block">
          ← Back to Blog
        </Link>

        {/* Article Header */}
        <article>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium px-2 py-1 rounded bg-orange-600/20 text-orange-400">
              Audit Preparation
            </span>
            <span className="text-slate-500 text-sm">January 31, 2026</span>
            <span className="text-slate-600 text-sm">•</span>
            <span className="text-slate-500 text-sm">18 min read</span>
          </div>

          <h1 className="text-4xl font-bold mb-6">
            SOC 2 Audit Prep: The Contract Compliance Checklist Your Auditors Are Looking For
          </h1>

          <p className="text-xl text-slate-400 mb-8">
            Your SOC 2 audit is in 90 days. You've documented security controls and gathered evidence. But vendor contract compliance trips up even experienced teams—here's the checklist auditors consistently look for.
          </p>

          {/* Article Content */}
          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-slate-300 mb-4">
              SOC 2 auditors don't just want to see that you have vendor contracts—they want evidence that those contracts contain specific security and compliance commitments aligned with your own SOC 2 obligations. And if you're pursuing SOC 2 Type II, they'll want proof that you're actually monitoring vendor compliance over time.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Why Auditors Care About Your Vendor Contracts</h2>
            
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">The Logic Chain:</h3>
              <ol className="list-decimal pl-6 text-slate-300 space-y-2">
                <li>You've committed to specific security controls in your SOC 2 report</li>
                <li>Many of those controls depend on third-party vendors</li>
                <li>Your ability to meet your commitments requires vendors meeting theirs</li>
                <li>Therefore, your vendor contracts must enforce the security and compliance obligations you need</li>
              </ol>
            </div>

            <p className="text-slate-300 mb-4">
              If any link in this chain is broken, it creates exceptions in your audit report.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">The Complete Contract Compliance Checklist</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">Section 1: Vendor Identification and Risk Assessment</h3>
            
            <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-blue-400 mb-3">What Auditors Want to See:</h4>
              <ul className="list-none text-slate-300 space-y-2">
                <li>✓ Vendor inventory documenting all third parties within SOC 2 scope</li>
                <li>✓ Risk classification for each vendor (critical/high/medium/low)</li>
                <li>✓ Scope determination: which vendors process, store, or transmit in-scope data</li>
                <li>✓ Dependencies mapping: how each vendor supports your security controls</li>
              </ul>
            </div>

            <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-red-400 mb-3">Common Failures:</h4>
              <ul className="list-disc pl-6 text-slate-300 space-y-2">
                <li>Incomplete vendor lists (missing SaaS tools, development vendors, etc.)</li>
                <li>No documented risk assessment methodology</li>
                <li>Inability to explain why certain vendors are in/out of scope</li>
                <li>No connection between vendor services and your control environment</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">Section 2: Security and Confidentiality Provisions</h3>
            
            <p className="text-slate-300 mb-4"><strong>Required Contract Elements:</strong></p>
            <ul className="list-none text-slate-300 mb-4 space-y-2">
              <li>✓ Confidentiality obligations covering in-scope data</li>
              <li>✓ Security commitments aligned with your own security controls</li>
              <li>✓ Data handling requirements: encryption, access controls, monitoring</li>
              <li>✓ Incident notification obligations with specific timeframes</li>
              <li>✓ Return or destruction of data upon contract termination</li>
            </ul>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">✓ Auditors Like:</h4>
                <ul className="text-slate-300 text-sm space-y-2">
                  <li>"Maintain SOC 2 Type II certification, renewed annually"</li>
                  <li>"AES-256 encryption at rest; TLS 1.2+ in transit"</li>
                  <li>"Notify within 24 hours of security incident"</li>
                </ul>
              </div>
              <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">❌ Creates Exceptions:</h4>
                <ul className="text-slate-300 text-sm space-y-2">
                  <li>"Maintain reasonable security measures"</li>
                  <li>"Comply with applicable laws"</li>
                  <li>"Security per vendor policy"</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">Section 3: Audit Rights and Compliance Verification</h3>
            
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
              <h4 className="font-semibold text-blue-400 mb-3">Critical Contract Provisions:</h4>
              <ul className="list-none text-slate-300 space-y-2">
                <li>✓ Right to review vendor's SOC 2/ISO 27001 reports</li>
                <li>✓ Right to conduct security assessments or accept third-party assessments</li>
                <li>✓ Advance notice requirements reasonable enough to actually exercise</li>
                <li>✓ Scope of audit covers systems processing your data</li>
                <li>✓ Frequency: annual at minimum, additional audits for cause</li>
              </ul>
            </div>

            <p className="text-slate-300 mb-4"><strong>Why This Matters:</strong></p>
            <p className="text-slate-300 mb-4">
              You can't just take vendors' word that they're secure. Auditors want evidence that you have the right to verify—and that you're actually doing it.
            </p>

            <p className="text-slate-300 mb-4"><strong>Questions Auditors Ask:</strong></p>
            <ul className="list-disc pl-6 text-slate-300 mb-4 space-y-2">
              <li>How do you know vendor security controls are operating effectively?</li>
              <li>When did you last review vendor compliance evidence?</li>
              <li>What happens if a vendor fails to provide required certifications?</li>
              <li>Have you exercised your audit rights in the past 12 months?</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Section 4: Sub-Contractor Management</h3>
            
            <p className="text-slate-300 mb-4"><strong>Required Contract Terms:</strong></p>
            <ul className="list-none text-slate-300 mb-4 space-y-2">
              <li>✓ Sub-contractor disclosure requirements</li>
              <li>✓ Advance notification of new sub-contractors</li>
              <li>✓ Right to object to sub-contractors that don't meet your requirements</li>
              <li>✓ Flow-down obligations: sub-contractors must meet same security standards</li>
              <li>✓ Vendor liability for sub-contractor failures</li>
            </ul>

            <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-yellow-400 mb-3">⚠️ Red Flags for Auditors:</h4>
              <ul className="list-disc pl-6 text-slate-300 space-y-2">
                <li>Contracts allowing unlimited sub-contracting without notice</li>
                <li>No flow-down of security obligations to sub-contractors</li>
                <li>Vendor disclaims liability for sub-contractor acts</li>
                <li>You can't identify critical vendor sub-contractors</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">Section 5: Business Continuity and Disaster Recovery</h3>
            
            <p className="text-slate-300 mb-4"><strong>What Contracts Should Address:</strong></p>
            <ul className="list-none text-slate-300 mb-4 space-y-2">
              <li>✓ Availability commitments (SLAs aligned with your own availability controls)</li>
              <li>✓ Disaster recovery capabilities and RTOs/RPOs</li>
              <li>✓ Business continuity testing requirements</li>
              <li>✓ Notification of outages or service disruptions</li>
              <li>✓ Backup and redundancy obligations</li>
            </ul>

            <p className="text-slate-300 mb-4">
              <strong>Common Gap:</strong> Many companies have strong internal BC/DR controls but haven't verified that critical vendors have equivalent capabilities. If vendor downtime breaks your availability commitments, auditors will flag it.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Pre-Audit Contract Review Process (90-Day Timeline)</h2>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-blue-400 mb-2">Week 1-2: Inventory and Classification</h4>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Finalize vendor list with business owners</li>
                  <li>• Risk-classify each vendor</li>
                  <li>• Identify which vendors are in SOC 2 scope</li>
                  <li>• Flag vendors with missing or incomplete contracts</li>
                </ul>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-blue-400 mb-2">Week 3-4: Contract Gap Analysis</h4>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Review each in-scope vendor contract against checklist</li>
                  <li>• Document gaps by vendor and severity</li>
                  <li>• Prioritize remediation: critical gaps first</li>
                </ul>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-blue-400 mb-2">Week 5-8: Remediation</h4>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Execute addendums for critical gaps</li>
                  <li>• Obtain updated security certifications from vendors</li>
                  <li>• Conduct security assessments on vendors lacking adequate contract provisions</li>
                  <li>• Document decisions on acceptable risk for remaining gaps</li>
                </ul>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-blue-400 mb-2">Week 9-12: Evidence Gathering</h4>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Collect all vendor SOC 2/ISO 27001 reports</li>
                  <li>• Compile security questionnaire responses</li>
                  <li>• Document audit rights exercise over past 12 months</li>
                  <li>• Prepare vendor compliance monitoring records</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Common Audit Exceptions and How to Avoid Them</h2>

            <div className="space-y-4 mb-6">
              <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">Exception: "Vendor contracts do not contain adequate security requirements"</h4>
                <p className="text-slate-300 text-sm"><strong>Prevention:</strong> Use checklist to ensure all required security provisions are present and specific enough to be enforceable.</p>
              </div>

              <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">Exception: "Company has not verified vendor compliance with contractual security obligations"</h4>
                <p className="text-slate-300 text-sm"><strong>Prevention:</strong> Maintain records of SOC 2 reports received, security questionnaires completed, and assessments conducted within the audit period.</p>
              </div>

              <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">Exception: "Company lacks audit rights to verify vendor security controls"</h4>
                <p className="text-slate-300 text-sm"><strong>Prevention:</strong> Negotiate audit rights into all critical/high-risk vendor contracts; accept third-party reports as alternatives where appropriate.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">The Bottom Line for Audit Success</h2>
            
            <p className="text-slate-300 mb-4">
              Auditors aren't trying to catch you unprepared—they're verifying that your vendor management practices actually support the security commitments in your SOC 2 report.
            </p>

            <p className="text-slate-300 mb-4">
              The organizations that pass SOC 2 audits without exceptions are the ones who:
            </p>
            <ol className="list-decimal pl-6 text-slate-300 mb-4 space-y-2">
              <li>Treat vendor contracts as security controls, not just commercial agreements</li>
              <li>Maintain evidence of vendor compliance verification</li>
              <li>Have processes to identify and remediate gaps before audits begin</li>
              <li>Can demonstrate continuous monitoring, not point-in-time compliance</li>
            </ol>

            <p className="text-slate-300 mb-4">
              Start your contract review now. Waiting until your auditor asks is too late.
            </p>

            <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-6 my-8">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Preparing for SOC 2 audit and need to verify vendor contract compliance at scale?</h3>
              <p className="text-slate-300 mb-4">
                GRMC.ai analyzes your vendor contracts against SOC 2 Trust Services Criteria, identifies gaps, and provides audit-ready documentation—so you can enter your audit with confidence instead of surprises.
              </p>
              <Link 
                to="/" 
                className="inline-block bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Analyze Your Contracts →
              </Link>
            </div>
          </div>
        </article>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-sm mb-4">Share this post</p>
          <div className="flex gap-4">
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://grmc.ai/blog/soc2-audit-contract-compliance')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              LinkedIn
            </a>
            <a 
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent('https://grmc.ai/blog/soc2-audit-contract-compliance')}&text=${encodeURIComponent('SOC 2 Audit Prep: The Contract Compliance Checklist')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>GRMC.ai™ — Governance, Risk Management & Compliance</p>
        <p className="mt-2 text-xs text-slate-600">© 2025 GRMC.ai. All rights reserved.</p>
      </footer>
    </div>
  );
}
