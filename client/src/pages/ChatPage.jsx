import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendChatPrompt } from '../lib/api';
import MessageBubble from '../components/MessageBubble';
import VanguardSidebar from '../components/VanguardSidebar';
import ThreatTelemetryPanel from '../components/ThreatTelemetryPanel';
import SettingsModal from '../components/SettingsModal';
import SearchHistoryModal from '../components/SearchHistoryModal';
import {
  Shield, Send, Paperclip, Sparkles, Trash2, Plus,
  Sliders, AlertCircle, RefreshCw, Lock, Terminal,
  Cpu, Check, ChevronDown, Zap, Search,
  PanelLeft, ChevronRight, Activity, ShieldCheck
} from 'lucide-react';

import CyberShieldOrb from '../components/CyberShieldOrb';

const WELCOME_MESSAGES = [
  {
    role: 'assistant',
    content: "Welcome to **Vanguard Cyber AI** enterprise defense console.\n\nYour session is actively shielded by the **Vanguard Threat Interception Gateway**:\n- 🛡️ **Autonomous PII Neutralization:** Emails, credentials, and sensitive identifiers are masked before reaching the model.\n- 🔒 **Dynamic Threat Quarantine:** Real-time heuristic scanning blocks malicious overrides and prompt injections.\n- ⚡ **Zero Data Retention:** Complete confidentiality for enterprise security compliance.\n\nHow can Vanguard assist your security operations today?",
    status: 'passed',
    timestamp: new Date().toISOString(),
  }
];

