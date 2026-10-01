import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search, X, Shield, ShieldCheck, ShieldAlert, Clock,
  ArrowRight, Copy, Check, MessageSquare, ChevronRight,
  Filter, Eye, Terminal, Sparkles, Trash2
} from 'lucide-react';
import { fetchUserHistory, clearAllUserHistory, deleteHistoryRecord } from '../lib/api';

export default function SearchHistoryModal({ isOpen, onClose, onSelectPrompt, accessToken }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | passed | modified | blocked
  const [selectedItem, setSelectedItem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const searchInputRef = useRef(null);

  // Fetch history when opened
  useEffect(() => {
    if (isOpen && accessToken) {
      setLoading(true);
      fetchUserHistory(accessToken)
        .then(data => setHistory(data))
        .catch(err => console.error('Failed to load history:', err))
        .finally(() => setLoading(false));

      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
      setStatusFilter('all');
      setSelectedItem(null);
    }
  }, [isOpen, accessToken]);

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter history
  const filteredHistory = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return history.filter(item => {
      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      if (!q) return true;

      const promptMatch = item.original_prompt?.toLowerCase().includes(q);
      const maskedMatch = item.masked_prompt?.toLowerCase().includes(q);
      const responseMatch = item.ai_response?.toLowerCase().includes(q);
      const threatMatch = item.threat_reason?.toLowerCase().includes(q);

      return promptMatch || maskedMatch || responseMatch || threatMatch;
    });
  }, [history, searchQuery, statusFilter]);

  const [clearing, setClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleCopy = async (id, text, e) => {
    e?.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDeleteRecord = async (id, e) => {
    e?.stopPropagation();
    try {
      await deleteHistoryRecord(id, accessToken);
      setHistory(prev => prev.filter(item => item.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (err) {
      console.error('Failed to delete history record:', err);
    }
  };

  const handleClearAll = async () => {
    setClearing(true);
    try {
      await clearAllUserHistory(accessToken);
      setHistory([]);
      setSelectedItem(null);
      setShowClearConfirm(false);
    } catch (err) {
      console.error('Failed to clear history:', err);
    } finally {
      setClearing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-3xl bg-[#10121a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Search Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#141622]/50">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
                <Search className="w-4 h-4 text-brand-300" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">Search Conversation & Security History</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[11px] font-mono text-slate-500 bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.06]">
                ESC to close
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search prompts, responses, PII tokens, or security audit logs…"
              className="w-full pl-11 pr-10 py-3 bg-[#0a0b0f] border border-white/10 rounded-2xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/10 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-slate-400 hover:text-white text-sm"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 mt-3 pt-1 overflow-x-auto text-xs">
            <span className="text-slate-500 text-[11px] font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {[
              { id: 'all', label: 'All Queries', count: history.length },
              { id: 'passed', label: 'Passed', color: 'emerald' },
              { id: 'modified', label: 'PII Sanitized', color: 'amber' },
              { id: 'blocked', label: 'Blocked Threats', color: 'rose' },
            ].map(f => {
              const active = statusFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                    active
                      ? 'bg-brand-600/25 text-brand-300 border border-brand-500/40'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 border border-white/[0.04]'
                  }`}
                >
                  {f.color === 'emerald' && <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />}
                  {f.color === 'amber' && <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />}
                  {f.color === 'rose' && <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-6 h-6 border-2 border-brand-400/30 border-t-brand-400 rounded-full animate-spin" />
              <p className="text-xs font-medium">Scanning encrypted audit logs…</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Shield className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-medium text-slate-400">No matching search history found</p>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {searchQuery
                  ? `No prompts or responses matched "${searchQuery}". Try different keywords.`
                  : 'Start chatting with Aegis AI to build your encrypted audit trail.'}
              </p>
            </div>
          ) : (
            filteredHistory.map(item => {
              const isBlocked = item.status === 'blocked';
              const isModified = item.status === 'modified';
              const isPassed = item.status === 'passed';
              const isExpanded = selectedItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    isExpanded
                      ? 'bg-[#141724] border-brand-500/40 shadow-xl'
                      : 'bg-[#0e1017]/80 hover:bg-[#12141f] border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Status row */}
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {isPassed && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Passed
                          </span>
                        )}
                        {isModified && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            PII Sanitized
                          </span>
                        )}
                        {isBlocked && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Blocked
                          </span>
                        )}

                        {item.pii_entities_found > 0 && (
                          <span className="text-[11px] text-amber-400 font-medium">
                            • {item.pii_entities_found} PII token{item.pii_entities_found > 1 ? 's' : ''} masked
                          </span>
                        )}

                        <span className="text-[11px] text-slate-500 ml-auto flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.created_at).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Prompt Preview */}
                      <p className="text-sm font-medium text-slate-200 line-clamp-2 leading-relaxed">
                        {item.original_prompt}
                      </p>

                      {/* Response Preview if not expanded */}
                      {!isExpanded && item.ai_response && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          ↳ {item.ai_response}
                        </p>
                      )}

                      {/* Blocked reason preview */}
                      {!isExpanded && isBlocked && item.threat_reason && (
                        <p className="text-xs text-rose-400/90 mt-1 line-clamp-1">
                          🚫 {item.threat_reason}
                        </p>
                      )}
                    </div>

                    {/* Quick Action buttons */}
                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      <button
                        onClick={e => handleCopy(item.id, item.original_prompt, e)}
                        className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-500 hover:text-slate-300 transition-colors"
                        title="Copy prompt"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => setSelectedItem(isExpanded ? null : item)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isExpanded ? 'bg-white/[0.1] text-brand-300' : 'hover:bg-white/[0.08] text-slate-500 hover:text-slate-300'
                        }`}
                        title="Toggle details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={e => handleDeleteRecord(item.id, e)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete this record from database"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          onSelectPrompt(item.original_prompt);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-xl bg-brand-600/20 hover:bg-brand-600/40 text-brand-300 border border-brand-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                        title="Load into chat"
                      >
                        <span>Load</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Audit Card Details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-white/[0.08] space-y-3 text-xs animate-slide-up">
                      {/* Masked Prompt */}
                      {item.masked_prompt && item.masked_prompt !== item.original_prompt && (
                        <div className="p-2.5 rounded-xl bg-[#090a0e] border border-white/[0.06]">
                          <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                            Sanitized Prompt Sent to LLM:
                          </span>
                          <p className="font-mono text-slate-300 text-[11px] leading-relaxed">
                            {item.masked_prompt}
                          </p>
                        </div>
                      )}

                      {/* Full AI Response */}
                      {item.ai_response && (
                        <div className="p-2.5 rounded-xl bg-[#090a0e] border border-white/[0.06]">
                          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                            Verified AI Response:
                          </span>
                          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                            {item.ai_response}
                          </p>
                        </div>
                      )}

                      {/* Threat Details if blocked */}
                      {isBlocked && item.threat_reason && (
                        <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/25">
                          <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider block mb-1">
                            Firewall Quarantine Classification:
                          </span>
                          <p className="text-rose-300 leading-relaxed font-mono text-[11px]">
                            {item.threat_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-white/[0.08] bg-[#141622]/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Showing {filteredHistory.length} of {history.length} records
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              PII is auto-redacted before database insertion
            </span>
          </div>

          <div className="flex items-center gap-2">
            {showClearConfirm ? (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/25 px-2.5 py-1 rounded-xl">
                <span className="text-[11px] text-rose-300 font-medium">Purge all records from database?</span>
                <button
                  onClick={handleClearAll}
                  disabled={clearing}
                  className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 text-xs rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {clearing ? 'Purging...' : 'Yes, Delete All'}
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  disabled={clearing}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-400 text-xs rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            ) : (
              history.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition-all"
                  title="Permanently remove all logged search and prompt records from database"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Wipe Database History
                </button>
              )
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
