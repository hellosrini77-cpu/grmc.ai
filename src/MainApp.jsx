import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import jsPDF from 'jspdf';
import { useAuth } from './context/AuthContext';
import Blog from './Blog';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FRAMEWORKS = [
  { key: 'gdpr', label: 'GDPR Art. 28', fullName: 'GDPR Article 28' },
  { key: 'soc2', label: 'SOC 2', fullName: 'SOC 2' },
  { key: 'ccpa', label: 'CCPA/CPRA', fullName: 'CCPA/CPRA' },
  { key: 'hipaa', label: 'HIPAA BAA', fullName: 'HIPAA Business Associate' },
  { key: 'iso27001', label: 'ISO 27001', fullName: 'ISO 27001' },
  { key: 'sox', label: 'SOX', fullName: 'SOX (Sarbanes-Oxley)' },
  { key: 'cmmc', label: 'CMMC', fullName: 'CMMC (Cybersecurity Maturity Model)' },
  { key: 'nist171', label: 'NIST 800-171', fullName: 'NIST SP 800-171' },
  { key: 'pcidss', label: 'PCI DSS', fullName: 'PCI DSS (Payment Card Industry)' },
  { key: 'fedramp', label: 'FedRAMP', fullName: 'FedRAMP Authorization' },
  { key: 'nistaimrf', label: 'NIST AI RMF', fullName: 'NIST AI Risk Management Framework' },
];

