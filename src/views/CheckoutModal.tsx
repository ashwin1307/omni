import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BusTrip, Passenger, Booking } from '../types';
import { 
  X, 
  CreditCard, 
  Wallet, 
  Smartphone, 
  Landmark, 
  ShieldCheck, 
  Tag, 
  Check, 
  Loader2, 
  Lock 
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface CheckoutModalProps {
  trip: BusTrip;
  passengers: Passenger[];
  boardingPoint: string;
  droppingPoint: string;
  hasInsurance: boolean;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  trip,
  passengers,
  boardingPoint,
  droppingPoint,
  hasInsurance,
  onClose,
  onSuccess,
}) => {
  const { userProfile, createBooking, topUpWallet } = useApp();

  type PaymentGateway = 'wallet' | 'card' | 'apple_google_pay' | 'netbanking' | 'upi';
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('wallet');

  // Card details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9012');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [cardHolder, setCardHolder] = useState(userProfile.fullName);

  // Netbanking bank
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Coupon state
  const [couponCode, setCouponCode] = useState('OMNIFAST');
  const [discountApplied, setDiscountApplied] = useState(true);

  // Loading state
  const [isProcessing, setIsProcessing] = useState(false);

  // Price calculations
  const seatsSum = passengers.reduce((sum, p) => {
    const seatObj = trip.seats.find((s) => s.id === p.seatId);
    return sum + (seatObj ? seatObj.price : trip.basePrice);
  }, 0);

  const insuranceFee = hasInsurance ? passengers.length * 49.0 : 0;
  const taxFee = Math.round(seatsSum * 0.05 * 100) / 100;
  const discountAmount = discountApplied ? 150.0 : 0;
  const totalAmount = Math.max(0, Math.round((seatsSum + insuranceFee + taxFee - discountAmount) * 100) / 100);

  const isWalletSufficient = userProfile.walletBalance >= totalAmount;

  const handlePay = () => {
    if (selectedGateway === 'wallet' && !isWalletSufficient) {
      alert('Insufficient wallet balance. Please top up or choose another payment method.');
      return;
    }

    soundFX.playTap();
    setIsProcessing(true);

    // Simulate gateway handoff & authorization
    setTimeout(() => {
      setIsProcessing(false);

      const paymentMethodMapped: Booking['paymentMethod'] = 
        selectedGateway === 'card' ? 'card' :
        selectedGateway === 'apple_google_pay' ? 'apple_google_pay' :
        selectedGateway === 'netbanking' ? 'netbanking' :
        selectedGateway === 'upi' ? 'upi' : 'wallet';

      const newBooking = createBooking({
        tripId: trip.id,
        operatorName: trip.operator.name,
        busType: trip.operator.busType,
        busNumber: trip.busNumber,
        fromCity: trip.fromCity,
        toCity: trip.toCity,
        departureDate: trip.departureDate,
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime,
        duration: trip.duration,
        boardingPoint,
        droppingPoint,
        passengers,
        selectedSeatNumbers: passengers.map((p) => p.seatNumber),
        totalAmount,
        taxAmount: taxFee,
        discountAmount,
        paymentMethod: paymentMethodMapped,
        paymentId: `TXN-${Date.now().toString().slice(-6)}`,
      });

      onSuccess(newBooking);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Secure Checkout</h2>
              <p className="text-xs text-slate-400">256-Bit Encrypted Multi-Gateway Gateway</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFX.playTap();
              onClose();
            }}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Fare Summary Accordion */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-semibold pb-1 border-b border-slate-800">
              <span>{trip.operator.name}</span>
              <span className="font-mono text-white">Seats: {passengers.map((p) => p.seatNumber).join(', ')}</span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Base Seat Fare ({passengers.length} passenger{passengers.length > 1 ? 's' : ''})</span>
              <span className="font-mono text-slate-300">₹{seatsSum.toFixed(2)}</span>
            </div>

            {hasInsurance && (
              <div className="flex justify-between text-slate-400">
                <span>OmniTravel Protection Insurance</span>
                <span className="font-mono text-slate-300">₹{insuranceFee.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400">
              <span>Interstate Transit GST (5%) & Tolls</span>
              <span className="font-mono text-slate-300">₹{taxFee.toFixed(2)}</span>
            </div>

            {discountApplied && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Promo Coupon (OMNIFAST)</span>
                <span className="font-mono">-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
              <span>Total Payable</span>
              <span className="text-base text-indigo-400 font-mono">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Coupon Code Input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Tag className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Enter Promo Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                soundFX.playTap();
                setDiscountApplied(!discountApplied);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-colors"
            >
              {discountApplied ? 'Remove' : 'Apply'}
            </button>
          </div>

          {/* Payment Gateways Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Select Payment Gateway
            </label>

            {/* Gateway 1: OmniWallet */}
            <div
              onClick={() => {
                soundFX.playTap();
                setSelectedGateway('wallet');
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                selectedGateway === 'wallet'
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">OmniWallet Stored Balance</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-semibold">
                        Instant 1-Tap
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Available: <strong className="text-white font-mono">₹{userProfile.walletBalance.toFixed(2)}</strong>
                    </p>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedGateway === 'wallet'
                      ? 'border-indigo-400 bg-indigo-600 text-white'
                      : 'border-slate-600'
                  }`}
                >
                  {selectedGateway === 'wallet' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              {!isWalletSufficient && selectedGateway === 'wallet' && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-amber-400">Short by ₹{(totalAmount - userProfile.walletBalance).toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      topUpWallet(500);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500"
                  >
                    + Add ₹500 to Wallet
                  </button>
                </div>
              )}
            </div>

            {/* Gateway 2: UPI / Instant Wallets */}
            <div
              onClick={() => {
                soundFX.playTap();
                setSelectedGateway('apple_google_pay');
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                selectedGateway === 'apple_google_pay'
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-white border border-slate-700 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Instant UPI (GPay · PhonePe · Paytm)</span>
                    <p className="text-[11px] text-slate-400">Instant 1-tap UPI pinless / biometric authorization</p>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedGateway === 'apple_google_pay'
                      ? 'border-indigo-400 bg-indigo-600 text-white'
                      : 'border-slate-600'
                  }`}
                >
                  {selectedGateway === 'apple_google_pay' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            {/* Gateway 3: Credit & Debit Cards */}
            <div
              onClick={() => {
                soundFX.playTap();
                setSelectedGateway('card');
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                selectedGateway === 'card'
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Credit / Debit Card</span>
                    <p className="text-[11px] text-slate-400">RuPay, Visa, MasterCard, Maestro</p>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedGateway === 'card'
                      ? 'border-indigo-400 bg-indigo-600 text-white'
                      : 'border-slate-600'
                  }`}
                >
                  {selectedGateway === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              {selectedGateway === 'card' && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 text-xs" onClick={(e) => e.stopPropagation()}>
                  <div>
                    <label className="text-[10px] text-slate-400 mb-1 block">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 font-mono text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 mb-1 block">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 font-mono text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 mb-1 block">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 font-mono text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Gateway 4: NetBanking */}
            <div
              onClick={() => {
                soundFX.playTap();
                setSelectedGateway('netbanking');
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                selectedGateway === 'netbanking'
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">NetBanking Direct Bank Transfer</span>
                    <p className="text-[11px] text-slate-400">All major Indian banks with instant netbanking</p>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedGateway === 'netbanking'
                      ? 'border-indigo-400 bg-indigo-600 text-white'
                      : 'border-slate-600'
                  }`}
                >
                  {selectedGateway === 'netbanking' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              {selectedGateway === 'netbanking' && (
                <div className="mt-3 pt-3 border-t border-slate-800" onClick={(e) => e.stopPropagation()}>
                  <label className="text-[10px] text-slate-400 mb-1 block">Select Your Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Pay Button */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/60 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.98] cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Authorizing Payment with Gateway...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>
                  Authorize & Pay ₹{totalAmount.toFixed(2)}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
