import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function CustomSelect({ value, onChange, options, placeholder, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const selectedOpt = options.find((option) => option.value === value);

  return (
    <div className="relative w-full" ref={ref}>
      {label && <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1.5 block">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 outline-none focus:border-sky-500 transition-colors h-[46px]"
      >
        <span className="truncate">{selectedOpt ? selectedOpt.label : placeholder}</span>
        <ChevronDown size={16} className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-1.5 bg-slate-950 border border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden py-1 max-h-48 overflow-y-auto custom-scrollbar">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-800/60 ${
                option.value === value ? 'text-sky-400 bg-sky-500/5 font-bold' : 'text-slate-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CustomFilterSelect({ value, onChange, options, placeholder, label, widthClass }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const selectedOpt = options.find((option) => option.value === value);

  return (
    <div className={`relative ${widthClass || 'w-full'}`} ref={ref}>
      {label && <label className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-1.5 block">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-slate-300 focus:border-sky-500 transition-colors h-[38px]"
      >
        <span className="truncate">{selectedOpt ? selectedOpt.label : placeholder}</span>
        <ChevronDown size={14} className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden py-1 max-h-48 overflow-y-auto custom-scrollbar">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors hover:bg-slate-800/60 ${
                option.value === value ? 'text-sky-400 bg-sky-500/5 font-bold' : 'text-slate-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CustomHeaderSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const selectedOpt = options.find((option) => option.value === value);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="bg-transparent border-none outline-none text-slate-500 font-mono text-[10px] uppercase tracking-widest font-bold cursor-pointer hover:text-slate-300 focus:text-slate-200 flex items-center gap-1 mx-auto"
      >
        <span>{selectedOpt ? selectedOpt.label : placeholder}</span>
        <ChevronDown size={10} className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-1.5 w-44 min-w-max bg-slate-950 border border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden py-1 max-h-48 overflow-y-auto custom-scrollbar">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors hover:bg-slate-800/60 ${
                option.value === value ? 'text-sky-400 bg-sky-500/10 font-bold' : 'text-slate-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CustomFormPlatformSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const options = ['LeetCode', 'GFG', 'HackerRank', 'Codeforces', 'CodeChef', 'InterviewBit', 'Other'];

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-slate-300 text-xs outline-none focus:border-sky-500 transition-colors h-[38px]"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={12} className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden py-1 max-h-40 overflow-y-auto custom-scrollbar">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-slate-800/60 ${
                option === value ? 'text-sky-400 bg-sky-500/10 font-bold' : 'text-slate-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CompactLanguageSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const options = [
    { value: 'cpp', label: 'C++' },
    { value: 'java', label: 'Java' },
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'c', label: 'C' },
    { value: 'other', label: 'Other' },
  ];

  const selected = options.find((option) => option.value === value) || options[0];

  return (
    <div className="relative w-28 shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-slate-950 border border-slate-800 px-2.5 rounded-lg text-slate-300 text-[10px] font-mono tracking-widest uppercase outline-none focus:border-sky-500 transition-colors h-[32px]"
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown size={12} className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 bg-slate-950 border border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden py-1 max-h-40 overflow-y-auto custom-scrollbar w-28">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors hover:bg-slate-800/60 ${
                option.value === value ? 'text-sky-400 bg-sky-500/5 font-bold' : 'text-slate-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
