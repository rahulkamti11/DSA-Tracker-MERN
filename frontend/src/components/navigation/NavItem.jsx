import Tooltip from '../ui/Tooltip.jsx';

export default function NavItem({
  id,
  icon: Icon,
  label,
  alert,
  active,
  sidebarCollapsed,
  onClick,
}) {
  const button = (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center rounded-lg text-sm font-medium transition-colors relative ${
        sidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
      } ${active ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
    >
      <Icon size={18} />
      {!sidebarCollapsed && <span>{label}</span>}
      {alert > 0 && (
        sidebarCollapsed ? (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        ) : (
          <span className="ml-auto bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full text-[10px] font-bold">{alert}</span>
        )
      )}
    </button>
  );

  return sidebarCollapsed ? <Tooltip content={label}>{button}</Tooltip> : button;
}
