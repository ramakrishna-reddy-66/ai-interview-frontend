import React, { useState } from 'react';
import { Plus, Sparkles, Layers } from 'lucide-react';
import { createInterview } from '../api';

export default function CreateTrackModal({ isOpen, onClose, onTrackCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError('');

    try {
      const newTrack = await createInterview(title.trim(), description.trim());
      onTrackCreated(newTrack);
      setTitle('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create interview track');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTemplate = (presetTitle, presetDesc) => {
    setTitle(presetTitle);
    setDescription(presetDesc);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '520px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '2rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)' }}>
        
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
        >
          ✕
        </button>

        <div style={{ marginBottom: '1.5rem' }}>
          <div className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
            <Layers style={{ width: '12px', height: '12px' }} />
            <span>CUSTOM TRACK</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff' }}>
            Create New Track
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Define any custom tech stack or job role. AI will generate targeted questions.
          </p>
        </div>

        {error && (
          <div className="auth-alert-error">
            {error}
          </div>
        )}

        {/* Quick Templates */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Quick Role Templates:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {[
              { t: 'Golang Backend Engineer', d: 'Goroutines, Channels, Microservices, and Performance.' },
              { t: 'DevOps & Cloud Architect', d: 'Kubernetes, Docker, CI/CD, AWS, and Infrastructure.' },
              { t: 'AI & Machine Learning Engineer', d: 'PyTorch, Transformers, LLMs, and Model Evaluation.' },
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickTemplate(p.t, p.d)}
                style={{ fontSize: '0.72rem', padding: '0.35rem 0.65rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#cbd5e1', cursor: 'pointer' }}
              >
                + {p.t}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Track Title / Job Role</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer (Next.js & TypeScript)"
              required
              style={{ width: '100%', background: 'rgba(10,15,29,0.9)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div className="form-group">
            <label>Track Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the skills and seniority level..."
              rows={3}
              style={{ width: '100%', background: 'rgba(10,15,29,0.9)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading || !title.trim()} className="btn-primary">
              {loading ? <Sparkles style={{ width: '16px', height: '16px' }} /> : <Plus style={{ width: '16px', height: '16px' }} />}
              <span>Create Track</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
