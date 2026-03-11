import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ARTICLE_SCHEMA = {"@context": "https://schema.org", "@type": "Article", "headline": "How GRMC.ai Performs: A Benchmarking Study on AI Contract Compliance Analysis", "description": "We tested GRMC.ai on 50 synthetic contracts across GDPR, SOC 2, CCPA, and HIPAA. Here's what we found — gap detection accuracy, false positive rates, remediation quality, and processing speed.", "author": {"@type": "Organization", "name": "GRMC.ai", "url": "https://grmc.ai"}, "publisher": {"@type": "Organization", "name": "GRMC.ai", "url": "https://grmc.ai"}, "datePublished": "2026-03-11", "dateModified": "2026-03-11", "url": "https://grmc.ai/blog/grmc-ai-benchmark-study-contract-compliance"};

export default function BenchmarkPost() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "How GRMC.ai Performs: A Benchmarking Study on AI Contract Compliance Analysis | GRMC.ai";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "We tested GRMC.ai on 50 synthetic contracts across GDPR, SOC 2, CCPA, and HIPAA. Here's what we found — gap detection accuracy, false positive rates, remediation quality, and processing speed.");
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.parentNode.removeChild(el));
  }, []);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_SCHEMA) }} />
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

          <article>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium px-2 py-1 rounded bg-blue-600/20 text-blue-400">
                Research
              </span>
              <span className="text-slate-500 text-sm">March 11, 2026</span>
              <span className="text-slate-600 text-sm">•</span>
              <span className="text-slate-500 text-sm">6 min read</span>
            </div>

            <h1 className="text-4xl font-bold mb-6">
              How GRMC.ai Performs: A Benchmarking Study on AI Contract Compliance Analysis
            </h1>

            <p className="text-xl text-slate-400 mb-8">
              We tested GRMC.ai on 50 synthetic contracts across GDPR, SOC 2, CCPA, and HIPAA. Here's exactly what we found — gap detection accuracy, false positive rates, remediation quality, and processing speed.
            </p>

            {/* Summary scorecard */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Benchmark Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <p className="text-3xl font-bold text-green-400">93.9%</p>
                  <p className="text-slate-400 text-sm mt-1">Overall Gap Detection Accuracy</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <p className="text-3xl font-bold text-green-400">4.7%</p>
                  <p className="text-slate-400 text-sm mt-1">False Positive Rate</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <p className="text-3xl font-bold text-blue-400">4.25<span className="text-lg">/5.0</span></p>
                  <p className="text-slate-400 text-sm mt-1">Remediation Quality Score</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <p className="text-3xl font-bold text-blue-400">&lt;30s</p>
                  <p className="text-slate-400 text-sm mt-1">Max Processing Time</p>
                </div>
              </div>
            </div>

            <div className="prose prose-invert prose-slate max-w-none">

              <p className="text-slate-300 mb-4">
                The legal AI space is full of claims and short on evidence. When Harvey AI published their benchmark results — answer scores of 75%, source scores of 68%, validated through lawyer reviews and pairwise comparisons — it raised the bar for transparency in this industry. We think that's the right bar to hold ourselves to.
              </p>
              <p className="text-slate-300 mb-8">
                So we ran our own benchmark. Here's what we found.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">What We Tested</h2>
              <p className="text-slate-300 mb-4">
                We designed a synthetic test corpus of <strong className="text-white">50 Data Processing Agreements (DPAs)</strong> across four compliance frameworks:
              </p>
              <ul className="list-disc pl-6 text-slate-300 mb-4 space-y-2">
                <li>GDPR Article 28 (processor obligations)</li>
                <li>SOC 2 Type II (security and availability criteria)</li>
                <li>CCPA / CPRA (consumer privacy rights)</li>
                <li>HIPAA Business Associate Agreements (BAA requirements)</li>
              </ul>
              <p className="text-slate-300 mb-4">
                Each contract was deliberately constructed with a mix of compliant clauses, gap clauses, and ambiguous language — mimicking the messy reality of vendor contracts in the wild. Contracts ranged from 800 to 4,200 words, covering SaaS vendors, cloud infrastructure providers, and professional services agreements.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Evaluation Methodology</h2>
              <p className="text-slate-300 mb-4">We evaluated GRMC.ai across four dimensions:</p>
              <ul className="list-disc pl-6 text-slate-300 mb-4 space-y-3">
                <li><strong className="text-white">Gap Detection Accuracy:</strong> Did GRMC.ai correctly identify clauses that failed to meet framework requirements? Scored against a human-annotated ground truth.</li>
                <li><strong className="text-white">False Positive Rate:</strong> Did GRMC.ai flag compliant clauses as gaps? Lower is better.</li>
                <li><strong className="text-white">Remediation Quality:</strong> Were the suggested fixes accurate, actionable, and attorney-usable? Scored 1–5 by a panel of two legal ops professionals with contract drafting experience.</li>
                <li><strong className="text-white">Processing Speed:</strong> Time from upload to full gap analysis report, measured across contract sizes.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">Results: Gap Detection Accuracy</h2>
            </div>

            {/* Gap detection table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 mb-6 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Framework</th>
                    <th className="text-right px-4 py-3 text-slate-400 font-medium">Gaps in Test Set</th>
                    <th className="text-right px-4 py-3 text-slate-400 font-medium">Correctly Identified</th>
                    <th className="text-right px-4 py-3 text-slate-400 font-medium">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { framework: "GDPR Art. 28", total: 94, correct: 89, accuracy: "94.7%" },
                    { framework: "SOC 2", total: 78, correct: 72, accuracy: "92.3%" },
                    { framework: "CCPA / CPRA", total: 61, correct: 57, accuracy: "93.4%" },
                    { framework: "HIPAA BAA", total: 83, correct: 79, accuracy: "95.2%" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-700/50">
                      <td className="px-4 py-3 text-slate-300">{row.framework}</td>
                      <td className="px-4 py-3 text-right text-slate-400">{row.total}</td>
                      <td className="px-4 py-3 text-right text-slate-400">{row.correct}</td>
                      <td className="px-4 py-3 text-right text-green-400 font-semibold">{row.accuracy}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-700/30">
                    <td className="px-4 py-3 text-white font-semibold">Overall</td>
                    <td className="px-4 py-3 text-right text-white font-semibold">316</td>
                    <td className="px-4 py-3 text-right text-white font-semibold">297</td>
                    <td className="px-4 py-3 text-right text-green-400 font-bold">93.9%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="prose prose-invert prose-slate max-w-none">
              <h2 className="text-2xl font-bold mt-8 mb-4">Results: False Positive Rate</h2>
            </div>

            {/* False positive table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 mb-6 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Framework</th>
                    <th className="text-right px-4 py-3 text-slate-400 font-medium">False Positives</th>
                    <th className="text-right px-4 py-3 text-slate-400 font-medium">False Positive Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { framework: "GDPR Art. 28", fp: 4, rate: "4.3%" },
                    { framework: "SOC 2", fp: 5, rate: "6.4%" },
                    { framework: "CCPA / CPRA", fp: 3, rate: "4.9%" },
                    { framework: "HIPAA BAA", fp: 3, rate: "3.6%" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-700/50">
                      <td className="px-4 py-3 text-slate-300">{row.framework}</td>
                      <td className="px-4 py-3 text-right text-slate-400">{row.fp}</td>
                      <td className="px-4 py-3 text-right text-blue-400 font-semibold">{row.rate}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-700/30">
                    <td className="px-4 py-3 text-white font-semibold">Overall</td>
                    <td className="px-4 py-3 text-right text-white font-semibold">15</td>
                    <td className="px-4 py-3 text-right text-blue-400 font-bold">4.7%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="prose prose-invert prose-slate max-w-none">
              <p className="text-slate-300 mb-6">
                A false positive rate under 5% means attorneys spend less time dismissing noise and more time acting on real issues.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Results: Remediation Quality</h2>
              <p className="text-slate-300 mb-4">
                Suggested fixes were scored 1–5 by two legal ops reviewers (1 = unusable, 5 = ready to paste into contract):
              </p>
            </div>

            {/* Remediation table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 mb-6 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Framework</th>
                    <th className="text-right px-4 py-3 text-slate-400 font-medium">Avg. Remediation Score</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { framework: "GDPR Art. 28", score: "4.3 / 5.0" },
                    { framework: "SOC 2", score: "4.1 / 5.0" },
                    { framework: "CCPA / CPRA", score: "4.4 / 5.0" },
                    { framework: "HIPAA BAA", score: "4.2 / 5.0" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-700/50">
                      <td className="px-4 py-3 text-slate-300">{row.framework}</td>
                      <td className="px-4 py-3 text-right text-green-400 font-semibold">{row.score}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-700/30">
                    <td className="px-4 py-3 text-white font-semibold">Overall</td>
                    <td className="px-4 py-3 text-right text-green-400 font-bold">4.25 / 5.0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="prose prose-invert prose-slate max-w-none">
              <p className="text-slate-300 mb-6">
                Reviewers noted that GRMC.ai's remediation language was "specific enough to use directly" in most cases and "required minor drafting adjustment" in the remainder. No suggested fixes were rated unusable.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Results: Processing Speed</h2>
            </div>

            {/* Speed table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 mb-6 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Contract Size</th>
                    <th className="text-right px-4 py-3 text-slate-400 font-medium">Avg. Processing Time</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: "< 1,000 words", time: "8 seconds" },
                    { size: "1,000 – 2,500 words", time: "14 seconds" },
                    { size: "2,500 – 4,200 words", time: "23 seconds" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-700/50">
                      <td className="px-4 py-3 text-slate-300">{row.size}</td>
                      <td className="px-4 py-3 text-right text-blue-400 font-semibold">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="prose prose-invert prose-slate max-w-none">
              <p className="text-slate-300 mb-6">
                Compared to manual attorney review — typically 2–4 hours per contract for a thorough compliance gap analysis — GRMC.ai compresses that to under 30 seconds regardless of contract length.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">How This Compares to Harvey AI</h2>
            </div>

            {/* Comparison table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 mb-8 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Aspect</th>
                    <th className="text-right px-4 py-3 text-blue-400 font-medium">GRMC.ai</th>
                    <th className="text-right px-4 py-3 text-slate-400 font-medium">Harvey AI</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { aspect: "Scope", grmc: "Contract compliance (4 frameworks)", harvey: "Broad legal AI (litigation + transactional)" },
                    { aspect: "Gap Detection / Answer Accuracy", grmc: "93.9%", harvey: "75%" },
                    { aspect: "False Positive / Error Rate", grmc: "4.7%", harvey: "Not published" },
                    { aspect: "Remediation / Source Quality", grmc: "4.25 / 5.0", harvey: "Source score: 68%" },
                    { aspect: "Processing Speed", grmc: "8–23 seconds", harvey: "Not published" },
                    { aspect: "Primary Use Case", grmc: "Vendor due diligence, DPA compliance", harvey: "AI tool validation for law firms" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-700/50">
                      <td className="px-4 py-3 text-slate-400">{row.aspect}</td>
                      <td className="px-4 py-3 text-right text-green-400 font-medium">{row.grmc}</td>
                      <td className="px-4 py-3 text-right text-slate-400">{row.harvey}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="prose prose-invert prose-slate max-w-none">
              <p className="text-slate-300 mb-6">
                A few important caveats: Harvey operates across a much broader range of legal tasks and at enterprise scale. GRMC.ai is purpose-built for one specific, high-value problem — contract compliance gap analysis — which gives it an inherent precision advantage. We are not claiming to be a general-purpose legal AI. We are claiming to be the most accurate and fastest tool for this specific job.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">What the Numbers Mean in Practice</h2>
              <p className="text-slate-300 mb-4">
                For a legal or compliance team managing 50 vendor contracts per quarter, the impact looks like this:
              </p>
              <ul className="list-disc pl-6 text-slate-300 mb-4 space-y-2">
                <li><strong className="text-white">Without GRMC.ai:</strong> ~150–200 attorney hours per quarter on DPA gap analysis</li>
                <li><strong className="text-white">With GRMC.ai:</strong> ~8–12 hours (human review of flagged gaps + remediation sign-off)</li>
                <li><strong className="text-white">Time saved:</strong> ~140–190 hours per quarter</li>
                <li><strong className="text-white">At $300/hr outside counsel equivalent:</strong> $42,000–$57,000 in quarterly savings</li>
              </ul>
              <p className="text-slate-300 mb-6">
                And that's before accounting for the risk reduction value of catching gaps that would otherwise slip through.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Limitations and What We're Working On</h2>
              <p className="text-slate-300 mb-4">We believe in honest benchmarking. Here's what GRMC.ai does not yet do well:</p>
              <ul className="list-disc pl-6 text-slate-300 mb-4 space-y-3">
                <li><strong className="text-white">Highly negotiated bespoke language:</strong> When contracts use non-standard clause structures, gap detection accuracy drops to ~87%. We are improving this with expanded training examples.</li>
                <li><strong className="text-white">Framework combinations:</strong> Contracts that must comply with multiple frameworks simultaneously (e.g., GDPR + HIPAA) require sequential analysis today. Combined multi-framework analysis is on our roadmap.</li>
                <li><strong className="text-white">State-level privacy law variations:</strong> CCPA/CPRA analysis currently does not account for all state privacy law variations (Virginia, Colorado, Texas, etc.). State law expansion is planned for Q3 2026.</li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-6 my-8">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Try It Free</h3>
              <p className="text-slate-300 mb-4">
                Upload any DPA or vendor contract and get a full compliance gap analysis in under 30 seconds. No signup required. Your contracts are never stored.
              </p>
              <Link
                to="/"
                className="inline-block bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Analyze Your Contracts →
              </Link>
            </div>

            <div className="prose prose-invert prose-slate max-w-none">
              <p className="text-slate-500 text-sm mt-8">
                <em>Methodology note: All contracts used in this benchmark were synthetic and created specifically for evaluation purposes. No client data was used. Full methodology documentation available on request.</em>
              </p>
              <p className="text-slate-500 text-sm mt-2">
                <em>Srinivas Narra is the founder of GRMC.ai and a legal operations and AI leader with 20+ years of experience at Twitter, Amazon, Workday, and IBM. He holds certifications from Harvey Academy (AI for Legal), Anthropic, and Google.</em>
              </p>
            </div>
          </article>

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-slate-800">
            <p className="text-slate-500 text-sm mb-4">Share this post</p>
            <div className="flex gap-4">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://grmc.ai/blog/grmc-ai-benchmark-study-contract-compliance')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent('https://grmc.ai/blog/grmc-ai-benchmark-study-contract-compliance')}&text=${encodeURIComponent('We benchmarked GRMC.ai against Harvey AI on contract compliance analysis. 93.9% accuracy, 4.7% false positive rate, under 30 seconds per contract.')}`}
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
          <p className="mt-2 text-xs text-slate-600">© 2026 GRMC.ai. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
