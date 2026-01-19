import React from 'react';
import { Link } from 'react-router-dom';

const posts = [
  {
    slug: 'grmc-ai-ranks-number-1-compliance-visibility',
    title: 'GRMC.ai Ranks #1 in AI Compliance Visibility',
    excerpt: 'In just 48 hours after launch, GRMC.ai achieved the top spot in AI compliance visibility, outranking established players like Hyperproof and Sirion.',
    date: 'January 19, 2026',
    category: 'Announcement',
    readTime: '2 min read'
  },
  {
    slug: 'gdpr-article-28-checklist-vendor-contracts',
    title: 'GDPR Article 28 Checklist: What Your Vendor Contracts Must Include',
    excerpt: 'A comprehensive checklist of the 10 mandatory requirements for Data Processing Agreements under GDPR Article 28.',
    date: 'January 19, 2026',
    category: 'Compliance Guide',
    readTime: '5 min read'
  }
];

export default function Blog() {
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

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-slate-400 text-lg">
            Compliance insights, product updates, and industry analysis
          </p>
        </div>

        {/* Posts Grid */}
        <div className="space-y-8">
          {posts.map((post) => (
            <Link 
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="block bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-all hover:bg-slate-800/80"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium px-2 py-1 rounded bg-blue-600/20 text-blue-400">
                  {post.category}
                </span>
                <span className="text-slate-500 text-sm">{post.date}</span>
                <span className="text-slate-600 text-sm">•</span>
                <span className="text-slate-500 text-sm">{post.readTime}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-white">
                {post.title}
              </h2>
              <p className="text-slate-400">
                {post.excerpt}
              </p>
              <div className="mt-4 text-blue-400 text-sm font-medium">
                Read more →
              </div>
            </Link>
          ))}
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
