import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Booking, BusTrip, NotificationItem, UserProfile, DeviceFrameType } from '../types';
import { MOCK_BUS_TRIPS } from '../data/mockBuses';
import { soundFX } from '../utils/audio';
import confetti from 'canvas-confetti';

interface AppContextType {
  // Device & Navigation
  deviceFrame: DeviceFrameType;
  setDeviceFrame: (frame: DeviceFrameType) => void;
  activeTab: 'search' | 'my-trips' | 'live-track' | 'profile';
  setActiveTab: (tab: 'search' | 'my-trips' | 'live-track' | 'profile') => void;

  // Trips & Booking Flow
  trips: BusTrip[];
  selectedTrip: BusTrip | null;
  setSelectedTrip: (trip: BusTrip | null) => void;
  selectedSeats: string[];
  setSelectedSeats: (seats: string[]) => void;
  bookings: Booking[];
  viewingTicket: Booking | null;
  setViewingTicket: (booking: Booking | null) => void;
  activeLiveTrackingTripId: string;
  setActiveLiveTrackingTripId: (tripId: string) => void;

  // User & Wallet
  userProfile: UserProfile;
  topUpWallet: (amount: number) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  activeBannerNotification: NotificationItem | null;
  dismissBannerNotification: () => void;
  sendPushNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  simulateSampleAlert: () => void;

  // Offline Mode & Sync
  isOffline: boolean;
  toggleOfflineMode: () => void;
  offlineSyncPending: number;
  syncOfflineQueue: () => void;

