export default function StatCard({ title, value, subtitle, icon: Icon, color = 'brand', trend }) {
  const colorMap = {
    brand: {
      bg: 'bg-indigo-50/40',
      border: 'border-indigo-100',
      icon: 'text-indigo-600 bg-indigo-100',
      value: 'text-slate-900',
    },
    danger: {
      bg: 'bg-rose-50/40',
      border: 'border-rose-100',
      icon: 'text-rose-600 bg-rose-100',
      value: 'text-rose-700',
    },
    warning: {
      bg: 'bg-amber-50/40',
      border: 'border-amber-100',
      icon: 'text-amber-600 bg-amber-100',
      value: 'text-amber-700',
    },
    success: {
      bg: 'bg-emerald-50/40',
      border: 'border-emerald-100',
      icon: 'text-emerald-600 bg-emerald-100',
      value: 'text-emerald-700',
    },
  };

  const c = colorMap[color] || colorMap.brand;

  return (
    <div className={`glass-card p-6 border ${c.border} ${c.bg} hover:shadow-md transition-all duration-200 animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-600 mb-1">{title}</p>
          <p className={`text-4xl font-extrabold ${c.value} tabular-nums`}>{value}</p>
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
