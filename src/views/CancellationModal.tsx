import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { 
  X, 
  AlertTriangle, 
  Wallet, 
  CreditCard, 
  Check, 
  Info, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface CancellationModalProps {
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

export const CancellationModal: React.FC<CancellationModalProps> = ({
  booking,
  onClose,
  onSuccess,
}) => {
  const { cancelBooking } = useApp();

  const [refundToWallet, setRefundToWallet] = useState(true);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(
    booking.passengers.map((p) => p.seatId)
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleSeat = (seatId: string) => {
    soundFX.playTap();
    if (selectedSeatIds.includes(seatId)) {
      if (selectedSeatIds.length === 1) {
        alert('You must select at least 1 seat to cancel.');
        return;
      }
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seatId));
    } else {
      setSelectedSeatIds([...selectedSeatIds, seatId]);
    }
  };

  // Calculations
  const seatPortion = booking.totalAmount / booking.passengers.length;
  const subtotal = seatPortion * selectedSeatIds.length;
  const fee = Math.round(subtotal * 0.1 * 100) / 100;
  const estimatedRefund = Math.round((subtotal - fee) * 100) / 100;

  const handleConfirmCancel = () => {
    soundFX.playTap();
    setIsProcessing(true);

    setTimeout(() => {
      cancelBooking(booking.id, selectedSeatIds, refundToWallet);
      setIsProcessing(false);
      onSuccess();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Cancel Booking & Refund</h2>
              <p className="text-xs text-slate-400 font-mono">PNR: {booking.pnr}</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFX.playTap();
              onClose();
            }}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Policy Banner */}
          <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-3 flex items-start gap-2.5 text-amber-200">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-white block">Standard Cancellation Policy:</span>
              <p className="text-[11px] text-amber-300/90 leading-relaxed">
                Cancelling more than 12 hours prior to scheduled departure qualifies for a 90% refund (10% operator cancellation fee applies).
              </p>
            </div>
          </div>

          {/* Select seats to cancel */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] block">
              Select Passenger Seats to Cancel
            </label>
            <div className="space-y-1.5">
              {booking.passengers.map((passenger) => {
                const isSelected = selectedSeatIds.includes(passenger.seatId);
                return (
                  <div
                    key={passenger.seatId}
                    onClick={() => toggleSeat(passenger.seatId)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-rose-950/30 border-rose-500/40 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-slate-800 text-white font-mono font-bold text-xs flex items-center justify-center border border-slate-700">
                        {passenger.seatNumber}
                      </span>
                      <span className="font-medium text-slate-200">{passenger.fullName}</span>
                    </div>

                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected
                          ? 'bg-rose-600 border-rose-500 text-white'
                          : 'border-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Refund Destination */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] block">
              Select Refund Destination
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => { soundFX.playTap(); setRefundToWallet(true); }}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  refundToWallet
                    ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Wallet className="w-4 h-4 text-indigo-400 mb-1" />
                <span className="font-bold text-xs block text-white">OmniWallet</span>
                <span className="text-[10px] text-emerald-400 block font-medium">Instant Credit · ₹0 Fee</span>
              </div>

              <div
                onClick={() => { soundFX.playTap(); setRefundToWallet(false); }}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  !refundToWallet
                    ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-slate-400 mb-1" />
                <span className="font-bold text-xs block text-white">Bank Account / UPI</span>
                <span className="text-[10px] text-slate-500 block">Takes 3-5 bank days</span>
              </div>
            </div>
          </div>

          {/* Refund Breakdown */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Paid Fare for Selected Seats</span>
              <span className="font-mono text-slate-200">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Cancellation Charge (10%)</span>
              <span className="font-mono text-rose-400">-₹{fee.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
              <span>Net Refund Amount</span>
              <span className="font-mono text-emerald-400 text-base">
                ₹{estimatedRefund.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Confirm */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
          <button
            onClick={handleConfirmCancel}
            disabled={isProcessing || selectedSeatIds.length === 0}
            className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span>Processing Cancellation & Refund...</span>
            ) : (
              <span>Confirm Cancellation · Refund ₹{estimatedRefund.toFixed(2)}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
