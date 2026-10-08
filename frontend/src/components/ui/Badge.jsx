export default function Badge({ children, color }) {
  const colors = {
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    red: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    blue: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  };

  return (
    <span className={`px-2 py-1 border rounded-md text-[10px] font-mono whitespace-nowrap uppercase tracking-wider ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
}
