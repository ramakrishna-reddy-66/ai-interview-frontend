import React from 'react';
import { 
  Bot, 
  LayoutDashboard, 
  BookOpen, 
  Terminal, 
  LogOut, 
  Volume2, 
  VolumeX,
  PlusCircle
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  user, 
  onLogout, 
  onOpenCreateModal,
  soundEnabled,
  setSoundEnabled 
}) {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('dashboard')} 
          className="navbar-brand"
        >
          <div className="brand-icon-box">
            <Bot style={{ width: '22px', height: '22px', color: '#ffffff' }} />
          </div>
          <div>
            <div className="brand-title">
              Interview<span>AI</span>
              <span className="brand-badge">PRO</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="navbar-nav">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`nav-link ${currentTab === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard style={{ width: '16px', height: '16px' }} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('bank')}
            className={`nav-link ${currentTab === 'bank' ? 'active' : ''}`}
          >
            <BookOpen style={{ width: '16px', height: '16px' }} />
            <span>Question Bank</span>
          </button>

          <button
            onClick={() => setCurrentTab('sandbox')}
            className={`nav-link ${currentTab === 'sandbox' ? 'active' : ''}`}
          >
            <Terminal style={{ width: '16px', height: '16px' }} />
            <span>AI Sandbox</span>
          </button>
        </nav>

        {/* User profile & actions */}
        <div className="navbar-user-actions">
          
          {/* TTS Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Speech Voice: ON' : 'Speech Voice: OFF'}
            className="btn-secondary"
            style={{ padding: '0.45rem 0.75rem' }}
          >
            {soundEnabled ? (
              <Volume2 style={{ width: '16px', height: '16px', color: '#10b981' }} />
            ) : (
              <VolumeX style={{ width: '16px', height: '16px', color: '#64748b' }} />
            )}
          </button>

          {/* New Track */}
          <button
            onClick={onOpenCreateModal}
            className="btn-secondary"
            style={{ padding: '0.45rem 0.85rem' }}
          >
            <PlusCircle style={{ width: '16px', height: '16px', color: '#818cf8' }} />
            <span>New Track</span>
          </button>

          {/* User Profile */}
          {user && (
            <div className="user-profile-badge">
              <div className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-info-names">
                <span className="user-name-text">{user.name}</span>
                <span className="user-email-text">{user.email}</span>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '4px', marginLeft: '4px' }}
              >
                <LogOut style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
