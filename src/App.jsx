import React, { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import jsPDF from 'jspdf';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FRAMEWORKS = [
  { key: 'gdpr', label: 'GDPR Art. 28', fullName: 'GDPR Article 28' },
  { key: 'soc2', label: 'SOC 2', fullName: 'SOC 2' },
  { key: 'ccpa', label: 'CCPA/CPRA', fullName: 'CCPA/CPRA' },
  { key: 'hipaa', label: 'HIPAA BAA', fullName: 'HIPAA Business Associate' },
];

// Generate a simple hash for contract text to use as an identifier
const hashText = (text) => {
  let hash = 0;
  for (let i = 0; i < Math.min(text.length, 5000); i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

// LocalStorage helpers for delta tracking
const HISTORY_KEY = 'grmc_compliance_history';

const getHistory = () => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveToHistory = (identifier, fileName, results) => {
  const history = getHistory();
  const now = new Date().toISOString();
  
  if (!history[identifier]) {
    history[identifier] = {
      fileName,
      analyses: []
    };
  }
  
  history[identifier].analyses.push({
    date: now,
    overallScore: results.overallScore,
    scores: {
      gdpr: results.gdpr?.score,
      soc2: results.soc2?.score,
      ccpa: results.ccpa?.score,
      hipaa: results.hipaa?.score
    }
  });
  
  // Keep only last 10 analyses per contract
  if (history[identifier].analyses.length > 10) {
    history[identifier].analyses = history[identifier].analyses.slice(-10);
  }
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

const getPreviousAnalysis = (identifier) => {
  const history = getHistory();
  if (history[identifier] && history[identifier].analyses.length > 0) {
    const analyses = history[identifier].analyses;
    if (analyses.length >= 1) {
      return analyses[analyses.length - 1];
    }
  }
  return null;
};

const getContractHistory = (identifier) => {
  const history = getHistory();
  return history[identifier]?.analyses || [];
};

// Extract text from a single file
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

export default function App() {
  // Multi-file state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [expandedResult, setExpandedResult] = useState(0);
  
  // Single contract state (for paste)
  const [contractText, setContractText] = useState('');
  
  // Processing state
  const [analyzing, setAnalyzing] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [extracting, setExtracting] = useState(false);
  
  // UI state
  const [activeTab, setActiveTab] = useState('gdpr');
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [historyContractId, setHistoryContractId] = useState(null);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [emailReportModal, setEmailReportModal] = useState({ open: false, resultIndex: null });
  const [emailSending, setEmailSending] = useState(false);
  
  const fileInputRef = useRef(null);

  // Handle multiple file uploads
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setAllResults([]);
    setError('');
    setExtracting(true);
    setContractText('');

    try {
      const processedFiles = [];
      
      for (const file of files) {
        try {
          const text = await extractTextFromFile(file);
          processedFiles.push({
            name: file.name,
            text: text,
            id: `file_${file.name}_${hashText(text)}`
          });
        } catch (err) {
          console.error(`Failed to extract text from ${file.name}:`, err);
          processedFiles.push({
            name: file.name,
            text: '',
            error: 'Failed to extract text',
            id: `file_${file.name}_error`
          });
        }
      }
      
      setUploadedFiles(processedFiles);
    } catch (err) {
      console.error('File processing error:', err);
      setError('Failed to process files. Please try again.');
    }
    
    setExtracting(false);
    e.target.value = '';
  };

  // Analyze all contracts sequentially
  const analyzeContracts = async () => {
    // Determine what to analyze
    const filesToAnalyze = uploadedFiles.length > 0 
      ? uploadedFiles.filter(f => f.text && !f.error)
      : contractText.trim() 
        ? [{ name: 'Pasted Text', text: contractText, id: `text_${hashText(contractText)}` }]
        : [];

    if (filesToAnalyze.length === 0) {
      setError('Please upload contracts or paste text first.');
      return;
    }

    setAnalyzing(true);
    setError('');
    setAllResults([]);
    setTotalFiles(filesToAnalyze.length);
    setCurrentFileIndex(0);

    const results = [];

    for (let i = 0; i < filesToAnalyze.length; i++) {
      const file = filesToAnalyze[i];
      setCurrentFileIndex(i + 1);

      try {
        // Get previous analysis for delta tracking
        const prevAnalysis = getPreviousAnalysis(file.id);

        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contractText: file.text.substring(0, 50000)
          })
        });

        if (!response.ok) {
          throw new Error('Analysis failed');
        }

        const data = await response.json();
        
        // Save to history
        saveToHistory(file.id, file.name, data);

        results.push({
          fileName: file.name,
          contractId: file.id,
          results: data,
          previousAnalysis: prevAnalysis,
          error: null
        });
      } catch (err) {
        console.error(`Analysis error for ${file.name}:`, err);
        results.push({
          fileName: file.name,
          contractId: file.id,
          results: null,
          previousAnalysis: null,
          error: 'Analysis failed'
        });
      }
    }

    setAllResults(results);
    setExpandedResult(0);
    setAnalyzing(false);
    
    // Auto-select first applicable framework from first successful result
    const firstSuccess = results.find(r => r.results);
    if (firstSuccess) {
      const firstApplicable = FRAMEWORKS.find(f => firstSuccess.results[f.key]?.applicable !== false);
      if (firstApplicable) setActiveTab(firstApplicable.key);
    }
  };

  // Generate PDF Report for a specific result
  const exportPdfReport = (resultIndex) => {
    const resultData = allResults[resultIndex];
    if (!resultData?.results) return;
    
    const results = resultData.results;
    const fileName = resultData.fileName;
    const previousAnalysis = resultData.previousAnalysis;
    
    setExportingPdf(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let y = 20;
      
      const checkPageBreak = (needed = 20) => {
        if (y + needed > 280) {
          doc.addPage();
          y = 20;
        }
      };
      
      // Header
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('GRMC.ai', margin, 18);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Contract Compliance Report', margin, 28);
      
      doc.setFontSize(9);
      doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, margin, 35);
      
      if (fileName) {
        doc.text(`Document: ${fileName}`, pageWidth - margin - doc.getTextWidth(`Document: ${fileName}`), 35);
      }
      
      y = 55;
      
      // Overall Score Section
      doc.setFillColor(51, 65, 85);
      doc.roundedRect(margin, y - 5, pageWidth - 2 * margin, 35, 3, 3, 'F');
      
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(10);
      doc.text('OVERALL COMPLIANCE SCORE', margin + 10, y + 5);
      
      const scoreColor = results.overallScore >= 80 ? [74, 222, 128] : 
                         results.overallScore >= 60 ? [250, 204, 21] :
                         results.overallScore >= 40 ? [251, 146, 60] : [248, 113, 113];
      
      doc.setTextColor(...scoreColor);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text(`${results.overallScore}%`, margin + 10, y + 25);
      
      if (previousAnalysis) {
        const delta = results.overallScore - previousAnalysis.overallScore;
        const deltaText = delta >= 0 ? `+${delta}%` : `${delta}%`;
        const deltaColor = delta >= 0 ? [74, 222, 128] : [248, 113, 113];
        doc.setTextColor(...deltaColor);
        doc.setFontSize(12);
        doc.text(`${deltaText} vs previous`, margin + 55, y + 25);
      }
      
      let scoreX = pageWidth - margin - 120;
      FRAMEWORKS.forEach(fw => {
        const fwData = results[fw.key];
        const fwScore = fwData?.applicable === false ? 'N/A' : `${fwData?.score || 0}%`;
        const fwColor = fwData?.applicable === false ? [100, 116, 139] :
                        fwData?.score >= 80 ? [74, 222, 128] :
                        fwData?.score >= 60 ? [250, 204, 21] :
                        fwData?.score >= 40 ? [251, 146, 60] : [248, 113, 113];
        
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(fw.label, scoreX, y + 5);
        
        doc.setTextColor(...fwColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(fwScore, scoreX, y + 15);
        
        scoreX += 30;
      });
      
      y += 45;
      
      if (results.summary) {
        checkPageBreak(30);
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        const summaryLines = doc.splitTextToSize(results.summary, pageWidth - 2 * margin);
        doc.text(summaryLines, margin, y);
        y += summaryLines.length * 5 + 10;
      }
      
      FRAMEWORKS.forEach(fw => {
        const fwData = results[fw.key];
        if (!fwData) return;
        
        checkPageBreak(50);
        
        doc.setFillColor(51, 65, 85);
        doc.roundedRect(margin, y - 2, pageWidth - 2 * margin, 12, 2, 2, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(fw.fullName, margin + 5, y + 6);
        
        const fwScore = fwData.applicable === false ? 'N/A' : `${fwData.score}%`;
        doc.text(fwScore, pageWidth - margin - 20, y + 6);
        
        y += 18;
        
        if (fwData.applicable === false) {
          doc.setTextColor(100, 116, 139);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'italic');
          doc.text('This framework may not be applicable to this contract type', margin + 5, y);
          y += 15;
          return;
        }
        
        if (fwData.checklist) {
          fwData.checklist.forEach(item => {
            checkPageBreak(20);
            
            if (item.present) {
              doc.setTextColor(74, 222, 128);
              doc.text('✓', margin + 5, y);
            } else {
              doc.setTextColor(248, 113, 113);
              doc.text('✗', margin + 5, y);
            }
            
            const reqColor = item.present ? [134, 239, 172] : [252, 165, 165];
            doc.setTextColor(...reqColor);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            const reqLines = doc.splitTextToSize(item.requirement, pageWidth - 2 * margin - 20);
            doc.text(reqLines, margin + 15, y);
            y += reqLines.length * 4;
            
            if (item.note) {
              doc.setTextColor(100, 116, 139);
              doc.setFontSize(7);
              const noteLines = doc.splitTextToSize(item.note, pageWidth - 2 * margin - 20);
              doc.text(noteLines, margin + 15, y + 2);
              y += noteLines.length * 3 + 4;
            }
            
            y += 4;
          });
        }
        
        if (fwData.gaps && fwData.gaps.length > 0) {
          checkPageBreak(30);
          
          doc.setTextColor(248, 113, 113);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.text('GAPS & REMEDIATION', margin + 5, y);
          y += 8;
          
          fwData.gaps.forEach(gap => {
            checkPageBreak(25);
            
            doc.setFillColor(15, 23, 42);
            const gapHeight = 20;
            doc.roundedRect(margin + 5, y - 4, pageWidth - 2 * margin - 10, gapHeight, 2, 2, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            const issueLines = doc.splitTextToSize(`Issue: ${gap.issue}`, pageWidth - 2 * margin - 20);
            doc.text(issueLines, margin + 10, y + 2);
            
            doc.setTextColor(148, 163, 184);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            const remLines = doc.splitTextToSize(`Remediation: ${gap.remediation}`, pageWidth - 2 * margin - 20);
            doc.text(remLines, margin + 10, y + 10);
            
            y += gapHeight + 5;
          });
        }
        
        y += 10;
      });
      
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(8);
        doc.text(
          `Page ${i} of ${pageCount} | GRMC.ai - AI-Powered Contract Compliance`,
          pageWidth / 2,
          290,
          { align: 'center' }
        );
      }
      
      const pdfFileName = fileName 
        ? `compliance-report-${fileName.replace(/\.[^/.]+$/, '')}.pdf`
        : `compliance-report-${new Date().toISOString().split('T')[0]}.pdf`;
      
      doc.save(pdfFileName);
    } catch (err) {
      console.error('PDF export error:', err);
      setError('Failed to export PDF. Please try again.');
    }
    
    setExportingPdf(false);
  };

  // Email PDF Report
  const emailPdfReport = async (resultIndex, email, feedback) => {
    const resultData = allResults[resultIndex];
    if (!resultData?.results) return;
    
    const results = resultData.results;
    const fileName = resultData.fileName;
    const previousAnalysis = resultData.previousAnalysis;
    
    setEmailSending(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let y = 20;
      
      const checkPageBreak = (needed = 20) => {
        if (y + needed > 280) {
          doc.addPage();
          y = 20;
        }
      };
      
      // Header
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('GRMC.ai', margin, 18);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Contract Compliance Report', margin, 28);
      
      doc.setFontSize(9);
      doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, margin, 35);
      
      if (fileName) {
        doc.text(`Document: ${fileName}`, pageWidth - margin - doc.getTextWidth(`Document: ${fileName}`), 35);
      }
      
      y = 55;
      
      // Overall Score Section
      doc.setFillColor(51, 65, 85);
      doc.roundedRect(margin, y - 5, pageWidth - 2 * margin, 35, 3, 3, 'F');
      
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(10);
      doc.text('OVERALL COMPLIANCE SCORE', margin + 10, y + 5);
      
      const scoreColor = results.overallScore >= 80 ? [74, 222, 128] : 
                         results.overallScore >= 60 ? [250, 204, 21] :
                         results.overallScore >= 40 ? [251, 146, 60] : [248, 113, 113];
      
      doc.setTextColor(...scoreColor);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text(`${results.overallScore}%`, margin + 10, y + 25);
      
      if (previousAnalysis) {
        const delta = results.overallScore - previousAnalysis.overallScore;
        const deltaText = delta >= 0 ? `+${delta}%` : `${delta}%`;
        const deltaColor = delta >= 0 ? [74, 222, 128] : [248, 113, 113];
        doc.setTextColor(...deltaColor);
        doc.setFontSize(12);
        doc.text(`${deltaText} vs previous`, margin + 55, y + 25);
      }
      
      let scoreX = pageWidth - margin - 120;
      FRAMEWORKS.forEach(fw => {
        const fwData = results[fw.key];
        const fwScore = fwData?.applicable === false ? 'N/A' : `${fwData?.score || 0}%`;
        const fwColor = fwData?.applicable === false ? [100, 116, 139] :
                        fwData?.score >= 80 ? [74, 222, 128] :
                        fwData?.score >= 60 ? [250, 204, 21] :
                        fwData?.score >= 40 ? [251, 146, 60] : [248, 113, 113];
        
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(fw.label, scoreX, y + 5);
        
        doc.setTextColor(...fwColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(fwScore, scoreX, y + 15);
        
        scoreX += 30;
      });
      
      y += 45;
      
      if (results.summary) {
        checkPageBreak(30);
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        const summaryLines = doc.splitTextToSize(results.summary, pageWidth - 2 * margin);
        doc.text(summaryLines, margin, y);
        y += summaryLines.length * 5 + 10;
      }
      
      FRAMEWORKS.forEach(fw => {
        const fwData = results[fw.key];
        if (!fwData) return;
        
        checkPageBreak(50);
        
        doc.setFillColor(51, 65, 85);
        doc.roundedRect(margin, y - 2, pageWidth - 2 * margin, 12, 2, 2, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(fw.fullName, margin + 5, y + 6);
        
        const fwScore = fwData.applicable === false ? 'N/A' : `${fwData.score}%`;
        doc.text(fwScore, pageWidth - margin - 20, y + 6);
        
        y += 18;
        
        if (fwData.applicable === false) {
          doc.setTextColor(100, 116, 139);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'italic');
          doc.text('This framework may not be applicable to this contract type', margin + 5, y);
          y += 15;
          return;
        }
        
        if (fwData.checklist) {
          fwData.checklist.forEach(item => {
            checkPageBreak(20);
            
            if (item.present) {
              doc.setTextColor(74, 222, 128);
              doc.text('✓', margin + 5, y);
            } else {
              doc.setTextColor(248, 113, 113);
              doc.text('✗', margin + 5, y);
            }
            
            const reqColor = item.present ? [134, 239, 172] : [252, 165, 165];
            doc.setTextColor(...reqColor);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            const reqLines = doc.splitTextToSize(item.requirement, pageWidth - 2 * margin - 20);
            doc.text(reqLines, margin + 15, y);
            y += reqLines.length * 4;
            
            if (item.note) {
              doc.setTextColor(100, 116, 139);
              doc.setFontSize(7);
              const noteLines = doc.splitTextToSize(item.note, pageWidth - 2 * margin - 20);
              doc.text(noteLines, margin + 15, y + 2);
              y += noteLines.length * 3 + 4;
            }
            
            y += 4;
          });
        }
        
        if (fwData.gaps && fwData.gaps.length > 0) {
          checkPageBreak(30);
          
          doc.setTextColor(248, 113, 113);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.text('GAPS & REMEDIATION', margin + 5, y);
          y += 8;
          
          fwData.gaps.forEach(gap => {
            checkPageBreak(25);
            
            doc.setFillColor(15, 23, 42);
            const gapHeight = 20;
            doc.roundedRect(margin + 5, y - 4, pageWidth - 2 * margin - 10, gapHeight, 2, 2, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            const issueLines = doc.splitTextToSize(`Issue: ${gap.issue}`, pageWidth - 2 * margin - 20);
            doc.text(issueLines, margin + 10, y + 2);
            
            doc.setTextColor(148, 163, 184);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            const remLines = doc.splitTextToSize(`Remediation: ${gap.remediation}`, pageWidth - 2 * margin - 20);
            doc.text(remLines, margin + 10, y + 10);
            
            y += gapHeight + 5;
          });
        }
        
        y += 10;
      });
      
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(8);
        doc.text(
          `Page ${i} of ${pageCount} | GRMC.ai - AI-Powered Contract Compliance`,
          pageWidth / 2,
          290,
          { align: 'center' }
        );
      }
      
      // Get PDF as base64
      const pdfBase64 = doc.output('datauristring').split(',')[1];
      const pdfFileName = fileName 
        ? `compliance-report-${fileName.replace(/\.[^/.]+$/, '')}.pdf`
        : `compliance-report-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Send to Apps Script
      await fetch('https://script.google.com/macros/s/AKfycbzuGZL_JbwuCpI_Ql7n12DteonZNOvGg_QeU6HbV5ta5H3XssZ-mN7_0bCHYJJzvcs/exec', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          source: 'grmc.ai',
          feedback: feedback || '',
          reportPdf: pdfBase64,
          reportFileName: pdfFileName,
          contractName: fileName || 'Pasted Text',
          overallScore: results.overallScore
        })
      });
      
      setEmailReportModal({ open: false, resultIndex: null });
      alert('Report sent! Check your email.');
    } catch (err) {
      console.error('Email report error:', err);
      alert('Failed to send report. Please try again.');
    }
    
    setEmailSending(false);
  };

  // Reset everything
  const reset = () => {
    setContractText('');
    setUploadedFiles([]);
    setAllResults([]);
    setError('');
    setShowHistory(false);
    setHistoryContractId(null);
    setExpandedResult(0);
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  // Calculate delta
  const getDelta = (current, previous) => {
    if (!previous) return null;
    return current - previous;
  };

  // Render delta badge
  const renderDelta = (current, previous) => {
    const delta = getDelta(current, previous);
    if (delta === null) return null;
    
    const isPositive = delta >= 0;
    return (
      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
        isPositive ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
      }`}>
        {isPositive ? '↑' : '↓'} {Math.abs(delta)}%
      </span>
    );
  };

  // Render checklist for a framework
  const renderChecklist = (data) => (
    <div className="space-y-4">
      {data.applicable === false && (
        <div className="bg-slate-700/50 rounded-lg p-3 text-slate-400 text-sm mb-4">
          ⚠️ This framework may not be applicable to this contract type
        </div>
      )}
      
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

  // Render history modal
  const renderHistoryModal = () => {
    if (!showHistory || !historyContractId) return null;
    
    const history = getContractHistory(historyContractId);
    
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Compliance History</h3>
            <button 
              onClick={() => setShowHistory(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            {history.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No previous analyses found</p>
            ) : (
              <div className="space-y-3">
                {history.slice().reverse().map((analysis, i) => (
                  <div key={i} className="bg-slate-900 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 text-xs">
                        {new Date(analysis.date).toLocaleDateString()} at {new Date(analysis.date).toLocaleTimeString()}
                      </span>
                      <span className={`text-lg font-bold ${getScoreColor(analysis.overallScore)}`}>
                        {analysis.overallScore}%
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs">
                      {FRAMEWORKS.map(fw => (
                        <div key={fw.key}>
                          <span className="text-slate-500">{fw.label}: </span>
                          <span className={getScoreColor(analysis.scores[fw.key])}>
                            {analysis.scores[fw.key] !== undefined ? `${analysis.scores[fw.key]}%` : 'N/A'}
                          </span>
                        </div>
                      ))}
                    </div>
                    {i === 0 && <span className="text-xs text-blue-400 mt-2 block">Current</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render email report modal
  const renderEmailReportModal = () => {
    if (!emailReportModal.open) return null;
    
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-xl max-w-md w-full overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Email Report</h3>
            <button 
              onClick={() => setEmailReportModal({ open: false, resultIndex: null })}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              emailPdfReport(
                emailReportModal.resultIndex,
                formData.get('email'),
                formData.get('feedback')
              );
            }}
            className="p-4 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Email address *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Feedback (optional)
              </label>
              <textarea
                name="feedback"
                rows={3}
                placeholder="Any issues or suggestions? We'd love to hear from you..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">Help us improve GRMC.ai</p>
            </div>
            <button
              type="submit"
              disabled={emailSending}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {emailSending ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Report
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Render single result card
  const renderResultCard = (resultData, index) => {
    const { fileName, contractId, results, previousAnalysis, error: resultError } = resultData;
    const isExpanded = expandedResult === index;
    
    if (resultError) {
      return (
        <div key={index} className="bg-slate-800 rounded-xl border border-red-800/50 overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-red-400">✗</span>
              <span className="font-medium">{fileName}</span>
            </div>
            <span className="text-red-400 text-sm">Analysis failed</span>
          </div>
        </div>
      );
    }
    
    return (
      <div key={index} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {/* Collapsed header */}
        <button
          onClick={() => setExpandedResult(isExpanded ? -1 : index)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className={`text-lg font-bold ${getScoreColor(results.overallScore)}`}>
              {results.overallScore}%
            </span>
            <span className="font-medium truncate max-w-[200px]">{fileName}</span>
            {previousAnalysis && renderDelta(results.overallScore, previousAnalysis.overallScore)}
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex gap-3">
              {FRAMEWORKS.map(fw => (
                <span key={fw.key} className={`text-xs ${
                  results[fw.key]?.applicable === false 
                    ? 'text-slate-600' 
                    : getScoreColor(results[fw.key]?.score)
                }`}>
                  {fw.label}: {results[fw.key]?.applicable === false ? 'N/A' : `${results[fw.key]?.score}%`}
                </span>
              ))}
            </div>
            <svg 
              className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        
        {/* Expanded content */}
        {isExpanded && (
          <div className="border-t border-slate-700">
            {/* Summary */}
            {results.summary && (
              <div className="p-4 border-b border-slate-700">
                <p className="text-slate-400 text-sm">{results.summary}</p>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="p-4 border-b border-slate-700 flex gap-2 flex-wrap">
              <button
                onClick={() => exportPdfReport(index)}
                disabled={exportingPdf}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {exportingPdf ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Report
                  </>
                )}
              </button>
              <button
                onClick={() => setEmailReportModal({ open: true, resultIndex: index })}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Report
              </button>
              <button
                onClick={() => {
                  setHistoryContractId(contractId);
                  setShowHistory(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View History
              </button>
            </div>
            
            {/* Framework tabs */}
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
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* History Modal */}
      {renderHistoryModal()}
      
      {/* Email Report Modal */}
      {renderEmailReportModal()}
      
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="GRMC.ai" className="h-80" />
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
            Upload contracts. Get instant compliance analysis across GDPR, SOC 2, CCPA & HIPAA.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Upload & Input (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* File Upload - Now accepts multiple */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <label className="block text-sm font-medium text-slate-400 mb-3">Contract Documents</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                multiple
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
                ) : uploadedFiles.length > 0 ? (
                  <div>
                    <div className="text-green-400 mb-1">✓ {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} loaded</div>
                    <div className="text-slate-400 text-sm mb-2">
                      {uploadedFiles.map(f => f.name).join(', ')}
                    </div>
                    <div className="text-slate-500 text-sm">Click to upload different files</div>
                  </div>
                ) : (
                  <div>
                    <svg className="w-10 h-10 mx-auto mb-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="text-slate-300 font-medium">Upload PDF or text files</div>
                    <div className="text-slate-500 text-sm mt-1">DPA, MSA, BAA, Vendor Agreements</div>
                    <div className="text-blue-400 text-xs mt-2">Supports multiple files</div>
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
                onChange={(e) => {
                  setContractText(e.target.value);
                  if (e.target.value) setUploadedFiles([]);
                }}
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
              onClick={analyzeContracts}
              disabled={analyzing || (!contractText.trim() && uploadedFiles.length === 0)}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                analyzing || (!contractText.trim() && uploadedFiles.length === 0)
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
                  Analyzing {currentFileIndex} of {totalFiles}...
                </span>
              ) : uploadedFiles.length > 1 ? (
                `Analyze ${uploadedFiles.length} Contracts`
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

            {/* Privacy Banner */}
            <div className="bg-green-900/20 rounded-xl p-4 border border-green-800/30">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <div className="text-green-400 text-sm font-medium">Your data is safe</div>
                  <div className="text-slate-400 text-xs mt-1">Contracts are analyzed in real-time and never stored. Your data is not retained or used for AI training.</div>
                </div>
              </div>
            </div>

            {/* Email Signup */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="text-sm font-medium text-slate-300 mb-2">Get updates</div>
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const email = e.target.email.value;
                  const btn = e.target.querySelector('button');
                  btn.disabled = true;
                  btn.textContent = 'Sending...';
                  try {
                    await fetch('https://script.google.com/macros/s/AKfycbzuGZL_JbwuCpI_Ql7n12DteonZNOvGg_QeU6HbV5ta5H3XssZ-mN7_0bCHYJJzvcs/exec', {
                      method: 'POST',
                      body: JSON.stringify({ email, source: 'grmc.ai' })
                    });
                    e.target.reset();
                    btn.textContent = '✓ Subscribed!';
                    setTimeout(() => { btn.textContent = 'Subscribe'; btn.disabled = false; }, 2000);
                  } catch (err) {
                    btn.textContent = 'Try again';
                    btn.disabled = false;
                  }
                }}
                className="flex gap-2"
              >
                <input 
                  type="email" 
                  name="email" 
                  placeholder="your@email.com" 
                  required
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Right: Results (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            {allResults.length === 0 ? (
              <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                <svg className="w-16 h-16 text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-slate-500 text-lg">Compliance results will appear here</div>
                <div className="text-slate-600 text-sm mt-2">Upload contracts and click Analyze</div>
              </div>
            ) : (
              <>
                {/* Results summary */}
                {allResults.length > 1 && (
                  <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <div className="text-sm text-slate-400 mb-2">
                      Analyzed {allResults.length} contracts
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      {allResults.filter(r => r.results).length > 0 && (
                        <span className="text-green-400 text-sm">
                          ✓ {allResults.filter(r => r.results).length} successful
                        </span>
                      )}
                      {allResults.filter(r => r.error).length > 0 && (
                        <span className="text-red-400 text-sm">
                          ✗ {allResults.filter(r => r.error).length} failed
                        </span>
                      )}
                      <span className="text-slate-400 text-sm">
                        Avg score: {Math.round(
                          allResults.filter(r => r.results).reduce((sum, r) => sum + r.results.overallScore, 0) /
                          allResults.filter(r => r.results).length
                        )}%
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Individual results */}
                {allResults.map((result, index) => renderResultCard(result, index))}

                {/* Reset */}
                <button
                  onClick={reset}
                  className="w-full py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium transition-colors"
                >
                  Analyze More Contracts
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>GRMC.ai — Governance, Risk Management & Compliance</p>
          <p className="mt-1">AI-powered contract compliance analysis</p>
          <p className="mt-3 text-xs text-slate-600">🔒 Zero data retention • Your contracts are never stored</p>
        </footer>
      </main>
    </div>
  );
}
