import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, JourneyPlan, BusStop, RouteOption, JourneyStep } from '../types';
import { mockBuses, mockRoutes, mockStops, simulateBusMovement } from '../data/mockData';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  buses: mockBuses,
  routes: mockRoutes,
  stops: mockStops,
  currentJourneyPlan: null,
  isPlanning: false,
  preferences: {
    language: 'en',
    notifications: {
      enabled: true,
      arrivalAlert: true,
      arrivalMinutes: 5,
      vibration: true
    },
    routePlanner: {
      recentJourneys: [],
      preferredRouteTypes: ['fastest'],
      maxWalkingDistance: 500 // 500 meters
    },
    favorites: {
      routes: [],
      stops: []
    },
    recentSearches: []
  },
  currentLocation: null,
  isLoading: false,
  hasLocationPermission: false,
  hasNotificationPermission: false,
  isOnline: true,
  currentLanguage: 'en',

  // Actions
  updateBusPositions: () => {
    const { buses, routes } = get();
    const updatedBuses = buses.map(bus => {
      const route = routes.find(r => r.id === bus.routeId);
      return route ? simulateBusMovement(bus, route) : bus;
    });
    
    set({ buses: updatedBuses });
  },

  setCurrentLocation: (location) => {
    set({ currentLocation: location });
  },

  planJourney: async (fromStop: BusStop, toStop: BusStop): Promise<JourneyPlan> => {
    set({ isPlanning: true });
    
    try {
      const { routes, buses } = get();
      
      // Find routes that connect the two stops
      const routeOptions: RouteOption[] = [];
      
      // Direct route (no transfers)
      routes.forEach(route => {
        const fromIndex = route.stops.findIndex(stop => stop.id === fromStop.id);
        const toIndex = route.stops.findIndex(stop => stop.id === toStop.id);
        
        if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
          const routeBuses = buses.filter(bus => bus.routeId === route.id && bus.status !== 'breakdown');
          
          if (routeBuses.length > 0) {
            const steps: JourneyStep[] = [{
              type: 'bus',
              description: `Take Bus ${route.routeNumber} from ${fromStop.name} to ${toStop.name}`,
              descriptionHindi: `बस ${route.routeNumber} से ${fromStop.nameHindi} से ${toStop.nameHindi} जाएं`,
              duration: (toIndex - fromIndex) * 3, // 3 minutes per stop
              route,
              fromStop,
              toStop
            }];
            
            routeOptions.push({
              id: `direct-${route.id}`,
              buses: routeBuses,
              routes: [route],
              transfers: 0,
              totalDuration: (toIndex - fromIndex) * 3,
              walkingDistance: 0,
              estimatedFare: 10, // Base fare
              steps
            });
          }
        }
      });
      
      // Routes with transfers
      routes.forEach(route1 => {
        const fromIndex1 = route1.stops.findIndex(stop => stop.id === fromStop.id);
        
        if (fromIndex1 !== -1) {
          routes.forEach(route2 => {
            if (route1.id === route2.id) return;
            
            const toIndex2 = route2.stops.findIndex(stop => stop.id === toStop.id);
            
            if (toIndex2 !== -1) {
              // Find common stops for transfer
              const transferStops = route1.stops.filter(stop1 => 
                route2.stops.some(stop2 => stop2.id === stop1.id)
              );
              
              if (transferStops.length > 0) {
                const transferStop = transferStops[0];
                const transfer1Index = route1.stops.findIndex(s => s.id === transferStop.id);
                const transfer2Index = route2.stops.findIndex(s => s.id === transferStop.id);
                
                if (transfer1Index > fromIndex1 && transfer2Index < toIndex2) {
                  const buses1 = buses.filter(bus => bus.routeId === route1.id && bus.status !== 'breakdown');
                  const buses2 = buses.filter(bus => bus.routeId === route2.id && bus.status !== 'breakdown');
                  
                  if (buses1.length > 0 && buses2.length > 0) {
                    const steps: JourneyStep[] = [
                      {
                        type: 'bus',
                        description: `Take Bus ${route1.routeNumber} from ${fromStop.name} to ${transferStop.name}`,
                        descriptionHindi: `बस ${route1.routeNumber} से ${fromStop.nameHindi} से ${transferStop.nameHindi} जाएं`,
                        duration: (transfer1Index - fromIndex1) * 3,
                        route: route1,
                        fromStop,
                        toStop: transferStop
                      },
                      {
                        type: 'transfer',
                        description: `Transfer at ${transferStop.name}`,
                        descriptionHindi: `${transferStop.nameHindi} पर बदलें`,
                        duration: 5, // 5 minutes transfer time
                        fromStop: transferStop,
                        toStop: transferStop
                      },
                      {
                        type: 'bus',
                        description: `Take Bus ${route2.routeNumber} from ${transferStop.name} to ${toStop.name}`,
                        descriptionHindi: `बस ${route2.routeNumber} से ${transferStop.nameHindi} से ${toStop.nameHindi} जाएं`,
                        duration: (toIndex2 - transfer2Index) * 3,
                        route: route2,
                        fromStop: transferStop,
                        toStop
                      }
                    ];
                    
                    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
                    
                    routeOptions.push({
                      id: `transfer-${route1.id}-${route2.id}`,
                      buses: [...buses1, ...buses2],
                      routes: [route1, route2],
                      transfers: 1,
                      totalDuration,
                      walkingDistance: 100, // Assume 100m walking for transfer
                      estimatedFare: 15, // Higher fare for transfers
                      steps
                    });
                  }
                }
              }
            }
          });
        }
      });
      
      // Sort by total duration (fastest first)
      routeOptions.sort((a, b) => a.totalDuration - b.totalDuration);
      
      const journeyPlan: JourneyPlan = {
        id: `journey-${Date.now()}`,
        fromStop,
        toStop,
        routes: routeOptions.slice(0, 3), // Top 3 options
        totalDuration: routeOptions[0]?.totalDuration || 0,
        createdAt: new Date()
      };
      
      set({ currentJourneyPlan: journeyPlan, isPlanning: false });
      
      // Add to recent journeys
      get().addRecentJourney(journeyPlan);
      
      return journeyPlan;
      
    } catch (error) {
      console.error('Error planning journey:', error);
      set({ isPlanning: false });
      throw error;
    }
  },

  addRecentJourney: async (journey: JourneyPlan) => {
    const { preferences } = get();
    const recentJourneys = [journey, ...preferences.routePlanner.recentJourneys.filter(j => j.id !== journey.id)].slice(0, 10);
    
    const newPreferences = {
      ...preferences,
      routePlanner: {
        ...preferences.routePlanner,
        recentJourneys
      }
    };
    
    set({ preferences: newPreferences });
    await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  },

  clearCurrentJourneyPlan: () => {
    set({ currentJourneyPlan: null });
  },

  setLanguage: async (language) => {
    const { preferences } = get();
    const newPreferences = { ...preferences, language };
    
    set({ 
      preferences: newPreferences,
      currentLanguage: language 
    });
    await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  },

  addRecentSearch: async (search) => {
    const { preferences } = get();
    const recentSearches = [search, ...preferences.recentSearches.filter(s => s !== search)].slice(0, 10);
    
    const newPreferences = {
      ...preferences,
      recentSearches
    };
    
    set({ preferences: newPreferences });
    await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  },

  toggleFavoriteRoute: async (routeId) => {
    const { preferences } = get();
    const isFav = preferences.favorites.routes.includes(routeId);
    const routes = isFav
      ? preferences.favorites.routes.filter(id => id !== routeId)
      : [routeId, ...preferences.favorites.routes];

    const newPreferences = {
      ...preferences,
      favorites: {
        ...preferences.favorites,
        routes
      }
    };
    set({ preferences: newPreferences });
    await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  },

  toggleFavoriteStop: async (stopId) => {
    const { preferences } = get();
    const isFav = preferences.favorites.stops.includes(stopId);
    const stops = isFav
      ? preferences.favorites.stops.filter(id => id !== stopId)
      : [stopId, ...preferences.favorites.stops];

    const newPreferences = {
      ...preferences,
      favorites: {
        ...preferences.favorites,
        stops
      }
    };
    set({ preferences: newPreferences });
    await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  },

  requestPermissions: async () => {
    set({ isLoading: true });
    
    try {
      // Request location permission
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      const hasLocationPermission = locationStatus === 'granted';
      
      // Request notification permission
      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
      const hasNotificationPermission = notificationStatus === 'granted';
      
      // Get current location if permission granted
      let currentLocation = null;
      if (hasLocationPermission) {
        try {
          const location = await Location.getCurrentPositionAsync({});
          currentLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          };
        } catch (error) {
          console.log('Error getting location:', error);
        }
      }
      
      set({
        hasLocationPermission,
        hasNotificationPermission,
        currentLocation,
        isLoading: false
      });
      
      // Load saved preferences
      try {
        const savedPreferences = await AsyncStorage.getItem('userPreferences');
        if (savedPreferences) {
          const loaded = JSON.parse(savedPreferences);
          // Backfill missing fields for older saved data
          const preferences = {
            language: loaded.language ?? 'en',
            notifications: loaded.notifications ?? {
              enabled: true,
              arrivalAlert: true,
              arrivalMinutes: 5,
              vibration: true,
            },
            routePlanner: loaded.routePlanner ?? {
              recentJourneys: [],
              preferredRouteTypes: ['fastest'],
              maxWalkingDistance: 500,
            },
            favorites: loaded.favorites ?? { routes: [], stops: [] },
            recentSearches: loaded.recentSearches ?? [],
          };
          set({ 
            preferences,
            currentLanguage: preferences.language 
          });
        }
      } catch (error) {
        console.log('Error loading preferences:', error);
      }
      
    } catch (error) {
      console.log('Error requesting permissions:', error);
      set({ isLoading: false });
    }
  }
}));

export default useAppStore;