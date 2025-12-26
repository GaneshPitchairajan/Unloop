
import React, { useState } from 'react';
import { User } from '../types';
import { LogIn, Sparkles, UserPlus, Fingerprint, Lock, Mail } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
  allUsers: User[];
}

const LoginPage: React.FC<Props> = ({ onLogin, allUsers }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const existing = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (isRegistering) {
      if (existing) {
        alert("This email is already registered. Please login.");
        setIsRegistering(false);
        return;
      }
      const newUser: User = {
        id: 'u-' + Date.now(),
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        isMentor: false
      };
      onLogin(newUser);
    } else {
      if (existing) {
        onLogin(existing);
      } else {
        alert("Account not found. Please register.");
        setIsRegistering(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 overflow-hidden">
      {/* Branding Section */}
      <div className="md:w-1/2 bg-slate-900 flex flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 text-center space-y-8 max-w-sm">
          <div className="w-24 h-24 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-indigo-600/20 animate-pulse">
            <Fingerprint className="text-white" size={48} />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tighter text-white">Unloop Your Potential.</h1>
            <p className="text-slate-400 text-lg leading-relaxed font-light">
              "Clarity is not the absence of chaos, but the mastery of it."
            </p>
          </div>
          <div className="pt-8 border-t border-slate-800 grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-widest text-indigo-400">
            <div className="flex flex-col gap-2">
              <Sparkles size={16} className="mx-auto" />
              <span>Calm Logic</span>
            </div>
            <div className="flex flex-col gap-2">
              <Lock size={16} className="mx-auto" />
              <span>Private Space</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white">
              {isRegistering ? 'Create your space' : 'Welcome back'}
            </h2>
            <p className="text-slate-500 font-medium">
              {isRegistering ? 'Start your journey to structured clarity.' : 'Your sanctuary is waiting.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {isRegistering && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700"
                      required
                    />
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700"
                    required
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 shadow-xl shadow-indigo-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <span>{isRegistering ? 'Initialize Space' : 'Enter Sanctuary'}</span>
              <Sparkles size={18} />
            </button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-slate-500 hover:text-indigo-400 text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              {isRegistering ? <LogIn size={14}/> : <UserPlus size={14}/>}
              {isRegistering ? 'Already have an account? Login' : 'First time here? Create an account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
