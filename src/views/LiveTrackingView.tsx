import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Navigation2, 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Gauge, 
  Compass, 
  Share2, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Zap, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export const LiveTrackingView: React.FC = () => {
  const { 
    trips, 
    activeLiveTrackingTripId, 
    setActiveLiveTrackingTripId, 
    sendPushNotification 
  } = useApp();

  const currentTrip = trips.find((t) => t.id === activeLiveTrackingTripId) || trips[0];

  // Dynamic telemetry simulation
  const [speed, setSpeed] = useState(currentTrip.currentSpeedKmH);
  const [delayMins, setDelayMins] = useState(currentTrip.delayMinutes);
  const [progressPercent, setProgressPercent] = useState(42);
  const [callModal, setCallModal] = useState<string | null>(null);

  // Animate speed subtly
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((prev) => {
        const delta = (Math.random() - 0.48) * 4;
        return Math.min(95, Math.max(55, Math.round(prev + delta)));
      });
      setProgressPercent((prev) => (prev >= 98 ? 10 : prev + 0.1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateDelay = () => {
    soundFX.playTap();
    const newDelay = delayMins + 15;
    setDelayMins(newDelay);

    sendPushNotification({
      title: `⚠️ Live Delay Update: ${currentTrip.busNumber}`,
      message: `Highway slowdown detected. Trip ${currentTrip.fromCity} → ${currentTrip.toCity} is delayed by ${newDelay} mins.`,
      type: 'delay',
      priority: 'high',
    });
  };

  const handleSimulateOnTime = () => {
    soundFX.playTap();
    setDelayMins(0);
    sendPushNotification({
      title: `✅ Resumed Speed: ${currentTrip.busNumber}`,
      message: `Traffic cleared. Coach is running at optimal cruise speed (${speed} km/h).`,
      type: 'departure',
      priority: 'normal',
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100">
      {/* Route Switcher & Live Beacon Bar */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Live GPS Telemetry
          </span>
        </div>

        {/* Bus Selector */}
        <select
          value={currentTrip.id}
          onChange={(e) => {
            soundFX.playTap();
            setActiveLiveTrackingTripId(e.target.value);
          }}
          className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          {trips.map((t) => (
            <option key={t.id} value={t.id}>
              {t.fromCity} → {t.toCity} ({t.busNumber})
            </option>
          ))}
        </select>
      </div>

      {/* Interactive Map Visualizer */}
      <div className="relative h-64 bg-slate-900 overflow-hidden border-b border-slate-800">
        {/* Synthetic Map Grid & Road Canvas */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        {/* Highway Vector Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <path
            d="M 30,220 C 120,200 180,120 260,90 S 340,50 400,30"
            fill="none"
            stroke="#1e293b"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 30,220 C 120,200 180,120 260,90 S 340,50 400,30"
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="4"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />
        </svg>

        {/* Map Location Pins */}
        <div className="absolute left-6 bottom-6 flex items-center gap-1.5 bg-slate-950/90 border border-slate-700/80 rounded-lg px-2 py-1 shadow-lg text-[10px] text-slate-300">
          <MapPin className="w-3 h-3 text-indigo-400" />
          <span className="font-semibold">{currentTrip.fromCity}</span>
        </div>

        <div className="absolute right-6 top-6 flex items-center gap-1.5 bg-slate-950/90 border border-slate-700/80 rounded-lg px-2 py-1 shadow-lg text-[10px] text-slate-300">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span className="font-semibold">{currentTrip.toCity}</span>
        </div>

        {/* Live Moving Bus Marker */}
        <div
          className="absolute z-10 transition-all duration-1000 flex flex-col items-center pointer-events-none"
          style={{
            left: `${progressPercent}%`,
            top: `${Math.max(20, 75 - progressPercent * 0.55)}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Pulsing Radar Ring */}
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 animate-ping absolute -top-2" />
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 border-2 border-white shadow-2xl flex items-center justify-center text-white relative">
            <Navigation2 className="w-5 h-5 -rotate-45" />
          </div>
          <div className="mt-1 bg-slate-950/90 border border-indigo-500/50 rounded-md px-2 py-0.5 text-[9px] font-bold font-mono text-indigo-300 shadow whitespace-nowrap">
            {currentTrip.busNumber} · {speed} km/h
          </div>
        </div>

        {/* Top Floating Telemetry Pills */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl px-2.5 py-1 flex items-center gap-2 text-xs shadow-lg">
            <Gauge className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono font-bold text-white">{speed} km/h</span>
            <span className="text-[10px] text-slate-400">Cruise</span>
          </div>

          <div
            className={`backdrop-blur-md rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-xs shadow-lg font-semibold border ${
              delayMins > 0
                ? 'bg-amber-950/90 text-amber-300 border-amber-500/40'
                : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {delayMins > 0 ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Delayed +{delayMins}m</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>On Schedule</span>
              </>
            )}
          </div>
        </div>

        {/* Simulation Controls Overlay */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1">
          <button
            onClick={handleSimulateDelay}
            className="px-2 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-[10px] text-amber-400 border border-slate-700/80 shadow transition-colors"
            title="Simulate 15 min delay alert"
          >
            +15m Delay
          </button>
          {delayMins > 0 && (
            <button
              onClick={handleSimulateOnTime}
              className="px-2 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-[10px] text-emerald-400 border border-slate-700/80 shadow transition-colors"
              title="Reset delay to 0"
            >
              Clear Delay
            </button>
          )}
        </div>
      </div>

      {/* Telemetry Stats & Journey Information */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Next Stop Milestone Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
              Approaching Next Stop
            </span>
            <span className="text-xs font-mono font-bold text-white bg-indigo-600/20 border border-indigo-500/30 px-2 py-0.5 rounded-lg">
              ETA: 18 mins
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                {currentTrip.routeStops[2]?.name || 'Krishnagiri Highway Food Plaza'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Distance: ~18 km remaining · Tea & Refreshment break (15 min)
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Trip Progress</span>
              <span className="font-mono text-indigo-300 font-semibold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Driver & Coach Attendant Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-sm font-bold">
                👨‍✈️
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{currentTrip.driverName}</span>
                  <span className="text-[10px] text-amber-400 font-semibold">★ 4.9</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Lead Captain · Reg: <span className="font-mono text-slate-300">{currentTrip.busNumber}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFX.playTap();
                  setCallModal(`Calling ${currentTrip.driverName} at ${currentTrip.driverPhone}...`);
                }}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors"
                title="Call Captain"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
              </button>
              <button
                onClick={() => {
                  soundFX.playTap();
                  setCallModal(`Connecting to Onboard Attendant messaging...`);
                }}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors"
                title="Message Attendant"
              >
                <MessageSquare className="w-4 h-4 text-sky-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Route Milestones Timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            All Route Milestones & Checkpoints
          </h4>

          <div className="space-y-3 relative pl-2">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-800" />

            {currentTrip.routeStops.map((stop, sIdx) => {
              const isPassed = stop.passed;
              const isCurrent = sIdx === currentTrip.currentStopIndex;

              return (
                <div key={stop.id} className="flex items-start gap-3 relative z-10 text-xs">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isCurrent
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20 animate-pulse'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {isPassed ? '✓' : sIdx + 1}
                  </div>

                  <div className="flex-1 flex items-center justify-between pb-1">
                    <div>
                      <span className={`font-semibold block ${isCurrent ? 'text-indigo-400' : 'text-slate-200'}`}>
                        {stop.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{stop.landmark}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {stop.scheduledTime}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simulated Call/Message Toast */}
      {callModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-xs text-center space-y-3 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
              <Phone className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-300 font-medium">{callModal}</p>
            <button
              onClick={() => setCallModal(null)}
              className="px-4 py-1.5 rounded-xl bg-slate-800 text-white text-xs hover:bg-slate-700"
            >
              End Simulation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
