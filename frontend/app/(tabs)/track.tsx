import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
// import MapView, { Marker, Polyline } from 'react-native-maps';
import MapPlaceholder from '../../components/MapPlaceholder';
import useAppStore from '../../store/useAppStore';
import { getTranslation } from '../../utils/translations';
import { Bus, BusRoute } from '../../types';

const { width, height } = Dimensions.get('window');

export default function TrackScreen() {
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  
  const {
    buses,
    routes,
    stops,
    currentLocation,
    hasLocationPermission,
    currentLanguage,
    updateBusPositions,
  } = useAppStore();

  useEffect(() => {
    const interval = setInterval(updateBusPositions, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [updateBusPositions]);

  const handleBusPress = (bus: Bus) => {
    setSelectedBus(bus);
    setShowRouteDetails(true);
  };

  const selectedRoute = selectedBus ? routes.find(r => r.id === selectedBus.routeId) : null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {getTranslation('liveTracking', currentLanguage)}
        </Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={updateBusPositions}
        >
          <MaterialIcons name="refresh" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapPlaceholder
          style={styles.map}
          buses={buses}
          stops={stops}
          userLocation={currentLocation}
          selectedBus={selectedBus}
        />
      </View>

      {/* Bottom Sheet */}
      {selectedBus && selectedRoute && (
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHandle} />
          
          <View style={styles.busDetails}>
            <View style={styles.busHeader}>
              <View style={styles.busInfo}>
                <MaterialIcons name="directions-bus" size={24} color="#2196F3" />
                <Text style={styles.busNumber}>{selectedRoute.routeNumber}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setSelectedBus(null)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.routeName}>
              {currentLanguage === 'hi' ? selectedRoute.routeNameHindi : selectedRoute.routeName}
            </Text>

            {/* Next Stop Info */}
            <View style={styles.nextStopContainer}>
              <MaterialIcons name="location-on" size={20} color="#4CAF50" />
              <View style={styles.nextStopInfo}>
                <Text style={styles.nextStopLabel}>
                  {getTranslation('nextStop', currentLanguage)}:
                </Text>
                <Text style={styles.nextStopName}>
                  {currentLanguage === 'hi' 
                    ? selectedRoute.stops[selectedBus.nextStopIndex]?.nameHindi 
                    : selectedRoute.stops[selectedBus.nextStopIndex]?.name
                  }
                </Text>
                <Text style={styles.eta}>
                  {getTranslation('arrivingIn', currentLanguage)} {Math.ceil((selectedBus.estimatedArrival.getTime() - Date.now()) / (1000 * 60))} min
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="notifications" size={20} color="#2196F3" />
                <Text style={styles.actionButtonText}>
                  {getTranslation('notifyWhen', currentLanguage)} 5 {getTranslation('minutesAway', currentLanguage)}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="favorite-border" size={20} color="#E91E63" />
                <Text style={styles.actionButtonText}>Save Route</Text>
              </TouchableOpacity>
            </View>

            {/* Bus Features */}
            <View style={styles.busFeatures}>
              {selectedBus.isAC && (
                <View style={styles.featureTag}>
                  <MaterialIcons name="ac-unit" size={16} color="#2196F3" />
                  <Text style={styles.featureText}>AC</Text>
                </View>
              )}
              {selectedBus.isAccessible && (
                <View style={styles.featureTag}>
                  <MaterialIcons name="accessible" size={16} color="#2196F3" />
                  <Text style={styles.featureText}>
                    {currentLanguage === 'hi' ? 'सुलभ' : 'Accessible'}
                  </Text>
                </View>
              )}
              <View style={styles.occupancyInfo}>
                <MaterialIcons name="people" size={16} color="#666" />
                <Text style={styles.occupancyText}>
                  {selectedBus.currentOccupancy}/{selectedBus.capacity}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Bus List */}
      {!selectedBus && (
        <View style={styles.busList}>
          <Text style={styles.busListTitle}>Active Buses</Text>
          {buses.map((bus) => {
            const route = routes.find(r => r.id === bus.routeId);
            if (!route) return null;
            
            return (
              <TouchableOpacity 
                key={bus.id}
                style={styles.busListItem}
                onPress={() => handleBusPress(bus)}
              >
                <MaterialIcons name="directions-bus" size={20} color="#2196F3" />
                <View style={styles.busListItemContent}>
                  <Text style={styles.busListItemNumber}>{route.routeNumber}</Text>
                  <Text style={styles.busListItemRoute}>
                    {currentLanguage === 'hi' ? route.routeNameHindi : route.routeName}
                  </Text>
                </View>
                <View style={[styles.statusDot, { 
                  backgroundColor: bus.status === 'on_time' ? '#4CAF50' : '#FF9800' 
                }]} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <MaterialIcons name="my-location" size={24} color="white" />
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  mapContainer: {
    height: 250,
    margin: 16,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  busList: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  busListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  busListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 8,
  },
  busListItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  busListItemNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  busListItemRoute: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
    paddingBottom: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
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
  busDetails: {
    paddingBottom: 16,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  busInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2196F3',
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 16,
  },
  nextStopContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  nextStopInfo: {
    marginLeft: 12,
    flex: 1,
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
  eta: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  busFeatures: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#2196F3',
    marginLeft: 4,
    fontWeight: '500',
  },
  occupancyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  occupancyText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 16,
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
});