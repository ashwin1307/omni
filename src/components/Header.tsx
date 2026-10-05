import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  Zap,
  RefreshCw
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';
import { soundFX } from '../utils/audio';

export const Header: React.FC = () => {
  const { 
    deviceFrame, 
    setDeviceFrame, 
    isOffline, 
    toggleOfflineMode, 
    offlineSyncPending, 
    unreadNotificationCount, 
    simulateSampleAlert 
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        {/* Device Switcher & Quick Testing Toolbar (Top utility row) */}
        <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Device:</span>
            <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => { soundFX.playTap(); setDeviceFrame('iphone'); }}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors flex items-center gap-1 ${
                  deviceFrame === 'iphone' ? 'bg-indigo-600 text-white' : 'hover:text-white'
                }`}
                title="iPhone 16 Pro View"
              >
                <Smartphone className="w-3 h-3" />
                iOS
              </button>
              <button
                onClick={() => { soundFX.playTap(); setDeviceFrame('android'); }}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors flex items-center gap-1 ${
                  deviceFrame === 'android' ? 'bg-indigo-600 text-white' : 'hover:text-white'
                }`}
                title="Google Pixel 9 View"
              >
                <Smartphone className="w-3 h-3" />
                Android
              </button>
              <button
                onClick={() => { soundFX.playTap(); setDeviceFrame('responsive'); }}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors flex items-center gap-1 ${
                  deviceFrame === 'responsive' ? 'bg-indigo-600 text-white' : 'hover:text-white'
                }`}
                title="Full Responsive View"
              >
                <Monitor className="w-3 h-3" />
                Fluid
              </button>
            </div>
          </div>

          {/* Offline Mode Switcher & Quick Push Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleOfflineMode}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-colors ${
                isOffline
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
              }`}
              title="Toggle Offline Caching Simulator"
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3 h-3 text-amber-400" />
                  <span>Offline Mode</span>
                  {offlineSyncPending > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </>
              ) : (
                <>
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <span>Cloud Synced</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                soundFX.playTap();
                simulateSampleAlert();
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/50 hover:text-white transition-colors"
              title="Trigger simulated delay or gate push notification"
            >
              <Zap className="w-3 h-3 text-indigo-400" />
              <span className="hidden sm:inline">Simulate</span> Alert
            </button>
          </div>
        </div>

        {/* Main App Bar (Compact Mobile Height ~52px) */}
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <span className="font-bold text-white text-sm tracking-tight">OM</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-white tracking-tight leading-none">
                  OmniBus
                </h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                  Cross-Platform
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                Smart Intercity Transit & Telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Notification Bell with badge */}
            <button
              onClick={() => {
                soundFX.playTap();
                setIsNotifOpen(true);
              }}
              className="relative w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-bounce">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notification Drawer Modal */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
