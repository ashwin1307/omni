import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BusTrip, Passenger } from '../types';
import { 
  X, 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ChevronRight, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface PassengerDetailsModalProps {
  trip: BusTrip;
  onClose: () => void;
  onProceedToCheckout: (data: {
    passengers: Passenger[];
    boardingPoint: string;
    droppingPoint: string;
    contactEmail: string;
    contactPhone: string;
    hasInsurance: boolean;
  }) => void;
}

export const PassengerDetailsModal: React.FC<PassengerDetailsModalProps> = ({
  trip,
  onClose,
  onProceedToCheckout,
}) => {
  const { selectedSeats, userProfile } = useApp();

  // Selected seats mapping to passenger objects
  const selectedSeatObjects = trip.seats.filter((s) => selectedSeats.includes(s.id));

  const [passengers, setPassengers] = useState<Passenger[]>(() => {
    return selectedSeatObjects.map((seat, index) => {
      // Pre-fill with saved passenger if available
      const saved = userProfile.savedPassengers[index];
      return {
        seatId: seat.id,
        seatNumber: seat.number,
        fullName: saved ? saved.fullName : index === 0 ? userProfile.fullName : '',
        age: saved ? saved.age : 28,
        gender: saved ? saved.gender : seat.isLadiesReserved ? 'female' : 'male',
      };
    });
  });

  const [boardingPoint, setBoardingPoint] = useState<string>(
    trip.boardingPoints[0]?.name || ''
  );
  const [droppingPoint, setDroppingPoint] = useState<string>(
    trip.droppingPoints[0]?.name || ''
  );
  const [contactEmail, setContactEmail] = useState<string>(userProfile.email);
  const [contactPhone, setContactPhone] = useState<string>(userProfile.phone);
  const [hasInsurance, setHasInsurance] = useState<boolean>(true);

  const updatePassenger = (index: number, updates: Partial<Passenger>) => {
    setPassengers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  const applySavedPassenger = (passengerIndex: number, saved: typeof userProfile.savedPassengers[0]) => {
    soundFX.playTap();
    updatePassenger(passengerIndex, {
      fullName: saved.fullName,
      age: saved.age,
      gender: saved.gender,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playTap();

    // Basic validation
    for (const p of passengers) {
      if (!p.fullName.trim()) {
        alert(`Please enter the passenger name for seat ${p.seatNumber}`);
        return;
      }
    }

    if (!contactEmail.trim() || !contactPhone.trim()) {
      alert('Please provide contact email and phone number for digital QR ticket delivery.');
      return;
    }

    onProceedToCheckout({
      passengers,
      boardingPoint,
      droppingPoint,
      contactEmail,
      contactPhone,
      hasInsurance,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div>
            <h2 className="text-base font-bold text-white">Passenger & Boarding Details</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {trip.fromCity} → {trip.toCity} · Seats:{' '}
              <strong className="text-indigo-400 font-mono">
                {selectedSeatObjects.map((s) => s.number).join(', ')}
              </strong>
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Passenger Information Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Passenger Information
            </h3>

            {passengers.map((passenger, idx) => (
              <div
                key={passenger.seatId}
                className="bg-slate-950/50 border border-slate-800 rounded-2xl p-3.5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-mono font-bold flex items-center justify-center">
                      {passenger.seatNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">
                      Passenger {idx + 1}
                    </span>
                  </div>

                  {/* Quick-pick saved passenger */}
                  {userProfile.savedPassengers.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-500 mr-1">Quick pick:</span>
                      {userProfile.savedPassengers.map((saved, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => applySavedPassenger(idx, saved)}
                          className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        >
                          {saved.fullName.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={passenger.fullName}
                      onChange={(e) => updatePassenger(idx, { fullName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 mb-1 block">Age</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        required
                        value={passenger.age}
                        onChange={(e) => updatePassenger(idx, { age: parseInt(e.target.value) || 18 })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 mb-1 block">Gender</label>
                      <select
                        value={passenger.gender}
                        onChange={(e) => updatePassenger(idx, { gender: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Boarding & Dropping Points */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              Route Stops
            </h3>

            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-3 space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">
                  Select Boarding Point ({trip.fromCity})
                </label>
                <select
                  value={boardingPoint}
                  onChange={(e) => setBoardingPoint(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {trip.boardingPoints.map((bp) => (
                    <option key={bp.name} value={bp.name}>
                      {bp.time} - {bp.name} ({bp.landmark})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">
                  Select Dropping Point ({trip.toCity})
                </label>
                <select
                  value={droppingPoint}
                  onChange={(e) => setDroppingPoint(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {trip.droppingPoints.map((dp) => (
                    <option key={dp.name} value={dp.name}>
                      {dp.time} - {dp.name} ({dp.landmark})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              Ticket Delivery & Alerts
            </h3>

            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-3 space-y-2.5">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Email (for e-ticket & QR pass)</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Mobile (for SMS & WhatsApp gate updates)</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Travel Protection Add-on */}
          <div
            onClick={() => setHasInsurance(!hasInsurance)}
            className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-colors ${
              hasInsurance
                ? 'bg-indigo-950/30 border-indigo-500/40 text-slate-200'
                : 'bg-slate-950/40 border-slate-800 text-slate-400'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 shrink-0 ${
                hasInsurance
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'border-slate-600 bg-slate-800'
              }`}
            >
              {hasInsurance && <Check className="w-3.5 h-3.5" />}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  OmniTravel Secure™ (₹49 / rider)
                </span>
                <span className="text-[11px] font-mono text-indigo-400 font-semibold">
                  +₹49
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Up to ₹5,00,000 emergency medical cover, luggage theft protection, and zero fee on delay rescheduling.
              </p>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] cursor-pointer"
            >
              <span>Continue to Payment Gateways</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
