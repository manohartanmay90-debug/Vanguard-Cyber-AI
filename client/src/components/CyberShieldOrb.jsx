import { Shield } from 'lucide-react';

export default function CyberShieldOrb() {
  return (
    <div className="my-auto py-28 flex flex-col items-center justify-center text-center select-none animate-fade-in max-w-xl mx-auto px-4">
      {/* Sleek Minimal Brand Mark */}
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/10 border border-slate-700">
          <Shield className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Clean Minimal Headline */}
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        What can I help with today?
      </h2>
    </div>
  );
}
