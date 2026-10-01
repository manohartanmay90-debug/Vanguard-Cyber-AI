import { useState } from 'react';
import {
  Shield, ShieldCheck, ShieldAlert, Copy, Check,
  Sparkles, ThumbsUp, ThumbsDown, Terminal, Info, ExternalLink, Lock
} from 'lucide-react';

function CopyButton({ text, label = '' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 text-xs transition-all duration-150"
      title="Copy message"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          {label && <span className="text-emerald-400 font-medium">Copied</span>}
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
}

// Formats content with lightweight markdown parser for clean developer hierarchy
function FormattedContent({ content }) {
  if (!content) return null;

  // Split by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 leading-relaxed text-[14px] text-slate-200">
      {parts.map((part, idx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          const hasLang = /^[a-z0-9_-]+$/i.test(firstLine);
          const lang = hasLang ? firstLine : 'code';
          const codeBody = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <div key={idx} className="my-3 rounded-xl overflow-hidden border border-white/[0.08] bg-[#090a0e] shadow-lg">
              <div className="flex items-center justify-between px-3.5 py-1.5 bg-white/[0.03] border-b border-white/[0.06] text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-brand-400" />
                  {lang}
                </span>
                <CopyButton text={codeBody} label="Copy code" />
              </div>
              <pre className="p-3.5 overflow-x-auto text-[13px] font-mono text-emerald-300/90 leading-normal selection:bg-brand-500/30">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        // Render regular markdown paragraphs with bold, inline code, and lists
        const paragraphs = part.split(/\n\n+/);
        return paragraphs.map((p, pIdx) => {
          const trimmed = p.trim();
          if (!trimmed) return null;

          // Bullet lists
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const items = trimmed.split(/\n[-*]\s+/).filter(Boolean);
            return (
              <ul key={pIdx} className="space-y-1.5 list-disc list-inside text-slate-300 pl-1">
                {items.map((item, itemIdx) => (
                  <li key={itemIdx} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }} />
                ))}
              </ul>
            );
          }

          // Headers
          if (trimmed.startsWith('### ')) {
            return (
              <h3
                key={pIdx}
                className="text-base font-semibold text-white tracking-tight pt-1"
                dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(trimmed.replace(/^###\s+/, '')) }}
              />
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2
                key={pIdx}
                className="text-lg font-bold text-white tracking-tight pt-1"
                dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(trimmed.replace(/^##\s+/, '')) }}
              />
            );
          }

          return (
            <p
              key={pIdx}
              className="leading-relaxed text-slate-200"
              dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(trimmed) }}
            />
          );
        });
      })}
    </div>
  );
}

