import React from 'react';
import { Link } from 'react-router-dom';

export default function Post2() {
  const checklist = [
    {
      requirement: "Process data only on documented instructions from the controller",
      description: "The processor must act solely on the controller's written instructions. Any processing outside these instructions requires explicit authorization.",
      tip: "Look for clauses stating the processor will only process data 'as instructed' or 'pursuant to documented instructions'"
    },
    {
      requirement: "Ensure authorized persons have committed to confidentiality",
      description: "All personnel with access to personal data must be bound by confidentiality obligations, either by contract or statutory duty.",
      tip: "Check for employee confidentiality agreements, NDAs, or references to statutory confidentiality obligations"
    },
    {
      requirement: "Take all security measures required under Article 32",
      description: "Processors must implement appropriate technical and organizational measures including encryption, pseudonymization, and regular security testing.",
      tip: "Look for specific security controls: encryption at rest/in transit, access controls, penetration testing schedules"
    },
    {
      requirement: "Respect conditions for engaging sub-processors",
      description: "Either obtain prior specific authorization for each sub-processor, or general written authorization with notification of changes and right to object.",
      tip: "Check for sub-processor lists, notification procedures, and objection rights"
    },
    {
      requirement: "Assist the controller with data subject rights requests",
      description: "The processor must help the controller respond to requests for access, rectification, erasure, portability, and objections.",
      tip: "Look for specific SLAs on response times and procedures for handling DSARs"
    },
    {
      requirement: "Assist with security, breach notification, and DPIAs",
      description: "Processors must help controllers comply with Articles 32-36, including breach notification within specified timeframes and Data Protection Impact Assessments.",
      tip: "Check for breach notification timelines (72 hours is the GDPR standard) and DPIA cooperation clauses"
    },
    {
      requirement: "Delete or return all personal data after services end",
      description: "At the controller's choice, the processor must delete or return all personal data and delete existing copies, unless EU law requires storage.",
      tip: "Look for clear data deletion/return procedures and certification of deletion"
    },
    {
      requirement: "Make available all information to demonstrate compliance",
      description: "The processor must provide the controller with all information necessary to demonstrate compliance with Article 28 obligations.",
      tip: "Check for audit rights, compliance documentation, and reporting requirements"
    },
    {
      requirement: "Allow and contribute to audits and inspections",
      description: "The processor must allow the controller (or their auditor) to conduct audits and inspections, and actively contribute to these reviews.",
      tip: "Look for audit rights with reasonable notice periods, scope definitions, and cost allocation"
    },
    {
      requirement: "Inform controller if instructions infringe GDPR",
      description: "If the processor believes an instruction from the controller would violate GDPR or other data protection laws, they must immediately inform the controller.",
      tip: "Check for notification obligations and procedures when legal conflicts arise"
    }
  ];

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
            <span className="text-xs font-medium px-2 py-1 rounded bg-green-600/20 text-green-400">
              Compliance Guide
            </span>
            <span className="text-slate-500 text-sm">January 19, 2026</span>
            <span className="text-slate-600 text-sm">•</span>
            <span className="text-slate-500 text-sm">5 min read</span>
          </div>

          <h1 className="text-4xl font-bold mb-6">
            GDPR Article 28 Checklist: What Your Vendor Contracts Must Include
          </h1>

          <p className="text-xl text-slate-400 mb-8">
            A comprehensive checklist of the 10 mandatory requirements for Data Processing Agreements under GDPR Article 28. Use this to review your DPAs or validate vendor contracts.
          </p>

          {/* Quick Summary */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">Quick Summary</h3>
            <p className="text-slate-300 mb-4">
              GDPR Article 28 requires a binding contract between data controllers and processors. This contract must include specific provisions covering instructions, confidentiality, security, sub-processors, data subject rights, breach notification, and audit rights.
            </p>
            <p className="text-slate-400 text-sm">
              Missing any of these 10 requirements could result in non-compliance and potential fines up to €20 million or 4% of annual turnover.
            </p>
          </div>

          {/* Article Content */}
          <div className="prose prose-invert prose-slate max-w-none">
            <h2 className="text-2xl font-bold mt-8 mb-4">Why Article 28 Matters</h2>
            <p className="text-slate-300 mb-4">
              When you share personal data with a vendor (processor), GDPR holds you (the controller) responsible for ensuring they handle that data properly. Article 28 specifies exactly what must be in your Data Processing Agreement (DPA) to protect both parties and—most importantly—the data subjects.
            </p>
            <p className="text-slate-300 mb-8">
              Many organizations use template DPAs from their vendors without verifying all requirements are met. This checklist helps you spot gaps before they become compliance issues.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-6">The 10 Mandatory Requirements</h2>
          </div>

          {/* Checklist */}
          <div className="space-y-4 mb-8">
            {checklist.map((item, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.requirement}
                    </h3>
                    <p className="text-slate-400 text-sm mb-3">
                      {item.description}
                    </p>
                    <div className="bg-slate-900 rounded-lg p-3">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">What to look for:</p>
                      <p className="text-slate-300 text-sm">{item.tip}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-6 my-8">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Automate Your Compliance Checks</h3>
            <p className="text-slate-300 mb-4">
              Manually checking contracts against this list takes hours. GRMC.ai analyzes your DPAs against GDPR Article 28 (and SOC 2, CCPA, HIPAA) in seconds—with specific remediation recommendations for each gap.
            </p>
            <Link 
              to="/" 
              className="inline-block bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Analyze Your DPA Free →
            </Link>
          </div>

          {/* Additional Content */}
          <div className="prose prose-invert prose-slate max-w-none">
            <h2 className="text-2xl font-bold mt-8 mb-4">Common Gaps We See</h2>
            <p className="text-slate-300 mb-4">
              After analyzing hundreds of DPAs, here are the most common Article 28 gaps:
            </p>
            <ul className="list-disc pl-6 text-slate-300 mb-4 space-y-2">
              <li><strong>Vague sub-processor clauses</strong> — No clear list or notification procedure</li>
              <li><strong>Missing breach notification timelines</strong> — "Promptly" isn't a number</li>
              <li><strong>Weak audit rights</strong> — No clear mechanism to verify compliance</li>
              <li><strong>Unclear data deletion procedures</strong> — What happens when the contract ends?</li>
              <li><strong>No DPIA cooperation clause</strong> — Leaves controllers unable to complete impact assessments</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">What Happens If You're Non-Compliant?</h2>
            <p className="text-slate-300 mb-4">
              GDPR enforcement has real teeth. Supervisory authorities can impose fines up to:
            </p>
            <ul className="list-disc pl-6 text-slate-300 mb-4 space-y-2">
              <li>€20 million, or</li>
              <li>4% of total worldwide annual turnover (whichever is higher)</li>
            </ul>
            <p className="text-slate-300 mb-4">
              Beyond fines, inadequate DPAs can lead to data breach liability, reputational damage, and inability to demonstrate compliance during audits.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Next Steps</h2>
            <p className="text-slate-300 mb-4">
              1. <strong>Audit your existing DPAs</strong> — Use this checklist (or GRMC.ai) to identify gaps<br/>
              2. <strong>Prioritize by risk</strong> — Start with vendors handling sensitive data or large volumes<br/>
              3. <strong>Negotiate amendments</strong> — Work with vendors to close gaps<br/>
              4. <strong>Document everything</strong> — Maintain records to demonstrate compliance
            </p>
          </div>
        </article>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-sm mb-4">Share this post</p>
          <div className="flex gap-4">
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://grmc.ai/blog/gdpr-article-28-checklist-vendor-contracts')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              LinkedIn
            </a>
            <a 
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent('https://grmc.ai/blog/gdpr-article-28-checklist-vendor-contracts')}&text=${encodeURIComponent('GDPR Article 28 Checklist: What Your Vendor Contracts Must Include')}`}
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
