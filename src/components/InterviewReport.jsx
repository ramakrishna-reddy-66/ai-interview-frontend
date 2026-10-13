import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Download, 
  Printer, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { getDetailedReport, getInterviewReportText, resetInterviewSession } from '../api';

export default function InterviewReport({ 
  interview, 
  onBackToDashboard, 
  onRetakeInterview 
}) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleRetake = async () => {
    try {
      await resetInterviewSession(interview.id);
    } catch (err) {
      console.warn('Could not reset previous answers:', err);
    }
    onRetakeInterview(interview);
  };

  useEffect(() => {
    fetchReport();
  }, [interview]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await getDetailedReport(interview.id);
      setReportData(data);
    } catch (err) {
      console.error('Failed to fetch detailed report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadText = async () => {
    try {
      const text = await getInterviewReportText(interview.id);
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `InterviewAI_Report_${interview.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
        <Sparkles style={{ width: '36px', height: '36px', color: '#818cf8', animation: 'spin 1.5s linear infinite', margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: '800' }}>Generating AI Performance Report...</h3>
        <p style={{ fontSize: '0.85rem' }}>Analyzing question-by-question metrics and scoring.</p>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
        <AlertCircle style={{ width: '36px', height: '36px', color: '#f43f5e', margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: '800', marginBottom: '0.5rem' }}>Report Unavailable</h3>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>Could not load the detailed evaluation report.</p>
        <button onClick={onBackToDashboard} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Header Actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <button onClick={onBackToDashboard} className="btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}>
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          <span>Back to Dashboard</span>
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleDownloadText} className="btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}>
            <Download style={{ width: '14px', height: '14px' }} />
            <span>Download .txt</span>
          </button>

          <button onClick={handlePrint} className="btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}>
            <Printer style={{ width: '14px', height: '14px' }} />
            <span>Print / PDF</span>
          </button>

          <button onClick={handleRetake} className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>
            <RotateCcw style={{ width: '14px', height: '14px' }} />
            <span>Retake</span>
          </button>
        </div>
      </div>

      {/* Main Scorecard Banner */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.6)' }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <div className="badge badge-indigo" style={{ marginBottom: '0.75rem' }}>
              <Sparkles style={{ width: '12px', height: '12px' }} />
              <span>OFFICIAL EVALUATION RESULT</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff', marginBottom: '0.5rem' }}>
              {reportData.interviewTitle}
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', maxWidth: '550px' }}>
              {reportData.interviewDescription || 'Assessment completed with AI scoring and feedback.'}
            </p>
          </div>

          {/* Big Score Gauge */}
          <div style={{ background: 'rgba(10, 15, 29, 0.95)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '1.75rem 2.5rem', textAlign: 'center', minWidth: '220px' }}>
            <div style={{ fontSize: '3rem', fontWeight: '900', color: reportData.percentage >= 80 ? '#10b981' : reportData.percentage >= 60 ? '#06b6d4' : '#f59e0b', fontFamily: 'var(--font-heading)' }}>
              {reportData.percentage}%
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
              {reportData.totalScore} / {reportData.maxScore} Points
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <span className={`badge ${reportData.percentage >= 80 ? 'badge-emerald' : reportData.percentage >= 60 ? 'badge-cyan' : 'badge-amber'}`}>
                {reportData.performance}
              </span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div style={{ background: 'rgba(10, 15, 29, 0.6)', padding: '1.5rem', borderRadius: '16px', margin: '2rem 0', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Award style={{ width: '16px', height: '16px' }} />
            <span>Executive AI Assessment</span>
          </h3>
          <p style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.6 }}>
            {reportData.summaryFeedback}
          </p>
        </div>

        {/* Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Questions Answered</div>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', marginTop: '0.2rem' }}>
              {reportData.answeredQuestions} / {reportData.totalQuestions}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Points</div>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#818cf8', marginTop: '0.2rem' }}>
              {reportData.totalScore} pts
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Proficiency Rating</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ec4899', marginTop: '0.35rem' }}>
              {reportData.performance}
            </div>
          </div>
        </div>

      </div>

      {/* Breakdown per question */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <FileText style={{ width: '20px', height: '20px', color: '#818cf8' }} />
          <span>Question-by-Question Evaluation ({reportData.items?.length || 0})</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reportData.items?.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={item.questionId || idx}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '1.5rem', transition: 'all 0.2s ease' }}
              >
                <div 
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', cursor: 'pointer' }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#818cf8' }}>Q#{idx + 1}</span>
                      <span className={`badge ${(item.score || 0) >= 8 ? 'badge-emerald' : (item.score || 0) >= 5 ? 'badge-amber' : 'badge-rose'}`}>
                        Score: {item.score || 0}/10
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>
                      {item.questionText}
                    </h3>
                  </div>

                  <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                    {isExpanded ? <ChevronUp style={{ width: '20px', height: '20px' }} /> : <ChevronDown style={{ width: '20px', height: '20px' }} />}
                  </button>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', color: '#cbd5e1', marginTop: '1rem', lineHeight: 1.5 }}>
                  <strong style={{ color: '#818cf8' }}>AI Feedback: </strong>
                  {item.feedback}
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Your Submitted Answer:
                      </div>
                      <div style={{ background: '#050811', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.85rem', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#f8fafc', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                        {item.candidateAnswer || 'Not answered.'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Ideal Industry Model Answer:
                      </div>
                      <div style={{ background: '#050811', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '0.85rem', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                        {item.modelAnswer || 'No model answer provided.'}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
