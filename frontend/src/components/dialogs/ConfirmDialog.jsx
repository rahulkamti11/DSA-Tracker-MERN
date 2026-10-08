export default function ConfirmDialog({ confirmModal, setConfirmModal }) {
  if (!confirmModal.open) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
        <h2 className="text-lg font-bold text-slate-100 mb-3">{confirmModal.title}</h2>
        <p className="text-sm text-slate-400 mb-6">{confirmModal.message}</p>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => setConfirmModal({ open: false, title: '', message: '', onConfirm: null })} className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200 transition-colors">Cancel</button>
          <button
            type="button"
            onClick={() => {
              if (confirmModal.onConfirm) confirmModal.onConfirm();
              setConfirmModal({ open: false, title: '', message: '', onConfirm: null });
            }}
            className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-sky-500 hover:bg-sky-400 transition-colors shadow-[0_0_15px_rgba(56,189,248,0.3)]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
