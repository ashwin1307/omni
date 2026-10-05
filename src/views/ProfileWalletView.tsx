import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Wallet, 
  PlusCircle, 
  ShieldCheck, 
  Users, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  Bell, 
  CreditCard, 
  ChevronRight, 
  Check, 
  RefreshCw, 
  Leaf,
  Sparkles
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export const ProfileWalletView: React.FC = () => {
  const { 
    userProfile, 
    topUpWallet, 
    updateUserProfile, 
    isOffline, 
    toggleOfflineMode, 
    bookings, 
    offlineSyncPending,
    syncOfflineQueue 
  } = useApp();

  const [topUpAmount, setTopUpAmount] = useState<number>(50);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [newPassengerName, setNewPassengerName] = useState('');
  const [newPassengerAge, setNewPassengerAge] = useState(25);
  const [newPassengerGender, setNewPassengerGender] = useState<'male' | 'female' | 'other'>('male');

  const handleTopUpConfirm = (amt: number) => {
    topUpWallet(amt);
    setShowTopUpModal(false);
  };

  const handleAddPassenger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassengerName.trim()) return;
    soundFX.playTap();

    updateUserProfile({
      savedPassengers: [
        ...userProfile.savedPassengers,
        {
          fullName: newPassengerName.trim(),
          age: newPassengerAge,
          gender: newPassengerGender,
        },
      ],
    });

    setNewPassengerName('');
    setShowPassengerModal(false);
  };

  const handleRemovePassenger = (index: number) => {
    soundFX.playTap();
    const updated = userProfile.savedPassengers.filter((_, i) => i !== index);
    updateUserProfile({ savedPassengers: updated });
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 p-4 space-y-4 overflow-y-auto">
      {/* User Header Profile Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 border border-indigo-400/40 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-indigo-600/30">
              {userProfile.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {userProfile.fullName}
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.2 rounded-full font-bold">
                  {userProfile.tier} Tier
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{userProfile.email}</p>
              <p className="text-[11px] text-slate-500 font-mono">{userProfile.phone}</p>
            </div>
          </div>
        </div>

        {/* Travel stats */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Trips Taken</span>
            <span className="text-sm font-bold text-white font-mono">{bookings.length + 4}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">OmniPoints</span>
            <span className="text-sm font-bold text-indigo-400 font-mono">1,450</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">CO₂ Offset</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">48 kg</span>
          </div>
        </div>
      </div>

      {/* OmniWallet Stored Value Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">OmniWallet Stored Balance</h3>
              <p className="text-[10px] text-slate-400">Instant 1-tap checkout & zero-fee instant refunds</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playTap();
              setShowTopUpModal(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Top Up</span>
          </button>
        </div>

        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-medium">Available Cash Balance</span>
            <div className="text-2xl font-black text-white font-mono">
              ₹{userProfile.walletBalance.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleTopUpConfirm(500)}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono font-medium transition-colors"
            >
              +₹500
            </button>
            <button
              onClick={() => handleTopUpConfirm(1000)}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono font-medium transition-colors"
            >
              +₹1000
            </button>
          </div>
        </div>
      </div>

      {/* Offline Storage & Cloud Synchronization Center */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              {isOffline ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Offline Resilience & Cloud Sync</h3>
              <p className="text-[10px] text-slate-400">Offline-first local caching engine</p>
            </div>
          </div>

          <button
            onClick={toggleOfflineMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isOffline
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {isOffline ? 'Go Online' : 'Simulate Offline'}
          </button>
        </div>

        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Offline QR Pass Storage</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              {bookings.length} Passes Cached
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <span>Sync Engine State</span>
            <span className="font-mono text-slate-300">
              {isOffline ? 'Offline (Sync Queued)' : 'Active (Direct Cloud Connection)'}
            </span>
          </div>

          {offlineSyncPending > 0 && (
            <div className="flex justify-between items-center text-amber-400 pt-1 border-t border-slate-800">
              <span>Pending Cloud Actions</span>
              <button
                onClick={syncOfflineQueue}
                className="text-[11px] underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Sync {offlineSyncPending} action(s) now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Saved Passengers Directory */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Saved Co-Passengers</h3>
              <p className="text-[10px] text-slate-400">1-tap passenger assignment during seat selection</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playTap();
              setShowPassengerModal(true);
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            + Add
          </button>
        </div>

        <div className="space-y-2">
          {userProfile.savedPassengers.map((passenger, pIdx) => (
            <div
              key={pIdx}
              className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-white block">{passenger.fullName}</span>
                <span className="text-[10px] text-slate-400">
                  {passenger.age} yrs · {passenger.gender.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => handleRemovePassenger(pIdx)}
                className="text-slate-500 hover:text-rose-400 text-xs px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-xs w-full space-y-4 animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-white">Top Up OmniWallet</h3>
            <p className="text-xs text-slate-400">Select or enter amount to reload instantly via saved cards or UPI.</p>

            <div className="grid grid-cols-3 gap-2">
              {[200, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    topUpAmount === amt
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">Custom Amount (₹)</label>
              <input
                type="number"
                min="100"
                max="50000"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(parseInt(e.target.value) || 100)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowTopUpModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleTopUpConfirm(topUpAmount)}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
              >
                Add ₹{topUpAmount}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Passenger Modal */}
      {showPassengerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <form
            onSubmit={handleAddPassenger}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-xs w-full space-y-3 animate-in zoom-in-95"
          >
            <h3 className="text-sm font-bold text-white">Add Co-Passenger</h3>

            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Jordan Smith"
                value={newPassengerName}
                onChange={(e) => setNewPassengerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
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
                  value={newPassengerAge}
                  onChange={(e) => setNewPassengerAge(parseInt(e.target.value) || 18)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Gender</label>
                <select
                  value={newPassengerGender}
                  onChange={(e) => setNewPassengerGender(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPassengerModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
