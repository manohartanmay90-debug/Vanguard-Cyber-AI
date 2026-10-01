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

        // Determine role and redirect (use maybeSingle so missing profile does not crash login)
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

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

  async function handleDemoLogin() {
    setEmail('demo@vanguardcyber.ai');
    setPassword('VanguardDemo2026!');
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'demo@vanguardcyber.ai',
        password: 'VanguardDemo2026!',
      });
      if (error) throw error;
      navigate('/chat', { replace: true });
    } catch (err) {
      setError(err.message || 'Demo login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#f8fafc] text-slate-900 font-sans select-none">
      {/* ── 1. AMBIENT RADAR & LIGHT GRID BACKDROP ──────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />

        {/* Ambient radial glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-500/[0.06] rounded-full blur-[140px]" />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-sky-500/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[120px]" />

        {/* Concentric Radar Wave Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-brand-500/15 animate-ping [animation-duration:6s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-sky-500/15 animate-pulse [animation-duration:4s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-slate-300/40" />

        {/* Target Axes */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-300/40 to-transparent" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-slate-300/40 to-transparent" />
      </div>

      {/* ── 2. FLOATING SECURITY TELEMETRY BADGES ──────────────── */}
      <div className="absolute inset-0 pointer-events-none max-w-6xl mx-auto hidden lg:block">
        {/* Top Left: PII Guard */}
        <div className="absolute top-20 left-8 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-xl border border-emerald-300 text-xs shadow-md animate-pulse-soft">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-emerald-700 font-semibold tracking-wider text-[11px]">PII_GUARD: 100% SANITIZED</span>
        </div>

        {/* Top Right: Zero-Day Protection */}
        <div className="absolute top-20 right-8 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-xl border border-sky-300 text-xs shadow-md animate-pulse-soft [animation-delay:1.5s]">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          <span className="font-mono text-sky-700 font-semibold tracking-wider text-[11px]">FIREWALL: ACTIVE QUARANTINE</span>
        </div>

        {/* Bottom Left: SOC2 Enclave */}
        <div className="absolute bottom-20 left-8 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-xl border border-brand-300 text-xs shadow-md animate-pulse-soft [animation-delay:2.5s]">
          <Lock className="w-4 h-4 text-brand-600" />
          <span className="font-mono text-brand-700 font-semibold tracking-wider text-[11px]">SOC2 TYPE II • AES-256</span>
        </div>

        {/* Bottom Right: Latency & Engine */}
        <div className="absolute bottom-20 right-8 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200 text-xs shadow-md">
          <Cpu className="w-4 h-4 text-violet-600" />
          <span className="font-mono text-slate-700 font-semibold tracking-wider text-[11px]">GATEWAY: 210MS LATENCY</span>
        </div>
      </div>

      {/* ── 3. AUTHENTICATION CARD ─────────────────────────────── */}
      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Brand Header */}
        <div className="text-center mb-7">
          {/* Glowing Vanguard Emblem */}
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 via-sky-500 to-emerald-500 p-[2px] shadow-lg shadow-brand-500/20">
              <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center shadow-inner">
                <Shield className="w-8 h-8 text-brand-600" />
              </div>
            </div>
            {/* Live indicator dot */}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-[3px] border-white shadow-sm" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-2">
            Vanguard Cyber AI
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5 font-medium tracking-wide">
            Enterprise AI Threat Defense & Security Gateway
          </p>
        </div>

        {/* Executive White Glassmorphic Card */}
        <div className="relative rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200 p-7 sm:p-8 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Top subtle highlight line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-100 rounded-2xl p-1 mb-6 border border-slate-200/60">
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                id={`auth-tab-${m}`}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 capitalize ${
                  mode === m
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-3.5 mb-5 animate-fade-in text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 mb-5 animate-fade-in text-xs text-emerald-700">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider" htmlFor="auth-email">
                Company Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="auth-email"
                  type="email"
                  required
                  placeholder="analyst@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3 pl-10 text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="auth-password">
                  Password
                </label>
                <span className="text-[11px] text-slate-400 font-medium">Enterprise Auth</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3 pl-10 pr-11 text-sm outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
              className="w-full mt-3 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-brand-500/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

            {/* Instant Demo Access Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200/80" /></div>
              <span className="relative bg-white px-2.5 text-[11px] font-medium text-slate-400 uppercase tracking-wider">or rapid evaluation</span>
            </div>

            {/* Instant 1-Click Demo Login Button */}
            <button
              id="demo-login-btn"
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Instant 1-Click Demo Login (Analyst Mode)</span>
            </button>
          </form>

          {/* Footer Security Badge */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Protected by Vanguard Sentinel • SOC2 Type II Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
