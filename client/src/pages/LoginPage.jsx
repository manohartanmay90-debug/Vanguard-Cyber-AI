import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  Shield, Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles,
  ShieldCheck, Cpu, Terminal, CheckCircle2, ArrowRight
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Determine role and redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/chat', { replace: true });
        }
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess('Account created! Check your email for the verification link, then log in.');
        setMode('login');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#06070a] text-slate-100 font-sans select-none">
      {/* ── 1. 3D CYBER GRID & AMBIENT RADAR BACKDROP ──────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cyber matrix grid */}
        <div className="absolute inset-0 cyber-grid opacity-60" />

        {/* Ambient radial glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-600/[0.08] rounded-full blur-[140px]" />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-cyan-600/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-emerald-600/[0.04] rounded-full blur-[120px]" />

        {/* Concentric Radar Wave Rings (Pulsing outwards) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-brand-500/20 animate-ping [animation-duration:6s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-cyan-500/15 animate-pulse [animation-duration:4s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-indigo-500/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[940px] h-[940px] rounded-full border border-white/[0.03]" />

        {/* Crosshair Target Axes */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/15 to-transparent" />

        {/* Slowly rotating radar sweep beam */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full radar-sweep opacity-40 animate-spin [animation-duration:14s]" />
      </div>

      {/* ── 2. FLOATING SECURITY TELEMETRY BADGES ──────────────── */}
      <div className="absolute inset-0 pointer-events-none max-w-6xl mx-auto hidden lg:block">
        {/* Top Left: PII Guard */}
        <div className="absolute top-20 left-8 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#0d0f18]/80 backdrop-blur-xl border border-emerald-500/30 text-xs shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-pulse-soft">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
          <span className="font-mono text-emerald-400 font-semibold tracking-wider text-[11px]">PII_GUARD: 100% SANITIZED</span>
        </div>

        {/* Top Right: Zero-Day Protection */}
        <div className="absolute top-20 right-8 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#0d0f18]/80 backdrop-blur-xl border border-cyan-500/30 text-xs shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-pulse-soft [animation-delay:1.5s]">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-cyan-300 font-semibold tracking-wider text-[11px]">FIREWALL: ACTIVE QUARANTINE</span>
        </div>

        {/* Bottom Left: SOC2 Enclave */}
        <div className="absolute bottom-20 left-8 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#0d0f18]/80 backdrop-blur-xl border border-brand-500/30 text-xs shadow-[0_0_20px_rgba(99,102,241,0.15)] animate-pulse-soft [animation-delay:2.5s]">
          <Lock className="w-4 h-4 text-brand-400" />
          <span className="font-mono text-brand-300 font-semibold tracking-wider text-[11px]">SOC2 TYPE II • AES-256</span>
        </div>

        {/* Bottom Right: Latency & Engine */}
        <div className="absolute bottom-20 right-8 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#0d0f18]/80 backdrop-blur-xl border border-white/[0.08] text-xs shadow-2xl">
          <Cpu className="w-4 h-4 text-violet-400" />
          <span className="font-mono text-slate-300 font-semibold tracking-wider text-[11px]">GATEWAY: 210MS LATENCY</span>
        </div>
      </div>

      {/* ── 3. AUTHENTICATION CARD ─────────────────────────────── */}
      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Brand Header */}
        <div className="text-center mb-7">
          {/* Glowing Aegis Emblem */}
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 via-cyan-500 to-emerald-400 p-[2px] shadow-2xl shadow-brand-900/60 animate-glow">
              <div className="w-full h-full bg-[#0a0c12] rounded-3xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-brand-300 drop-shadow-[0_0_12px_rgba(99,102,241,0.9)]" />
              </div>
            </div>
            {/* Live indicator dot */}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-[3px] border-[#06070a] shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            Vanguard Cyber AI
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-medium tracking-wide">
            Enterprise AI Threat Defense & Security Gateway
          </p>
        </div>

        {/* Deep Charcoal Glassmorphic Card */}
        <div className="relative rounded-3xl bg-[#0c0e17]/90 backdrop-blur-2xl border border-white/[0.09] p-7 sm:p-8 shadow-2xl shadow-black/90 overflow-hidden">
          {/* Top glowing laser line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#07080e] rounded-2xl p-1 mb-6 border border-white/[0.06]">
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                id={`auth-tab-${m}`}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 capitalize ${
                  mode === m
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-900/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/25 rounded-2xl p-3.5 mb-5 animate-fade-in text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-3.5 mb-5 animate-fade-in text-xs text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider" htmlFor="auth-email">
                Company Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="auth-email"
                  type="email"
                  required
                  placeholder="analyst@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#07080e] border border-white/[0.08] focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 text-slate-100 placeholder:text-slate-600 rounded-xl px-4 py-3 pl-10 text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider" htmlFor="auth-password">
                  Password
                </label>
                <span className="text-[11px] text-slate-500 font-medium">Enterprise Auth</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#07080e] border border-white/[0.08] focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 text-slate-100 placeholder:text-slate-600 rounded-xl px-4 py-3 pl-10 pr-11 text-sm outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="auth-submit"
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-semibold text-sm transition-all duration-200 shadow-xl shadow-brand-900/40 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{mode === 'login' ? 'Authenticating with Gateway…' : 'Provisioning Account…'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Vanguard Cyber AI' : 'Create Enterprise Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Security Badge */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Protected by Vanguard Sentinel • SOC2 Type II Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
