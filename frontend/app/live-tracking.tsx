import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
// import MapView, { Marker, Polyline } from 'react-native-maps';
import MapPlaceholder from '../components/MapPlaceholder';
import useAppStore from '../store/useAppStore';
import { getTranslation } from '../utils/translations';
import { Bus, BusRoute } from '../types';

const { width, height } = Dimensions.get('window');
const BOTTOM_SHEET_MIN_HEIGHT = 160;
const BOTTOM_SHEET_MAX_HEIGHT = 400;

export default function LiveTrackingScreen() {
  const { busId } = useLocalSearchParams<{ busId: string }>();
  const [panY] = useState(new Animated.Value(0));
  const [bottomSheetHeight] = useState(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT));
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    buses,
    routes,
    stops,
    currentLocation,
    hasLocationPermission,
    currentLanguage,
    toggleFavoriteRoute,
    preferences,
    updateBusPositions,
  } = useAppStore();

  const selectedBus = buses.find(bus => bus.id === busId);
  const selectedRoute = selectedBus ? routes.find(route => route.id === selectedBus.routeId) : null;

  useEffect(() => {
    if (!selectedBus || !selectedRoute) {
      router.back();
      return;
    }

    const interval = setInterval(updateBusPositions, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [selectedBus, selectedRoute, updateBusPositions]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      const newHeight = isExpanded 
        ? BOTTOM_SHEET_MAX_HEIGHT - gestureState.dy
        : BOTTOM_SHEET_MIN_HEIGHT - gestureState.dy;
      
      if (newHeight >= BOTTOM_SHEET_MIN_HEIGHT && newHeight <= BOTTOM_SHEET_MAX_HEIGHT) {
        bottomSheetHeight.setValue(newHeight);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      const velocity = gestureState.vy;
      const currentHeight = isExpanded ? BOTTOM_SHEET_MAX_HEIGHT : BOTTOM_SHEET_MIN_HEIGHT;
      
      let targetHeight;
      if (velocity > 0.5) {
        // Swipe down - collapse
        targetHeight = BOTTOM_SHEET_MIN_HEIGHT;
        setIsExpanded(false);
      } else if (velocity < -0.5) {
        // Swipe up - expand
        targetHeight = BOTTOM_SHEET_MAX_HEIGHT;
        setIsExpanded(true);
      } else {
        // Based on position
        const midPoint = (BOTTOM_SHEET_MIN_HEIGHT + BOTTOM_SHEET_MAX_HEIGHT) / 2;
        if (currentHeight > midPoint) {
          targetHeight = BOTTOM_SHEET_MAX_HEIGHT;
          setIsExpanded(true);
        } else {
          targetHeight = BOTTOM_SHEET_MIN_HEIGHT;
          setIsExpanded(false);
        }
      }
      
      Animated.spring(bottomSheetHeight, {
        toValue: targetHeight,
        useNativeDriver: false,
      }).start();
    },
  });

  if (!selectedBus || !selectedRoute) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={48} color="#FF5722" />
          <Text style={styles.errorText}>Bus not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getCurrentStop = () => {
    return selectedRoute.stops[selectedBus.currentStopIndex];
  };

  const getNextStop = () => {
    return selectedRoute.stops[selectedBus.nextStopIndex];
  };

  const getTimeUntilArrival = () => {
    const minutes = Math.ceil((selectedBus.estimatedArrival.getTime() - Date.now()) / (1000 * 60));
    return minutes > 0 ? minutes : 0;
  };

  const isFavorite = preferences.favorites.routes.includes(selectedRoute.id);
  const routeName = currentLanguage === 'hi' ? selectedRoute.routeNameHindi : selectedRoute.routeName;
  const currentStop = getCurrentStop();
  const nextStop = getNextStop();
  const currentStopName = currentStop ? (currentLanguage === 'hi' ? currentStop.nameHindi : currentStop.name) : '';
  const nextStopName = nextStop ? (currentLanguage === 'hi' ? nextStop.nameHindi : nextStop.name) : '';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {getTranslation('liveTracking', currentLanguage)}
          </Text>
          <Text style={styles.headerSubtitle}>
            Bus {selectedRoute.routeNumber}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.favoriteHeaderButton}
          onPress={() => toggleFavoriteRoute(selectedRoute.id)}
        >
          <MaterialIcons 
            name={isFavorite ? "favorite" : "favorite-border"} 
            size={24} 
            color={isFavorite ? "#E91E63" : "#666"} 
          />
        </TouchableOpacity>
      </View>

      {/* ETA Banner */}
      <View style={styles.etaBanner}>
        <View style={styles.etaContent}>
          <MaterialIcons name="access-time" size={20} color="#4CAF50" />
          <Text style={styles.etaText}>
            {getTranslation('arrivingIn', currentLanguage)} {getTimeUntilArrival()} {getTranslation('minutesAway', currentLanguage).split(' ')[1]}
          </Text>
        </View>
        <View style={[styles.statusBadge, { 
          backgroundColor: selectedBus.status === 'on_time' ? '#4CAF50' : '#FF9800' 
        }]}>
          <Text style={styles.statusText}>
            {selectedBus.status === 'on_time' 
              ? getTranslation('onTime', currentLanguage)
              : `${selectedBus.delayMinutes}min ${getTranslation('delayed', currentLanguage)}`
            }
          </Text>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapPlaceholder
          style={styles.map}
          buses={[selectedBus]}
          stops={selectedRoute.stops}
          userLocation={currentLocation}
          selectedBus={selectedBus}
        />
      </View>

      {/* Bottom Sheet */}
      <Animated.View 
        style={[
          styles.bottomSheet,
          { 
            height: bottomSheetHeight,
            transform: [{ translateY: panY }],
          }
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.bottomSheetHandle} />
        
        {/* Compact View */}
        <View style={styles.compactView}>
          <View style={styles.busInfo}>
            <MaterialIcons name="directions-bus" size={24} color="#2196F3" />
            <View style={styles.busDetails}>
              <Text style={styles.busNumber}>{selectedRoute.routeNumber}</Text>
              <Text style={styles.routeName}>{routeName}</Text>
            </View>
          </View>
          
          <View style={styles.nextStopInfo}>
            <Text style={styles.nextStopLabel}>
              {getTranslation('nextStop', currentLanguage)}:
            </Text>
            <Text style={styles.nextStopName}>{nextStopName}</Text>
          </View>
        </View>

        {/* Expanded View */}
        {isExpanded && (
          <View style={styles.expandedView}>
            {/* Route Progress */}
            <View style={styles.routeProgress}>
              <Text style={styles.progressTitle}>Route Progress</Text>
              <View style={styles.progressStops}>
                {selectedRoute.stops.map((stop, index) => {
                  const isPassed = index < selectedBus.currentStopIndex;
                  const isCurrent = index === selectedBus.currentStopIndex;
                  const isNext = index === selectedBus.nextStopIndex;
                  
                  return (
                    <View key={stop.id} style={styles.progressStop}>
                      <View style={[
                        styles.progressDot,
                        isPassed && styles.progressDotPassed,
                        isCurrent && styles.progressDotCurrent,
                      ]} />
                      <Text style={[
                        styles.progressStopName,
                        (isCurrent || isNext) && styles.progressStopNameActive,
                      ]}>
                        {currentLanguage === 'hi' ? stop.nameHindi : stop.name}
                      </Text>
                      {isCurrent && (
                        <Text style={styles.youAreHereText}>
                          {getTranslation('youAreHere', currentLanguage)}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Bus Features */}
            <View style={styles.busFeatures}>
              <Text style={styles.featuresTitle}>Bus Features</Text>
              <View style={styles.featuresList}>
                {selectedBus.isAC && (
                  <View style={styles.featureTag}>
                    <MaterialIcons name="ac-unit" size={16} color="#2196F3" />
                    <Text style={styles.featureText}>AC</Text>
                  </View>
                )}
                {selectedBus.isAccessible && (
                  <View style={styles.featureTag}>
                    <MaterialIcons name="accessible" size={16} color="#2196F3" />
                    <Text style={styles.featureText}>Wheelchair Accessible</Text>
                  </View>
                )}
                <View style={styles.occupancyTag}>
                  <MaterialIcons name="people" size={16} color="#666" />
                  <Text style={styles.occupancyText}>
                    {selectedBus.currentOccupancy}/{selectedBus.capacity} passengers
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="notifications" size={20} color="#2196F3" />
                <Text style={styles.actionButtonText}>
                  Notify at 5 min
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push(`/route-details?routeId=${selectedRoute.id}`)}
              >
                <MaterialIcons name="info" size={20} color="#4CAF50" />
                <Text style={styles.actionButtonText}>
                  Route Details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab}>
          <MaterialIcons name="my-location" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerBackButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  favoriteHeaderButton: {
    padding: 8,
  },
  etaBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  etaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  etaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  mapContainer: {
    height: 250,
    margin: 16,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  compactView: {
    paddingBottom: 16,
  },
  busInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  busDetails: {
    marginLeft: 12,
  },
  busNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2196F3',
  },
  routeName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  nextStopInfo: {
    marginBottom: 8,
  },
  nextStopLabel: {
    fontSize: 14,
    color: '#666',
  },
  nextStopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  expandedView: {
    paddingBottom: 24,
  },
  routeProgress: {
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  progressStops: {
    maxHeight: 120,
  },
  progressStop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  progressDotPassed: {
    backgroundColor: '#4CAF50',
  },
  progressDotCurrent: {
    backgroundColor: '#FF9800',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressStopName: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  progressStopNameActive: {
    color: '#333',
    fontWeight: '500',
  },
  youAreHereText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  busFeatures: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#2196F3',
    marginLeft: 4,
    fontWeight: '500',
  },
  occupancyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  occupancyText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 180,
    right: 16,
  },
  fab: {
    backgroundColor: '#2196F3',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#FF5722',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});