import { BusRoute, BusStop, Bus } from '../types';

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
    isActive: true,
    estimatedDuration: 35
  },
  {
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
export const mockBuses: Bus[] = [
  {
    id: 'bus1',
    routeId: 'route1',
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
    lastUpdated: new Date()
  },
  {
    id: 'bus3',
    routeId: 'route2', 
    busNumber: 'DL-9012',
    currentStopIndex: 0,
    nextStopIndex: 1,
    coordinates: { latitude: 28.6229, longitude: 77.2180 }, // At Metro Station
    speed: 30,
    capacity: 60,
    currentOccupancy: 28,
    isAC: true,
    isAccessible: true,
    status: 'on_time',
    delayMinutes: 0,
    estimatedArrival: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
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