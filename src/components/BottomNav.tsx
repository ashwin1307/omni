import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Ticket, Navigation2, User } from 'lucide-react';
import { soundFX } from '../utils/audio';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, bookings } = useApp();

  const activeBookingsCount = bookings.filter((b) => b.bookingStatus === 'confirmed').length;

  const handleTabClick = (tab: typeof activeTab) => {
    soundFX.playTap();
    setActiveTab(tab);
  };

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1">
      <div className="grid grid-cols-4 items-center h-14 max-w-lg mx-auto">
        {/* Tab 1: Explore / Search */}
        <button
          onClick={() => handleTabClick('search')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
            activeTab === 'search' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Search routes"
        >
          <Search className={`w-5 h-5 transition-transform ${activeTab === 'search' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Search</span>
          {activeTab === 'search' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
          )}
        </button>

        {/* Tab 2: My Trips */}
        <button
          onClick={() => handleTabClick('my-trips')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
            activeTab === 'my-trips' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="My booked trips"
        >
          <div className="relative">
            <Ticket className={`w-5 h-5 transition-transform ${activeTab === 'my-trips' ? 'scale-110' : ''}`} />
            {activeBookingsCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[8px] font-bold flex items-center justify-center">
                {activeBookingsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1">My Trips</span>
          {activeTab === 'my-trips' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
          )}
        </button>

        {/* Tab 3: Live Telemetry Tracking */}
        <button
          onClick={() => handleTabClick('live-track')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
            activeTab === 'live-track' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Real-time bus tracking"
        >
          <div className="relative">
            <Navigation2 className={`w-5 h-5 transition-transform ${activeTab === 'live-track' ? 'scale-110' : ''}`} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-slate-950" />
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1">Live Track</span>
          {activeTab === 'live-track' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
          )}
        </button>

        {/* Tab 4: Wallet & Profile */}
        <button
          onClick={() => handleTabClick('profile')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
            activeTab === 'profile' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="User profile and wallet"
        >
          <User className={`w-5 h-5 transition-transform ${activeTab === 'profile' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Profile</span>
          {activeTab === 'profile' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
          )}
        </button>
      </div>
    </nav>
  );
};
