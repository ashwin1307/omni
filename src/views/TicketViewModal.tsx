import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { 
  X, 
  Download, 
  Share2, 
  Navigation2, 
  CheckCircle2, 
  QrCode, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  WifiOff, 
  CheckCheck, 
  Sparkles,
  Printer
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface TicketViewModalProps {
  booking: Booking;
  onClose: () => void;
  onTrackTrip?: () => void;
}

export const TicketViewModal: React.FC<TicketViewModalProps> = ({
  booking,
  onClose,
  onTrackTrip,
}) => {
  const { isOffline, verifyBoardingScan, setActiveLiveTrackingTripId, setActiveTab } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [scanResult, setScanResult] = useState<{
    valid: boolean;
    message: string;
    passengerNames: string[];
    seatNumbers: string[];
  } | null>(null);

  // Generate QR Code image data
  useEffect(() => {
    QRCode.toDataURL(booking.qrPayload, {
      width: 220,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [booking.qrPayload]);

  const handleSimulateScan = () => {
    const result = verifyBoardingScan(booking.pnr);
    setScanResult(result);
  };

  const handleTrackBus = () => {
    soundFX.playTap();
    setActiveLiveTrackingTripId(booking.tripId);
    setActiveTab('live-track');
    onClose();
  };

  const handleDownload = () => {
    soundFX.playTap();
    // Simulate pass download
    alert(`Boarding pass for PNR ${booking.pnr} downloaded to offline device storage.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Controls */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <QrCode className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-white">Digital Boarding Pass</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Download Pass"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                soundFX.playTap();
                onClose();
              }}
              className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Boarding Pass Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Offline Availability Banner */}
          <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Offline Verified & Saved</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">256-bit Gate Key</span>
          </div>

          {/* Ticket Pass Card */}
          <div className="bg-white rounded-3xl text-slate-900 overflow-hidden shadow-xl border border-slate-200 relative">
            {/* Header / Brand */}
            <div className="p-4 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-200">
                    INTERCITY BOARDING PASS
                  </span>
                  <h3 className="text-base font-extrabold tracking-tight">
                    {booking.operatorName}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] block text-indigo-200 font-mono">PNR CODE</span>
                  <span className="text-sm font-bold font-mono tracking-wider bg-white/10 px-2 py-0.5 rounded border border-white/20">
                    {booking.pnr}
                  </span>
                </div>
              </div>

              <div className="text-xs text-indigo-100 flex items-center gap-2">
                <span>{booking.busType}</span>
                <span>·</span>
                <span className="font-mono">{booking.busNumber}</span>
              </div>
            </div>

            {/* Route & Times */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black tracking-tight text-slate-900">
                    {booking.departureTime}
                  </span>
                  <p className="text-xs font-semibold text-slate-600">{booking.fromCity}</p>
                </div>

                <div className="flex flex-col items-center px-2">
                  <span className="text-[10px] text-slate-600 font-medium">{booking.duration}</span>
                  <div className="w-16 h-0.5 bg-slate-300 relative my-1">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-600" />
                  </div>
                  <span className="text-[9px] text-emerald-800 font-semibold uppercase">Direct Non-Stop</span>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black tracking-tight text-slate-900">
                    {booking.arrivalTime}
                  </span>
                  <p className="text-xs font-semibold text-slate-600">{booking.toCity}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-600 block uppercase font-medium">Boarding Point</span>
                  <span className="font-semibold text-slate-800 line-clamp-1">{booking.boardingPoint}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-600 block uppercase font-medium">Terminal Platform</span>
                  <span className="font-bold text-indigo-700 font-mono">{booking.platformNumber}</span>
                </div>
              </div>
            </div>

            {/* Tear Line Decorator */}
            <div className="relative h-6 bg-slate-50 flex items-center justify-between px-2 overflow-hidden">
              <div className="w-5 h-5 rounded-full bg-slate-900 -ml-4" />
              <div className="border-t-2 border-dashed border-slate-300 flex-1 mx-2" />
              <div className="w-5 h-5 rounded-full bg-slate-900 -mr-4" />
            </div>

            {/* Seat & Passenger Specs */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] text-slate-600 uppercase font-semibold block">Date</span>
                <span className="text-xs font-bold text-slate-800 font-mono">{booking.departureDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-600 uppercase font-semibold block">Seat(s)</span>
                <span className="text-sm font-extrabold text-indigo-600 font-mono">
                  {booking.selectedSeatNumbers.join(', ')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-600 uppercase font-semibold block">Status</span>
                <span
                  className={`text-xs font-bold uppercase inline-block px-1.5 py-0.5 rounded ${
                    booking.bookingStatus === 'boarded'
                      ? 'bg-emerald-100 text-emerald-800'
                      : booking.bookingStatus === 'cancelled'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  {booking.bookingStatus}
                </span>
              </div>
            </div>

            {/* QR Code Presentation */}
            <div className="p-5 flex flex-col items-center justify-center bg-white">
              {qrDataUrl ? (
                <div className="p-2 border-2 border-slate-900 rounded-2xl bg-white shadow-sm">
                  <img
                    src={qrDataUrl}
                    alt="Digital Boarding QR Code"
                    className="w-40 h-40 object-contain"
                  />
                </div>
              ) : (
                <div className="w-40 h-40 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  Generating QR...
                </div>
              )}

              <p className="text-[11px] text-slate-500 font-medium text-center mt-2">
                Present this QR code to the coach attendant at gate check-in
              </p>
              <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                Ref: {booking.paymentId} · 256-bit Secure
              </span>
            </div>
          </div>

          {/* Conductor Gate Scan Simulator Action */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Conductor Scanner Simulator</h4>
                  <p className="text-[10px] text-slate-400">Test gate turnstile & attendant scan verification</p>
                </div>
              </div>
              <button
                onClick={handleSimulateScan}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all active:scale-95 shadow cursor-pointer"
              >
                Scan Ticket
              </button>
            </div>

            {scanResult && (
              <div
                className={`p-2.5 rounded-xl text-xs border animate-in fade-in duration-200 ${
                  scanResult.valid
                    ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {scanResult.valid ? (
                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <X className="w-4 h-4 text-rose-400" />
                  )}
                  <span>{scanResult.message}</span>
                </div>
                {scanResult.valid && (
                  <p className="text-[11px] text-emerald-300/80">
                    Passengers verified:{' '}
                    <strong>{scanResult.passengerNames.join(', ')}</strong> | Seats:{' '}
                    <strong>{scanResult.seatNumbers.join(', ')}</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0">
          <button
            onClick={handleTrackBus}
            className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            <Navigation2 className="w-4 h-4" />
            <span>Track Bus Live Telemetry</span>
          </button>
        </div>
      </div>
    </div>
  );
};
