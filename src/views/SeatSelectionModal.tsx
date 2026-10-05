import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BusTrip, Seat, SeatDeck } from '../types';
import { 
  X, 
  ChevronRight, 
  Sparkles, 
  Info, 
  User, 
  Wifi, 
  Zap, 
  Coffee, 
  ShieldCheck 
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface SeatSelectionModalProps {
  trip: BusTrip;
  onClose: () => void;
  onProceedToPassengers: () => void;
}

export const SeatSelectionModal: React.FC<SeatSelectionModalProps> = ({
  trip,
  onClose,
  onProceedToPassengers,
}) => {
  const { selectedSeats, setSelectedSeats } = useApp();
  const [activeDeck, setActiveDeck] = useState<SeatDeck>('lower');

  const toggleSeat = (seat: Seat) => {
    if (seat.isBooked) {
      soundFX.playTap();
      return;
    }

    soundFX.playTap();
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seat.id));
    } else {
      if (selectedSeats.length >= 6) {
        alert('You can select a maximum of 6 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  const selectedSeatObjects = trip.seats.filter((s) => selectedSeats.includes(s.id));
  const subtotal = selectedSeatObjects.reduce((acc, curr) => acc + curr.price, 0);

  // Group seats by deck and row
  const deckSeats = trip.seats.filter((s) => s.deck === activeDeck);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Select Your Seats</h2>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-medium">
                {trip.operator.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {trip.fromCity} → {trip.toCity} · {trip.departureTime}
            </p>
          </div>
          <button
            onClick={() => {
              soundFX.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Deck Switcher (If bus has upper deck) */}
        {trip.hasUpperDeck && (
          <div className="p-3 bg-slate-950/40 border-b border-slate-800 flex items-center justify-center">
            <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 w-full max-w-xs">
              <button
                onClick={() => {
                  soundFX.playTap();
                  setActiveDeck('lower');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeDeck === 'lower'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Lower Deck
              </button>
              <button
                onClick={() => {
                  soundFX.playTap();
                  setActiveDeck('upper');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeDeck === 'upper'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Upper Deck (Sleeper)
              </button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="px-4 py-2.5 bg-slate-950/20 border-b border-slate-800/60 grid grid-cols-4 gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded border border-slate-600 bg-slate-800" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-indigo-600 border border-indigo-400" />
            <span className="text-indigo-300 font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-slate-800/50 border border-slate-700/50 opacity-40" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-pink-950/60 border border-pink-500/60 text-pink-400" />
            <span className="text-pink-400">Ladies</span>
          </div>
        </div>

        {/* Bus Interior Seat Grid */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
          {/* Driver Cabin Area */}
          <div className="w-full max-w-xs mb-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-2.5 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                🚌
              </div>
              <span className="text-[11px] font-medium text-slate-400">Driver Cabin</span>
            </div>
            <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 text-[10px] font-semibold border border-slate-700">
              Steer
            </div>
          </div>

          {/* Seat Layout (2+1 or 2+2) */}
          <div className="w-full max-w-xs bg-slate-950/40 border border-slate-800/80 rounded-3xl p-4 shadow-inner">
            <div className="text-center text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-3">
              Front of Coach
            </div>

            <div className="space-y-3">
              {/* Render rows */}
              {[1, 2, 3, 4, 5, 6].map((rowNum) => {
                const prefix = activeDeck === 'lower' ? 'L' : 'U';
                const seatA = deckSeats.find((s) => s.id === `${prefix}${rowNum}A`);
                const seatB = deckSeats.find((s) => s.id === `${prefix}${rowNum}B`);
                const seatC = deckSeats.find((s) => s.id === `${prefix}${rowNum}C`);

                return (
                  <div key={rowNum} className="flex items-center justify-between gap-3">
                    {/* Left Single Seat (Aisle on right) */}
                    <div className="w-16">
                      {seatA && (
                        <SeatItem
                          seat={seatA}
                          isSelected={selectedSeats.includes(seatA.id)}
                          onToggle={() => toggleSeat(seatA)}
                        />
                      )}
                    </div>

                    {/* Gangway / Walking Aisle */}
                    <div className="flex-1 text-center">
                      <span className="text-[9px] text-slate-600 font-mono select-none">
                        R{rowNum}
                      </span>
                    </div>

                    {/* Right Double Seats */}
                    <div className="flex items-center gap-2">
                      {seatB && (
                        <div className="w-16">
                          <SeatItem
                            seat={seatB}
                            isSelected={selectedSeats.includes(seatB.id)}
                            onToggle={() => toggleSeat(seatB)}
                          />
                        </div>
                      )}
                      {seatC && (
                        <div className="w-16">
                          <SeatItem
                            seat={seatC}
                            isSelected={selectedSeats.includes(seatC.id)}
                            onToggle={() => toggleSeat(seatC)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center text-[10px] uppercase font-semibold text-slate-500 tracking-wider mt-4">
              Rear of Coach
            </div>
          </div>
        </div>

        {/* Sticky Bottom Summary Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-slate-400">
                {selectedSeats.length === 0 ? (
                  'Select at least 1 seat'
                ) : (
                  <span>
                    Selected ({selectedSeats.length}):{' '}
                    <strong className="text-white font-mono">
                      {selectedSeatObjects.map((s) => s.number).join(', ')}
                    </strong>
                  </span>
                )}
              </div>
              <div className="text-lg font-bold text-white font-mono">
                ₹{subtotal.toFixed(2)}
              </div>
            </div>

            <button
              disabled={selectedSeats.length === 0}
              onClick={() => {
                soundFX.playTap();
                onProceedToPassengers();
              }}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Passenger Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Seat Button Subcomponent
const SeatItem: React.FC<{
  seat: Seat;
  isSelected: boolean;
  onToggle: () => void;
}> = ({ seat, isSelected, onToggle }) => {
  const isSleeper = seat.type === 'sleeper';

  if (seat.isBooked) {
    return (
      <div
        className={`h-11 rounded-xl flex flex-col items-center justify-center border text-[10px] font-mono cursor-not-allowed select-none ${
          seat.bookedGender === 'female'
            ? 'bg-pink-950/30 border-pink-900/40 text-pink-500/50'
            : 'bg-slate-900/60 border-slate-800/80 text-slate-600'
        }`}
      >
        <span>{seat.number}</span>
        <span className="text-[8px] text-slate-600">
          {seat.bookedGender === 'female' ? 'Lady' : 'Booked'}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={onToggle}
      className={`w-full h-11 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer relative ${
        isSelected
          ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30 scale-105'
          : seat.isLadiesReserved
          ? 'bg-pink-950/40 border-pink-600/60 text-pink-300 hover:border-pink-400'
          : 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
      }`}
    >
      <div className="flex items-center gap-1">
        <span className="text-[11px] font-bold font-mono">{seat.number}</span>
        {seat.isLadiesReserved && !isSelected && (
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
        )}
      </div>
      <span className="text-[9px] font-mono opacity-80">₹{seat.price}</span>

      {/* Berth pillow accent for sleepers */}
      {isSleeper && (
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white/20" />
      )}
    </button>
  );
};
