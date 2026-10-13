import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Mic, 
  Award,
  Zap
} from 'lucide-react';
import { loginUser, registerUser } from '../api';

export default function LoginPage({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await registerUser(name, email, password);
        onLoginSuccess({
          id: res.id,
          name: res.name || name,
          email: res.email || email,
          token: res.token || 'iai_user',
        });
      } else {
        const res = await loginUser(email, password);
        onLoginSuccess({
          id: res.id,
          name: res.name || email.split('@')[0],
          email: res.email || email,
          token: res.token,
        });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    onLoginSuccess({
      id: 99,
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      token: 'iai_demo_token',
    });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        
        {/* Left Banner Side */}
        <div className="auth-banner-side">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div className="brand-icon-box">
                <Bot style={{ width: '24px', height: '24px', color: '#ffffff' }} />
              </div>
              <div>
                <div className="brand-title">
                  Interview<span>AI</span>
                  <span className="brand-badge">PRO</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>AI Mock Interview Platform</div>
              </div>
            </div>

            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.25, marginBottom: '0.75rem' }}>
              Master Technical Interviews with Real-Time AI.
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Practice mock interviews for Java, Python, React, System Design, and SQL with instant voice prompting, live AI grading, and detailed performance scorecards.
            </p>

            {/* Feature bullets */}
            <div className="auth-features-list">
              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <Mic style={{ width: '18px', height: '18px' }} />
                </div>
                <div className="auth-feature-text">
                  <h4>Interactive Voice Interviews</h4>
                  <p>AI speaks questions aloud and transcribes your microphone speech in real-time.</p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <Award style={{ width: '18px', height: '18px' }} />
                </div>
                <div className="auth-feature-text">
                  <h4>Instant 1-10 AI Grading</h4>
                  <p>Heuristic and semantic evaluation with tailored feedback on every answer.</p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <Cpu style={{ width: '18px', height: '18px' }} />
                </div>
                <div className="auth-feature-text">
                  <h4>Comprehensive Reports & Model Solutions</h4>
                  <p>Compare answers against Tier-1 model solutions and export printable PDF reports.</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2rem' }}>
            Trusted by developers preparing for Google, Amazon, Microsoft & Meta.
          </div>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-side">
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.35rem' }}>
              {isRegister ? 'Create Your Account' : 'Sign in to InterviewAI'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              {isRegister ? 'Enter your details below to begin practicing' : 'Enter your email and password to access your dashboard'}
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="auth-tabs">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(''); }}
              className={`auth-tab-btn ${!isRegister ? 'active' : ''}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(''); }}
              className={`auth-tab-btn ${isRegister ? 'active' : ''}`}
            >
              Register
            </button>
          </div>

          {/* Quick Demo Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="demo-fill-btn"
          >
            <Zap style={{ width: '14px', height: '14px' }} />
            <span>Instant Demo Access (Skip Login)</span>
          </button>

          {error && (
            <div className="auth-alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.johnson@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem 1rem', marginTop: '0.5rem' }}
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{isRegister ? 'Create Account & Enter Dashboard' : 'Sign In & Enter Dashboard'}</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.78rem', color: '#64748b' }}>
            {isRegister ? (
              <span>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(false); }} style={{ color: '#818cf8', fontWeight: 600 }}>Sign In</a></span>
            ) : (
              <span>New to InterviewAI? <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(true); }} style={{ color: '#818cf8', fontWeight: 600 }}>Create an Account</a></span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
