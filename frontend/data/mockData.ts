import { BusRoute, BusStop, Bus } from '../types';

// Mock bus stops across full Kanpur City
export const mockStops: BusStop[] = [
  {
    id: 'stop1',
    name: 'Kanpur Central',
    nameHindi: 'कानपुर सेंट्रल',
    coordinates: { latitude: 26.4547, longitude: 80.3514 },
    amenities: ['shelter', 'seating', 'display_board']
  },
  {
    id: 'stop2',
    name: 'Z Square Mall',
    nameHindi: 'जेड स्क्वायर मॉल',
    coordinates: { latitude: 26.4660, longitude: 80.3450 },
    amenities: ['shelter', 'seating', 'food_court']
  },
  {
    id: 'stop3',
    name: 'Rawatpur',
    nameHindi: 'रावतपुर',
    coordinates: { latitude: 26.4800, longitude: 80.2950 },
    amenities: ['shelter', 'seating']
  },
  {
    id: 'stop4',
    name: 'Kalyanpur',
    nameHindi: 'कल्याणपुर',
    coordinates: { latitude: 26.4950, longitude: 80.2580 },
    amenities: ['shelter', 'seating', 'display_board']
  },
  {
    id: 'stop5',
    name: 'IIT Kanpur',
    nameHindi: 'आईआईटी कानपुर',
    coordinates: { latitude: 26.5123, longitude: 80.2329 },
    amenities: ['shelter', 'seating', 'wifi']
  },
  {
    id: 'stop6',
    name: 'Jajmau',
    nameHindi: 'जाजमऊ',
    coordinates: { latitude: 26.4400, longitude: 80.4000 },
    amenities: ['shelter', 'seating']
  },
  {
    id: 'stop7',
    name: 'Ramadevi',
    nameHindi: 'रामादेवी',
    coordinates: { latitude: 26.4167, longitude: 80.3833 },
    amenities: ['shelter', 'seating', 'display_board']
  },
  {
    id: 'stop8',
    name: 'Govind Nagar',
    nameHindi: 'गोविंद नगर',
    coordinates: { latitude: 26.4350, longitude: 80.3150 },
    amenities: ['shelter', 'seating', 'display_board']
  },
  {
    id: 'stop9',
    name: 'Panki',
    nameHindi: 'पनकी',
    coordinates: { latitude: 26.4800, longitude: 80.2300 },
    amenities: ['shelter', 'seating']
  },
  {
    id: 'stop10',
    name: 'Naubasta',
    nameHindi: 'नौबस्ता',
    coordinates: { latitude: 26.4000, longitude: 80.3300 },
    amenities: ['shelter', 'seating']
  },
  {
    id: 'stop11',
    name: 'Barra Bypass',
    nameHindi: 'बर्रा बाईपास',
    coordinates: { latitude: 26.4200, longitude: 80.3000 },
    amenities: ['shelter', 'seating']
  },
  {
    id: 'stop12',
    name: 'Kidwai Nagar',
    nameHindi: 'किदवई नगर',
    coordinates: { latitude: 26.4300, longitude: 80.3300 },
    amenities: ['shelter', 'seating']
  },
  {
    id: 'stop13',
    name: 'Chakeri Airport',
    nameHindi: 'चकेरी एयरपोर्ट',
    coordinates: { latitude: 26.4167, longitude: 80.4167 },
    amenities: ['shelter', 'seating', 'display_board']
  },
  {
    id: 'stop14',
    name: 'Bithoor',
    nameHindi: 'बिठूर',
    coordinates: { latitude: 26.6167, longitude: 80.2667 },
    amenities: ['shelter', 'seating']
  },
  {
    id: 'stop15',
    name: 'Azad Nagar',
    nameHindi: 'आजाद नगर',
    coordinates: { latitude: 26.4833, longitude: 80.3000 },
    amenities: ['shelter', 'seating']
  },
  {
    id: 'stop16',
    name: 'Chunniganj',
    nameHindi: 'चुन्नीगंज',
    coordinates: { latitude: 26.4700, longitude: 80.3400 },
    amenities: ['shelter', 'seating']
  },
  {
    id: 'stop17',
    name: 'Phool Bagh',
    nameHindi: 'फूल बाग',
    coordinates: { latitude: 26.4667, longitude: 80.3500 },
    amenities: ['shelter', 'seating', 'display_board']
  },
  {
    id: 'stop18',
    name: 'Tatmill',
    nameHindi: 'टातमिल',
    coordinates: { latitude: 26.4500, longitude: 80.3600 },
    amenities: ['shelter', 'seating']
  },
  {
    id: 'stop19',
    name: 'Civil Lines',
    nameHindi: 'सिविल लाइन्स',
    coordinates: { latitude: 26.4750, longitude: 80.3500 },
    amenities: ['shelter', 'seating']
  },
  {
    id: 'stop20',
    name: 'Gumti No. 5',
    nameHindi: 'गुमटी नंबर 5',
    coordinates: { latitude: 26.4580, longitude: 80.3220 },
    amenities: ['shelter', 'seating']
  },
  {
    id: 'stop21',
    name: 'Vijay Nagar',
    nameHindi: 'विजय नगर',
    coordinates: { latitude: 26.4450, longitude: 80.3050 },
    amenities: ['shelter', 'seating']
  },
  {
    id: 'stop22',
    name: 'Sharda Nagar',
    nameHindi: 'शारदा नगर',
    coordinates: { latitude: 26.5000, longitude: 80.2500 },
    amenities: ['shelter', 'seating']
  }
];

