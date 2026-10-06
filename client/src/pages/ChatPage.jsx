import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { sendChatPrompt } from '../lib/api';
import MessageBubble from '../components/MessageBubble';
import VanguardSidebar from '../components/VanguardSidebar';
import ThreatTelemetryPanel from '../components/ThreatTelemetryPanel';
import SettingsModal from '../components/SettingsModal';
import SearchHistoryModal from '../components/SearchHistoryModal';
import CyberShieldOrb from '../components/CyberShieldOrb';
import {
  Shield, Send, Paperclip, Sparkles, Trash2, Plus,
  Sliders, AlertCircle, RefreshCw, Lock, Terminal,
  Cpu, Check, ChevronDown, Zap, Search,
  PanelLeft, ChevronRight, Activity, ShieldCheck,
  Globe, Mic, MicOff, Share2, Square, ArrowUp,
  FileCode, BrainCircuit, ExternalLink, Download
} from 'lucide-react';

const MODELS = [
  { id: 'vanguard-4o', name: 'Vanguard 4o', tag: 'Sentinel Shield', desc: 'Fastest & smartest model for cyber threat analysis & code audits.' },
  { id: 'vanguard-deep', name: 'Vanguard DeepReason', tag: 'o1 Heuristics', desc: 'Multi-step threat decompilation and vulnerability root-cause analysis.' },
  { id: 'vanguard-stealth', name: 'Vanguard Zero-Trust', tag: 'Ephemeral', desc: 'Zero data retention stealth sandbox with hardware memory wipe.' }
];

