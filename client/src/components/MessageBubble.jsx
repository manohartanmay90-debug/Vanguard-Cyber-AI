import { useState } from 'react';
import {
  Shield, ShieldCheck, ShieldAlert, Copy, Check,
  Sparkles, ThumbsUp, ThumbsDown, Terminal, Info,
  Volume2, VolumeX, RotateCcw, ChevronDown, ChevronRight,
  Cpu, Lock, Activity, Share2, CheckCheck
} from 'lucide-react';

function CopyButton({ text, label = '' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Clipboard copy failed', e);
    }
  };

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs transition-standard"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-600 font-medium">Copied</span>
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

// Formats content with lightweight markdown parser for clean ChatGPT-style hierarchy
function FormattedContent({ content }) {
  if (!content) return null;

  // Split by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 leading-relaxed text-[14.5px] text-slate-800">
      {parts.map((part, idx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          const hasLang = /^[a-z0-9_-]+$/i.test(firstLine);
          const lang = hasLang ? firstLine : 'code';
          const codeBody = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <div key={idx} className="my-3.5 rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-md font-mono">
              <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">{lang}</span>
                </div>
                <CopyButton text={codeBody} label="Copy code" />
              </div>
              <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed text-slate-100 font-mono selection:bg-blue-600/40">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        // Render regular markdown paragraphs with bold, inline code, headers, and lists
        const paragraphs = part.split(/\n\n+/);
        return paragraphs.map((p, pIdx) => {
          const trimmed = p.trim();
          if (!trimmed) return null;

          // Bullet lists
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const items = trimmed.split(/\n[-*]\s+/).filter(Boolean);
            return (
              <ul key={pIdx} className="space-y-1.5 list-disc list-outside ml-5 text-slate-700">
                {items.map((item, itemIdx) => (
                  <li key={itemIdx} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }} />
                ))}
              </ul>
            );
          }

          // Numbered lists
          if (/^\d+\.\s+/.test(trimmed)) {
            const items = trimmed.split(/\n\d+\.\s+/).filter(Boolean);
            return (
              <ol key={pIdx} className="space-y-1.5 list-decimal list-outside ml-5 text-slate-700">
                {items.map((item, itemIdx) => (
                  <li key={itemIdx} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }} />
                ))}
              </ol>
            );
          }

          // Headers
          if (trimmed.startsWith('### ')) {
            return (
              <h3
                key={pIdx}
                className="text-base font-bold text-slate-900 tracking-tight pt-2 pb-0.5"
                dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(trimmed.replace(/^###\s+/, '')) }}
              />
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2
                key={pIdx}
                className="text-lg font-bold text-slate-900 tracking-tight pt-3 pb-1 border-b border-slate-100"
                dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(trimmed.replace(/^##\s+/, '')) }}
              />
            );
          }
          if (trimmed.startsWith('# ')) {
            return (
              <h1
                key={pIdx}
                className="text-xl font-extrabold text-slate-900 tracking-tight pt-3 pb-1"
                dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(trimmed.replace(/^#\s+/, '')) }}
              />
            );
          }

          // Blockquotes
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote
                key={pIdx}
                className="border-l-4 border-blue-500 pl-3.5 py-1 my-2 bg-blue-50/50 rounded-r-lg text-slate-700 text-sm italic"
                dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(trimmed.replace(/^>\s+/, '')) }}
              />
            );
          }

          return (
            <p
              key={pIdx}
              className="leading-relaxed text-slate-800"
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
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
    // Italics
    .replace(/\*([^*]+)\*/g, '<em class="italic text-slate-700">$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-slate-100 text-blue-700 font-mono text-[12.5px] border border-slate-200">$1</code>')
    // Newlines within paragraph
    .replace(/\n/g, '<br />');
}

export default function MessageBubble({ message, onRegenerate }) {
  const isUser = message.role === 'user';
  const isBlocked = message.status === 'blocked';
  const isModified = message.status === 'modified';
  const isPassed = message.status === 'passed' || (!isBlocked && !isModified);

  const [feedback, setFeedback] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showThinking, setShowThinking] = useState(false);

  // Text-to-Speech handler
  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // ── USER MESSAGE ──────────────────────────────────────────────
  if (isUser) {
    return (
      <div className="flex justify-end gap-3 group animate-slide-up mb-6">
        <div className="max-w-[82%] md:max-w-[75%] flex flex-col items-end">
          {/* User Message Bubble */}
          <div className="relative bg-slate-100 hover:bg-slate-200/90 text-slate-900 rounded-2xl rounded-tr-sm px-5 py-3 text-[14.5px] leading-relaxed shadow-xs border border-slate-200/80 transition-standard">
            <p className="whitespace-pre-wrap selection:bg-blue-200 font-normal">{message.content}</p>
          </div>

          {/* Subtitle / Metadata row */}
          <div className="flex items-center gap-2 mt-1.5 px-1 text-xs text-slate-400">
            {message.zeroRetention && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-medium text-[11px]" title="Zero-Retention active: query was ephemeral">
                <Lock className="w-3 h-3 text-amber-600" />
                Zero-Retention
              </span>
            )}
            {message.piiMasked > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium text-[11px]">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {message.piiMasked} PII sanitized
              </span>
            )}
            <CopyButton text={message.content} />
            <span className="font-mono text-[11px] text-slate-400">
              {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── ASSISTANT MESSAGE (ChatGPT Style) ─────────────────────────
  return (
    <div className="flex gap-3.5 group animate-slide-up mb-7 items-start">
      {/* ChatGPT Style Avatar Icon */}
      <div className="relative shrink-0 mt-0.5">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition-transform ${
          isBlocked
            ? 'bg-rose-100 border border-rose-300 text-rose-600'
            : 'bg-slate-900 text-white border border-slate-700'
        }`}>
          {isBlocked ? (
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          ) : (
            <Shield className="w-4 h-4 text-white" />
          )}
        </div>
        {/* Status dot */}
        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
          isBlocked ? 'bg-rose-500' : 'bg-emerald-500'
        }`} />
      </div>

      <div className="flex-1 max-w-[92%]">
        {/* Assistant Header & Status Indicators */}
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
            Vanguard
            <span className="font-normal text-xs text-slate-500 font-mono">4o</span>
          </span>

          {/* Security Status Subtitle Block */}
          {isPassed && (
            <div className="badge-vanguard-pass">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Verified Safe</span>
            </div>
          )}

          {isModified && (
            <div className="badge-vanguard-warn">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>PII Scrubbed</span>
            </div>
          )}

          {isBlocked && (
            <div className="badge-vanguard-block">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Threat Blocked</span>
            </div>
          )}

          {message.zeroRetention && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-medium">
              <Lock className="w-2.5 h-2.5 text-amber-600" />
              <span>Ephemeral</span>
            </div>
          )}
        </div>

        {/* ChatGPT / OpenAI o1 Style Thought / Sentinel Inspection Dropdown */}
        <div className="mb-2">
          <button
            onClick={() => setShowThinking(prev => !prev)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-slate-600 text-xs font-mono transition-standard group/thought"
          >
            {showThinking ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            <span className="flex items-center gap-1 font-sans text-[11px] font-medium text-slate-600 group-hover/thought:text-slate-900">
              <Activity className="w-3 h-3 text-blue-600" />
              Sentinel Threat Inspection (Sub-second)
            </span>
          </button>

          {showThinking && (
            <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5 animate-slide-up font-mono">
              <div className="flex items-center justify-between text-[11px] border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-sans">Heuristic Status</span>
                <span className={`font-bold ${isBlocked ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {isBlocked ? 'QUARANTINED' : 'PASSED (0 Malicious Triggers)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-sans">PII Entities Masked</span>
                <span className="text-slate-800 font-bold">{message.piiMasked || 0}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-sans">Zero Retention Mode</span>
                <span className="text-slate-800">{message.zeroRetention ? 'Enabled (No logs retained)' : 'Disabled'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Message Content Container */}
        <div className={`p-4 rounded-2xl transition-standard ${
          isBlocked
            ? 'bg-rose-50 border border-rose-200 text-rose-900'
            : 'bg-white border border-slate-200/90 text-slate-800 shadow-xs'
        }`}>
          {isBlocked ? (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                Enterprise Security Quarantine Triggered
              </div>
              <p className="text-sm leading-relaxed text-rose-800">{message.content}</p>
              {message.threatReason && (
                <div className="mt-2 pt-2 border-t border-rose-200 bg-rose-100/50 p-2.5 rounded-xl font-mono text-xs text-rose-800">
                  <span className="font-semibold block text-[10px] uppercase tracking-wider">Firewall Detection Reason:</span>
                  <span className="mt-0.5 block">{message.threatReason}</span>
                </div>
              )}
            </div>
          ) : (
            <FormattedContent content={message.content} />
          )}
        </div>

        {/* ChatGPT Style Action & Tool Footer */}
        <div className="flex items-center justify-between mt-2 px-1 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <CopyButton text={message.content} label="Copy" />

            <button
              onClick={handleToggleSpeak}
              className={`p-1.5 rounded-lg hover:bg-slate-100 transition-standard ${
                isSpeaking ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-700'
              }`}
              title={isSpeaking ? 'Stop speech' : 'Read aloud'}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-standard"
                title="Regenerate response"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="flex items-center gap-0.5 border-l border-slate-200 pl-1.5 ml-1">
              <button
                onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                  feedback === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Good response"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                  feedback === 'down' ? 'text-rose-600 bg-rose-50' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Poor response"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>
              {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
