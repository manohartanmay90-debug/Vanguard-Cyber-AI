import { useState } from 'react';
import {
  X, Shield, Cpu, Lock, CheckCircle2, Sliders, Database,
  Settings, User, Moon, Sun, Volume2, ShieldCheck, Download, Trash2
} from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('general');
  const [piiEnabled, setPiiEnabled] = useState(true);
  const [jailbreakGuard, setJailbreakGuard] = useState(true);
  const [speechRate, setSpeechRate] = useState('1.0');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in select-none">
      <div
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body with Sidebar Tabs */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left Tabs */}
          <div className="w-48 bg-slate-50 border-r border-slate-100 p-3 space-y-1 shrink-0">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'general' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>General</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'security' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Security & Guard</span>
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'data' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Data Controls</span>
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'system' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>System & Model</span>
            </button>
          </div>

          {/* Right Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto text-sm space-y-5">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <p className="font-semibold text-slate-900 text-xs">Theme</p>
                    <p className="text-[11px] text-slate-500">System default light aesthetic</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">Light (Clean)</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <p className="font-semibold text-slate-900 text-xs">Speech Playback Rate</p>
                    <p className="text-[11px] text-slate-500">Audio read aloud speed</p>
                  </div>
                  <select
                    value={speechRate}
                    onChange={e => setSpeechRate(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 bg-white"
                  >
                    <option value="0.8">0.8x</option>
                    <option value="1.0">1.0x (Normal)</option>
                    <option value="1.2">1.2x (Fast)</option>
                    <option value="1.5">1.5x</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 text-xs">Auto-Scroll to Latest Message</p>
                    <p className="text-[11px] text-slate-500">Smooth scroll during generation</p>
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold">Enabled</span>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900 text-xs">Autonomous PII Masking</p>
                      <p className="text-[11px] text-slate-600">Redacts SSN, API keys, passwords before model inference</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={piiEnabled}
                    onChange={e => setPiiEnabled(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900 text-xs">Prompt Injection Quarantine</p>
                      <p className="text-[11px] text-slate-600">Blocks adversarial jailbreaks & system prompt leaks</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={jailbreakGuard}
                    onChange={e => setJailbreakGuard(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Threat Confidence Threshold</span>
                    <span className="font-mono text-blue-600 font-bold">75% (Strict Enterprise)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full w-[75%]" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <p className="font-semibold text-slate-900 text-xs">Export All Audit Logs</p>
                    <p className="text-[11px] text-slate-500">Download conversation history as JSON</p>
                  </div>
                  <button
                    onClick={() => alert('Exporting security audit archive…')}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-rose-600 text-xs">Delete All Conversations</p>
                    <p className="text-[11px] text-slate-500">Permanently wipe session database</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear session history?')) {
                        alert('Session logs purged.');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear History
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Gateway Version</span>
                    <span className="font-mono font-bold text-slate-800">Vanguard Sentinel 2.5 (SOC2)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Inference Core</span>
                    <span className="font-mono text-blue-600 font-semibold">Gemini 3.1 Flash / Multi-Model</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Threat Latency Overhead</span>
                    <span className="font-mono text-emerald-600 font-semibold">&lt; 12ms</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-all shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
