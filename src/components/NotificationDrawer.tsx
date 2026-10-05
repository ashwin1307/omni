import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  X, 
  CheckCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Radio, 
  Volume2, 
  Smartphone,
  Info
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    markAllNotificationsAsRead, 
    markNotificationAsRead, 
    simulateSampleAlert,
    setViewingTicket,
    bookings,
    setActiveTab
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'alerts' | 'trips'>('all');
  const [notifyPreferences, setNotifyPreferences] = useState({
    delays: true,
    gateChanges: true,
    departureReminder: true,
    soundVibrate: true,
  });

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'alerts') return item.type === 'delay' || item.type === 'gate';
    if (activeFilter === 'trips') return item.type === 'departure' || item.type === 'booking' || item.type === 'refund';
    return true;
  });

  const handleNotificationClick = (item: typeof notifications[0]) => {
    markNotificationAsRead(item.id);
    if (item.bookingPnr) {
      const match = bookings.find((b) => b.pnr === item.bookingPnr);
      if (match) {
        setViewingTicket(match);
        onClose();
        return;
      }
    }
    if (item.type === 'delay') {
      setActiveTab('live-track');
      onClose();
    }
  };

  const togglePref = (key: keyof typeof notifyPreferences) => {
    soundFX.playTap();
    setNotifyPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Travel Alerts & Notifications</h2>
              <p className="text-[11px] text-slate-400">Real-time schedule changes & gate updates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-2">
          {/* Segmented Filter */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-xl text-xs">
            <button
              onClick={() => { soundFX.playTap(); setActiveFilter('all'); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => { soundFX.playTap(); setActiveFilter('alerts'); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                activeFilter === 'alerts' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Delays & Gates
            </button>
            <button
              onClick={() => { soundFX.playTap(); setActiveFilter('trips'); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                activeFilter === 'trips' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Trips
            </button>
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">No notifications in this filter</p>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer text-left relative ${
                  item.read
                    ? 'bg-slate-800/40 border-slate-800/60 opacity-80'
                    : 'bg-slate-800/80 border-indigo-500/30 shadow-sm'
                } hover:border-slate-600`}
              >
                {!item.read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-400 ring-4 ring-indigo-400/20" />
                )}

                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      item.type === 'delay'
                        ? 'bg-amber-500/10 text-amber-400'
                        : item.type === 'gate'
                        ? 'bg-sky-500/10 text-sky-400'
                        : item.type === 'refund' || item.type === 'booking'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-indigo-500/10 text-indigo-400'
                    }`}
                  >
                    {item.type === 'delay' && <AlertTriangle className="w-3.5 h-3.5" />}
                    {item.type === 'gate' && <Radio className="w-3.5 h-3.5" />}
                    {(item.type === 'departure') && <Clock className="w-3.5 h-3.5" />}
                    {(item.type === 'refund' || item.type === 'booking') && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {item.type === 'system' && <Info className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-slate-200">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed mb-1.5">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{item.timestamp}</span>
                      {item.bookingPnr && (
                        <>
                          <span>·</span>
                          <span className="font-mono text-indigo-400">PNR: {item.bookingPnr}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Live Simulator & Preferences Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 space-y-2">
          {/* Quick simulation button */}
          <div className="flex items-center justify-between bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-2.5">
            <div>
              <p className="text-xs font-semibold text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Live Alert Simulation
              </p>
              <p className="text-[10px] text-indigo-300/80">Trigger real-time push delay or gate changes</p>
            </div>
            <button
              onClick={simulateSampleAlert}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md active:scale-95"
            >
              Simulate Push
            </button>
          </div>

          {/* Quick toggles */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => togglePref('delays')}
              className={`p-2 rounded-xl border flex items-center justify-between transition-colors ${
                notifyPreferences.delays
                  ? 'bg-slate-800/80 border-indigo-500/30 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>Delay Broadcasts</span>
              <span className={`w-2 h-2 rounded-full ${notifyPreferences.delays ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            </button>
            <button
              onClick={() => togglePref('gateChanges')}
              className={`p-2 rounded-xl border flex items-center justify-between transition-colors ${
                notifyPreferences.gateChanges
                  ? 'bg-slate-800/80 border-indigo-500/30 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>Gate & Platform</span>
              <span className={`w-2 h-2 rounded-full ${notifyPreferences.gateChanges ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
