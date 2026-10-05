export type SeatType = 'seater' | 'sleeper' | 'semi-sleeper';
export type SeatDeck = 'lower' | 'upper';
export type SeatGender = 'any' | 'female' | 'male';

export interface Seat {
  id: string; // e.g., "L1", "U12"
  number: string;
  type: SeatType;
  deck: SeatDeck;
  price: number;
  isBooked: boolean;
  bookedGender?: SeatGender;
  isLadiesReserved?: boolean;
}

export interface BusOperator {
  id: string;
  name: string;
  logoText: string;
  rating: number;
  totalReviews: number;
  busType: string; // "Volvo 9600 Multi-Axle AC Sleeper (2+1)"
  amenities: string[]; // ["Wi-Fi", "USB Charging", "Reading Light", "Water Bottle", "Blanket", "Snacks"]
  badge?: string;
  totalSeats: number;
  availableSeats: number;
}

export interface RouteStop {
  id: string;
  name: string;
  landmark: string;
  scheduledTime: string;
  passed: boolean;
  lat: number;
  lng: number;
  distanceKm: number;
}

export interface BusTrip {
  id: string;
  operator: BusOperator;
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  basePrice: number;
  departureDate: string;
  boardingPoints: { name: string; time: string; landmark: string }[];
  droppingPoints: { name: string; time: string; landmark: string }[];
  seats: Seat[];
  hasUpperDeck: boolean;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  currentSpeedKmH: number;
  liveStatus: 'on-time' | 'delayed' | 'boarding' | 'completed';
  delayMinutes: number;
  routeStops: RouteStop[];
  currentStopIndex: number;
}

export interface Passenger {
  seatId: string;
  seatNumber: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

export interface Booking {
  id: string;
  pnr: string;
  tripId: string;
  operatorName: string;
  busType: string;
  busNumber: string;
  fromCity: string;
  toCity: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  boardingPoint: string;
  droppingPoint: string;
  passengers: Passenger[];
  selectedSeatNumbers: string[];
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  paymentMethod: 'card' | 'upi' | 'apple_google_pay' | 'netbanking' | 'wallet';
  paymentId: string;
  bookingStatus: 'confirmed' | 'boarded' | 'cancelled' | 'completed';
  bookingDate: string;
  qrPayload: string;
  platformNumber: string;
  gateNumber: string;
  cancellationRefund?: {
    refundAmount: number;
    fee: number;
    refundedTo: 'wallet' | 'card';
    cancelledAt: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'delay' | 'departure' | 'gate' | 'refund' | 'booking' | 'system';
  timestamp: string;
  read: boolean;
  bookingPnr?: string;
  priority: 'high' | 'normal' | 'low';
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  tier: 'Silver' | 'Gold' | 'Platinum';
  walletBalance: number;
  savedPassengers: Omit<Passenger, 'seatId' | 'seatNumber'>[];
}

export type DeviceFrameType = 'iphone' | 'android' | 'responsive';
