import { BusTrip, Seat } from '../types';

// Helper to generate seat map with realistic layout
function generateSeats(busType: 'sleeper' | 'seater', hasUpperDeck: boolean): Seat[] {
  const seats: Seat[] = [];

  // Lower Deck (2+1 or 2+2)
  const lowerRows = 6;
  for (let r = 1; r <= lowerRows; r++) {
    const isSleeper = busType === 'sleeper';
    
    // Seat A (Window Left)
    const seatIdA = `L${r}A`;
    const isBookedA = (r === 2 || r === 4);
    seats.push({
      id: seatIdA,
      number: `${r}A`,
      type: isSleeper ? 'sleeper' : 'semi-sleeper',
      deck: 'lower',
      price: isSleeper ? 1250 : 750,
      isBooked: isBookedA,
      bookedGender: isBookedA ? (r === 2 ? 'female' : 'male') : undefined,
      isLadiesReserved: r === 1,
    });

    // Seat B (Right Window)
    const seatIdB = `L${r}B`;
    const isBookedB = (r === 3 || r === 5);
    seats.push({
      id: seatIdB,
      number: `${r}B`,
      type: isSleeper ? 'sleeper' : 'semi-sleeper',
      deck: 'lower',
      price: isSleeper ? 1150 : 700,
      isBooked: isBookedB,
      bookedGender: isBookedB ? 'male' : undefined,
      isLadiesReserved: false,
    });

    // Seat C (Right Aisle/Window 2+1)
    const seatIdC = `L${r}C`;
    const isBookedC = (r === 1);
    seats.push({
      id: seatIdC,
      number: `${r}C`,
      type: isSleeper ? 'sleeper' : 'semi-sleeper',
      deck: 'lower',
      price: isSleeper ? 1250 : 750,
      isBooked: isBookedC,
      bookedGender: isBookedC ? 'female' : undefined,
      isLadiesReserved: r === 1 || r === 3,
    });
  }

  // Upper Deck (if double decker)
  if (hasUpperDeck) {
    const upperRows = 6;
    for (let r = 1; r <= upperRows; r++) {
      const seatIdA = `U${r}A`;
      const isBookedA = (r === 1 || r === 5);
      seats.push({
        id: seatIdA,
        number: `U${r}A`,
        type: 'sleeper',
        deck: 'upper',
        price: 1350,
        isBooked: isBookedA,
        bookedGender: isBookedA ? 'male' : undefined,
        isLadiesReserved: false,
      });

      const seatIdB = `U${r}B`;
      const isBookedB = (r === 2);
      seats.push({
        id: seatIdB,
        number: `U${r}B`,
        type: 'sleeper',
        deck: 'upper',
        price: 1300,
        isBooked: isBookedB,
        bookedGender: isBookedB ? 'female' : undefined,
        isLadiesReserved: r === 2,
      });

      const seatIdC = `U${r}C`;
      const isBookedC = (r === 4);
      seats.push({
        id: seatIdC,
        number: `U${r}C`,
        type: 'sleeper',
        deck: 'upper',
        price: 1400,
        isBooked: isBookedC,
        bookedGender: isBookedC ? 'male' : undefined,
        isLadiesReserved: false,
      });
    }
  }

  return seats;
}

