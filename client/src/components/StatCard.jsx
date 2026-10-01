export default function StatCard({ title, value, subtitle, icon: Icon, color = 'brand', trend }) {
  const colorMap = {
    brand: {
      bg: 'bg-brand-600/10',
      border: 'border-brand-500/20',
      icon: 'text-brand-400 bg-brand-600/20',
      value: 'text-brand-300',
    },
    danger: {
      bg: 'bg-danger-500/10',
      border: 'border-danger-500/20',
      icon: 'text-danger-400 bg-danger-500/20',
      value: 'text-danger-300',
    },
    warning: {
      bg: 'bg-warning-500/10',
      border: 'border-warning-500/20',
      icon: 'text-warning-400 bg-warning-500/20',
      value: 'text-warning-300',
    },
    success: {
      bg: 'bg-success-500/10',
      border: 'border-success-500/20',
      icon: 'text-success-400 bg-success-500/20',
      value: 'text-success-300',
    },
  };

  const c = colorMap[color] || colorMap.brand;

  return (
    <div className={`glass-card p-6 border ${c.border} ${c.bg} hover:scale-[1.02] transition-transform duration-200 animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <p className={`text-4xl font-bold ${c.value} tabular-nums`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1.5">{subtitle}</p>
          )}
          {trend !== undefined && (
            <p className={`text-xs mt-2 font-medium ${trend >= 0 ? 'text-danger-400' : 'text-success-400'}`}>
              {trend >= 0 ? `↑ ${trend}` : `↓ ${Math.abs(trend)}`} from last period
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-2xl ${c.icon} flex items-center justify-center shrink-0 shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
