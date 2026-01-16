import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FRAMEWORKS = [
  { key: 'gdpr', label: 'GDPR Art. 28', fullName: 'GDPR Article 28' },
  { key: 'soc2', label: 'SOC 2', fullName: 'SOC 2' },
  { key: 'ccpa', label: 'CCPA/CPRA', fullName: 'CCPA/CPRA' },
  { key: 'hipaa', label: 'HIPAA BAA', fullName: 'HIPAA Business Associate' },
];

export default function App() {
  const [contractText, setContractText] = useState('');
  const [fileName, setFileName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('gdpr');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Extract text from PDF
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setResults(null);
    setError('');
    setExtracting(true);

    try {
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
        setContractText(fullText);
      } else {
        const text = await file.text();
        setContractText(text);
      }
    } catch (err) {
      console.error('File parsing error:', err);
      setError('Failed to extract text from file. Please try a different file or paste the text directly.');
    }
    setExtracting(false);
    e.target.value = '';
  };

  // Analyze contract for compliance
  const analyzeContract = async () => {
    if (!contractText.trim()) {
      setError('Please upload a contract or paste the text first.');
      return;
    }

    setAnalyzing(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractText: contractText.substring(0, 50000)
        })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data);
      
      // Auto-select first applicable framework
      const firstApplicable = FRAMEWORKS.find(f => data[f.key]?.applicable !== false);
      if (firstApplicable) setActiveTab(firstApplicable.key);
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Analysis failed. Please try again.');
    }
    setAnalyzing(false);
  };

  // Reset everything
  const reset = () => {
    setContractText('');
    setFileName('');
    setResults(null);
    setError('');
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBgClass = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Render checklist for a framework
  const renderChecklist = (data) => (
    <div className="space-y-4">
      {data.applicable === false && (
        <div className="bg-slate-700/50 rounded-lg p-3 text-slate-400 text-sm mb-4">
          ⚠️ This framework may not be applicable to this contract type
        </div>
      )}
      
      {/* Checklist */}
      <div className="space-y-2">
        {data.checklist?.map((item, i) => (
          <div key={i} className={`flex items-start gap-3 p-2 rounded-lg ${
            item.present ? 'bg-green-900/20' : 'bg-red-900/20'
          }`}>
            {item.present ? (
              <span className="text-green-400 mt-0.5">✓</span>
            ) : (
              <span className="text-red-400 mt-0.5">✗</span>
            )}
            <div>
              <div className={item.present ? 'text-green-300' : 'text-red-300'}>
                {item.requirement}
              </div>
              {item.note && (
                <div className="text-slate-500 text-xs mt-1">{item.note}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Gaps & Remediation */}
      {data.gaps?.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-2">
            Gaps & Remediation
          </h4>
          <div className="space-y-2">
            {data.gaps.map((gap, i) => (
              <div key={i} className="bg-slate-900 rounded-lg p-3">
                <div className="text-white font-medium text-sm mb-1">{gap.issue}</div>
                <div className="text-slate-400 text-xs">{gap.remediation}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">GRMC</span>
            <span className="text-blue-400 text-2xl">.ai</span>
          </div>
          <span className="text-slate-500 text-sm hidden sm:block">Governance, Risk Management & Compliance</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Contract <span className="text-blue-400">Compliance</span> Intelligence
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Upload a contract. Get instant compliance analysis across GDPR, SOC 2, CCPA & HIPAA.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Upload & Input (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* File Upload */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <label className="block text-sm font-medium text-slate-400 mb-3">Contract Document</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-slate-700/50 transition-all cursor-pointer"
              >
                {extracting ? (
                  <div className="text-blue-400">
                    <svg className="animate-spin h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Extracting text...
                  </div>
                ) : fileName ? (
                  <div>
                    <div className="text-green-400 mb-1">✓ {fileName}</div>
                    <div className="text-slate-500 text-sm">Click to upload different file</div>
                  </div>
                ) : (
                  <div>
                    <svg className="w-10 h-10 mx-auto mb-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="text-slate-300 font-medium">Upload PDF or text file</div>
                    <div className="text-slate-500 text-sm mt-1">DPA, MSA, BAA, Vendor Agreement</div>
                  </div>
                )}
              </button>
            </div>

            {/* Text Input */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <label className="block text-sm font-medium text-slate-400 mb-3">
                Or paste contract text
              </label>
              <textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                placeholder="Paste your contract text here..."
                className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
              <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                <span>{contractText.length.toLocaleString()} characters</span>
                {contractText && (
                  <button onClick={() => setContractText('')} className="text-slate-400 hover:text-white">
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={analyzeContract}
              disabled={analyzing || !contractText.trim()}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                analyzing || !contractText.trim()
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {analyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing 4 frameworks...
                </span>
              ) : (
                'Analyze Compliance'
              )}
            </button>

            {error && (
              <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Frameworks Legend */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Frameworks Analyzed</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-slate-400">GDPR Article 28</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span className="text-slate-400">SOC 2</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span className="text-slate-400">CCPA/CPRA</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  <span className="text-slate-400">HIPAA BAA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            {!results ? (
              <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                <svg className="w-16 h-16 text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-slate-500 text-lg">Compliance results will appear here</div>
                <div className="text-slate-600 text-sm mt-2">Upload a contract and click Analyze</div>
              </div>
            ) : (
              <>
                {/* Overall Score + Framework Scores */}
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Overall Score</div>
                      <div className={`text-4xl font-bold ${getScoreColor(results.overallScore)}`}>
                        {results.overallScore}%
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {FRAMEWORKS.map(fw => (
                        <div key={fw.key} className="text-center">
                          <div className="text-slate-500 text-xs mb-1">{fw.label}</div>
                          <div className={`text-lg font-bold ${
                            results[fw.key]?.applicable === false 
                              ? 'text-slate-600' 
                              : getScoreColor(results[fw.key]?.score)
                          }`}>
                            {results[fw.key]?.applicable === false ? 'N/A' : `${results[fw.key]?.score}%`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Summary */}
                  {results.summary && (
                    <div className="pt-3 border-t border-slate-700">
                      <p className="text-slate-400 text-sm">{results.summary}</p>
                    </div>
                  )}
                </div>

                {/* Framework Tabs */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                  <div className="flex border-b border-slate-700 overflow-x-auto">
                    {FRAMEWORKS.map(fw => (
                      <button
                        key={fw.key}
                        onClick={() => setActiveTab(fw.key)}
                        className={`flex-1 px-3 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                          activeTab === fw.key
                            ? 'bg-slate-700 text-white border-b-2 border-blue-500'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                      >
                        {fw.label}
                        {results[fw.key] && (
                          <span className={`ml-1 text-xs ${
                            results[fw.key]?.applicable === false 
                              ? 'text-slate-600' 
                              : getScoreColor(results[fw.key]?.score)
                          }`}>
                            {results[fw.key]?.applicable === false ? 'N/A' : `${results[fw.key]?.score}%`}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  <div className="p-4 max-h-[400px] overflow-y-auto">
                    {results[activeTab] && renderChecklist(results[activeTab])}
                  </div>
                </div>

                {/* Reset */}
                <button
                  onClick={reset}
                  className="w-full py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium transition-colors"
                >
                  Analyze Another Contract
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>GRMC.ai — Governance, Risk Management & Compliance</p>
          <p className="mt-1">AI-powered contract compliance analysis</p>
        </footer>
      </main>
    </div>
  );
}
