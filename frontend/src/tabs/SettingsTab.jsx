import { useState } from 'react';
import useTheme from '../hooks/useTheme.js';

export default function SettingsTab({ active, user }) {
  const { themeMode, setTheme } = useTheme();
  const [settingsForm, setSettingsForm] = useState(() => ({
    displayName: user && user.name ? user.name : 'Guest User',
    username: user && user.username ? user.username : 'guest@dsatracker.com',
    password: '',
    tooltipsEnabled: true,
  }));

  if (!active) return null;

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
        <div>
          <h2 className="text-lg font-bold text-sky-400">Settings</h2>
          <p className="text-sm text-slate-400 mt-1">Manage user details, dashboard theme, and hover assistance settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 animate-in slide-in-from-bottom-3 duration-300">
          <h3 className="text-md font-bold text-slate-200 border-b border-slate-800 pb-2">Profile Details</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1.5 block">Display Name</label>
              <input value={settingsForm.displayName} onChange={(e) => setSettingsForm({ ...settingsForm, displayName: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-slate-300 outline-none text-sm focus:border-sky-500 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1.5 block">Username / Email</label>
              <input value={settingsForm.username} onChange={(e) => setSettingsForm({ ...settingsForm, username: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-slate-300 outline-none text-sm focus:border-sky-500 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1.5 block">New Password</label>
              <input type="password" value={settingsForm.password} onChange={(e) => setSettingsForm({ ...settingsForm, password: e.target.value })} placeholder="Type new password" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-slate-300 outline-none text-sm focus:border-sky-500 transition-colors" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5 animate-in slide-in-from-bottom-3 duration-300 delay-100">
          <h3 className="text-md font-bold text-slate-200 border-b border-slate-800 pb-2">Preferences</h3>
          <div>
            <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-2 block">Theme Mode</label>
            <div className="flex bg-slate-950 border border-slate-800 rounded-full p-1 gap-1 max-w-[280px]">
              {[{ id: 'dark', label: 'Dark' }, { id: 'light', label: 'Light' }, { id: 'system', label: 'System' }].map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setTheme(theme.id)}
                  className={`flex-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    themeMode === theme.id ? 'bg-sky-500 text-slate-950 shadow-[0_0_10px_rgba(56,189,248,0.4)]' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-2 block">Hover Assistance</label>
            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-xs text-slate-300 font-medium">Enable Custom Tooltip Hover UI</span>
              <button
                type="button"
                onClick={() => setSettingsForm({ ...settingsForm, tooltipsEnabled: !settingsForm.tooltipsEnabled })}
                className={`w-10 h-5 rounded-full relative transition-colors duration-200 shrink-0 ${
                  settingsForm.tooltipsEnabled ? 'bg-sky-500' : 'bg-slate-800'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  settingsForm.tooltipsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
