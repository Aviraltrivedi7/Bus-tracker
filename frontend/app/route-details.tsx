import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import useAppStore from '../store/useAppStore';
import { getTranslation } from '../utils/translations';
import { BusRoute, Bus } from '../types';

export default function RouteDetailsScreen() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  
  const {
    buses,
    routes,
    currentLanguage,
    preferences,
    toggleFavoriteRoute,
    updateBusPositions,
  } = useAppStore();

  const selectedRoute = routes.find(route => route.id === routeId);
  const routeBuses = buses.filter(bus => bus.routeId === routeId);

  useEffect(() => {
    if (!selectedRoute) {
      router.back();
      return;
    }

    const interval = setInterval(updateBusPositions, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [selectedRoute, updateBusPositions]);

  if (!selectedRoute) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={48} color="#FF5722" />
          <Text style={styles.errorText}>Route not found</Text>
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

  const isFavorite = preferences.favorites.routes.includes(selectedRoute.id);
  const routeName = currentLanguage === 'hi' ? selectedRoute.routeNameHindi : selectedRoute.routeName;

  const getBusForStop = (stopIndex: number): Bus | null => {
    // Find bus that's at or approaching this stop
    return routeBuses.find(bus => 
      bus.currentStopIndex === stopIndex || 
      bus.nextStopIndex === stopIndex
    ) || null;
  };

  const getStopStatus = (stopIndex: number, bus: Bus | null) => {
    if (!bus) return 'scheduled';
    
    if (stopIndex < bus.currentStopIndex) {
      return 'departed';
    } else if (stopIndex === bus.currentStopIndex) {
      return 'current';
    } else if (stopIndex === bus.nextStopIndex) {
      return 'approaching';
    } else {
      return 'upcoming';
    }
  };

  const getStopETA = (stopIndex: number, bus: Bus | null) => {
    if (!bus) return null;
    
    const status = getStopStatus(stopIndex, bus);
    
    if (status === 'current' || status === 'approaching') {
      const minutes = Math.ceil((bus.estimatedArrival.getTime() - Date.now()) / (1000 * 60));
      return minutes > 0 ? `${minutes} min` : 'Arriving';
    }
    
    if (status === 'upcoming') {
      // Calculate rough ETA based on remaining stops
      const stopsAway = stopIndex - bus.currentStopIndex;
      const estimatedMinutes = stopsAway * 3; // Assume 3 minutes between stops
      return `~${estimatedMinutes} min`;
    }
    
    return null;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'departed':
        return 'check-circle';
      case 'current':
        return 'radio-button-checked';
      case 'approaching':
        return 'radio-button-checked';
      case 'upcoming':
        return 'radio-button-unchecked';
      default:
        return 'schedule';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'departed':
        return '#4CAF50';
      case 'current':
        return '#FF9800';
      case 'approaching':
        return '#FF9800';
      case 'upcoming':
        return '#2196F3';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status: string, bus: Bus | null) => {
    if (currentLanguage === 'hi') {
      switch (status) {
        case 'departed':
          return 'प्रस्थान';
        case 'current':
          return 'वर्तमान';
        case 'approaching':
          return 'आ रही है';
        case 'upcoming':
          return 'आगामी';
        default:
          return 'समय सारणी';
      }
    }
    
    switch (status) {
      case 'departed':
        return 'Departed';
      case 'current':
        return 'Current Stop';
      case 'approaching':
        return `Arriving ${getStopETA(0, bus)}`;
      case 'upcoming':
        return 'Upcoming';
      default:
        return 'Scheduled';
    }
  };

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
            {getTranslation('routeDetails', currentLanguage)}
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

      {/* Route Info */}
      <View style={styles.routeInfo}>
        <View style={styles.routeHeader}>
          <MaterialIcons name="directions-bus" size={24} color="#2196F3" />
          <View style={styles.routeHeaderText}>
            <Text style={styles.routeNumber}>{selectedRoute.routeNumber}</Text>
            <Text style={styles.routeName}>{routeName}</Text>
          </View>
          <Text style={styles.stopsCount}>
            {selectedRoute.stops.length} {getTranslation('stops', currentLanguage)}
          </Text>
        </View>

        <View style={styles.routeStats}>
          <View style={styles.statItem}>
            <MaterialIcons name="schedule" size={16} color="#666" />
            <Text style={styles.statText}>~{selectedRoute.estimatedDuration} min</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="directions-bus" size={16} color="#666" />
            <Text style={styles.statText}>{routeBuses.length} buses running</Text>
          </View>
        </View>
      </View>

      {/* Route Timeline */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.timeline}>
          <Text style={styles.timelineTitle}>Route Timeline</Text>
          
          {selectedRoute.stops.map((stop, index) => {
            const bus = getBusForStop(index);
            const status = getStopStatus(index, bus);
            const eta = getStopETA(index, bus);
            const statusIcon = getStatusIcon(status);
            const statusColor = getStatusColor(status);
            const statusText = getStatusText(status, bus);
            
            const isLast = index === selectedRoute.stops.length - 1;
            
            return (
              <View key={stop.id} style={styles.timelineItem}>
                {/* Timeline Line */}
                <View style={styles.timelineLineContainer}>
                  <View style={[styles.timelineDot, { backgroundColor: statusColor }]}>
                    <MaterialIcons name={statusIcon} size={16} color="white" />
                  </View>
                  {!isLast && <View style={styles.timelineLine} />}
                </View>
                
                {/* Stop Details */}
                <View style={styles.stopDetails}>
                  <View style={styles.stopHeader}>
                    <Text style={styles.stopName}>
                      {currentLanguage === 'hi' ? stop.nameHindi : stop.name}
                    </Text>
                    {eta && (
                      <View style={[styles.etaBadge, { backgroundColor: statusColor }]}>
                        <Text style={styles.etaText}>{eta}</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.stopMeta}>
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {statusText}
                    </Text>
                    {bus && bus.delayMinutes > 0 && (
                      <Text style={styles.delayText}>
                        {bus.delayMinutes}min {getTranslation('delayed', currentLanguage)}
                      </Text>
                    )}
                  </View>
                  
                  {/* Stop Amenities */}
                  {stop.amenities.length > 0 && (
                    <View style={styles.amenities}>
                      {stop.amenities.map((amenity, amenityIndex) => (
                        <View key={amenityIndex} style={styles.amenityTag}>
                          <MaterialIcons 
                            name={getAmenityIcon(amenity)} 
                            size={12} 
                            color="#666" 
                          />
                          <Text style={styles.amenityText}>{amenity.replace('_', ' ')}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  
                  {/* Current Position Indicator */}
                  {status === 'current' && (
                    <View style={styles.currentPositionIndicator}>
                      <MaterialIcons name="my-location" size={16} color="#FF9800" />
                      <Text style={styles.currentPositionText}>
                        {getTranslation('youAreHere', currentLanguage)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
        
        {/* Service Updates */}
        <View style={styles.serviceUpdates}>
          <Text style={styles.serviceUpdatesTitle}>Service Updates</Text>
          
          {routeBuses.some(bus => bus.status === 'delayed') && (
            <View style={styles.serviceUpdate}>
              <MaterialIcons name="warning" size={20} color="#FF9800" />
              <Text style={styles.serviceUpdateText}>
                Some buses are running {Math.max(...routeBuses.map(b => b.delayMinutes))} minutes late due to traffic conditions.
              </Text>
            </View>
          )}
          
          {routeBuses.some(bus => bus.status === 'breakdown') && (
            <View style={styles.serviceUpdate}>
              <MaterialIcons name="error" size={20} color="#FF5722" />
              <Text style={styles.serviceUpdateText}>
                Service disruption: One bus is temporarily out of service. Alternative routes available.
              </Text>
            </View>
          )}
          
          {routeBuses.every(bus => bus.status === 'on_time') && (
            <View style={styles.serviceUpdate}>
              <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.serviceUpdateText}>
                All buses are running on time. No service disruptions.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/track')}
        >
          <MaterialIcons name="map" size={20} color="#2196F3" />
          <Text style={styles.actionButtonText}>View on Map</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="notifications" size={20} color="#FF9800" />
          <Text style={styles.actionButtonText}>Set Alert</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, isFavorite && styles.favoriteActionButton]}
          onPress={() => toggleFavoriteRoute(selectedRoute.id)}
        >
          <MaterialIcons 
            name={isFavorite ? "favorite" : "favorite-border"} 
            size={20} 
            color={isFavorite ? "white" : "#E91E63"} 
          />
          <Text style={[styles.actionButtonText, isFavorite && styles.favoriteActionButtonText]}>
            {isFavorite ? 'Saved' : 'Save Route'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getAmenityIcon = (amenity: string) => {
  switch (amenity) {
    case 'shelter':
      return 'home';
    case 'seating':
      return 'chair';
    case 'display_board':
      return 'tv';
    case 'wifi':
      return 'wifi';
    case 'accessibility':
      return 'accessible';
    case 'food_court':
      return 'restaurant';
    case 'student_discount':
      return 'school';
    case 'luggage_space':
      return 'luggage';
    default:
      return 'info';
  }
};

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
  routeInfo: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  routeNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2196F3',
  },
  routeName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  stopsCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  routeStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  timeline: {
    backgroundColor: 'white',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingBottom: 20,
  },
  timelineLineContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 8,
    minHeight: 40,
  },
  stopDetails: {
    flex: 1,
    paddingTop: 4,
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  etaBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  etaText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  stopMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 12,
  },
  delayText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '500',
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  amenityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  amenityText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 2,
    textTransform: 'capitalize',
  },
  currentPositionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  currentPositionText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 4,
    fontWeight: '600',
  },
  serviceUpdates: {
    backgroundColor: 'white',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  serviceUpdatesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  serviceUpdate: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  serviceUpdateText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    flex: 1,
    justifyContent: 'center',
  },
  favoriteActionButton: {
    backgroundColor: '#E91E63',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  favoriteActionButtonText: {
    color: 'white',
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