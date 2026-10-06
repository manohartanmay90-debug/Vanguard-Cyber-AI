import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Shield, ShieldCheck, ShieldAlert, Zap, Lock, Cpu,
  Terminal, ArrowRight, CheckCircle2, Sparkles, Activity,
  Database, Eye, EyeOff, Mail, AlertCircle, X, ChevronRight,
  Server, HardDrive, DollarSign, BarChart3, Sliders, Code2, Copy, Check
} from 'lucide-react';
import CyberLaserGridBackground from '../components/CyberLaserGridBackground';

export default function EnterprisePage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedSdk, setCopiedSdk] = useState(false);

  // ROI Calculator State
  const [employeeCount, setEmployeeCount] = useState(250);
  const [queriesPerDay, setQueriesPerDay] = useState(40);

  // Calculations
  const annualQueries = employeeCount * queriesPerDay * 250;
  const estimatedPiiExposures = Math.round(annualQueries * 0.04);
  const estimatedSavings = (estimatedPiiExposures * 165).toLocaleString(); // Average cost of compromised record ~$165

  const openAuth = (mode = 'login') => {
    if (session) {
      navigate('/chat');
      return;
    }
    setAuthMode(mode);
    setError('');
    setSuccess('');
    setShowAuthModal(true);
  };

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/chat', { replace: true });
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess('Account created! Please verify your email and sign in.');
        setAuthMode('login');
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
      const { error } = await supabase.auth.signInWithPassword({
        email: 'demo@vanguardcyber.ai',
        password: 'VanguardDemo2026!',
      });
      if (error) throw error;
      navigate('/chat', { replace: true });
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedSdk(true);
    setTimeout(() => setCopiedSdk(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#070a13] text-slate-100 font-sans selection:bg-cyan-500/30 flex flex-col relative overflow-x-hidden">
      {/* ── 3D CYBER LASER GRID BACKGROUND ─────────────────────────── */}
      <CyberLaserGridBackground />

      {/* ── 1. DARK STEALTH NAVBAR ──────────────────────────────────── */}
      <header className="w-full h-16 border-b border-cyan-500/20 bg-[#090d1a]/80 backdrop-blur-xl sticky top-0 z-40 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-emerald-500 p-[1.5px] shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#090d1a] rounded-xl flex items-center justify-center">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-base text-white tracking-tight block leading-tight">
                Vanguard<span className="text-cyan-400">-Cyber-AI</span>
              </span>
              <span className="text-[10px] text-cyan-500/80 font-mono">
                Enterprise Solutions
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-white/10 text-xs font-medium">
            <Link to="/" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              Overview
            </Link>
            <Link to="/security" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              Threat Intel & Firewall
            </Link>
            <Link to="/enterprise" className="px-3 py-1.5 rounded-lg text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 font-semibold shadow-xs">
              Enterprise Solutions
            </Link>
          </nav>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => openAuth('login')}
            className="hidden sm:inline-block px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => openAuth('signup')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all group"
          >
            <span>Deploy Enterprise</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* ── 2. HERO: ENTERPRISE ZERO-TRUST ARCHITECTURE ─────────────── */}
      <main className="flex-1 max-w-6xl mx-auto px-6 sm:px-12 py-12 sm:py-16 relative z-10 flex flex-col items-center text-center">
        {/* Top Glowing Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-6 shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-fade-in">
          <Server className="w-3.5 h-3.5 text-emerald-400" />
          <span>SOC2 Type II • ISO 27001 • HIPAA & GDPR Enforced</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl leading-[1.12]">
          Zero-Trust <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">Enterprise AI Gateway</span> & Multi-Model Enclaves
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Unify your workforce AI adoption under a single sovereign security gateway. Autonomous PII scrubbing, 99.99% multi-model uptime, and full compliance auditing.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full sm:w-auto">
          <button
            onClick={() => openAuth('signup')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all"
          >
            <span>Start Enterprise Sandbox</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleDemoLogin}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-emerald-500/30 text-emerald-300 font-semibold text-sm shadow-xs transition-all"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>1-Click Live Test</span>
          </button>
        </div>

        {/* ── 3. ARCHITECTURE PILLARS ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 w-full text-left">
          {/* Pillar 1 */}
          <div className="p-6 rounded-3xl bg-[#0c1222] border border-emerald-500/30 hover:border-emerald-400/60 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">Multi-Model Dual Failover</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Google Gemini 3.1 & Groq LLaMA 3.3 failover cluster guarantees continuous sub-second response times and 99.99% enterprise SLA uptime.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-3xl bg-[#0c1222] border border-cyan-500/30 hover:border-cyan-400/60 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <HardDrive className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">Ephemeral Hardware Enclaves</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Zero-Retention session buffers wipe forensic data and raw prompts from RAM upon response delivery, ensuring zero persistence.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-3xl bg-[#0c1222] border border-indigo-500/30 hover:border-indigo-400/60 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">Immutable Audit Telemetry</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              SOC2 compliance logs record quarantined attack vectors and masked token counts into tamper-proof Supabase databases.
            </p>
          </div>
        </div>

        {/* ── 4. INTERACTIVE ENTERPRISE ROI & RISK CALCULATOR ───────── */}
        <div className="mt-20 w-full max-w-4xl p-8 rounded-3xl bg-[#0c1222]/95 border border-emerald-500/30 shadow-2xl backdrop-blur-xl text-left relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-lg text-white">Enterprise ROI & Data Leak Prevention Calculator</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-bold">
              ESTIMATOR
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
                  <span>Active AI Users / Employees:</span>
                  <span className="font-mono text-cyan-400 font-bold text-sm">{employeeCount} Employees</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="5000"
                  step="25"
                  value={employeeCount}
                  onChange={e => setEmployeeCount(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-white/10 rounded-lg h-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
                  <span>Average AI Queries per User / Day:</span>
                  <span className="font-mono text-cyan-400 font-bold text-sm">{queriesPerDay} Queries/day</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={queriesPerDay}
                  onChange={e => setQueriesPerDay(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-white/10 rounded-lg h-2"
                />
              </div>
            </div>

            {/* Results Display */}
            <div className="p-6 rounded-2xl bg-[#060913] border border-emerald-500/40 text-center space-y-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-mono block">
                Estimated Annual Breach Exposure Prevented
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">
                ${estimatedSavings}
              </div>
              <p className="text-xs text-slate-400">
                Based on <span className="text-white font-semibold">{estimatedPiiExposures.toLocaleString()}</span> sensitive PII entities automatically masked per year at $165 avg breach cost.
              </p>
            </div>
          </div>
        </div>

        {/* ── 5. DEVELOPER REST API & SDK CODE BLOCK ────────────────── */}
        <div className="mt-20 w-full max-w-4xl text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-white">Developer Gateway & REST API</h3>
              <p className="text-xs text-slate-400">Integrate Vanguard threat protection into your existing Python or Node.js pipelines.</p>
            </div>
            <button
              onClick={() => copyCode(`curl -X POST https://vanguardcyber.ai/api/chat \\\n  -H "Authorization: Bearer YOUR_API_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{"prompt": "Audit user input", "zeroRetention": true}'`)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 flex items-center gap-1.5 transition-all"
            >
              {copiedSdk ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSdk ? 'Copied' : 'Copy cURL'}</span>
            </button>
          </div>

          <div className="rounded-2xl bg-[#060913] border border-cyan-500/30 overflow-hidden font-mono text-xs">
            <div className="px-4 py-2 bg-[#0c1222] border-b border-white/10 flex items-center justify-between text-slate-400 text-[11px]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>POST /api/chat</span>
              </div>
              <span className="text-emerald-400">HTTP/2 200 OK</span>
            </div>
            <pre className="p-4 text-emerald-300 overflow-x-auto leading-relaxed">
{`curl -X POST https://vanguardcyber.ai/api/chat \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Analyze sensitive query with credentials",
    "zeroRetention": true
  }'`}
            </pre>
          </div>
        </div>

        {/* ── 6. BOTTOM CTA ─────────────────────────────────────────── */}
        <div className="mt-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#0a1020] to-cyan-950/60 border border-emerald-500/30 text-center w-full max-w-4xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Secure your workforce with Vanguard Enterprise
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Get instant deployment with SOC2 compliance and zero data retention today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <button
              onClick={() => openAuth('signup')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              Start Free Console
            </button>
            <Link
              to="/security"
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/30 font-semibold text-xs transition-all"
            >
              Inspect Threat Matrix →
            </Link>
          </div>
        </div>
      </main>

      {/* ── 7. FOOTER ─────────────────────────────────────────────── */}
      <footer className="w-full border-t border-white/10 py-6 px-6 text-center text-xs text-slate-500 bg-[#060913]">
        <p>Vanguard-Cyber-AI • Enterprise Architecture • SOC2 Type II Certified</p>
      </footer>

      {/* ── 8. AUTH MODAL (SIGN IN / SIGN UP) ──────────────────────── */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            className="w-full max-w-md bg-[#0c1222] border border-emerald-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 animate-slide-up relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-xs">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white tracking-tight">
                  {authMode === 'login' ? 'Sign In to Vanguard' : 'Create Vanguard Account'}
                </h3>
                <p className="text-xs text-slate-400">Access your security defense console</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(''); setSuccess(''); }}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  authMode === 'login' ? 'bg-emerald-500 text-slate-950 shadow-xs font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setError(''); setSuccess(''); }}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  authMode === 'signup' ? 'bg-emerald-500 text-slate-950 shadow-xs font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="analyst@enterprise.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#060913] border border-white/10 focus:border-emerald-400 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#060913] border border-white/10 focus:border-emerald-400 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{authMode === 'login' ? 'Sign In to Console' : 'Deploy Enterprise'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-300 text-xs font-semibold border border-emerald-500/20 transition-colors flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click Instant Demo Login</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
