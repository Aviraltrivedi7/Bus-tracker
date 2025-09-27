export interface BusStop {
  id: string;
  name: string;
  nameHindi: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  amenities: string[];
}

export interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  routeNameHindi: string;
  stops: BusStop[];
  isActive: boolean;
  estimatedDuration: number; // in minutes
}

export interface Bus {
  id: string;
  routeId: string;
  busNumber: string;
  currentStopIndex: number;
  nextStopIndex: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  speed: number; // km/h
  capacity: number;
  currentOccupancy: number;
  isAC: boolean;
  isAccessible: boolean;
  status: 'on_time' | 'delayed' | 'early' | 'breakdown';
  delayMinutes: number;
  estimatedArrival: Date;
  lastUpdated: Date;
}

export interface JourneyPlan {
  id: string;
  fromStop: BusStop;
  toStop: BusStop;
  routes: RouteOption[];
  totalDuration: number;
  createdAt: Date;
}

export interface RouteOption {
  id: string;
  buses: Bus[];
  routes: BusRoute[];
  transfers: number;
  totalDuration: number;
  walkingDistance: number; // in meters
  estimatedFare: number; // in currency units
  steps: JourneyStep[];
}

export interface JourneyStep {
  type: 'walk' | 'bus' | 'transfer';
  description: string;
  descriptionHindi: string;
  duration: number; // in minutes
  route?: BusRoute;
  fromStop?: BusStop;
  toStop?: BusStop;
  distance?: number; // for walking steps
}

export interface UserPreferences {
  language: 'en' | 'hi' | 'regional';
  notifications: {
    enabled: boolean;
    arrivalAlert: boolean;
    arrivalMinutes: number;
    vibration: boolean;
  };
  routePlanner: {
    recentJourneys: JourneyPlan[];
    preferredRouteTypes: string[]; // ['fastest', 'cheapest', 'least_transfers']
    maxWalkingDistance: number;
  };
  favorites: {
    routes: string[];
    stops: string[];
  };
  recentSearches: string[];
}

export interface AppState {
  // Bus data
  buses: Bus[];
  routes: BusRoute[];
  stops: BusStop[];
  
  // Route planning
  currentJourneyPlan: JourneyPlan | null;
  isPlanning: boolean;
  
  // User data  
  preferences: UserPreferences;
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
  
  // App state
  isLoading: boolean;
  hasLocationPermission: boolean;
  hasNotificationPermission: boolean;
  isOnline: boolean;
  currentLanguage: 'en' | 'hi' | 'regional';
  
  // Actions
  updateBusPositions: () => void;
  setCurrentLocation: (location: { latitude: number; longitude: number }) => void;
  planJourney: (fromStop: BusStop, toStop: BusStop) => Promise<JourneyPlan>;
  addRecentJourney: (journey: JourneyPlan) => void;
  clearCurrentJourneyPlan: () => void;
  setLanguage: (language: 'en' | 'hi' | 'regional') => void;
  addRecentSearch: (search: string) => void;
  toggleFavoriteRoute: (routeId: string) => void;
  toggleFavoriteStop: (stopId: string) => void;
  requestPermissions: () => Promise<void>;
}
