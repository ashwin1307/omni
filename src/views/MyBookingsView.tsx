import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { 
  Ticket, 
  QrCode, 
  Navigation2, 
  XCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  WifiOff, 
  Search,
  ExternalLink
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { CancellationModal } from './CancellationModal';

export const MyBookingsView: React.FC = () => {
  const { 
    bookings, 
    setViewingTicket, 
    setActiveLiveTrackingTripId, 
    setActiveTab, 
    isOffline 
  } = useApp();

  const [filter, setFilter] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'upcoming') return b.bookingStatus === 'confirmed' || b.bookingStatus === 'boarded';
    if (filter === 'completed') return b.bookingStatus === 'completed';
    if (filter === 'cancelled') return b.bookingStatus === 'cancelled';
    return true;
  });

  const handleOpenTicket = (booking: Booking) => {
    soundFX.playTap();
    setViewingTicket(booking);
  };

  const handleTrack = (booking: Booking) => {
    soundFX.playTap();
    setActiveLiveTrackingTripId(booking.tripId);
    setActiveTab('live-track');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 p-4 space-y-4">
      {/* Title & Filter bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">My Bookings & Passes</h2>
          <p className="text-xs text-slate-400">Manage active trips, digital passes, and refunds</p>
        </div>

        {isOffline && (
          <span className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg">
            <WifiOff className="w-3 h-3" />
            Offline Ready
          </span>
        )}
      </div>

      {/* Segmented Filter Bar */}
      <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => { soundFX.playTap(); setFilter('upcoming'); }}
          className={`flex-1 py-2 rounded-xl font-medium transition-all ${
            filter === 'upcoming'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Upcoming ({bookings.filter((b) => b.bookingStatus === 'confirmed' || b.bookingStatus === 'boarded').length})
        </button>
        <button
          onClick={() => { soundFX.playTap(); setFilter('completed'); }}
          className={`flex-1 py-2 rounded-xl font-medium transition-all ${
            filter === 'completed'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Completed ({bookings.filter((b) => b.bookingStatus === 'completed').length})
        </button>
        <button
          onClick={() => { soundFX.playTap(); setFilter('cancelled'); }}
          className={`flex-1 py-2 rounded-xl font-medium transition-all ${
            filter === 'cancelled'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Cancelled ({bookings.filter((b) => b.bookingStatus === 'cancelled').length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {filteredBookings.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <Ticket className="w-12 h-12 mx-auto opacity-20" />
            <div>
              <p className="text-sm font-semibold text-slate-400">No {filter} trips found</p>
              <p className="text-xs text-slate-500 mt-0.5">Explore popular routes and book your next journey.</p>
            </div>
            <button
              onClick={() => { soundFX.playTap(); setActiveTab('search'); }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow hover:bg-indigo-500 transition-colors"
            >
              Search Buses
            </button>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 hover:border-slate-700 transition-all shadow-md relative overflow-hidden"
            >
              {/* Top Row: Operator & PNR & Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{booking.operatorName}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span>{booking.busType}</span>
                    <span>·</span>
                    <span className="font-mono text-indigo-400">PNR: {booking.pnr}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    booking.bookingStatus === 'confirmed'
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                      : booking.bookingStatus === 'boarded'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : booking.bookingStatus === 'cancelled'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {booking.bookingStatus}
                </span>
              </div>

              {/* Route & Times */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-base font-bold text-white font-mono">{booking.departureTime}</span>
                  <p className="text-[11px] text-slate-400 font-medium">{booking.fromCity}</p>
                  <span className="text-[10px] text-slate-500 block">{booking.departureDate}</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400">{booking.duration}</span>
                  <div className="w-12 h-0.5 bg-slate-700 relative my-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 absolute -top-0.5 left-1/2 -translate-x-1/2" />
                  </div>
                  <span className="text-[9px] text-emerald-400 font-mono">Platform {booking.platformNumber.replace(/\D/g, '') || '14'}</span>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-white font-mono">{booking.arrivalTime}</span>
                  <p className="text-[11px] text-slate-400 font-medium">{booking.toCity}</p>
                  <span className="text-[10px] text-slate-500 block">Seats: {booking.selectedSeatNumbers.join(', ')}</span>
                </div>
              </div>

              {/* Passengers & Refund Info */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <div>
                  <span className="text-slate-300">
                    {booking.passengers.map((p) => p.fullName).join(', ')}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    Paid ₹{booking.totalAmount.toFixed(2)} via {booking.paymentMethod.toUpperCase()}
                  </span>
                </div>

                {booking.cancellationRefund && (
                  <div className="text-right">
                    <span className="text-emerald-400 font-mono font-bold block">
                      +₹{booking.cancellationRefund.refundAmount.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Refunded to {booking.cancellationRefund.refundedTo}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => handleOpenTicket(booking)}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow active:scale-95"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Digital QR Pass</span>
                </button>

                {booking.bookingStatus !== 'cancelled' && (
                  <button
                    onClick={() => handleTrack(booking)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors border border-slate-700"
                    title="Live Tracking"
                  >
                    <Navigation2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Track</span>
                  </button>
                )}

                {booking.bookingStatus === 'confirmed' && (
                  <button
                    onClick={() => {
                      soundFX.playTap();
                      setCancellingBooking(booking);
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950 text-rose-300 border border-rose-800/40 text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cancellation Modal */}
      {cancellingBooking && (
        <CancellationModal
          booking={cancellingBooking}
          onClose={() => setCancellingBooking(null)}
          onSuccess={() => setCancellingBooking(null)}
        />
      )}
    </div>
  );
};
