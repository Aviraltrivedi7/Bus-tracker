import { BusRoute, BusStop, Bus } from '../types';

<<<<<<< HEAD
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
=======
// Mock bus stops in a typical Indian city
export const mockStops: BusStop[] = [
  {
    id: 'stop1',
    name: 'Railway Station',
    nameHindi: 'रेलवे स्टेशन',
    coordinates: { latitude: 28.6139, longitude: 77.2090 },
    amenities: ['shelter', 'seating', 'display_board']
  },
  {
    id: 'stop2', 
    name: 'Gandhi Chowk',
    nameHindi: 'गांधी चौक',
    coordinates: { latitude: 28.6169, longitude: 77.2120 },
    amenities: ['shelter', 'seating']
  },
  {
    id: 'stop3',
    name: 'City Hospital',
    nameHindi: 'सिटी हॉस्पिटल',
    coordinates: { latitude: 28.6199, longitude: 77.2150 },
    amenities: ['shelter', 'seating', 'accessibility']
  },
  {
    id: 'stop4',
    name: 'Metro Station',
    nameHindi: 'मेट्रो स्टेशन', 
    coordinates: { latitude: 28.6229, longitude: 77.2180 },
    amenities: ['shelter', 'seating', 'display_board', 'wifi']
  },
  {
    id: 'stop5',
    name: 'City Mall',
    nameHindi: 'सिटी मॉल',
    coordinates: { latitude: 28.6259, longitude: 77.2210 },
    amenities: ['shelter', 'seating', 'food_court']
  },
  {
    id: 'stop6',
    name: 'University',
    nameHindi: 'विश्वविद्यालय',
    coordinates: { latitude: 28.6289, longitude: 77.2240 },
    amenities: ['shelter', 'seating', 'student_discount']
  },
  {
    id: 'stop7',
    name: 'Tech Park',
    nameHindi: 'टेक पार्क',
    coordinates: { latitude: 28.6319, longitude: 77.2270 },
    amenities: ['shelter', 'seating', 'display_board', 'wifi']
  },
  {
    id: 'stop8',
    name: 'Airport Terminal',
    nameHindi: 'एयरपोर्ट टर्मिनल',
    coordinates: { latitude: 28.6349, longitude: 77.2300 },
    amenities: ['shelter', 'seating', 'luggage_space', 'display_board']
  }
];

// Mock bus routes  
export const mockRoutes: BusRoute[] = [
  {
    id: 'route1',
    routeNumber: '17A',
    routeName: 'Railway Station → City Mall',
    routeNameHindi: 'रेलवे स्टेशन → सिटी मॉल',
    stops: [mockStops[0], mockStops[1], mockStops[2], mockStops[4]], // 4 stops
    isActive: true,
    estimatedDuration: 25
  },
  {
    id: 'route2', 
    routeNumber: '8B',
    routeName: 'Metro Station → Airport',
    routeNameHindi: 'मेट्रो स्टेशन → एयरपोर्ट',
    stops: [mockStops[3], mockStops[5], mockStops[6], mockStops[7]], // 4 stops
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
    isActive: true,
    estimatedDuration: 35
  },
  {
<<<<<<< HEAD
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
=======
    id: 'route3',
    routeNumber: '25',
    routeName: 'Gandhi Chowk → University',
    routeNameHindi: 'गांधी चौक → विश्वविद्यालय',
    stops: [mockStops[1], mockStops[2], mockStops[3], mockStops[5]], // 4 stops
    isActive: true, 
    estimatedDuration: 20
  }
];

