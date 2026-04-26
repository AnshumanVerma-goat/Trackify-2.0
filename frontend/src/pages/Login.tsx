import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#030712] relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 space-y-8 glass-panel rounded-3xl z-10"
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-3xl text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] mb-6">T</div>
          <h2 className="text-4xl font-bold tracking-tight text-white">Trackify</h2>
          <p className="mt-2 text-sm text-slate-400">Welcome back! Master your productivity.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">Email address</label>
              <input
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 mt-1 bg-[#0b0f19]/80 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <input
                type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 mt-1 bg-[#0b0f19]/80 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-500"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transform transition-all hover:-translate-y-0.5"
          >
            Sign in
          </button>
        </form>
        <p className="text-center text-sm text-slate-400">
          Don't have an account? <Link to="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
