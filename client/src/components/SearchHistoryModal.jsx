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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Search Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center">
                <Search className="w-4 h-4 text-brand-600" />
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Search Conversation & Security History</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                ESC to close
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all"
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
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-slate-400 hover:text-slate-700 text-sm font-bold"
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
                      ? 'bg-brand-50 text-brand-700 border border-brand-300 shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {f.color === 'emerald' && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                  {f.color === 'amber' && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                  {f.color === 'rose' && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#fbfcfd]">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
              <div className="w-6 h-6 border-2 border-brand-500/30 border-t-brand-600 rounded-full animate-spin" />
              <p className="text-xs font-medium">Scanning encrypted audit logs…</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Shield className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No matching search history found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? `No prompts or responses matched "${searchQuery}". Try different keywords.`
                  : 'Start chatting with Vanguard Cyber AI to build your encrypted audit trail.'}
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
                      ? 'bg-brand-50/20 border-brand-300 shadow-sm'
                      : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Status row */}
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {isPassed && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Passed
                          </span>
                        )}
                        {isModified && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            PII Sanitized
                          </span>
                        )}
                        {isBlocked && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Blocked
                          </span>
                        )}

                        {item.pii_entities_found > 0 && (
                          <span className="text-[11px] text-amber-700 font-medium">
                            • {item.pii_entities_found} PII token{item.pii_entities_found > 1 ? 's' : ''} masked
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400 ml-auto flex items-center gap-1">
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
                      <p className="text-sm font-medium text-slate-900 line-clamp-2 leading-relaxed">
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
                        <p className="text-xs text-rose-600 mt-1 line-clamp-1">
                          🚫 {item.threat_reason}
                        </p>
                      )}
                    </div>

                    {/* Quick Action buttons */}
                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      <button
                        onClick={e => handleCopy(item.id, item.original_prompt, e)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        title="Copy prompt"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => setSelectedItem(isExpanded ? null : item)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isExpanded ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                        }`}
                        title="Toggle details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={e => handleDeleteRecord(item.id, e)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete this record from database"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          onSelectPrompt(item.original_prompt);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-semibold flex items-center gap-1 transition-all"
                        title="Load into chat"
                      >
                        <span>Load</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Audit Card Details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 text-xs animate-slide-up">
                      {/* Masked Prompt */}
                      {item.masked_prompt && item.masked_prompt !== item.original_prompt && (
                        <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200">
                          <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider block mb-1">
                            Sanitized Prompt Sent to LLM:
                          </span>
                          <p className="font-mono text-slate-800 text-[11px] leading-relaxed">
                            {item.masked_prompt}
                          </p>
                        </div>
                      )}

                      {/* Full AI Response */}
                      {item.ai_response && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                            Verified AI Response:
                          </span>
                          <p className="text-slate-800 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                            {item.ai_response}
                          </p>
                        </div>
                      )}

                      {/* Threat Details if blocked */}
                      {isBlocked && item.threat_reason && (
                        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                          <span className="text-[10px] font-semibold text-rose-800 uppercase tracking-wider block mb-1">
                            Firewall Quarantine Classification:
                          </span>
                          <p className="text-rose-700 leading-relaxed font-mono text-[11px]">
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
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-slate-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Showing {filteredHistory.length} of {history.length} records
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              PII is auto-redacted before database insertion
            </span>
          </div>

          <div className="flex items-center gap-2">
            {showClearConfirm ? (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-xl">
                <span className="text-[11px] text-rose-800 font-medium">Purge all records from database?</span>
                <button
                  onClick={handleClearAll}
                  disabled={clearing}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {clearing ? 'Purging...' : 'Yes, Delete All'}
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  disabled={clearing}
                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-600 text-xs rounded-lg transition-all border border-slate-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              history.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium transition-all"
                  title="Permanently remove all logged search and prompt records from database"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Wipe Database History
                </button>
              )
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 transition-all shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