// Mock buses with realistic positions
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
export const mockBuses: Bus[] = [
  {
    id: 'bus1',
    routeId: 'route1',
<<<<<<< HEAD
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
=======
    busNumber: 'DL-1234',
    currentStopIndex: 1,
    nextStopIndex: 2,
    coordinates: { latitude: 28.6154, longitude: 77.2105 }, // Between stops 1&2
    speed: 25,
    capacity: 50,
    currentOccupancy: 32,
    isAC: false,
    isAccessible: true,
    status: 'on_time',
    delayMinutes: 0,
    estimatedArrival: new Date(Date.now() + 4 * 60 * 1000), // 4 minutes
    lastUpdated: new Date()
  },
  {
    id: 'bus2', 
    routeId: 'route1',
    busNumber: 'DL-5678',
    currentStopIndex: 3,
    nextStopIndex: 0, // Circular route
    coordinates: { latitude: 28.6244, longitude: 77.2195 }, // Near City Mall
    speed: 20,
    capacity: 50,
    currentOccupancy: 45,
    isAC: true,
    isAccessible: false,
    status: 'delayed',
    delayMinutes: 3,
    estimatedArrival: new Date(Date.now() + 18 * 60 * 1000), // 18 minutes
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
    lastUpdated: new Date()
  },
  {
    id: 'bus3',
<<<<<<< HEAD
    routeId: 'route2',
    busNumber: 'UP-78-9012',
    currentStopIndex: 0,
    nextStopIndex: 1,
    coordinates: { latitude: 26.4660, longitude: 80.3450 },
    speed: 15,
    capacity: 60,
    currentOccupancy: 20,
=======
    routeId: 'route2', 
    busNumber: 'DL-9012',
    currentStopIndex: 0,
    nextStopIndex: 1,
    coordinates: { latitude: 28.6229, longitude: 77.2180 }, // At Metro Station
    speed: 30,
    capacity: 60,
    currentOccupancy: 28,
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
    isAC: true,
    isAccessible: true,
    status: 'on_time',
    delayMinutes: 0,
<<<<<<< HEAD
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
=======
    estimatedArrival: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
    lastUpdated: new Date()
  }
];

// Real-time simulation helpers
export const simulateBusMovement = (bus: Bus, route: BusRoute): Bus => {
  const currentTime = new Date();
  const timeDiff = currentTime.getTime() - bus.lastUpdated.getTime();
  const minutesPassed = timeDiff / (1000 * 60);
<<<<<<< HEAD

  if (minutesPassed < 0.5) return bus; // Update every 30 seconds

  // Simulate movement towards next stop
  const currentStop = route.stops[bus.currentStopIndex];
  const nextStop = route.stops[bus.nextStopIndex];

  if (!currentStop || !nextStop) return bus;

=======
  
  if (minutesPassed < 0.5) return bus; // Update every 30 seconds
  
  // Simulate movement towards next stop
  const currentStop = route.stops[bus.currentStopIndex];
  const nextStop = route.stops[bus.nextStopIndex];
  
  if (!currentStop || !nextStop) return bus;
  
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  // Calculate movement based on speed
  const speedKmH = bus.speed;
  const speedKmMin = speedKmH / 60;
  const distanceKm = speedKmMin * minutesPassed;
<<<<<<< HEAD

=======
  
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  // Simple linear interpolation for coordinates
  const latDiff = nextStop.coordinates.latitude - currentStop.coordinates.latitude;
  const lngDiff = nextStop.coordinates.longitude - currentStop.coordinates.longitude;
  const totalDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Rough km conversion
<<<<<<< HEAD

  const progress = Math.min(distanceKm / totalDistance, 1);

  const newLat = currentStop.coordinates.latitude + (latDiff * progress);
  const newLng = currentStop.coordinates.longitude + (lngDiff * progress);

  // If reached next stop, update indices
  let newCurrentIndex = bus.currentStopIndex;
  let newNextIndex = bus.nextStopIndex;

=======
  
  const progress = Math.min(distanceKm / totalDistance, 1);
  
  const newLat = currentStop.coordinates.latitude + (latDiff * progress);
  const newLng = currentStop.coordinates.longitude + (lngDiff * progress);
  
  // If reached next stop, update indices
  let newCurrentIndex = bus.currentStopIndex;
  let newNextIndex = bus.nextStopIndex;
  
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  if (progress >= 0.95) { // Almost at next stop
    newCurrentIndex = bus.nextStopIndex;
    newNextIndex = (bus.nextStopIndex + 1) % route.stops.length;
  }
<<<<<<< HEAD

  // Random delay simulation
  const randomDelay = Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0;

=======
  
  // Random delay simulation
  const randomDelay = Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0;
  
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
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