function renderInlineMarkdown(text) {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-white/[0.08] text-brand-300 font-mono text-[12.5px] border border-white/[0.06]">$1</code>')
    // Newlines within paragraph
    .replace(/\n/g, '<br />');
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const isBlocked = message.status === 'blocked';
  const isModified = message.status === 'modified';
  const isPassed = message.status === 'passed' || (!isBlocked && !isModified);

  const [feedback, setFeedback] = useState(null);

  // ── USER MESSAGE ──────────────────────────────────────────────
  if (isUser) {
    return (
      <div className="flex justify-end gap-3 group animate-slide-up mb-6">
        <div className="max-w-[78%] flex flex-col items-end">
          {/* User Message Bubble */}
          <div className="relative bg-[#111827] hover:bg-[#141d2f] border border-slate-800 rounded-2xl rounded-tr-sm px-5 py-3.5 text-slate-100 text-[14px] leading-relaxed shadow-executive transition-standard">
            <p className="whitespace-pre-wrap selection:bg-blue-600/30">{message.content}</p>
          </div>

          {/* Subtitle / Metadata row */}
          <div className="flex items-center gap-2 mt-1.5 px-1 text-xs text-slate-500">
            {message.zeroRetention && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-950/40 border border-blue-500/25 text-blue-300 font-medium text-[11px]" title="Zero-Retention active: this query is never written to the database">
                <Lock className="w-3 h-3 text-blue-400" />
                Zero-Retention
              </span>
            )}
            {message.piiMasked > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium text-[11px]">
                <Shield className="w-3 h-3" />
                {message.piiMasked} PII token{message.piiMasked > 1 ? 's' : ''} masked
              </span>
            )}
            <CopyButton text={message.content} />
            <span className="font-mono text-[11px]">
              {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── ASSISTANT MESSAGE ─────────────────────────────────────────
  return (
    <div className="flex gap-4 group animate-slide-up mb-7 items-start">
      {/* Circular Branded Logo */}
      <div className="relative shrink-0 mt-0.5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-executive relative p-[1px] ${
          isBlocked
            ? 'bg-gradient-to-tr from-rose-600 to-red-500'
            : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500'
        }`}>
          <div className="w-full h-full bg-[#0a0d14] rounded-xl flex items-center justify-center">
            {isBlocked ? (
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            ) : (
              <Shield className="w-4 h-4 text-blue-400" />
            )}
          </div>
        </div>
        {/* Active safety indicator */}
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0d14]" />
      </div>

      <div className="flex-1 max-w-[88%]">
        {/* Assistant Header & Security Status Subtitle Block */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="font-semibold text-slate-100 text-sm tracking-tight flex items-center gap-1.5">
            Vanguard Cyber AI
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700/60">
              Sentinel v2.5
            </span>
          </span>

          {/* Security Status Subtitle Block with green indicator dot */}
          {isPassed && (
            <div className="badge-vanguard-pass">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Passed</span>
              <span className="text-emerald-500/70 text-[10px] hidden sm:inline">• Verified Safe</span>
            </div>
          )}

          {isModified && (
            <div className="badge-vanguard-warn">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Passed</span>
              <span className="text-amber-400/80 text-[10px]">(PII Sanitized)</span>
            </div>
          )}

          {isBlocked && (
            <div className="badge-vanguard-block">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Quarantined</span>
              <span className="text-rose-400/80 text-[10px]">• Threat Blocked</span>
            </div>
          )}

          {message.zeroRetention && (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-950/40 border border-blue-500/25 text-blue-300 text-xs font-medium shadow-sm" title="Zero Retention Mode: Prompt was ephemeral and never saved to database">
              <Lock className="w-3 h-3 text-blue-400" />
              <span>Zero-Retention</span>
            </div>
          )}
        </div>

        {/* Message Content Container */}
        <div className={`rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-executive transition-standard border ${
          isBlocked
            ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
            : 'bg-[#0d121f] hover:bg-[#101626] border-slate-800 text-slate-200'
        }`}>
          {isBlocked ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                Enterprise Security Quarantine Triggered
              </div>
              <p className="text-sm leading-relaxed text-rose-200/90">{message.content}</p>
              {message.threatReason && (
                <div className="mt-2.5 pt-2.5 border-t border-rose-500/20 bg-rose-500/[0.04] p-3 rounded-xl">
                  <p className="text-[11px] uppercase tracking-wider text-rose-400 font-semibold">Firewall Audit Reason</p>
                  <p className="text-xs text-rose-300/80 mt-1 font-mono">{message.threatReason}</p>
                </div>
              )}
            </div>
          ) : (
            <FormattedContent content={message.content} />
          )}
        </div>

        {/* Action & Metadata Footer */}
        <div className="flex items-center justify-between mt-2 px-1 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CopyButton text={message.content} label="Copy" />
            <div className="flex items-center gap-0.5 border-l border-white/[0.08] pl-2 ml-1">
              <button
                onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                className={`p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors ${
                  feedback === 'up' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Good response"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                className={`p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors ${
                  feedback === 'down' ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Poor response"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <span>Scan: 0ms latency</span>
            <span>•</span>
            <span>
              {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
