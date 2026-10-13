import React, { useState } from 'react';
import { Bot, Sparkles, User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { loginUser, registerUser } from '../api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await registerUser(name, email, password);
        onAuthSuccess({
          id: res.id,
          name: res.name || name,
          email: res.email || email,
        });
      } else {
        const res = await loginUser(email, password);
        onAuthSuccess({
          id: res.id,
          name: res.name || email.split('@')[0],
          email: res.email || email,
          token: res.token,
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setName('Alex Johnson');
    setEmail('candidate@interviewai.dev');
    setPassword('Pass@12345');
  };

  return (
    <div className="modal-backdrop">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-white/20 space-y-6 relative animate-fadeIn shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-1"
        >
          ✕
        </button>

        {/* Brand Icon */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 p-[2px] mx-auto shadow-lg shadow-indigo-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister ? 'Join InterviewAI to track your interview practice' : 'Sign in to access your interview records'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  required
                  className="input-field pl-9 py-2 text-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="input-field pl-9 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input-field pl-9 py-2 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 text-sm font-semibold"
          >
            {loading ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            <span>{isRegister ? 'Sign Up' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Fill Button */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            ⚡ Auto-Fill Demo User
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-slate-400 hover:text-white"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

      </div>
    </div>
  );
}