const hashText = (text) => {
  let hash = 0;
  for (let i = 0; i < Math.min(text.length, 5000); i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

const HISTORY_KEY = 'grmc_compliance_history';
const getHistory = () => { try { const data = localStorage.getItem(HISTORY_KEY); return data ? JSON.parse(data) : {}; } catch { return {}; } };
const saveToHistory = (identifier, fileName, results) => {
  const history = getHistory();
  const now = new Date().toISOString();
  if (!history[identifier]) { history[identifier] = { fileName, analyses: [] }; }
  history[identifier].analyses.push({ date: now, overallScore: results.overallScore, scores: { gdpr: results.gdpr?.score, soc2: results.soc2?.score, ccpa: results.ccpa?.score, hipaa: results.hipaa?.score, iso27001: results.iso27001?.score, sox: results.sox?.score, cmmc: results.cmmc?.score, nist171: results.nist171?.score, pcidss: results.pcidss?.score, fedramp: results.fedramp?.score, nistaimrf: results.nistaimrf?.score } });
  if (history[identifier].analyses.length > 10) { history[identifier].analyses = history[identifier].analyses.slice(-10); }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};
const getPreviousAnalysis = (identifier) => { const history = getHistory(); if (history[identifier] && history[identifier].analyses.length > 0) { const analyses = history[identifier].analyses; if (analyses.length >= 1) { return analyses[analyses.length - 1]; } } return null; };
const getContractHistory = (identifier) => { const history = getHistory(); return history[identifier]?.analyses || []; };

const extractTextFromFile = async (file) => {
  if (file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  } else {
    return await file.text();
  }
};

// ─── PUBLIC LANDING PAGE ───────────────────────────────────────────────────
function LandingPage() {
  const navigate = useNavigate();
  const { currentUser, isSubscribed } = useAuth();

  function handleCTA() {
    if (currentUser && isSubscribed) {
      navigate('/app');
    } else if (currentUser) {
      navigate('/pricing');
    } else {
      navigate('/signup');
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="GRMC.ai" className="h-10 bg-white rounded p-1" />
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link>
            <Link to="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link>
            <Link to="/login" className="text-slate-400 hover:text-white transition-colors">Sign In</Link>
            <button onClick={handleCTA} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Get Started
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <img src="/logo.png" alt="GRMC.ai" className="block h-32 bg-white rounded-lg p-2 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Stop Manually Reviewing Vendor Contracts for <span className="text-blue-400">Compliance</span>
          </h1>
          <p className="text-slate-300 text-xl max-w-3xl mx-auto mb-4">
            AI-powered gap analysis for GDPR, SOC 2, CCPA, HIPAA, ISO 27001, SOX, CMMC, NIST 800-171, PCI DSS, FedRAMP, and NIST AI RMF. Upload a contract, get instant compliance assessment in minutes.
          </p>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto mb-8">
            Your CLM tells you what's in the contract. <span className="text-blue-400 font-semibold">GRMC.ai tells you if it's compliant</span>.
          </p>
          <button onClick={handleCTA} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
            Start Analyzing Contracts →
          </button>
        </div>

        <section className="mb-12 bg-slate-800/50 rounded-xl p-8 border border-slate-700/50">
          <h2 className="text-2xl font-bold mb-4 text-center">The Compliance Gap in Modern Contract Management</h2>
          <p className="text-slate-300 mb-4 text-center max-w-3xl mx-auto">Legal and compliance teams face a critical challenge:</p>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="bg-slate-900/50 rounded-lg p-4"><div className="text-red-400 mb-2">⚠️</div><p className="text-slate-300 text-sm">Vendor contracts require compliance verification across 11 frameworks</p></div>
            <div className="bg-slate-900/50 rounded-lg p-4"><div className="text-red-400 mb-2">⚠️</div><p className="text-slate-300 text-sm">CLM systems extract data but don't judge compliance</p></div>
            <div className="bg-slate-900/50 rounded-lg p-4"><div className="text-red-400 mb-2">⚠️</div><p className="text-slate-300 text-sm">Manual review takes 2-4 hours per contract</p></div>
            <div className="bg-slate-900/50 rounded-lg p-4"><div className="text-red-400 mb-2">⚠️</div><p className="text-slate-300 text-sm">Compliance mistakes are costly (fines, audit failures, deal delays)</p></div>
          </div>
          <p className="text-center text-slate-400 mt-6 font-medium">Result: Bottlenecks, risk exposure, and expensive manual work that doesn't scale.</p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Who GRMC.ai is Built For</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Legal Operations Teams</h3>
              <p className="text-slate-300 text-sm mb-4">Mid-market to enterprise companies using CLMs for contract storage but lacking a compliance intelligence layer. Manual DPA review takes 2-4 hours per contract — GRMC.ai reduces that to minutes.</p>
              <ul className="text-slate-400 text-sm space-y-2"><li>• Companies with 100-2000 employees</li><li>• Already using a CLM</li><li>• Overwhelmed with vendor contract reviews</li><li>• Need to scale compliance without hiring</li></ul>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">Compliance Officers</h3>
              <p className="text-slate-300 text-sm mb-4">Compliance and risk teams preparing for audits need to verify all vendor contracts meet framework requirements. GRMC.ai provides automated verification across all eleven frameworks.</p>
              <ul className="text-slate-400 text-sm space-y-2"><li>• Preparing for compliance audits</li><li>• Managing third-party risk programs</li><li>• Need audit documentation and evidence</li><li>• Tracking compliance across vendors</li></ul>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-3 text-green-400">Defense & Government Contractors</h3>
              <p className="text-slate-300 text-sm mb-4">Companies pursuing federal contracts must demonstrate CMMC certification and NIST 800-171 compliance. GRMC.ai automates gap analysis for CUI protection obligations.</p>
              <ul className="text-slate-400 text-sm space-y-2"><li>• Pursuing DoD or federal contracts</li><li>• Subject to DFARS/CMMC requirements</li><li>• Need to protect Controlled Unclassified Information</li><li>• Preparing for CMMC Level 2 or 3 assessment</li></ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">11 Compliance Frameworks</h2>
          <p className="text-slate-400 text-center mb-8 max-w-2xl mx-auto">Automated gap analysis against every major compliance framework</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'GDPR Article 28', color: 'blue', desc: 'Data Processing Agreement requirements' },
              { name: 'SOC 2', color: 'purple', desc: 'Vendor security requirements' },
              { name: 'CCPA/CPRA', color: 'orange', desc: 'California Consumer Privacy Act' },
              { name: 'HIPAA BAA', color: 'pink', desc: 'Health Insurance Portability and Accountability Act' },
              { name: 'ISO 27001', color: 'teal', desc: 'Information Security Management' },
              { name: 'SOX', color: 'yellow', desc: 'Sarbanes-Oxley financial controls' },
              { name: 'CMMC', color: 'red', desc: 'Cybersecurity Maturity Model Certification' },
              { name: 'NIST 800-171', color: 'indigo', desc: 'Protecting Controlled Unclassified Information' },
              { name: 'PCI DSS', color: 'emerald', desc: 'Payment Card Industry Data Security Standard' },
              { name: 'FedRAMP', color: 'cyan', desc: 'Federal Risk and Authorization Management' },
              { name: 'NIST AI RMF', color: 'violet', desc: 'AI Risk Management Framework' },
            ].map((fw, i) => (
              <div key={i} className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full bg-${fw.color}-500 mt-2 flex-shrink-0`}></span>
                <div>
                  <div className={`text-${fw.color}-400 font-semibold`}>{fw.name}</div>
                  <div className="text-slate-400 text-sm">{fw.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 bg-slate-800/50 rounded-xl p-8 border border-slate-700/50 text-center">
          <h2 className="text-3xl font-bold mb-4">Built by Legal Ops Experts</h2>
          <p className="text-slate-300 max-w-3xl mx-auto mb-6">GRMC.ai was created by <strong>20-year legal tech career veterans</strong> who spent their careers implementing enterprise CLM systems and managing global legal operations teams.</p>
          <p className="text-blue-400 font-medium mb-8">We built the tool we wished existed.</p>
          <button onClick={handleCTA} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
            Start Analyzing Contracts →
          </button>
        </section>

        <footer className="mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>GRMC.ai™ — Governance, Risk Management & Compliance</p>
          <p className="mt-1">AI-powered contract compliance analysis</p>
          <p className="mt-3 text-xs text-slate-600">🔒 Zero data retention • Your contracts are never stored</p>
          <p className="mt-2 text-xs text-slate-600">© 2026 GRMC.ai. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

// ─── GATED ANALYZE TOOL ────────────────────────────────────────────────────
function AnalyzeTool() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [expandedResult, setExpandedResult] = useState(0);
  const [contractText, setContractText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [extracting, setExtracting] = useState(false);
  const [activeTab, setActiveTab] = useState('gdpr');
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [historyContractId, setHistoryContractId] = useState(null);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [emailReportModal, setEmailReportModal] = useState({ open: false, resultIndex: null });
  const [emailSending, setEmailSending] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setAllResults([]); setError(''); setExtracting(true); setContractText('');
    try {
      const processedFiles = [];
      for (const file of files) {
        try {
          const text = await extractTextFromFile(file);
          processedFiles.push({ name: file.name, text, id: `file_${file.name}_${hashText(text)}` });
        } catch (err) {
          processedFiles.push({ name: file.name, text: '', error: 'Failed to extract text', id: `file_${file.name}_error` });
        }
      }
      setUploadedFiles(processedFiles);
    } catch (err) { setError('Failed to process files. Please try again.'); }
    setExtracting(false); e.target.value = '';
  };

  const analyzeContracts = async () => {
    const filesToAnalyze = uploadedFiles.length > 0 ? uploadedFiles.filter(f => f.text && !f.error) : contractText.trim() ? [{ name: 'Pasted Text', text: contractText, id: `text_${hashText(contractText)}` }] : [];
    if (filesToAnalyze.length === 0) { setError('Please upload contracts or paste text first.'); return; }
    setAnalyzing(true); setError(''); setAllResults([]); setTotalFiles(filesToAnalyze.length); setCurrentFileIndex(0);
    const results = [];
    for (let i = 0; i < filesToAnalyze.length; i++) {
      const file = filesToAnalyze[i]; setCurrentFileIndex(i + 1);
      try {
        const prevAnalysis = getPreviousAnalysis(file.id);
        const response = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contractText: file.text.substring(0, 50000) }) });
        if (!response.ok) throw new Error('Analysis failed');
        const data = await response.json();
        saveToHistory(file.id, file.name, data);
        results.push({ fileName: file.name, contractId: file.id, results: data, previousAnalysis: prevAnalysis, error: null });
      } catch (err) { results.push({ fileName: file.name, contractId: file.id, results: null, previousAnalysis: null, error: 'Analysis failed' }); }
    }
    setAllResults(results); setExpandedResult(0); setAnalyzing(false);
    const firstSuccess = results.find(r => r.results);
    if (firstSuccess) { const firstApplicable = FRAMEWORKS.find(f => firstSuccess.results[f.key]?.applicable !== false); if (firstApplicable) setActiveTab(firstApplicable.key); }
  };

  const getScoreColor = (score) => { if (score >= 80) return 'text-green-400'; if (score >= 60) return 'text-yellow-400'; if (score >= 40) return 'text-orange-400'; return 'text-red-400'; };
  const getDelta = (current, previous) => { if (!previous) return null; return current - previous; };
  const renderDelta = (current, previous) => { const delta = getDelta(current, previous); if (delta === null) return null; const isPositive = delta >= 0; return (<span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${isPositive ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>{isPositive ? '↑' : '↓'} {Math.abs(delta)}%</span>); };

  const renderChecklist = (data) => (
    <div className="space-y-4">
      {data.applicable === false && (<div className="bg-slate-700/50 rounded-lg p-3 text-slate-400 text-sm mb-4">⚠️ This framework may not be applicable to this contract type</div>)}
      <div className="space-y-2">
        {data.checklist?.map((item, i) => (
          <div key={i} className={`flex items-start gap-3 p-2 rounded-lg ${item.present ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
            {item.present ? <span className="text-green-400 mt-0.5">✓</span> : <span className="text-red-400 mt-0.5">✗</span>}
            <div><div className={item.present ? 'text-green-300' : 'text-red-300'}>{item.requirement}</div>{item.note && <div className="text-slate-500 text-xs mt-1">{item.note}</div>}</div>
          </div>
        ))}
      </div>
      {data.gaps?.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-2">Gaps & Clause Replacements</h4>
          <div className="space-y-3">
            {data.gaps.map((gap, i) => (
              <div key={i} className="bg-slate-900 rounded-lg p-3 space-y-2">
                <div className="text-white font-medium text-sm">{gap.issue}</div>
                {gap.currentClause && (<div><div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Current Clause</div><div className="bg-red-950/40 border border-red-900/40 rounded p-2 text-xs text-red-300 italic">{gap.currentClause}</div></div>)}
                {gap.replacementClause && (<div><div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Replacement Clause</div><div className="bg-green-950/40 border border-green-900/40 rounded p-2 text-xs text-green-300 font-mono leading-relaxed">{gap.replacementClause}</div><button onClick={() => navigator.clipboard.writeText(gap.replacementClause)} className="mt-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">📋 Copy to clipboard</button></div>)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const reset = () => { setContractText(''); setUploadedFiles([]); setAllResults([]); setError(''); setShowHistory(false); setHistoryContractId(null); setExpandedResult(0); };

  const renderResultCard = (resultData, index) => {
    const { fileName, contractId, results, previousAnalysis, error: resultError } = resultData;
    const isExpanded = expandedResult === index;
    if (resultError) return (<div key={index} className="bg-slate-800 rounded-xl border border-red-800/50 overflow-hidden"><div className="p-4 flex items-center justify-between"><div className="flex items-center gap-3"><span className="text-red-400">✗</span><span className="font-medium">{fileName}</span></div><span className="text-red-400 text-sm">Analysis failed</span></div></div>);
    return (
      <div key={index} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <button onClick={() => setExpandedResult(isExpanded ? -1 : index)} className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors">
          <div className="flex items-center gap-3"><span className={`text-lg font-bold ${getScoreColor(results.overallScore)}`}>{results.overallScore}%</span><span className="font-medium truncate max-w-[200px]">{fileName}</span>{previousAnalysis && renderDelta(results.overallScore, previousAnalysis.overallScore)}</div>
          <svg className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {isExpanded && (
          <div className="border-t border-slate-700">
            {results.summary && <div className="p-4 border-b border-slate-700"><p className="text-slate-400 text-sm">{results.summary}</p></div>}
            <div className="flex border-b border-slate-700 overflow-x-auto">
              {FRAMEWORKS.map(fw => (
                <button key={fw.key} onClick={() => setActiveTab(fw.key)} className={`flex-1 px-3 py-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === fw.key ? 'bg-slate-700 text-white border-b-2 border-blue-500' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
                  {fw.label}{results[fw.key] && (<span className={`ml-1 text-xs ${results[fw.key]?.applicable === false ? 'text-slate-600' : getScoreColor(results[fw.key]?.score)}`}>{results[fw.key]?.applicable === false ? 'N/A' : `${results[fw.key]?.score}%`}</span>)}
                </button>
              ))}
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto">{results[activeTab] && renderChecklist(results[activeTab])}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="GRMC.ai" className="h-10 bg-white rounded p-1" />
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
            <Link to="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link>
            <span className="text-slate-500 text-sm">{currentUser?.email}</span>
            <button onClick={() => { logout(); navigate('/'); }} className="text-slate-400 hover:text-white text-sm transition-colors">Sign Out</button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Contract Compliance Analyzer</h1>
          <p className="text-slate-400">Upload or paste a contract to analyze against 11 compliance frameworks</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <label className="block text-sm font-medium text-slate-400 mb-3">Contract Documents</label>
              <input ref={fileInputRef} type="file" accept=".pdf,.txt,.doc,.docx" multiple onChange={handleFileUpload} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-slate-700/50 transition-all cursor-pointer">
                {extracting ? (<div className="text-blue-400"><svg className="animate-spin h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Extracting text...</div>
                ) : uploadedFiles.length > 0 ? (<div><div className="text-green-400 mb-1">✓ {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} loaded</div><div className="text-slate-400 text-sm mb-2">{uploadedFiles.map(f => f.name).join(', ')}</div><div className="text-slate-500 text-sm">Click to upload different files</div></div>
                ) : (<div><svg className="w-10 h-10 mx-auto mb-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg><div className="text-slate-300 font-medium">Upload PDF or text files</div><div className="text-slate-500 text-sm mt-1">DPA, MSA, BAA, Vendor Agreements</div><div className="text-blue-400 text-xs mt-2">Supports multiple files</div></div>)}
              </button>
            </div>

            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <label className="block text-sm font-medium text-slate-400 mb-3">Or paste contract text</label>
              <textarea value={contractText} onChange={(e) => { setContractText(e.target.value); if (e.target.value) setUploadedFiles([]); }} placeholder="Paste your contract text here..." className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none" />
              <div className="flex justify-between items-center mt-2 text-xs text-slate-500"><span>{contractText.length.toLocaleString()} characters</span>{contractText && <button onClick={() => setContractText('')} className="text-slate-400 hover:text-white">Clear</button>}</div>
            </div>

            <button onClick={analyzeContracts} disabled={analyzing || (!contractText.trim() && uploadedFiles.length === 0)} className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${analyzing || (!contractText.trim() && uploadedFiles.length === 0) ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
              {analyzing ? (<span className="flex items-center justify-center gap-2"><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Analyzing {currentFileIndex} of {totalFiles}...</span>) : uploadedFiles.length > 1 ? `Analyze ${uploadedFiles.length} Contracts` : 'Analyze Compliance'}
            </button>

            {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

            <div className="bg-green-900/20 rounded-xl p-4 border border-green-800/30">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <div><div className="text-green-400 text-sm font-medium">Your data is safe</div><div className="text-slate-400 text-xs mt-1">Contracts are analyzed in real-time and never stored.</div></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            {allResults.length === 0 ? (
              <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                <svg className="w-16 h-16 text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div className="text-slate-500 text-lg">Compliance results will appear here</div>
                <div className="text-slate-600 text-sm mt-2">Upload contracts and click Analyze</div>
              </div>
            ) : (
              <>
                {allResults.length > 1 && (<div className="bg-slate-800 rounded-xl p-4 border border-slate-700"><div className="text-sm text-slate-400 mb-2">Analyzed {allResults.length} contracts</div><div className="flex gap-4 flex-wrap">{allResults.filter(r => r.results).length > 0 && <span className="text-green-400 text-sm">✓ {allResults.filter(r => r.results).length} successful</span>}{allResults.filter(r => r.error).length > 0 && <span className="text-red-400 text-sm">✗ {allResults.filter(r => r.error).length} failed</span>}<span className="text-slate-400 text-sm">Avg score: {Math.round(allResults.filter(r => r.results).reduce((sum, r) => sum + r.results.overallScore, 0) / allResults.filter(r => r.results).length)}%</span></div></div>)}
                {allResults.map((result, index) => renderResultCard(result, index))}
                <button onClick={reset} className="w-full py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium transition-colors">Analyze More Contracts</button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function MainApp() {
  return <LandingPage />;
}

export { AnalyzeTool };
