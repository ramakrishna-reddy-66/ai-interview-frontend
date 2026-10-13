import React, { useState } from 'react';
import { Terminal, Sparkles, Send, Award, CheckCircle2, Zap } from 'lucide-react';
import { generateAIQuestion, generateAIAnswer, scoreAIAnswer } from '../api';

export default function AISandbox() {
  const [topic, setTopic] = useState('Spring Boot REST API');
  const [question, setQuestion] = useState('What is dependency injection and how does it work in Spring Boot?');
  const [answer, setAnswer] = useState('');
  const [modelAnswer, setModelAnswer] = useState('');
  const [scoreResult, setScoreResult] = useState('');
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [loadingScore, setLoadingScore] = useState(false);

  const handleGenerateQuestion = async () => {
    if (!topic.trim()) return;
    setLoadingQuestion(true);
    try {
      const q = await generateAIQuestion(topic.trim());
      setQuestion(q);
      setModelAnswer('');
      setScoreResult('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleGenerateModelAnswer = async () => {
    if (!question.trim()) return;
    setLoadingAnswer(true);
    try {
      const a = await generateAIAnswer(topic.trim(), question.trim());
      setModelAnswer(a);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnswer(false);
    }
  };

  const handleScoreAnswer = async () => {
    if (!question.trim() || !answer.trim()) return;
    setLoadingScore(true);
    try {
      const res = await scoreAIAnswer(question.trim(), answer.trim());
      setScoreResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingScore(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Banner */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '2.5rem' }}>
        <div className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>
          <Terminal style={{ width: '12px', height: '12px' }} />
          <span>INTERACTIVE AI LAB</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff', marginBottom: '0.5rem' }}>
          AI Interview Sandbox
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', maxWidth: '600px' }}>
          Generate custom questions on any tech stack, test candidate answers, and evaluate responses with real-time scoring.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left: Input */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap style={{ width: '18px', height: '18px', color: '#818cf8' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>Prompt Generator</h2>
          </div>

          <div className="form-group">
            <label>Topic / Technology</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Docker, Python, Microservices..."
                style={{ flex: 1, background: 'rgba(10,15,29,0.9)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.65rem 1rem', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
              />
              <button onClick={handleGenerateQuestion} disabled={loadingQuestion || !topic.trim()} className="btn-primary" style={{ padding: '0.65rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                {loadingQuestion ? 'Generating...' : 'Generate Q'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Interview Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              style={{ width: '100%', background: 'rgba(10,15,29,0.9)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.75rem', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button onClick={handleGenerateModelAnswer} disabled={loadingAnswer || !question.trim()} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                {loadingAnswer ? 'Generating...' : 'Generate AI Model Answer'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Candidate Answer</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type candidate answer to test scoring..."
              rows={4}
              className="answer-textarea-box"
              style={{ minHeight: '100px', fontSize: '0.82rem' }}
            />
          </div>

          <button onClick={handleScoreAnswer} disabled={loadingScore || !answer.trim() || !question.trim()} className="btn-primary" style={{ width: '100%' }}>
            {loadingScore ? <span>Evaluating...</span> : <><Send style={{ width: '14px', height: '14px' }} /><span>Score Answer</span></>}
          </button>
        </div>

        {/* Right: Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <CheckCircle2 style={{ width: '16px', height: '16px' }} />
              <span>AI Model Answer</span>
            </h3>
            {modelAnswer ? (
              <div style={{ background: '#050811', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '1rem', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#cbd5e1', whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto' }}>
                {modelAnswer}
              </div>
            ) : (
              <p style={{ fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic' }}>Click "Generate AI Model Answer" to view ideal solution.</p>
            )}
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <Award style={{ width: '16px', height: '16px' }} />
              <span>Scoring & Feedback</span>
            </h3>
            {scoreResult ? (
              <div style={{ background: '#050811', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '12px', padding: '1rem', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#f8fafc', whiteSpace: 'pre-wrap' }}>
                {scoreResult}
              </div>
            ) : (
              <p style={{ fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic' }}>Submit an answer to see instant grading.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
