import React from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { deviceFrame } = useApp();

  if (deviceFrame === 'responsive') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start">
        <div className="w-full max-w-4xl min-h-screen flex flex-col bg-slate-900 border-x border-slate-800 shadow-2xl relative">
          {children}
        </div>
      </div>
    );
  }

  const isIphone = deviceFrame === 'iphone';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-2 sm:p-6 overflow-x-hidden">
      {/* Outer Phone Shell */}
      <div
        className={`relative w-full max-w-[412px] h-[860px] max-h-[95vh] rounded-[48px] bg-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_12px_#1e293b,0_0_0_14px_#0f172a] border-4 border-slate-800 flex flex-col overflow-hidden transition-all duration-300`}
      >
        {/* Mobile Status Bar */}
        <div className="relative z-40 bg-slate-950 text-slate-300 px-6 pt-3 pb-2 flex items-center justify-between text-xs select-none shrink-0">
          {/* Carrier Clock */}
          <span className="font-semibold tracking-tight text-[13px] text-white">
            09:41
          </span>

          {/* Notch / Dynamic Island / Punch Hole */}
          {isIphone ? (
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 h-6 w-28 bg-black rounded-full border border-slate-800/60 flex items-center justify-between px-2 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900/80 border border-slate-800" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-950 border border-indigo-700/50" />
              </div>
            </div>
          ) : (
            <div className="absolute left-1/2 -translate-x-1/2 top-3 w-3.5 h-3.5 rounded-full bg-black border border-slate-800" />
          )}

          {/* Status Icons: Signal, Wifi, Battery */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3 h-3 text-slate-300" />
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <span>98%</span>
              <BatteryMedium className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Inner Phone Screen Content */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-900 overflow-y-auto no-scrollbar relative">
          {children}
        </div>

        {/* Bottom System Home Bar (iOS indicator or Android bar) */}
        <div className="bg-slate-950 pt-1 pb-2 flex items-center justify-center shrink-0">
          {isIphone ? (
            <div className="w-32 h-1 bg-slate-600 rounded-full" />
          ) : (
            <div className="flex items-center justify-center gap-8 py-0.5">
              <div className="w-3 h-3 border-2 border-slate-500 rounded-sm" />
              <div className="w-3 h-3 border-2 border-slate-500 rounded-full" />
              <div className="w-3.5 h-3 border-2 border-slate-500 rotate-45" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
