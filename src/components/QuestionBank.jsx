import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Eye, 
  EyeOff, 
  Send, 
  Sparkles 
} from 'lucide-react';
import { generateAIAnswer, scoreAIAnswer } from '../api';

export default function QuestionBank() {
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [testModalQuestion, setTestModalQuestion] = useState(null);
  const [testAnswerText, setTestAnswerText] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const topics = [
    'All',
    'Java',
    'Python',
    'React',
    'JavaScript',
    'Spring Boot',
    'SQL',
    'DBMS',
    'System Design',
    'DSA',
    'Behavioral'
  ];

  const questionsData = [
    { id: 1, topic: 'Java', question: 'What is OOP in Java? Explain the four main principles with examples.' },
    { id: 2, topic: 'Java', question: 'What is the difference between method overloading and method overriding in Java?' },
    { id: 3, topic: 'Java', question: 'What is inheritance in Java? Explain with an example.' },
    { id: 4, topic: 'Java', question: 'What is the difference between an interface and an abstract class in Java?' },
    { id: 5, topic: 'Java', question: 'What is exception handling in Java? Explain try, catch, and finally blocks.' },
    { id: 6, topic: 'Python', question: 'What are the main features of Python? Explain with examples.' },
    { id: 7, topic: 'Python', question: 'What is the difference between a list and a tuple in Python?' },
    { id: 8, topic: 'Python', question: 'What are functions in Python? Explain with an example.' },
    { id: 9, topic: 'Python', question: 'What is object-oriented programming in Python? Explain classes and inheritance.' },
    { id: 10, topic: 'Python', question: 'What is the difference between == and is in Python?' },
    { id: 11, topic: 'React', question: 'What is React and how do components work in React?' },
    { id: 12, topic: 'React', question: 'What is the difference between props and state in React?' },
    { id: 13, topic: 'React', question: 'What is useState in React and how does state batching work?' },
    { id: 14, topic: 'React', question: 'What is useEffect in React and when is cleanup required?' },
    { id: 15, topic: 'React', question: 'What is the Virtual DOM in React?' },
    { id: 16, topic: 'Spring Boot', question: 'What is Spring Boot and why is it used for backend development?' },
    { id: 17, topic: 'Spring Boot', question: 'What is dependency injection and IoC in Spring Boot?' },
    { id: 18, topic: 'Spring Boot', question: 'What is a REST API in Spring Boot and how do you design endpoints?' },
    { id: 19, topic: 'Spring Boot', question: 'What is Spring Data JPA and how does it simplify database operations?' },
    { id: 20, topic: 'SQL', question: 'What is the difference between WHERE and HAVING in SQL?' },
    { id: 21, topic: 'SQL', question: 'What is the difference between DELETE, DROP, and TRUNCATE?' },
    { id: 22, topic: 'SQL', question: 'What is a JOIN in SQL? Explain different types of joins.' },
    { id: 23, topic: 'DBMS', question: 'What is normalization in DBMS? Explain 1NF, 2NF, and 3NF.' },
    { id: 24, topic: 'DBMS', question: 'What is a transaction in DBMS? Explain ACID properties.' },
    { id: 25, topic: 'System Design', question: 'What is Load Balancing and what algorithms are commonly used?' },
    { id: 26, topic: 'System Design', question: 'Explain the CAP theorem and its implications in distributed systems.' },
    { id: 27, topic: 'DSA', question: 'What is the difference between an Array and a Linked List in memory and performance?' },
    { id: 28, topic: 'DSA', question: 'How does a Hash Map work internally and how are collisions handled?' },
    { id: 29, topic: 'Behavioral', question: 'Tell me about yourself and your background in software engineering.' },
    { id: 30, topic: 'Behavioral', question: 'Describe a challenging technical problem you solved and how you approached it.' },
  ];

  const handleToggleAnswer = async (id, topic, question) => {
    if (revealedAnswers[id]) {
      setRevealedAnswers((prev) => ({ ...prev, [id]: null }));
    } else {
      try {
        const answer = await generateAIAnswer(topic, question);
        setRevealedAnswers((prev) => ({ ...prev, [id]: answer }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleOpenTestModal = (q) => {
    setTestModalQuestion(q);
    setTestAnswerText('');
    setTestResult(null);
  };

  const handleEvaluateTest = async () => {
    if (!testAnswerText.trim() || !testModalQuestion) return;
    setIsEvaluating(true);
    try {
      const result = await scoreAIAnswer(testModalQuestion.question, testAnswerText.trim());
      setTestResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const filteredQuestions = questionsData.filter((item) => {
    const matchTopic = selectedTopic === 'All' || item.topic.toLowerCase() === selectedTopic.toLowerCase();
    const matchSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || item.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTopic && matchSearch;
  });

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Banner */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '2.5rem' }}>
        <div className="badge badge-indigo" style={{ marginBottom: '0.75rem' }}>
          <BookOpen style={{ width: '12px', height: '12px' }} />
          <span>CURATED QUESTION BANK</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#ffffff', marginBottom: '0.5rem' }}>
          Technical & Behavioral Question Library
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', maxWidth: '600px', marginBottom: '1.5rem' }}>
          Browse curated questions asked by top tech companies. Reveal model answers or test your own responses.
        </p>

        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search style={{ width: '16px', height: '16px', color: '#64748b', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            style={{ width: '100%', background: 'rgba(10,15,29,0.9)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.65rem 1rem 0.65rem 2.5rem', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
          />
        </div>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: '700',
              whiteSpace: 'nowrap',
              border: '1px solid',
              cursor: 'pointer',
              background: selectedTopic === topic ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
              color: selectedTopic === topic ? '#ffffff' : '#94a3b8',
              borderColor: selectedTopic === topic ? 'var(--accent-primary)' : 'var(--border-color)',
              transition: 'all 0.2s ease',
            }}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Questions list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredQuestions.map((item) => {
          const isRevealed = Boolean(revealedAnswers[item.id]);
          return (
            <div
              key={item.id}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '1.5rem' }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
                  <span className="badge badge-indigo" style={{ marginTop: '2px' }}>{item.topic}</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', lineHeight: 1.4 }}>{item.question}</h3>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleToggleAnswer(item.id, item.topic, item.question)} className="btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                    {isRevealed ? <EyeOff style={{ width: '14px', height: '14px' }} /> : <Eye style={{ width: '14px', height: '14px' }} />}
                    <span>{isRevealed ? 'Hide' : 'Model Answer'}</span>
                  </button>

                  <button onClick={() => handleOpenTestModal(item)} className="btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                    <Sparkles style={{ width: '14px', height: '14px' }} />
                    <span>Test My Answer</span>
                  </button>
                </div>
              </div>

              {isRevealed && (
                <div style={{ background: '#050811', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', padding: '1rem', marginTop: '1rem', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  <strong style={{ color: '#818cf8', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>AI Model Answer:</strong>
                  {revealedAnswers[item.id]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Test Modal */}
      {testModalQuestion && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '600px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '2rem', position: 'relative' }}>
            
            <button onClick={() => setTestModalQuestion(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>
              ✕
            </button>

            <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>{testModalQuestion.topic}</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '1rem' }}>
              {testModalQuestion.question}
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Your Answer</label>
              <textarea
                value={testAnswerText}
                onChange={(e) => setTestAnswerText(e.target.value)}
                placeholder="Write your explanation..."
                rows={4}
                className="answer-textarea-box"
                style={{ minHeight: '120px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setTestModalQuestion(null)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleEvaluateTest} disabled={!testAnswerText.trim() || isEvaluating} className="btn-primary">
                {isEvaluating ? <span>Evaluating...</span> : <span>Evaluate</span>}
              </button>
            </div>

            {testResult && (
              <div style={{ background: '#050811', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '12px', padding: '1rem', marginTop: '1.25rem', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#f8fafc', whiteSpace: 'pre-wrap' }}>
                <strong style={{ color: '#10b981', display: 'block', marginBottom: '0.25rem', fontFamily: 'var(--font-sans)' }}>Score & Feedback:</strong>
                {testResult}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