  // Booking Actions
  createBooking: (newBookingData: Omit<Booking, 'id' | 'pnr' | 'bookingDate' | 'qrPayload' | 'platformNumber' | 'gateNumber' | 'bookingStatus'>) => Booking;
  cancelBooking: (bookingId: string, seatIdsToCancel?: string[], refundToWallet?: boolean) => { success: boolean; refundAmount: number; message: string };
  verifyBoardingScan: (pnr: string) => { valid: boolean; message: string; passengerNames: string[]; seatNumbers: string[] };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_PROFILE: UserProfile = {
  id: 'user-001',
  fullName: 'Ashwin Gnanaprakasam',
  email: 'ashwingnanaprakasam1307@gmail.com',
  phone: '+91 98450 78920',
  tier: 'Platinum',
  walletBalance: 2450.00,
  savedPassengers: [
    { fullName: 'Ashwin Gnanaprakasam', age: 29, gender: 'male' },
    { fullName: 'Priya Sundaram', age: 27, gender: 'female' },
  ],
};

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-sample-01',
    pnr: 'OMB-8924-X9',
    tripId: 'trip-blr-chn-01',
    operatorName: 'NueGo Green Electric Prime',
    busType: 'Electric Ultra-Sleeper AC (2+1 Multi-Axle)',
    busNumber: 'KA-01-AK-9402',
    fromCity: 'Bengaluru',
    toCity: 'Chennai',
    departureDate: '2026-10-06',
    departureTime: '22:30',
    arrivalTime: '05:45',
    duration: '7h 15m',
    boardingPoint: 'Majestic (Kempegowda Bus Station Platform 4)',
    droppingPoint: 'Koyambedu CMBT Omni Bus Terminus',
    passengers: [
      { seatId: 'L1A', seatNumber: '1A', fullName: 'Ashwin Gnanaprakasam', age: 29, gender: 'male' },
      { seatId: 'L1C', seatNumber: '1C', fullName: 'Priya Sundaram', age: 27, gender: 'female' },
    ],
    selectedSeatNumbers: ['1A', '1C'],
    totalAmount: 2400.00,
    taxAmount: 120.00,
    discountAmount: 150.00,
    paymentMethod: 'wallet',
    paymentId: 'UPI-TXN-902148',
    bookingStatus: 'confirmed',
    bookingDate: '2026-10-05T02:15:00.000Z',
    qrPayload: 'OMNIBUS:PNR:OMB-8924-X9:SEATS:1A,1C:DEPART:2026-10-06:GATE:4:BLR-CHN',
    platformNumber: 'Platform 4',
    gateNumber: 'Bay 12',
  },
  {
    id: 'bk-sample-02',
    pnr: 'OMB-4102-K3',
    tripId: 'trip-del-jpr-01',
    operatorName: 'IntrCity SmartBus AC Seater',
    busType: 'BharatBenz Executive Air Suspension (2+2)',
    busNumber: 'DL-01-P-4402',
    fromCity: 'Delhi',
    toCity: 'Jaipur',
    departureDate: '2026-09-28',
    departureTime: '06:30',
    arrivalTime: '11:15',
    duration: '4h 45m',
    boardingPoint: 'Kashmere Gate ISBT (Gate 1)',
    droppingPoint: 'Sindhi Camp Central Bus Stand',
    passengers: [
      { seatId: 'L2A', seatNumber: '2A', fullName: 'Ashwin Gnanaprakasam', age: 29, gender: 'male' },
    ],
    selectedSeatNumbers: ['2A'],
    totalAmount: 650.00,
    taxAmount: 32.50,
    discountAmount: 0,
    paymentMethod: 'upi',
    paymentId: 'GPay-TXN-88129',
    bookingStatus: 'completed',
    bookingDate: '2026-09-26T14:20:00.000Z',
    qrPayload: 'OMNIBUS:PNR:OMB-4102-K3:SEATS:2A:COMPLETED:DEL-JPR',
    platformNumber: 'Gate 1',
    gateNumber: 'Platform 2',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Platform Gate Assigned',
    message: 'Your bus to Chennai departs from Platform 4 at Majestic (Kempegowda Bus Station).',
    type: 'gate',
    timestamp: '15 mins ago',
    read: false,
    bookingPnr: 'OMB-8924-X9',
    priority: 'high',
  },
  {
    id: 'notif-2',
    title: 'Upcoming Departure in 18 hrs',
    message: 'Prepare your digital QR pass for fast boarding. High-speed Wi-Fi & charger ready on board.',
    type: 'departure',
    timestamp: '2 hours ago',
    read: false,
    bookingPnr: 'OMB-8924-X9',
    priority: 'normal',
  },
  {
    id: 'notif-3',
    title: 'Offline Pass Synced',
    message: 'Boarding pass OMB-8924-X9 is saved to your device. You can present it without internet.',
    type: 'system',
    timestamp: '5 hours ago',
    read: true,
    priority: 'low',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Device frame
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrameType>('iphone');
  const [activeTab, setActiveTab] = useState<'search' | 'my-trips' | 'live-track' | 'profile'>('search');

  // Trips
  const [trips] = useState<BusTrip[]>(MOCK_BUS_TRIPS);
  const [selectedTrip, setSelectedTrip] = useState<BusTrip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [activeLiveTrackingTripId, setActiveLiveTrackingTripId] = useState<string>('trip-blr-chn-01');

  // Bookings with LocalStorage caching for offline availability
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('omnibus_bookings_cache_in');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [viewingTicket, setViewingTicket] = useState<Booking | null>(null);

  // User Profile with LocalStorage
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('omnibus_profile_cache_in');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeBannerNotification, setActiveBannerNotification] = useState<NotificationItem | null>(null);

  // Offline Mode Simulator & Sync Queue
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineSyncPending, setOfflineSyncPending] = useState<number>(0);

  // Persist bookings to localStorage for offline cache
  useEffect(() => {
    try {
      localStorage.setItem('omnibus_bookings_cache_in', JSON.stringify(bookings));
    } catch (e) {
      console.warn('Failed to cache bookings', e);
    }
  }, [bookings]);

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem('omnibus_profile_cache_in', JSON.stringify(userProfile));
    } catch (e) {
      console.warn('Failed to cache profile', e);
    }
  }, [userProfile]);

  // Handle native navigator online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      soundFX.playNotification();
      sendPushNotification({
        title: 'Connection Restored',
        message: 'Back online. All ticket caches and tracking telemetry synchronized.',
        type: 'system',
        priority: 'normal',
      });
      syncOfflineQueue();
    };

    const handleOffline = () => {
      setIsOffline(true);
      soundFX.playNotification();
      sendPushNotification({
        title: 'Network Disconnected',
        message: 'Switched to Offline Mode. Your active QR boarding passes remain 100% accessible.',
        type: 'system',
        priority: 'high',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleOfflineMode = useCallback(() => {
    soundFX.playTap();
    setIsOffline((prev) => {
      const next = !prev;
      if (next) {
        sendPushNotification({
          title: 'Offline Mode Activated',
          message: 'Simulating zero connectivity. Offline digital QR tickets are ready for gate scanning.',
          type: 'system',
          priority: 'high',
        });
      } else {
        sendPushNotification({
          title: 'Cloud Sync Completed',
          message: 'All booking states, telemetry, and cancellation requests synchronized with cloud servers.',
          type: 'system',
          priority: 'normal',
        });
        setOfflineSyncPending(0);
      }
      return next;
    });
  }, []);

  const syncOfflineQueue = useCallback(() => {
    setOfflineSyncPending(0);
  }, []);

  // Send Push Notification
  const sendPushNotification = useCallback((notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      read: false,
    };

    soundFX.playNotification();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 100]);
      } catch {
        // ignore
      }
    }

    setNotifications((prev) => [newNotif, ...prev]);
    setActiveBannerNotification(newNotif);

    // Auto dismiss toast after 5s
    setTimeout(() => {
      setActiveBannerNotification((curr) => (curr?.id === newNotif.id ? null : curr));
    }, 5000);
  }, []);

  const dismissBannerNotification = useCallback(() => {
    setActiveBannerNotification(null);
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    soundFX.playTap();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Simulate urgent schedule changes
  const simulateSampleAlert = useCallback(() => {
    const alerts: Array<Omit<NotificationItem, 'id' | 'timestamp' | 'read'>> = [
      {
        title: '⚠️ Delay Alert: KA-01-AK-9402',
        message: 'Toll flyover work near Krishnagiri NH-48 caused a 15 min delay. Updated ETA: 06:00 AM.',
        type: 'delay',
        priority: 'high',
        bookingPnr: 'OMB-8924-X9',
      },
      {
        title: 'Platform Change Notice',
        message: 'Platform reassigned from Platform 4 to Platform 6 at Majestic (Kempegowda Bus Station).',
        type: 'gate',
        priority: 'high',
        bookingPnr: 'OMB-8924-X9',
      },
      {
        title: 'Bus Approaching Boarding Bay',
        message: 'NueGo Green Electric KA-01 is now docking at Majestic Bay 12. Have your QR code ready.',
        type: 'departure',
        priority: 'high',
        bookingPnr: 'OMB-8924-X9',
      },
    ];

    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    sendPushNotification(randomAlert);
  }, [sendPushNotification]);

  // Wallet
  const topUpWallet = useCallback((amount: number) => {
    soundFX.playSuccess();
    setUserProfile((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));
    sendPushNotification({
      title: 'Wallet Recharged',
      message: `Successfully credited ₹${amount.toFixed(2)} to your OmniWallet balance.`,
      type: 'refund',
      priority: 'normal',
    });
  }, [sendPushNotification]);

  const updateUserProfile = useCallback((profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  }, []);

  // Create Booking
  const createBooking = useCallback(
    (newBookingData: Omit<Booking, 'id' | 'pnr' | 'bookingDate' | 'qrPayload' | 'platformNumber' | 'gateNumber' | 'bookingStatus'>): Booking => {
      const pnr = `OMB-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9)}`;
      const bookingId = `bk-${Date.now()}`;
      const platformNumber = `Platform ${Math.floor(1 + Math.random() * 12)}`;
      const gateNumber = `Bay ${Math.floor(1 + Math.random() * 8)}`;
      const qrPayload = `OMNIBUS:PNR:${pnr}:TRIP:${newBookingData.tripId}:SEATS:${newBookingData.selectedSeatNumbers.join(',')}:DEP:${newBookingData.departureDate}`;

      const newBooking: Booking = {
        ...newBookingData,
        id: bookingId,
        pnr,
        bookingDate: new Date().toISOString(),
        qrPayload,
        platformNumber,
        gateNumber,
        bookingStatus: 'confirmed',
      };

      // Deduct from wallet if paid by wallet
      if (newBookingData.paymentMethod === 'wallet') {
        setUserProfile((prev) => ({
          ...prev,
          walletBalance: Math.max(0, prev.walletBalance - newBookingData.totalAmount),
        }));
      }

      setBookings((prev) => [newBooking, ...prev]);

      if (isOffline) {
        setOfflineSyncPending((prev) => prev + 1);
      }

      // Play success celebration
      soundFX.playSuccess();
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      sendPushNotification({
        title: 'Booking Confirmed!',
        message: `Ticket ${pnr} confirmed for ${newBooking.fromCity} → ${newBooking.toCity}. QR pass is saved offline.`,
        type: 'booking',
        priority: 'high',
        bookingPnr: pnr,
      });

      return newBooking;
    },
    [isOffline, sendPushNotification]
  );

  // Cancel Booking
  const cancelBooking = useCallback(
    (bookingId: string, seatIdsToCancel?: string[], refundToWallet = true) => {
      const target = bookings.find((b) => b.id === bookingId);
      if (!target) {
        return { success: false, refundAmount: 0, message: 'Booking not found.' };
      }

      // Cancellation policy calculation:
      const isPartial = seatIdsToCancel && seatIdsToCancel.length > 0 && seatIdsToCancel.length < target.passengers.length;
      let refundAmount = 0;
      let fee = 0;

      if (isPartial) {
        const seatPrice = target.totalAmount / target.passengers.length;
        const subtotal = seatPrice * seatIdsToCancel.length;
        fee = Math.round(subtotal * 0.1 * 100) / 100;
        refundAmount = Math.round((subtotal - fee) * 100) / 100;
      } else {
        fee = Math.round(target.totalAmount * 0.1 * 100) / 100;
        refundAmount = Math.round((target.totalAmount - fee) * 100) / 100;
      }

      // Apply refund
      if (refundToWallet) {
        setUserProfile((prev) => ({
          ...prev,
          walletBalance: prev.walletBalance + refundAmount,
        }));
      }

      soundFX.playTap();

      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          return {
            ...b,
            bookingStatus: 'cancelled',
            cancellationRefund: {
              refundAmount,
              fee,
              refundedTo: refundToWallet ? 'wallet' : 'card',
              cancelledAt: new Date().toISOString(),
            },
          };
        })
      );

      if (isOffline) {
        setOfflineSyncPending((prev) => prev + 1);
      }

      sendPushNotification({
        title: 'Cancellation & Refund Processed',
        message: `₹${refundAmount.toFixed(2)} refunded ${refundToWallet ? 'instantly to your OmniWallet' : 'to your bank account / UPI (3-5 days)'}.`,
        type: 'refund',
        priority: 'high',
        bookingPnr: target.pnr,
      });

      return {
        success: true,
        refundAmount,
        message: `Booking cancelled successfully. ₹${refundAmount.toFixed(2)} credited to ${refundToWallet ? 'OmniWallet' : 'Original Payment Source'}.`,
      };
    },
    [bookings, isOffline, sendPushNotification]
  );

  // Digital Boarding Pass Scanner Simulator (Conductor View)
  const verifyBoardingScan = useCallback(
    (pnr: string) => {
      const b = bookings.find((item) => item.pnr.toLowerCase() === pnr.toLowerCase());
      if (!b) {
        return {
          valid: false,
          message: 'Invalid PNR. Ticket record not found in manifest.',
          passengerNames: [],
          seatNumbers: [],
        };
      }

      if (b.bookingStatus === 'cancelled') {
        return {
          valid: false,
          message: 'TICKET CANCELLED - Boarding Denied. Refund was previously issued.',
          passengerNames: b.passengers.map((p) => p.fullName),
          seatNumbers: b.selectedSeatNumbers,
        };
      }

      soundFX.playScanSuccess();

      // Mark as boarded if confirmed
      if (b.bookingStatus === 'confirmed') {
        setBookings((prev) =>
          prev.map((item) => (item.id === b.id ? { ...item, bookingStatus: 'boarded' } : item))
        );
      }

      return {
        valid: true,
        message: 'VALID BOARDING PASS - Boarding Authorized',
        passengerNames: b.passengers.map((p) => p.fullName),
        seatNumbers: b.selectedSeatNumbers,
      };
    },
    [bookings]
  );

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        deviceFrame,
        setDeviceFrame,
        activeTab,
        setActiveTab,
        trips,
        selectedTrip,
        setSelectedTrip,
        selectedSeats,
        setSelectedSeats,
        bookings,
        viewingTicket,
        setViewingTicket,
        activeLiveTrackingTripId,
        setActiveLiveTrackingTripId,
        userProfile,
        topUpWallet,
        updateUserProfile,
        notifications,
        unreadNotificationCount,
        activeBannerNotification,
        dismissBannerNotification,
        sendPushNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        simulateSampleAlert,
        isOffline,
        toggleOfflineMode,
        offlineSyncPending,
        syncOfflineQueue,
        createBooking,
        cancelBooking,
        verifyBoardingScan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
