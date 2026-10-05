import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, AlertTriangle, Clock, CheckCircle2, X } from 'lucide-react';

export const PushBanner: React.FC = () => {
  const { activeBannerNotification, dismissBannerNotification, setActiveTab, setViewingTicket, bookings } = useApp();

  if (!activeBannerNotification) return null;

  const getIcon = () => {
    switch (activeBannerNotification.type) {
      case 'delay':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'departure':
      case 'gate':
        return <Clock className="w-4 h-4 text-sky-400" />;
      case 'booking':
      case 'refund':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-400" />;
    }
  };

  const handleClick = () => {
    if (activeBannerNotification.bookingPnr) {
      const match = bookings.find((b) => b.pnr === activeBannerNotification.bookingPnr);
      if (match) {
        setViewingTicket(match);
      } else {
        setActiveTab('my-trips');
      }
    } else {
      setActiveTab('live-track');
    }
    dismissBannerNotification();
  };

  return (
    <div className="absolute top-2 left-3 right-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div 
        onClick={handleClick}
        className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl rounded-2xl p-3.5 flex items-start gap-3 cursor-pointer hover:border-slate-600 transition-all text-left"
      >
        <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="text-xs font-semibold text-white truncate">
              {activeBannerNotification.title}
            </span>
            <span className="text-[10px] text-slate-400 shrink-0">
              {activeBannerNotification.timestamp}
            </span>
          </div>
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {activeBannerNotification.message}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            dismissBannerNotification();
          }}
          className="text-slate-400 hover:text-white p-1 rounded-lg shrink-0 -mr-1 -mt-1"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
