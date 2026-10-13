import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Award, 
  Sparkles, 
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { submitAnswer, getNextQuestion, resetInterviewSession } from '../api';

export default function InterviewStudio({ 
  interview, 
  initialQuestion, 
  onFinishInterview, 
  onBackToDashboard,
  soundEnabled 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setSeconds(0);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestion]);

  useEffect(() => {
    if (soundEnabled && currentQuestion?.questionText && 'speechSynthesis' in window) {
      speakText(currentQuestion.questionText);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentQuestion, soundEnabled]);

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (currentQuestion?.questionText) {
      speakText(currentQuestion.questionText);
    }
  };

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswerText((prev) => (prev ? prev + ' ' + transcript : transcript));
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim() || !currentQuestion?.id) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsSubmitting(true);
    try {
      const result = await submitAnswer(currentQuestion.id, answerText.trim());
      setEvaluation({
        score: result.score || 0,
        feedback: result.feedback || 'Answer evaluated.',
      });
    } catch (err) {
      console.error(err);
      alert('Error evaluating answer: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    setIsSubmitting(true);
    try {
      const nextQ = await getNextQuestion(interview.id);
      setCurrentQuestion(nextQ);
      setQuestionNumber((prev) => prev + 1);
      setAnswerText('');
      setEvaluation(null);
      setShowModelAnswer(false);
    } catch (err) {
      console.error(err);
      alert('Failed to get next question: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="studio-box">
      
      {/* Top Bar */}
      <div className="studio-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBackToDashboard} className="btn-secondary" style={{ padding: '0.5rem' }}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff' }}>{interview.title}</span>
              <span className="badge badge-indigo">Question {questionNumber}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.05)', padding: '0.45rem 0.85rem', borderRadius: '10px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
            <Clock style={{ width: '14px', height: '14px', color: '#818cf8' }} />
            <span>{formatTime(seconds)}</span>
          </div>

          <button onClick={() => onFinishInterview(interview)} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
            <CheckCircle2 style={{ width: '16px', height: '16px' }} />
            <span>Finish & View Report</span>
          </button>
        </div>
      </div>

      {/* Stage Box */}
      <div className="studio-stage">
        
        {/* Interviewer Persona Header */}
        <div className="interviewer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="brand-icon-box" style={{ width: '52px', height: '52px' }}>
              <Bot style={{ width: '28px', height: '28px', color: '#ffffff' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>AI Senior Technical Interviewer</span>
                <span className="badge badge-emerald">Active</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Evaluating depth, design principles, and concrete examples</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isSpeaking && (
              <div className="sound-wave">
                <div className="sound-bar" />
                <div className="sound-bar" />
                <div className="sound-bar" />
                <div className="sound-bar" />
                <div className="sound-bar" />
              </div>
            )}
            <button onClick={toggleSpeech} className="btn-secondary" style={{ padding: '0.5rem 0.85rem' }}>
              {isSpeaking ? <VolumeX style={{ width: '18px', height: '18px', color: '#f43f5e' }} /> : <Volume2 style={{ width: '18px', height: '18px', color: '#818cf8' }} />}
              <span style={{ fontSize: '0.8rem' }}>{isSpeaking ? 'Mute' : 'Speak'}</span>
            </button>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="question-prompt-box">
          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Question #{questionNumber}
          </div>
          <div className="question-prompt-text">
            {currentQuestion?.questionText || 'Loading question...'}
          </div>
        </div>

        {/* Candidate Answer Box */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
              Your Response {isListening && <span style={{ color: '#f43f5e', textTransform: 'none', marginLeft: '8px' }}>● Listening to microphone...</span>}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={toggleListening}
                className="btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', color: isListening ? '#f43f5e' : '#a5b4fc', borderColor: isListening ? '#f43f5e' : 'var(--border-color)' }}
              >
                {isListening ? <MicOff style={{ width: '14px', height: '14px' }} /> : <Mic style={{ width: '14px', height: '14px' }} />}
                <span>{isListening ? 'Stop Mic' : 'Voice Input'}</span>
              </button>

              {answerText && (
                <button onClick={() => setAnswerText('')} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.78rem', cursor: 'pointer' }}>
                  Clear
                </button>
              )}
            </div>
          </div>

          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Type or speak your answer here. Include definition, mechanics, and practical code examples..."
            className="answer-textarea-box"
            disabled={isSubmitting || evaluation !== null}
          />
        </div>

        {/* Action Button */}
        {!evaluation && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSubmitAnswer}
              disabled={!answerText.trim() || isSubmitting}
              className="btn-primary"
              style={{ padding: '0.85rem 1.75rem' }}
            >
              {isSubmitting ? (
                <>
                  <Sparkles style={{ width: '16px', height: '16px' }} />
                  <span>Evaluating Answer...</span>
                </>
              ) : (
                <>
                  <Send style={{ width: '16px', height: '16px' }} />
                  <span>Submit for AI Evaluation</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Live Evaluation Box */}
        {evaluation && (
          <div style={{ background: 'rgba(10, 15, 29, 0.95)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '1.75rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Award style={{ width: '24px', height: '24px', color: '#818cf8' }} />
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>Evaluation Result</h4>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Scored based on technical accuracy and clarity</p>
                </div>
              </div>

              <div style={{ fontSize: '1.25rem', fontWeight: '900', color: evaluation.score >= 8 ? '#10b981' : evaluation.score >= 5 ? '#f59e0b' : '#f43f5e', fontFamily: 'var(--font-heading)' }}>
                Score: {evaluation.score}/10
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1rem', borderRadius: '12px', fontSize: '0.88rem', color: '#e2e8f0', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              <strong style={{ color: '#818cf8', display: 'block', marginBottom: '0.25rem' }}>Feedback:</strong>
              {evaluation.feedback}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <button
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#a5b4fc' }}
              >
                {showModelAnswer ? <EyeOff style={{ width: '14px', height: '14px' }} /> : <Eye style={{ width: '14px', height: '14px' }} />}
                <span>{showModelAnswer ? 'Hide Model Answer' : 'View Ideal Model Answer'}</span>
              </button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleNextQuestion} className="btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.82rem' }}>
                  <span>Next Question</span>
                  <ChevronRight style={{ width: '16px', height: '16px' }} />
                </button>
                <button onClick={() => onFinishInterview(interview)} className="btn-secondary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.82rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                  <span>Finish</span>
                </button>
              </div>
            </div>

            {showModelAnswer && (
              <div style={{ background: '#050811', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '12px', padding: '1rem', marginTop: '1rem', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                <div style={{ color: '#818cf8', fontWeight: '700', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>Industry Model Solution:</div>
                {currentQuestion?.answer}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
