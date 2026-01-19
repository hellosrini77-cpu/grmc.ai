import React from 'react';
import { Link } from 'react-router-dom';

export default function Post1() {
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
            <span className="text-xs font-medium px-2 py-1 rounded bg-blue-600/20 text-blue-400">
              Announcement
            </span>
            <span className="text-slate-500 text-sm">January 19, 2026</span>
            <span className="text-slate-600 text-sm">•</span>
            <span className="text-slate-500 text-sm">2 min read</span>
          </div>

          <h1 className="text-4xl font-bold mb-6">
            GRMC.ai Ranks #1 in AI Compliance Visibility
          </h1>

          <p className="text-xl text-slate-400 mb-8">
            In just 48 hours after launch, GRMC.ai achieved the top spot in AI compliance visibility, outranking established enterprise players.
          </p>

          {/* Featured Image Placeholder - Rankings */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Industry Ranking</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-green-500/30">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-green-400">#1</span>
                  <span className="font-semibold">GRMC.ai</span>
                </div>
                <span className="text-green-400 font-bold">69%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-slate-500">#2</span>
                  <span className="text-slate-400">Hyperproof</span>
                </div>
                <span className="text-slate-400">25%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-slate-500">#3</span>
                  <span className="text-slate-400">Sirion</span>
                </div>
                <span className="text-slate-400">25%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-slate-500">#4</span>
                  <span className="text-slate-400">CUBE</span>
                </div>
                <span className="text-slate-400">0%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-slate-500">#5</span>
                  <span className="text-slate-400">LogicGate</span>
                </div>
                <span className="text-slate-400">0%</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">Source: Amplify AI Visibility Tracking, January 2026</p>
          </div>

          {/* Article Content */}
          <div className="prose prose-invert prose-slate max-w-none">
            <h2 className="text-2xl font-bold mt-8 mb-4">From Zero to #1 in 48 Hours</h2>
            <p className="text-slate-300 mb-4">
              When we launched GRMC.ai on January 17, 2026, we had a simple goal: make contract compliance analysis accessible and instant. What we didn't expect was to achieve the #1 position in AI compliance visibility within two days.
            </p>
            <p className="text-slate-300 mb-4">
              According to Amplify's AI visibility tracking, GRMC.ai now leads the pack with 69% visibility, ahead of established enterprise players like Hyperproof (25%), Sirion (25%), CUBE (0%), and LogicGate (0%).
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">What This Means</h2>
            <p className="text-slate-300 mb-4">
              AI visibility measures how often a brand appears in AI-generated responses and recommendations. In the compliance and contract management space, this metric indicates growing recognition of GRMC.ai as a solution for instant compliance gap analysis.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Why GRMC.ai?</h2>
            <p className="text-slate-300 mb-4">
              We built GRMC.ai to solve a problem we experienced firsthand during 50+ CLM implementations: compliance review was still a manual checklist exercise. Legal teams spent hours comparing vendor contracts against GDPR, SOC 2, CCPA, and HIPAA requirements.
            </p>
            <p className="text-slate-300 mb-4">
              GRMC.ai changes that. Upload a DPA, MSA, or BAA and get clause-by-clause gap analysis with specific remediation recommendations in seconds—not hours.
            </p>

            <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-6 my-8">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Try It Free</h3>
              <p className="text-slate-300 mb-4">
                No signup required. Your contracts are never stored.
              </p>
              <Link 
                to="/" 
                className="inline-block bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Analyze Your Contracts →
              </Link>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">What's Next</h2>
            <p className="text-slate-300 mb-4">
              We're just getting started. Based on user feedback, we're working on:
            </p>
            <ul className="list-disc pl-6 text-slate-300 mb-4 space-y-2">
              <li>ISO 27001 framework support</li>
              <li>SOX compliance analysis</li>
              <li>NIST framework integration</li>
              <li>Bulk contract processing API</li>
              <li>Team accounts for enterprise</li>
            </ul>
            <p className="text-slate-300 mb-4">
              Have a framework you'd like us to add? <a href="mailto:srinivasnarra@proton.me" className="text-blue-400 hover:text-blue-300">Let us know</a>.
            </p>
          </div>
        </article>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-sm mb-4">Share this post</p>
          <div className="flex gap-4">
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://grmc.ai/blog/grmc-ai-ranks-number-1-compliance-visibility')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              LinkedIn
            </a>
            <a 
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent('https://grmc.ai/blog/grmc-ai-ranks-number-1-compliance-visibility')}&text=${encodeURIComponent('GRMC.ai ranks #1 in AI compliance visibility!')}`}
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