// Mock bus routes covering full Kanpur
export const mockRoutes: BusRoute[] = [
  {
    id: 'route1',
    routeNumber: 'K1',
    routeName: 'Kanpur Central → IIT Kanpur',
    routeNameHindi: 'कानपुर सेंट्रल → आईआईटी कानपुर',
    stops: [mockStops[0], mockStops[1], mockStops[15], mockStops[2], mockStops[3], mockStops[4]],
    isActive: true,
    estimatedDuration: 55
  },
  {
    id: 'route2',
    routeNumber: 'K2',
    routeName: 'Z Square Mall → Jajmau',
    routeNameHindi: 'जेड स्क्वायर मॉल → जाजमऊ',
    stops: [mockStops[1], mockStops[16], mockStops[0], mockStops[17], mockStops[6], mockStops[5]],
    isActive: true,
    estimatedDuration: 40
  },
  {
    id: 'route3',
    routeNumber: 'K3',
    routeName: 'Panki → Ramadevi',
    routeNameHindi: 'पनकी → रामादेवी',
    stops: [mockStops[8], mockStops[3], mockStops[2], mockStops[19], mockStops[0], mockStops[6]],
    isActive: true,
    estimatedDuration: 60
  },
  {
    id: 'route4',
    routeNumber: 'K4',
    routeName: 'Bithoor → Kanpur Central',
    routeNameHindi: 'बिठूर → कानपुर सेंट्रल',
    stops: [mockStops[13], mockStops[4], mockStops[21], mockStops[14], mockStops[15], mockStops[1]],
    isActive: true,
    estimatedDuration: 75
  },
  {
    id: 'route5',
    routeNumber: 'K5',
    routeName: 'Naubasta → Civil Lines',
    routeNameHindi: 'नौबस्ता → सिविल लाइन्स',
    stops: [mockStops[9], mockStops[11], mockStops[7], mockStops[20], mockStops[18]],
    isActive: true,
    estimatedDuration: 45
  },
  {
    id: 'route6',
    routeNumber: 'K6',
    routeName: 'Barra Bypass → Tatmill',
    routeNameHindi: 'बर्रा बाईपास → टातमिल',
    stops: [mockStops[10], mockStops[7], mockStops[0], mockStops[17]],
    isActive: true,
    estimatedDuration: 35
  },
  {
    id: 'route7',
    routeNumber: 'K7',
    routeName: 'Kidwai Nagar → IIT Kanpur',
    routeNameHindi: 'किदवई नगर → आईआईटी कानपुर',
    stops: [mockStops[11], mockStops[7], mockStops[20], mockStops[2], mockStops[4]],
    isActive: true,
    estimatedDuration: 50
  }
];

