export default function AuthDialog({ open, onClose, handleAuth, authMode, setAuthMode, setAuthError, authError, syncProgress, setSyncProgress }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <form onSubmit={handleAuth} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-sky-400 font-mono drop-shadow-[0_0_10px_rgba(56,189,248,0.5)] mb-2">&lt;DSA/&gt;</h1>
          <p className="text-xs text-slate-400 tracking-widest uppercase">Spaced Repetition Tracker</p>
        </div>

        <div className="flex border border-slate-800 rounded-lg overflow-hidden mb-6 bg-slate-950">
          <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className={`flex-1 py-2 text-xs font-bold transition-colors ${authMode === 'login' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}>LOGIN</button>
          <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); }} className={`flex-1 py-2 text-xs font-bold transition-colors ${authMode === 'register' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}>REGISTER</button>
        </div>

        {authError && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-xs font-mono text-center mb-4">{authError}</div>
        )}

        <div className="space-y-4 mb-6">
          {authMode === 'register' && (
            <input name="name" required placeholder="Full Name..." className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 focus:border-sky-500 outline-none font-bold text-sm" />
          )}
          <input name="username" required placeholder="Username..." className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 focus:border-sky-500 outline-none font-bold text-sm" />
          <input name="password" type="password" required placeholder="Password..." className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 focus:border-sky-500 outline-none font-bold text-sm" />
        </div>

        <div className="flex items-center gap-2 mb-6">
          <input type="checkbox" id="sync-check" checked={syncProgress} onChange={(e) => setSyncProgress(e.target.checked)} className="rounded border-slate-800 bg-slate-950 text-sky-500 focus:ring-sky-500" />
          <label htmlFor="sync-check" className="text-xs text-slate-400 cursor-pointer">Sync current guest progress to my account</label>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 text-sm font-bold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors">Cancel</button>
          <button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-4 py-3 rounded-xl transition-colors shadow-[0_0_15px_rgba(56,189,248,0.4)]">{authMode === 'login' ? 'Login' : 'Register'}</button>
        </div>
      </form>
    </div>
  );
}
