import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BusTrip, Booking, Passenger } from '../types';
import { POPULAR_CITIES } from '../data/mockBuses';
import { 
  ArrowRightLeft, 
  Calendar, 
  MapPin, 
  Search, 
  Star, 
  Wifi, 
  Zap, 
  Coffee, 
  Sparkles, 
  Filter, 
  Clock, 
  ChevronRight, 
  ShieldCheck,
  Leaf
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { SeatSelectionModal } from './SeatSelectionModal';
import { PassengerDetailsModal } from './PassengerDetailsModal';
import { CheckoutModal } from './CheckoutModal';
import { TicketViewModal } from './TicketViewModal';
import heroBusImage from '../assets/images/bus_luxury_coach_1791194793384.jpg';

export const SearchBookView: React.FC = () => {
  const { trips, selectedTrip, setSelectedTrip, setViewingTicket } = useApp();

  const [fromCity, setFromCity] = useState('Bengaluru');
  const [toCity, setToCity] = useState('Chennai');
  const [departureDate, setDepartureDate] = useState('2026-10-06');
  const [filterType, setFilterType] = useState<'all' | 'sleeper' | 'ev' | 'top-rated'>('all');

  // Modal flow state
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Temporary booking staging data between steps
  const [checkoutData, setCheckoutData] = useState<{
    passengers: Passenger[];
    boardingPoint: string;
    droppingPoint: string;
    hasInsurance: boolean;
  } | null>(null);

  const [justBookedTicket, setJustBookedTicket] = useState<Booking | null>(null);

  const handleSwapCities = () => {
    soundFX.playTap();
    setFromCity(toCity);
    setToCity(fromCity);
  };

  // Filter buses
  const filteredBuses = trips.filter((trip) => {
    const matchRoute =
      (trip.fromCity.toLowerCase().includes(fromCity.toLowerCase()) || fromCity === 'All') &&
      (trip.toCity.toLowerCase().includes(toCity.toLowerCase()) || toCity === 'All');

    if (!matchRoute) return true; // Show matches or fallback gracefully

    if (filterType === 'sleeper') {
      return trip.operator.busType.toLowerCase().includes('sleeper');
    }
    if (filterType === 'ev') {
      return trip.operator.badge?.toLowerCase().includes('ev') || trip.operator.badge?.toLowerCase().includes('emission');
    }
    if (filterType === 'top-rated') {
      return trip.operator.rating >= 4.8;
    }
    return true;
  });

  const handleStartBooking = (trip: BusTrip) => {
    soundFX.playTap();
    setSelectedTrip(trip);
    setIsSeatModalOpen(true);
  };

  const handleProceedToPassengers = () => {
    setIsSeatModalOpen(false);
    setIsPassengerModalOpen(true);
  };

  const handleProceedToCheckout = (data: {
    passengers: Passenger[];
    boardingPoint: string;
    droppingPoint: string;
    contactEmail: string;
    contactPhone: string;
    hasInsurance: boolean;
  }) => {
    setCheckoutData(data);
    setIsPassengerModalOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setIsCheckoutModalOpen(false);
    setJustBookedTicket(newBooking);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Hero Visual Banner with Generated Bus Asset */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden shrink-0">
        <img
          src={heroBusImage}
          alt="Luxury Electric Coach Highway"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        {/* Measured Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/30" />

        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Intercity Transit</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
            Seamless Bus Booking & Live Telemetry
          </h2>
          <p className="text-xs text-slate-300 max-w-sm mt-0.5">
            Ultra-sleeper coaches, digital QR ticketing, and real-time highway GPS tracking.
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Route Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="space-y-2 relative">
            {/* From City */}
            <div className="relative">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block">
                From City
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-indigo-400 absolute left-3 pointer-events-none" />
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-9 pr-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                >
                  {POPULAR_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* City Swap Button */}
            <button
              onClick={handleSwapCities}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg border border-indigo-400/40 transition-transform active:rotate-180"
              title="Swap Departure and Destination"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>

            {/* To City */}
            <div className="relative">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block">
                To City
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 pointer-events-none" />
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-9 pr-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                >
                  {POPULAR_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date Selector Row */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block">
              Departure Date
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={() => setDepartureDate('2026-10-06')}
                className={`px-3 py-2 rounded-2xl text-xs font-medium border transition-colors ${
                  departureDate === '2026-10-06'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setDepartureDate('2026-10-07')}
                className={`px-3 py-2 rounded-2xl text-xs font-medium border transition-colors ${
                  departureDate === '2026-10-07'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Tomorrow
              </button>
            </div>
          </div>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
          <button
            onClick={() => { soundFX.playTap(); setFilterType('all'); }}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors border ${
              filterType === 'all'
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Buses ({trips.length})
          </button>
          <button
            onClick={() => { soundFX.playTap(); setFilterType('sleeper'); }}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors border ${
              filterType === 'sleeper'
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            AC Sleeper Berths
          </button>
          <button
            onClick={() => { soundFX.playTap(); setFilterType('ev'); }}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors border ${
              filterType === 'ev'
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🌱 Zero-Emission EV
          </button>
          <button
            onClick={() => { soundFX.playTap(); setFilterType('top-rated'); }}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors border ${
              filterType === 'top-rated'
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ★ Rating 4.8+
          </button>
        </div>

        {/* Bus List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Available Coaches on this Route</span>
            <span className="font-mono text-slate-300 font-semibold">{filteredBuses.length} trips</span>
          </div>

          {filteredBuses.map((trip) => (
            <div
              key={trip.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 hover:border-slate-700 transition-all shadow-md group relative overflow-hidden"
            >
              {/* Badge Tag */}
              {trip.operator.badge && (
                <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full w-fit">
                  <Leaf className="w-3 h-3" />
                  <span>{trip.operator.badge}</span>
                </div>
              )}

              {/* Operator & Rating */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {trip.operator.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{trip.operator.busType}</p>
                </div>

                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-400 font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{trip.operator.rating}</span>
                </div>
              </div>

              {/* Times & Route Grid */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-lg font-black text-white font-mono">{trip.departureTime}</span>
                  <p className="text-[11px] text-slate-400 font-medium">{trip.fromCity}</p>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-mono">{trip.duration}</span>
                  <div className="w-14 h-0.5 bg-slate-700 relative my-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 absolute -top-0.5 left-1/2 -translate-x-1/2" />
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">Direct Express</span>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-white font-mono">{trip.arrivalTime}</span>
                  <p className="text-[11px] text-slate-400 font-medium">{trip.toCity}</p>
                </div>
              </div>

              {/* Amenities List */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px] text-slate-400">
                {trip.operator.amenities.slice(0, 3).map((amenity, aIdx) => (
                  <span
                    key={aIdx}
                    className="bg-slate-800/60 border border-slate-700/60 px-2 py-0.5 rounded-lg whitespace-nowrap text-slate-300 text-[10px]"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              {/* Price & Booking Button */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Starting from</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-extrabold text-white font-mono">
                      ₹{trip.basePrice}
                    </span>
                    <span className="text-[10px] text-slate-400">/ seat</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {trip.operator.availableSeats} seats left
                  </span>
                  <button
                    onClick={() => handleStartBooking(trip)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1 shadow-md shadow-indigo-600/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Select Seats</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Seat Selection Modal */}
      {isSeatModalOpen && selectedTrip && (
        <SeatSelectionModal
          trip={selectedTrip}
          onClose={() => setIsSeatModalOpen(false)}
          onProceedToPassengers={handleProceedToPassengers}
        />
      )}

      {/* Step 2: Passenger Details Modal */}
      {isPassengerModalOpen && selectedTrip && (
        <PassengerDetailsModal
          trip={selectedTrip}
          onClose={() => setIsPassengerModalOpen(false)}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {/* Step 3: Multi-Gateway Checkout Modal */}
      {isCheckoutModalOpen && selectedTrip && checkoutData && (
        <CheckoutModal
          trip={selectedTrip}
          passengers={checkoutData.passengers}
          boardingPoint={checkoutData.boardingPoint}
          droppingPoint={checkoutData.droppingPoint}
          hasInsurance={checkoutData.hasInsurance}
          onClose={() => setIsCheckoutModalOpen(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Step 4: Digital QR Boarding Pass Modal */}
      {justBookedTicket && (
        <TicketViewModal
          booking={justBookedTicket}
          onClose={() => setJustBookedTicket(null)}
        />
      )}
    </div>
  );
};
