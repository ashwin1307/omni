/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DeviceFrame } from './components/DeviceFrame';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { PushBanner } from './components/PushBanner';
import { SearchBookView } from './views/SearchBookView';
import { MyBookingsView } from './views/MyBookingsView';
import { LiveTrackingView } from './views/LiveTrackingView';
import { ProfileWalletView } from './views/ProfileWalletView';
import { TicketViewModal } from './views/TicketViewModal';

const MainScreen: React.FC = () => {
  const { activeTab, viewingTicket, setViewingTicket } = useApp();

  return (
    <DeviceFrame>
      <div className="flex-1 flex flex-col min-h-full relative overflow-x-hidden">
        {/* Real-time Push Notification Banner */}
        <PushBanner />

        {/* Top Header with Device Switcher & Offline Toggle */}
        <Header />

        {/* Dynamic Tab Body */}
        <main className="flex-1 flex flex-col min-h-0 relative">
          {activeTab === 'search' && <SearchBookView />}
          {activeTab === 'my-trips' && <MyBookingsView />}
          {activeTab === 'live-track' && <LiveTrackingView />}
          {activeTab === 'profile' && <ProfileWalletView />}
        </main>

        {/* Bottom Tab Navigation Bar */}
        <BottomNav />

        {/* Full-Screen Digital QR Boarding Pass Modal (Global) */}
        {viewingTicket && (
          <TicketViewModal
            booking={viewingTicket}
            onClose={() => setViewingTicket(null)}
          />
        )}
      </div>
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainScreen />
    </AppProvider>
  );
}
