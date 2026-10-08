export const parseMd = (text) => {
  if (!text) return '';

  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-slate-800 text-sky-400 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-950 border border-slate-800 p-3 rounded-lg overflow-x-auto my-2 text-xs font-mono text-emerald-400">$1</pre>')
    .replace(/## (.*)/g, '<h2 class="text-lg font-bold text-slate-200 mt-4 mb-2">$1</h2>')
    .replace(/- (.*)/g, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n/g, '<br/>');
};