export const MOCK_BUS_TRIPS: BusTrip[] = [
  {
    id: 'trip-blr-chn-01',
    fromCity: 'Bengaluru',
    toCity: 'Chennai',
    departureTime: '22:30',
    arrivalTime: '05:45',
    duration: '7h 15m',
    departureDate: '2026-10-06',
    basePrice: 1150,
    hasUpperDeck: true,
    busNumber: 'KA-01-AK-9402',
    driverName: 'Captain Ramesh Babu',
    driverPhone: '+91 98450 23412',
    currentSpeedKmH: 78,
    liveStatus: 'on-time',
    delayMinutes: 0,
    currentStopIndex: 2,
    operator: {
      id: 'op-nuego-ev',
      name: 'NueGo Green Electric Prime',
      logoText: 'NUEGO',
      rating: 4.9,
      totalReviews: 1840,
      busType: 'Electric Ultra-Sleeper AC (2+1 Multi-Axle)',
      amenities: ['Ultra High-Speed Wi-Fi', 'USB-C 65W Fast Charge', 'Memory Foam Berths', 'Complimentary Snack Box', 'Privacy Curtains', 'Air Purifier HEPA'],
      badge: 'Zero Emission EV',
      totalSeats: 36,
      availableSeats: 26,
    },
    boardingPoints: [
      { name: 'Majestic (Kempegowda Bus Station Platform 4)', time: '22:30', landmark: 'Opp. Railway Station, Subhash Nagar' },
      { name: 'Madiwala (Near Total Mall)', time: '23:15', landmark: 'Maruthi Nagar Main Bus Bay' },
      { name: 'Electronic City Toll Plaza (Phase 1)', time: '23:45', landmark: 'Elevated Toll Exit Bay' },
    ],
    droppingPoints: [
      { name: 'Sriperumbudur Toll Plaza', time: '04:30', landmark: 'Bangalore Highway Junction' },
      { name: 'Poonamallee Bypass Junction', time: '05:00', landmark: 'Near Bus Stand' },
      { name: 'Koyambedu CMBT Omni Bus Terminus', time: '05:45', landmark: 'Platform Bay 12' },
    ],
    routeStops: [
      { id: 's1', name: 'Bengaluru Majestic Terminal', scheduledTime: '22:30', passed: true, lat: 12.9767, lng: 77.5713, distanceKm: 0, landmark: 'Origin Platform 4' },
      { id: 's2', name: 'Electronic City Toll Plaza', scheduledTime: '23:45', passed: true, lat: 12.8399, lng: 77.6770, distanceKm: 22, landmark: 'Elevated Flyover Exit' },
      { id: 's3', name: 'Krishnagiri Highway Toll Plaza', scheduledTime: '01:30', passed: false, lat: 12.5186, lng: 78.2137, distanceKm: 95, landmark: 'Highway Food Court (20 min tea break)' },
      { id: 's4', name: 'Vellore Golden Temple Bypass', scheduledTime: '03:15', passed: false, lat: 12.9165, lng: 79.1325, distanceKm: 215, landmark: 'NH-48 Overpass' },
      { id: 's5', name: 'Sriperumbudur Toll Junction', scheduledTime: '04:30', passed: false, lat: 12.9719, lng: 79.9427, distanceKm: 310, landmark: 'Chennai City Gate' },
      { id: 's6', name: 'Chennai Koyambedu CMBT', scheduledTime: '05:45', passed: false, lat: 13.0694, lng: 80.2057, distanceKm: 345, landmark: 'Final Destination Terminal' },
    ],
    seats: generateSeats('sleeper', true),
  },
  {
    id: 'trip-mum-goa-01',
    fromCity: 'Mumbai',
    toCity: 'Goa',
    departureTime: '20:00',
    arrivalTime: '08:30',
    duration: '12h 30m',
    departureDate: '2026-10-06',
    basePrice: 1450,
    hasUpperDeck: true,
    busNumber: 'MH-01-BR-8910',
    driverName: 'Sanjay Deshmukh',
    driverPhone: '+91 98221 44551',
    currentSpeedKmH: 72,
    liveStatus: 'on-time',
    delayMinutes: 0,
    currentStopIndex: 1,
    operator: {
      id: 'op-vrl',
      name: 'VRL I-Shift Volvo Multi-Axle',
      logoText: 'VRL',
      rating: 4.8,
      totalReviews: 2420,
      busType: 'Volvo 9600 AC Sleeper Luxury (2+1)',
      amenities: ['Free High-Speed Wi-Fi', 'Individual LED Screen', 'USB-C Charging', 'Blankets & Pillow', 'Mineral Water Bottle'],
      badge: 'Top Rated Volvo',
      totalSeats: 36,
      availableSeats: 18,
    },
    boardingPoints: [
      { name: 'Borivali West (Gokul Hotel)', time: '20:00', landmark: 'Near Shimpoli Signal' },
      { name: 'Dadar TT Circle (Asiad Bus Stand)', time: '21:15', landmark: 'Swami Narayan Temple Gate' },
      { name: 'Vashi Plaza (Near Center One Mall)', time: '22:15', landmark: 'Highway Bus Stop' },
    ],
    droppingPoints: [
      { name: 'Mapusa Gandhi Chowk', time: '07:45', landmark: 'Opp. Municipal Market' },
      { name: 'Panaji KTC Bus Stand', time: '08:30', landmark: 'Interstate Bay 3' },
    ],
    routeStops: [
      { id: 'mg1', name: 'Mumbai Borivali West', scheduledTime: '20:00', passed: true, lat: 19.2307, lng: 72.8567, distanceKm: 0, landmark: 'Origin' },
      { id: 'mg2', name: 'Dadar TT Circle Hub', scheduledTime: '21:15', passed: true, lat: 19.0178, lng: 72.8478, distanceKm: 32, landmark: 'City Hub' },
      { id: 'mg3', name: 'Pune Expressway Urse Toll', scheduledTime: '23:30', passed: false, lat: 18.7360, lng: 73.6820, distanceKm: 130, landmark: 'Expressway Food Mall' },
      { id: 'mg4', name: 'Kolhapur Shiroli Naka', scheduledTime: '04:15', passed: false, lat: 16.7410, lng: 74.2690, distanceKm: 380, landmark: 'NH-48 Midpoint' },
      { id: 'mg5', name: 'Mapusa Bus Stand', scheduledTime: '07:45', passed: false, lat: 15.5925, lng: 73.8130, distanceKm: 560, landmark: 'North Goa Gate' },
      { id: 'mg6', name: 'Panaji KTC Bus Terminus', scheduledTime: '08:30', passed: false, lat: 15.4909, lng: 73.8278, distanceKm: 585, landmark: 'Final Destination' },
    ],
    seats: generateSeats('sleeper', true),
  },
  {
    id: 'trip-del-jpr-01',
    fromCity: 'Delhi',
    toCity: 'Jaipur',
    departureTime: '06:30',
    arrivalTime: '11:15',
    duration: '4h 45m',
    departureDate: '2026-10-06',
    basePrice: 650,
    hasUpperDeck: false,
    busNumber: 'DL-01-P-4402',
    driverName: 'Surender Singh',
    driverPhone: '+91 98110 99201',
    currentSpeedKmH: 80,
    liveStatus: 'delayed',
    delayMinutes: 15,
    currentStopIndex: 1,
    operator: {
      id: 'op-intrcity',
      name: 'IntrCity SmartBus AC Seater',
      logoText: 'INTRCITY',
      rating: 4.75,
      totalReviews: 3100,
      busType: 'BharatBenz Executive Air Suspension (2+2)',
      amenities: ['SmartBus Lounge Access', 'High-Speed Wi-Fi', 'Live GPS Tracking', 'CCTV Security', 'Mineral Water'],
      badge: 'SmartBus Verified',
      totalSeats: 30,
      availableSeats: 19,
    },
    boardingPoints: [
      { name: 'Kashmere Gate ISBT (Gate 1)', time: '06:30', landmark: 'Metro Station Gate 1' },
      { name: 'Dhaula Kuan Metro Bus Bay', time: '07:15', landmark: 'Under Airport Express Metro' },
      { name: 'IFFCO Chowk Gurugram', time: '07:50', landmark: 'Flyover Bus Stop' },
    ],
    droppingPoints: [
      { name: 'Amer Road Bypass', time: '10:45', landmark: 'Near Tourist Complex' },
      { name: 'Sindhi Camp Central Bus Stand', time: '11:15', landmark: 'Platform 2' },
    ],
    routeStops: [
      { id: 'dj1', name: 'Delhi Kashmere Gate ISBT', scheduledTime: '06:30', passed: true, lat: 28.6675, lng: 77.2285, distanceKm: 0, landmark: 'Origin' },
      { id: 'dj2', name: 'Gurugram IFFCO Chowk', scheduledTime: '07:50', passed: false, lat: 28.4722, lng: 77.0725, distanceKm: 34, landmark: 'Current Location' },
      { id: 'dj3', name: 'Behror Midway Highway Oasis', scheduledTime: '09:20', passed: false, lat: 27.8870, lng: 76.2820, distanceKm: 135, landmark: 'Breakfast Rest Stop' },
      { id: 'dj4', name: 'Kotputli Toll Plaza', scheduledTime: '10:00', passed: false, lat: 27.7020, lng: 76.2000, distanceKm: 175, landmark: 'NH-48 Checkpoint' },
      { id: 'dj5', name: 'Jaipur Sindhi Camp Central', scheduledTime: '11:15', passed: false, lat: 26.9239, lng: 75.8010, distanceKm: 265, landmark: 'Final Terminal' },
    ],
    seats: generateSeats('seater', false),
  },
  {
    id: 'trip-hyd-blr-01',
    fromCity: 'Hyderabad',
    toCity: 'Bengaluru',
    departureTime: '21:45',
    arrivalTime: '06:30',
    duration: '8h 45m',
    departureDate: '2026-10-06',
    basePrice: 1200,
    hasUpperDeck: true,
    busNumber: 'TS-09-UB-7721',
    driverName: 'Venkat Rao',
    driverPhone: '+91 99882 12034',
    currentSpeedKmH: 82,
    liveStatus: 'on-time',
    delayMinutes: 0,
    currentStopIndex: 1,
    operator: {
      id: 'op-orange',
      name: 'Orange Tours & Travels Gold',
      logoText: 'ORANGE',
      rating: 4.85,
      totalReviews: 1980,
      busType: 'Scania Multi-Axle AC Sleeper (2+1)',
      amenities: ['Free 5G Wi-Fi', 'Blanket & Pillow', 'Charging Socket per berth', 'Reading Lamps', 'Bottle of Water'],
      badge: 'Premium Comfort',
      totalSeats: 36,
      availableSeats: 22,
    },
    boardingPoints: [
      { name: 'Ameerpet (Metro Pillar 1042)', time: '21:45', landmark: 'Opp. Big Bazaar' },
      { name: 'Gachibowli (ORR Junction)', time: '22:30', landmark: 'Near Outer Ring Road flyover' },
      { name: 'Shamshabad Airport Approach Road', time: '23:15', landmark: 'Near Toll Plaza' },
    ],
    droppingPoints: [
      { name: 'Hebbal Flyover Bus Bay', time: '05:45', landmark: 'Near Esteem Mall' },
      { name: 'Majestic (Kempegowda Bus Station)', time: '06:30', landmark: 'Platform 3' },
    ],
    routeStops: [
      { id: 'hb1', name: 'Hyderabad Ameerpet', scheduledTime: '21:45', passed: true, lat: 17.4375, lng: 78.4483, distanceKm: 0, landmark: 'Origin Hub' },
      { id: 'hb2', name: 'Shamshabad Airport Toll', scheduledTime: '23:15', passed: false, lat: 17.2403, lng: 78.4294, distanceKm: 42, landmark: 'City Exit' },
      { id: 'hb3', name: 'Kurnool Highway Bypass', scheduledTime: '01:45', passed: false, lat: 15.8281, lng: 78.0373, distanceKm: 215, landmark: 'Fuel & Refreshment' },
      { id: 'hb4', name: 'Anantapur Clock Tower Bypass', scheduledTime: '03:45', passed: false, lat: 14.6819, lng: 77.6006, distanceKm: 360, landmark: 'NH-44 Checkpoint' },
      { id: 'hb5', name: 'Bengaluru Hebbal Concourse', scheduledTime: '05:45', passed: false, lat: 13.0358, lng: 77.5970, distanceKm: 540, landmark: 'North Bengaluru Gate' },
      { id: 'hb6', name: 'Bengaluru Majestic Terminal', scheduledTime: '06:30', passed: false, lat: 12.9767, lng: 77.5713, distanceKm: 568, landmark: 'Final Terminal' },
    ],
    seats: generateSeats('sleeper', true),
  }
];

export const POPULAR_CITIES = [
  'Bengaluru',
  'Chennai',
  'Mumbai',
  'Pune',
  'Hyderabad',
  'Delhi',
  'Jaipur',
  'Goa',
  'Coimbatore',
  'Ahmedabad',
  'Kochi',
  'Kolkata',
];