function TypingIndicator() {
  return (
    <div className="flex gap-3.5 group animate-slide-up mb-7 items-start">
      {/* Assistant Avatar */}
      <div className="relative shrink-0 mt-0.5">
        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs border border-slate-700">
          <Shield className="w-4 h-4 text-white animate-pulse" />
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white animate-ping" />
      </div>

      {/* ChatGPT Style Thinking Stream */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs max-w-md w-full relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex space-x-1 items-center">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
          </div>
          <span className="text-xs font-semibold text-slate-700 font-mono">
            Vanguard Sentinel Inspecting
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold ml-auto">
            Live Scan
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>PII Redactor</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <Cpu className="w-3.5 h-3.5 text-blue-600 shrink-0 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Classifier</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Zero-Trust</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { accessToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [zeroRetention, setZeroRetention] = useState(false);

  // ChatGPT Features
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [isWebSearchActive, setIsWebSearchActive] = useState(false);
  const [isDeepReasonActive, setIsDeepReasonActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // 3-Column Layout state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(false);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      speechRecognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceDictation = () => {
    if (!speechRecognitionRef.current) {
      alert('Speech-to-text is not supported in this browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechRecognitionRef.current.start();
    }
  };

  // Global shortcut listeners (Cmd+K / Ctrl+K, Ctrl+O)
  useEffect(() => {
    function handleGlobalKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSearchHistory(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        handleNewThread();
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
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
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

    let fullPrompt = promptToSend;
    if (attachedFile) {
      fullPrompt = `[Attached Document: ${attachedFile.name}]\n\n${promptToSend}`;
    }
    if (isWebSearchActive) {
      fullPrompt = `[WEB SEARCH ENABLED]\n${fullPrompt}`;
    }
    if (isDeepReasonActive) {
      fullPrompt = `[DEEP REASONING AUDIT ENABLED]\n${fullPrompt}`;
    }

    setAttachedFile(null);

    // Optimistic user message
    const userMsg = {
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toISOString(),
      zeroRetention,
    };
    setMessages(prev => [...prev, userMsg]);

    let tokenToUse = accessToken;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.access_token) {
        tokenToUse = sessionData.session.access_token;
      }
    } catch {}

    if (!tokenToUse) {
      setError('Session expired or unauthorized. Please sign in again.');
      setLoading(false);
      return;
    }

    try {
      const data = await sendChatPrompt(fullPrompt, tokenToUse, zeroRetention);

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
  }, [input, loading, accessToken, attachedFile, zeroRetention, isWebSearchActive, isDeepReasonActive]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleNewThread() {
    setMessages([]);
    setInput('');
    setError('');
  }

  function handleExportChat() {
    if (messages.length === 0) return;
    const text = messages.map(m => `### ${m.role === 'user' ? 'User' : 'Vanguard Cyber AI'}\n${m.content}\n`).join('\n---\n\n');
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vanguard-audit-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('File size exceeds 2MB limit.');
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
    <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-800 font-sans select-none">
      {/* ── 1. COLUMN 1: CHATGPT SIDEBAR ──────────────────────────── */}
      <VanguardSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenSearch={() => setShowSearchHistory(true)}
        onNewThread={handleNewThread}
        onSelectPrompt={handleSubmit}
      />

      {/* ── 2. COLUMN 2: CENTER CHAT CANVAS ───────────────────────── */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-white relative overflow-hidden select-text">
        {/* ChatGPT Style Top Header */}
        <header className="h-14 px-4 sm:px-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarCollapsed(prev => !prev)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-standard"
              title="Toggle Sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            {/* ChatGPT Model Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setModelDropdownOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 text-slate-900 font-bold text-sm transition-standard group"
              >
                <span>{selectedModel.name}</span>
                <span className="text-[11px] font-normal text-slate-500 font-mono hidden sm:inline">
                  {selectedModel.tag}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
              </button>

              {modelDropdownOpen && (
                <div
                  className="absolute top-11 left-0 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 space-y-1 animate-slide-up"
                  onClick={e => e.stopPropagation()}
                >
                  <p className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Model Intelligence
                  </p>
                  {MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedModel(m);
                        if (m.id === 'vanguard-stealth') setZeroRetention(true);
                        setModelDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all ${
                        selectedModel.id === m.id
                          ? 'bg-slate-100 text-slate-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{m.name}</span>
                        <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                          {m.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 font-normal leading-tight">
                        {m.desc}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            {/* Ephemeral / Temporary Chat Toggle (ChatGPT style) */}
            <button
              onClick={() => setZeroRetention(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-standard ${
                zeroRetention
                  ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
              title={zeroRetention ? 'Temporary chat active: No history saved' : 'Enable temporary ephemeral chat'}
            >
              <Lock className={`w-3.5 h-3.5 ${zeroRetention ? 'text-amber-600' : 'text-slate-400'}`} />
              <span className="hidden md:inline">{zeroRetention ? 'Temporary Chat ON' : 'Temporary Chat'}</span>
            </button>

            {/* Export / Share Chat Button */}
            {messages.length > 0 && (
              <button
                onClick={handleExportChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 transition-standard"
                title="Export Security Audit Transcript"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Exported!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Export</span>
                  </>
                )}
              </button>
            )}

            {/* Telemetry Panel Toggle */}
            <button
              onClick={() => setShowTelemetry(prev => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-standard ${
                showTelemetry
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
              }`}
              title="Toggle Security Telemetry"
            >
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Telemetry</span>
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-standard"
              title="Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Central Chat Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-16 py-6 scroll-smooth">
          <div className="max-w-3xl mx-auto flex flex-col justify-between min-h-full">
            <div>
              {/* ChatGPT Empty State Hero with Quick Prompt Cards */}
              {messages.length === 0 && (
                <CyberShieldOrb onSelectPrompt={handleSubmit} />
              )}

              {/* Chat Messages */}
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <MessageBubble
                    key={i}
                    message={msg}
                    onRegenerate={
                      msg.role === 'assistant' && i === messages.length - 1
                        ? () => {
                            const lastUser = messages.filter(m => m.role === 'user').slice(-1)[0];
                            if (lastUser) handleSubmit(lastUser.content);
                          }
                        : undefined
                    }
                  />
                ))}

                {loading && <TypingIndicator />}
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="my-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-xs animate-slide-up">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
                <button
                  onClick={() => setError('')}
                  className="px-2.5 py-1 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div ref={bottomRef} className="h-4" />
          </div>
        </div>

        {/* ── 3. CHATGPT STYLE FLOATING COMPOSER ─────────────────────── */}
        <div className="px-4 sm:px-8 md:px-16 pb-5 pt-1 shrink-0 z-20 bg-white">
          <div className="max-w-3xl mx-auto">
            {/* Attached file chip */}
            {attachedFile && (
              <div className="mb-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 animate-slide-up shadow-xs">
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

            {/* Modern Floating Capsule Box (Iconic ChatGPT composer) */}
            <div className="relative rounded-3xl bg-slate-100/80 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 focus-within:bg-white focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100 p-3 shadow-sm transition-all duration-150">
              <textarea
                id="chat-input"
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Ask Vanguard anything or analyze security payloads…"
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 resize-none outline-none text-[14.5px] leading-relaxed disabled:opacity-50 min-h-[28px] max-h-48 border-none p-1.5 focus:ring-0 selection:bg-blue-100 font-sans"
              />

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-1">
                {/* Left Action Controls (Search, Deep Reason, Attachment) */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-standard"
                    title="Attach security log or file"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  {/* Threat Intelligence / Web Search Toggle */}
                  <button
                    onClick={() => setIsWebSearchActive(prev => !prev)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-standard ${
                      isWebSearchActive
                        ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                        : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                    title="Toggle Threat Intel Web Search"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Search</span>
                  </button>

                  {/* Deep Reasoning Toggle */}
                  <button
                    onClick={() => setIsDeepReasonActive(prev => !prev)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-standard ${
                      isDeepReasonActive
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-semibold'
                        : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                    title="Toggle Deep Reasoning Exploit Audit"
                  >
                    <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="hidden sm:inline">Deep Reason</span>
                  </button>
                </div>

                {/* Right Action Controls: Voice Speech & Send/Stop Button */}
                <div className="flex items-center gap-2">
                  {/* Voice Dictation Button */}
                  <button
                    type="button"
                    onClick={toggleVoiceDictation}
                    className={`p-2 rounded-full transition-all ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                    title={isListening ? 'Listening… click to stop' : 'Voice dictation'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* Send / Stop Circular Button */}
                  <button
                    id="send-btn"
                    onClick={() => (loading ? setLoading(false) : handleSubmit())}
                    disabled={!loading && !input.trim() && !attachedFile}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      loading
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : input.trim() || attachedFile
                        ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                    title={loading ? 'Stop generation' : 'Send prompt (Enter)'}
                  >
                    {loading ? (
                      <Square className="w-3.5 h-3.5 fill-white" />
                    ) : (
                      <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ChatGPT Sub-footer */}
            <p className="text-[11px] text-slate-400 text-center mt-2 font-normal">
              Vanguard can make mistakes. Verify critical security telemetry and intelligence.
            </p>
          </div>
        </div>
      </main>

      {/* ── 3. COLUMN 3: RIGHT THREAT DETECTION PANEL ─────────────── */}
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