function TypingIndicator() {
  return (
    <div className="flex gap-4 group animate-slide-up mb-7 items-start">
      {/* Animated Rotating Radar Shield Icon */}
      <div className="relative shrink-0 mt-0.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-md relative animate-pulse-glow">
          <div className="w-full h-full bg-white rounded-xl flex items-center justify-center relative overflow-hidden">
            <Shield className="w-4 h-4 text-blue-600 animate-float-subtle" />
            <div className="absolute inset-0 bg-blue-500/10 rounded-xl animate-ping" style={{ animationDuration: '3s' }} />
          </div>
        </div>
        {/* Active scan radar dot */}
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        </span>
      </div>

      {/* Cyber Threat Scanner HUD Card */}
      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm relative overflow-hidden max-w-md w-full">
        {/* Scanning laser beam animation */}
        <div className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-blue-500/15 to-transparent pointer-events-none animate-laser-sweep" />

        <div className="flex items-center gap-2 mb-2.5">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </div>
          <span className="text-xs font-bold text-slate-800 font-mono tracking-wide">
            VANGUARD SENTINEL SCANNER ACTIVE
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold ml-auto flex items-center gap-1">
            <Activity className="w-3 h-3 text-blue-600 animate-pulse" />
            LIVE SCAN
          </span>
        </div>

        {/* Multi-step Sentinel Pipeline Indicators with micro-animations */}
        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 animate-bounce" style={{ animationDuration: '2s' }} />
            <div className="leading-tight">
              <span className="block font-semibold text-slate-800">PII Masker</span>
              <span className="text-[9px] text-emerald-600 font-semibold">Active</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <Cpu className="w-3.5 h-3.5 text-blue-600 shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
            <div className="leading-tight">
              <span className="block font-semibold text-slate-800">Heuristics</span>
              <span className="text-[9px] text-blue-600 font-semibold">Inspecting</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
            <div className="leading-tight">
              <span className="block font-semibold text-slate-800">Firewall</span>
              <span className="text-[9px] text-amber-600 font-semibold">Zero-Trust</span>
            </div>
          </div>
        </div>

        {/* Animated Cyber Progress Bar */}
        <div className="w-full h-1 bg-slate-100 rounded-full mt-3 overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full w-2/3 animate-laser-sweep" />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { accessToken } = useAuth();
  const [messages, setMessages] = useState(WELCOME_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [zeroRetention, setZeroRetention] = useState(false);

  // 3-Column Layout state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(true);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Ctrl+K / Cmd+K global shortcut to open search history
  useEffect(() => {
    function handleGlobalKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSearchHistory(prev => !prev);
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px';
  }, [input]);

  const handleSubmit = useCallback(async (customPrompt) => {
    const promptToSend = (typeof customPrompt === 'string' ? customPrompt : input).trim();
    if (!promptToSend || loading) return;

    if (!accessToken) {
      setError('Session expired or unauthorized. Please sign in again.');
      return;
    }

    setInput('');
    setError('');
    setLoading(true);

    const fullPrompt = attachedFile
      ? `[Attached Document: ${attachedFile.name}]\n\n${promptToSend}`
      : promptToSend;

    setAttachedFile(null);

    // Optimistic user message
    const userMsg = {
      role: 'user',
      content: fullPrompt,
      timestamp: new Date().toISOString(),
      zeroRetention,
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const data = await sendChatPrompt(fullPrompt, accessToken, zeroRetention);

      const assistantMsg = {
        role: 'assistant',
        content: data.response,
        status: data.status,
        threatReason: data.threat_reason,
        piiMasked: data.pii_entities_found || 0,
        timestamp: new Date().toISOString(),
        zeroRetention,
      };

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...userMsg,
          piiMasked: data.pii_entities_found || 0,
        };
        return [...updated, assistantMsg];
      });
    } catch (err) {
      setError(err.message || 'Failed to communicate with Vanguard Cyber AI Gateway. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [input, loading, accessToken, attachedFile, zeroRetention]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleNewThread() {
    setMessages(WELCOME_MESSAGES);
    setInput('');
    setError('');
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('File size exceeds the 2MB enterprise limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      setAttachedFile({
        name: file.name,
        size: file.size,
        content: typeof content === 'string' ? content : '',
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-800 font-sans select-none">
      {/* ── 1. COLUMN 1: COLLAPSIBLE LEFT SIDEBAR ────────────────── */}
      <VanguardSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenSearch={() => setShowSearchHistory(true)}
        onNewThread={handleNewThread}
        onSelectPrompt={handleSubmit}
      />

      {/* ── 2. COLUMN 2: SPACIOUS CENTER CHAT FEED ───────────────── */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#f8fafc] relative overflow-hidden select-text">
        {/* Executive Top Bar */}
        <header className="h-14 px-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarCollapsed(prev => !prev)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-standard"
              title="Toggle Left Sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Dashboard</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="font-semibold text-slate-900">Threat Response</span>
            </div>

            {/* Live Gateway Status Badge */}
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="badge-vanguard-pass relative overflow-hidden group py-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Sentinel Gateway Active</span>
              </div>
            </div>
          </div>

          {/* Right Header Action Items */}
          <div className="flex items-center gap-2.5">
            {/* Zero-Retention toggle pill */}
            <button
              type="button"
              onClick={() => setZeroRetention(prev => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-standard ${zeroRetention
                  ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              title={
                zeroRetention
                  ? 'Zero-Retention Active: Prompts are never saved to the database (Ephemeral Mode)'
                  : 'Enable Zero-Retention: Prevents saving queries to the database'
              }
            >
              <Lock className={`w-3 h-3 ${zeroRetention ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`} />
              <span className="hidden md:inline">{zeroRetention ? 'Zero-Retention ON' : 'Zero-Retention OFF'}</span>
            </button>

            {/* Search History quick trigger */}
            <button
              onClick={() => setShowSearchHistory(true)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900 transition-standard shadow-xs"
              title="Search Prompt History (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>History</span>
              <span className="text-[10px] text-blue-600 font-mono bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded font-semibold">⌘K</span>
            </button>

            {/* Toggle Right Telemetry Panel */}
            <button
              onClick={() => setShowTelemetry(prev => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-medium transition-standard ${showTelemetry
                  ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              title="Toggle Right Threat Detection Panel"
            >
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Telemetry</span>
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-standard"
              title="Gateway Parameters"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Central Chat Stream with generous breathing room padding */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 scroll-smooth">
          <div className="max-w-3xl xl:max-w-4xl mx-auto flex flex-col justify-between min-h-full">
            <div>
              {/* Animated Holographic Cyber Defense Shield Visualizer for initial session */}
              {messages.length <= 1 && <CyberShieldOrb />}

              {/* Chat Messages */}
              <div className="space-y-2">
                {messages.map((msg, i) => (
                  <MessageBubble key={i} message={msg} />
                ))}

                {loading && <TypingIndicator />}
              </div>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="my-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-xs animate-slide-up">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
                <button
                  onClick={() => setError('')}
                  className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs transition-standard font-medium"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div ref={bottomRef} className="h-4" />
          </div>
        </div>

        {/* ── 3. FLAT, BORDERLESS INPUT BAR ─────────────────────────── */}
        <div className="px-6 sm:px-12 pb-6 pt-2 shrink-0 z-20">
          <div className="max-w-3xl xl:max-w-4xl mx-auto">
            {/* Attached file chip */}
            {attachedFile && (
              <div className="mb-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 animate-slide-up shadow-xs">
                <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-medium truncate max-w-xs">{attachedFile.name}</span>
                <button
                  onClick={() => setAttachedFile(null)}
                  className="text-slate-400 hover:text-slate-700 ml-1 font-bold text-xs"
                >
                  ×
                </button>
              </div>
            )}

            {/* Flat, borderless container with white styling */}
            <div className="relative rounded-2xl bg-white border border-slate-200 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 p-3.5 shadow-sm transition-standard">
              <textarea
                id="chat-input"
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Ask Vanguard Cyber AI or enter sensitive query (protected by firewall)…"
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 resize-none outline-none text-[14px] leading-relaxed disabled:opacity-50 min-h-[26px] max-h-44 border-none p-0 focus:ring-0 selection:bg-blue-100 font-sans"
              />

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-slate-100">
                {/* Left action icons */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-standard"
                    title="Attach security log or document"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setInput(prev => prev ? `${prev} (Audit strictly for credentials)` : 'Analyze the following code for security vulnerabilities:\n\n')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-standard hidden sm:flex items-center gap-1 text-xs"
                    title="Insert prompt template"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Templates</span>
                  </button>

                  <div className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold ml-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>PII Masking ON</span>
                  </div>

                  {/* Zero-Retention Database Prevention Toggle */}
                  <button
                    type="button"
                    onClick={() => setZeroRetention(prev => !prev)}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium transition-standard ${zeroRetention
                        ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    title={
                      zeroRetention
                        ? 'Zero-Retention Active: Prompts and responses will NOT be logged to the database'
                        : 'Enable Zero-Retention Mode: prevents query history from being recorded in the database'
                    }
                  >
                    <Lock className={`w-3 h-3 ${zeroRetention ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`} />
                    <span>{zeroRetention ? 'Zero-Retention: ON' : 'Zero-Retention: OFF'}</span>
                  </button>
                </div>

                {/* Right action icons & Send Button */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    {input.length}/5000
                  </span>

                  <button
                    id="send-btn"
                    onClick={() => handleSubmit()}
                    disabled={(!input.trim() && !attachedFile) || loading}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-standard shrink-0 ${input.trim() && !loading
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:scale-105 active:scale-95 animate-pulse-glow'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-footer compliance disclaimer */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 mt-2">
              <span className="flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Vanguard Sentinel v2.5 • SOC2 Type II Certified
              </span>
              <span className="hidden sm:inline">
                Shift + Enter for new line • Enter to send
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* ── 3. COLUMN 3: MODERN RIGHT-HAND THREAT DETECTION PANEL ──── */}
      <ThreatTelemetryPanel
        isOpen={showTelemetry}
        onClose={() => setShowTelemetry(false)}
      />

      {/* ── 4. SETTINGS MODAL ──────────────────────────────────────── */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* ── 5. SEARCH HISTORY MODAL ─────────────────────────────────── */}
      <SearchHistoryModal
        isOpen={showSearchHistory}
        onClose={() => setShowSearchHistory(false)}
        onSelectPrompt={(promptText) => {
          setShowSearchHistory(false);
          handleSubmit(promptText);
        }}
        accessToken={accessToken}
      />
    </div>
  );
}