// Mock buses distributed across Kanpur
export const mockBuses: Bus[] = [
  {
    id: 'bus1',
    routeId: 'route1',
    busNumber: 'UP-78-1234',
    currentStopIndex: 1,
    nextStopIndex: 2,
    coordinates: { latitude: 26.4700, longitude: 80.3200 },
    speed: 30,
    capacity: 50,
    currentOccupancy: 35,
    isAC: true,
    isAccessible: true,
    status: 'on_time',
    delayMinutes: 0,
    estimatedArrival: new Date(Date.now() + 5 * 60 * 1000),
    lastUpdated: new Date()
  },
  {
    id: 'bus2',
    routeId: 'route1',
    busNumber: 'UP-78-5678',
    currentStopIndex: 4,
    nextStopIndex: 5,
    coordinates: { latitude: 26.5050, longitude: 80.2450 },
    speed: 25,
    capacity: 50,
    currentOccupancy: 42,
    isAC: false,
    isAccessible: true,
    status: 'delayed',
    delayMinutes: 4,
    estimatedArrival: new Date(Date.now() + 8 * 60 * 1000),
    lastUpdated: new Date()
  },
  {
    id: 'bus3',
    routeId: 'route2',
    busNumber: 'UP-78-9012',
    currentStopIndex: 0,
    nextStopIndex: 1,
    coordinates: { latitude: 26.4660, longitude: 80.3450 },
    speed: 15,
    capacity: 60,
    currentOccupancy: 20,
    isAC: true,
    isAccessible: true,
    status: 'on_time',
    delayMinutes: 0,
    estimatedArrival: new Date(Date.now() + 2 * 60 * 1000),
    lastUpdated: new Date()
  },
  {
    id: 'bus4',
    routeId: 'route3',
    busNumber: 'UP-78-1122',
    currentStopIndex: 2,
    nextStopIndex: 3,
    coordinates: { latitude: 26.4750, longitude: 80.3150 },
    speed: 35,
    capacity: 50,
    currentOccupancy: 15,
    isAC: false,
    isAccessible: false,
    status: 'on_time',
    delayMinutes: 0,
    estimatedArrival: new Date(Date.now() + 10 * 60 * 1000),
    lastUpdated: new Date()
  },
  {
    id: 'bus5',
    routeId: 'route5',
    busNumber: 'UP-78-3344',
    currentStopIndex: 1,
    nextStopIndex: 2,
    coordinates: { latitude: 26.4250, longitude: 80.3200 },
    speed: 20,
    capacity: 50,
    currentOccupancy: 48,
    isAC: true,
    isAccessible: true,
    status: 'delayed',
    delayMinutes: 10,
    estimatedArrival: new Date(Date.now() + 15 * 60 * 1000),
    lastUpdated: new Date()
  }
];

// Real-time simulation helpers
export const simulateBusMovement = (bus: Bus, route: BusRoute): Bus => {
  const currentTime = new Date();
  const timeDiff = currentTime.getTime() - bus.lastUpdated.getTime();
  const minutesPassed = timeDiff / (1000 * 60);

  if (minutesPassed < 0.5) return bus; // Update every 30 seconds

  // Simulate movement towards next stop
  const currentStop = route.stops[bus.currentStopIndex];
  const nextStop = route.stops[bus.nextStopIndex];

  if (!currentStop || !nextStop) return bus;

  // Calculate movement based on speed
  const speedKmH = bus.speed;
  const speedKmMin = speedKmH / 60;
  const distanceKm = speedKmMin * minutesPassed;

  // Simple linear interpolation for coordinates
  const latDiff = nextStop.coordinates.latitude - currentStop.coordinates.latitude;
  const lngDiff = nextStop.coordinates.longitude - currentStop.coordinates.longitude;
  const totalDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Rough km conversion

  const progress = Math.min(distanceKm / totalDistance, 1);

  const newLat = currentStop.coordinates.latitude + (latDiff * progress);
  const newLng = currentStop.coordinates.longitude + (lngDiff * progress);

  // If reached next stop, update indices
  let newCurrentIndex = bus.currentStopIndex;
  let newNextIndex = bus.nextStopIndex;

  if (progress >= 0.95) { // Almost at next stop
    newCurrentIndex = bus.nextStopIndex;
    newNextIndex = (bus.nextStopIndex + 1) % route.stops.length;
  }

  // Random delay simulation
  const randomDelay = Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0;

  return {
    ...bus,
    currentStopIndex: newCurrentIndex,
    nextStopIndex: newNextIndex,
    coordinates: { latitude: newLat, longitude: newLng },
    delayMinutes: Math.max(0, bus.delayMinutes + randomDelay - 1),
    status: bus.delayMinutes > 5 ? 'delayed' : 'on_time',
    estimatedArrival: new Date(Date.now() + (5 + bus.delayMinutes) * 60 * 1000),
    lastUpdated: currentTime
  };
};