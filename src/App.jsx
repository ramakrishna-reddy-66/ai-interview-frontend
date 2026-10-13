import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import InterviewStudio from './components/InterviewStudio';
import InterviewReport from './components/InterviewReport';
import QuestionBank from './components/QuestionBank';
import AISandbox from './components/AISandbox';
import LoginPage from './components/LoginPage';
import CreateTrackModal from './components/CreateTrackModal';
import { 
  getInterviews, 
  deleteInterview, 
  startInterviewSession, 
  seedDefaultTracks 
} from './api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [interviews, setInterviews] = useState([]);
  const [loadingInterviews, setLoadingInterviews] = useState(true);

  // Active Session State
  const [activeInterview, setActiveInterview] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);

  // Modal & User Auth State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('interviewai_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Settings
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('interviewai_sound') !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('interviewai_sound', soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    if (user) {
      fetchInterviews();
    }
  }, [user]);

  const fetchInterviews = async () => {
    setLoadingInterviews(true);
    try {
      const data = await getInterviews();
      setInterviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch interviews:', err);
    } finally {
      setLoadingInterviews(false);
    }
  };

  const handleStartInterview = async (interview) => {
    try {
      const firstQ = await startInterviewSession(interview.id);
      setActiveInterview(interview);
      setActiveQuestion(firstQ);
      setCurrentTab('studio');
    } catch (err) {
      console.error('Failed to start interview:', err);
      alert('Failed to start interview session: ' + err.message);
    }
  };

  const handleDeleteInterview = async (id) => {
    if (confirm('Are you sure you want to delete this track?')) {
      try {
        await deleteInterview(id);
        setInterviews((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error('Failed to delete track:', err);
      }
    }
  };

  const handleSeedDefaults = async () => {
    try {
      await seedDefaultTracks();
      await fetchInterviews();
    } catch (err) {
      console.error('Failed to seed defaults:', err);
    }
  };

  const handleViewReport = (interview) => {
    setActiveInterview(interview);
    setCurrentTab('report');
  };

  const handleFinishInterview = (interview) => {
    setActiveInterview(interview);
    setCurrentTab('report');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('interviewai_user', JSON.stringify(userData));
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('interviewai_user');
  };

  const handleTrackCreated = (newTrack) => {
    setInterviews((prev) => [newTrack, ...prev]);
  };

  // If user is not logged in, show the Login Page first!
  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Once logged in, show the Dashboard & Full Application!
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onLogout={handleLogout}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Content Area */}
      <main className="main-content" style={{ flex: 1 }}>
        
        {currentTab === 'dashboard' && (
          <Dashboard
            interviews={interviews}
            loading={loadingInterviews}
            onStartInterview={handleStartInterview}
            onDeleteInterview={handleDeleteInterview}
            onOpenCreateModal={() => setIsCreateOpen(true)}
            onSeedDefaults={handleSeedDefaults}
            onViewReport={handleViewReport}
          />
        )}

        {currentTab === 'studio' && activeInterview && (
          <InterviewStudio
            interview={activeInterview}
            initialQuestion={activeQuestion}
            onFinishInterview={handleFinishInterview}
            onBackToDashboard={() => setCurrentTab('dashboard')}
            soundEnabled={soundEnabled}
          />
        )}

        {currentTab === 'report' && activeInterview && (
          <InterviewReport
            interview={activeInterview}
            onBackToDashboard={() => setCurrentTab('dashboard')}
            onRetakeInterview={handleStartInterview}
          />
        )}

        {currentTab === 'bank' && (
          <QuestionBank />
        )}

        {currentTab === 'sandbox' && (
          <AISandbox />
        )}

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 0', background: 'rgba(7, 10, 19, 0.9)', textAlign: 'center', fontSize: '0.78rem', color: '#64748b' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>© 2026 <strong style={{ color: '#818cf8' }}>InterviewAI</strong>. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1rem', color: '#94a3b8' }}>
            <span>Core Java • Spring Boot</span>
            <span>•</span>
            <span>React • AI Real-Time Simulator</span>
          </div>
        </div>
      </footer>

      <CreateTrackModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onTrackCreated={handleTrackCreated}
      />

    </div>
  );
}
