import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  Code2, 
  Database, 
  Cpu, 
  Layers, 
  MessageSquare, 
  Trash2, 
  Search, 
  Plus, 
  BarChart3, 
  Flame, 
  RefreshCw 
} from 'lucide-react';

export default function Dashboard({ 
  interviews, 
  loading, 
  onStartInterview, 
  onDeleteInterview, 
  onOpenCreateModal,
  onSeedDefaults,
  onViewReport 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const getCategoryIcon = (title = '') => {
    const t = title.toLowerCase();
    if (t.includes('java')) return <Code2 style={{ width: '22px', height: '22px', color: '#f59e0b' }} />;
    if (t.includes('python')) return <Cpu style={{ width: '22px', height: '22px', color: '#06b6d4' }} />;
    if (t.includes('react') || t.includes('frontend')) return <Layers style={{ width: '22px', height: '22px', color: '#6366f1' }} />;
    if (t.includes('database') || t.includes('sql') || t.includes('dbms')) return <Database style={{ width: '22px', height: '22px', color: '#10b981' }} />;
    if (t.includes('system') || t.includes('design')) return <Flame style={{ width: '22px', height: '22px', color: '#ec4899' }} />;
    return <MessageSquare style={{ width: '22px', height: '22px', color: '#a855f7' }} />;
  };

  const getTrackBadge = (title = '') => {
    const t = title.toLowerCase();
    if (t.includes('java')) return { text: 'Backend • Spring', color: 'badge-amber' };
    if (t.includes('python')) return { text: 'Backend • Python', color: 'badge-cyan' };
    if (t.includes('react')) return { text: 'Frontend • React', color: 'badge-indigo' };
    if (t.includes('sql') || t.includes('database')) return { text: 'Data • SQL', color: 'badge-emerald' };
    if (t.includes('system')) return { text: 'Architecture', color: 'badge-rose' };
    return { text: 'General Tech', color: 'badge-indigo' };
  };

  const filteredInterviews = interviews.filter((item) => {
    const matchSearch = (item.title + ' ' + (item.description || '')).toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedFilter === 'all') return matchSearch;
    return matchSearch && item.title.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-tag">
          <Sparkles style={{ width: '14px', height: '14px' }} />
          <span>AI-POWERED TECHNICAL INTERVIEW SIMULATOR</span>
        </div>

        <h1 className="hero-heading">
          Ace Your Next Tech Interview with <span>Real-Time AI</span>
        </h1>

        <p className="hero-subtext">
          Simulate realistic technical and behavioral interviews with real-time speech interaction, instant scoring out of 10, deep conceptual feedback, and model solutions.
        </p>

        {/* Metrics Grid */}
        <div className="hero-metrics-grid">
          <div className="metric-card-item">
            <span className="metric-number">{interviews.length}</span>
            <span className="metric-label">Available Tracks</span>
          </div>
          <div className="metric-card-item">
            <span className="metric-number emerald">Instant</span>
            <span className="metric-label">AI Scoring & Feedback</span>
          </div>
          <div className="metric-card-item">
            <span className="metric-number cyan">Voice & Code</span>
            <span className="metric-label">TTS / STT Support</span>
          </div>
          <div className="metric-card-item">
            <span className="metric-number pink">100% Free</span>
            <span className="metric-label">Unlimited Practice</span>
          </div>
        </div>

        {/* Hero Actions */}
        <div className="hero-action-buttons">
          <button
            onClick={() => {
              if (interviews.length > 0) {
                onStartInterview(interviews[0]);
              } else {
                onSeedDefaults();
              }
            }}
            className="btn-primary"
          >
            <Play style={{ width: '16px', height: '16px', fill: '#ffffff' }} />
            <span>Quick Start Mock Session</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            className="btn-secondary"
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            <span>Create Custom Track</span>
          </button>

          {interviews.length === 0 && (
            <button
              onClick={onSeedDefaults}
              className="btn-secondary"
              style={{ color: '#a5b4fc' }}
            >
              <RefreshCw style={{ width: '16px', height: '16px' }} />
              <span>Initialize Standard Tracks</span>
            </button>
          )}
        </div>
      </section>

      {/* Choose Track Section */}
      <section>
        <div className="tracks-header-row">
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff' }}>
              Choose an Interview Track
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
              Select a specialized track or create your own custom domain.
            </p>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search style={{ width: '16px', height: '16px', color: '#64748b', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tracks..."
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '0.65rem 1rem 0.65rem 2.5rem',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'all', label: 'All Tracks' },
            { id: 'java', label: 'Java & Spring' },
            { id: 'python', label: 'Python Backend' },
            { id: 'react', label: 'React & Frontend' },
            { id: 'sql', label: 'SQL & Database' },
            { id: 'system', label: 'System Design' },
            { id: 'behavioral', label: 'Behavioral / HR' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                border: '1px solid',
                cursor: 'pointer',
                background: selectedFilter === cat.id ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedFilter === cat.id ? '#ffffff' : '#94a3b8',
                borderColor: selectedFilter === cat.id ? 'var(--accent-primary)' : 'var(--border-color)',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tracks Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
            <RefreshCw style={{ width: '28px', height: '28px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            <p>Loading tracks...</p>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            <Sparkles style={{ width: '36px', height: '36px', color: '#818cf8', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>No tracks found</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>Try clearing your search filter or initialize the default interview tracks.</p>
            <button onClick={onSeedDefaults} className="btn-primary">
              <RefreshCw style={{ width: '16px', height: '16px' }} />
              <span>Initialize Standard Tracks</span>
            </button>
          </div>
        ) : (
          <div className="tracks-grid">
            {filteredInterviews.map((interview) => {
              const badge = getTrackBadge(interview.title);
              return (
                <div key={interview.id} className="track-card">
                  <div>
                    <div className="track-card-top">
                      <div className="track-icon-container">
                        {getCategoryIcon(interview.title)}
                      </div>
                      <span className={`badge ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>

                    <h3 className="track-title">{interview.title}</h3>
                    <p className="track-desc">
                      {interview.description || 'Comprehensive technical interview track with adaptive AI questions and scoring.'}
                    </p>
                  </div>

                  <div className="track-card-footer">
                    <button
                      onClick={() => onStartInterview(interview)}
                      className="btn-primary"
                      style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.82rem' }}
                    >
                      <Play style={{ width: '14px', height: '14px', fill: '#ffffff' }} />
                      <span>Start Interview</span>
                    </button>

                    <button
                      onClick={() => onViewReport(interview)}
                      title="View Report"
                      className="btn-secondary"
                      style={{ padding: '0.65rem 0.75rem' }}
                    >
                      <BarChart3 style={{ width: '16px', height: '16px' }} />
                    </button>

                    <button
                      onClick={() => onDeleteInterview(interview.id)}
                      title="Delete Track"
                      className="btn-secondary"
                      style={{ padding: '0.65rem 0.75rem', color: '#f43f5e' }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
