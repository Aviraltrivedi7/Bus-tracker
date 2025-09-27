import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,

  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import useAppStore from '../../store/useAppStore';
import { getTranslation } from '../../utils/translations';
import BusCard from '../../components/BusCard';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const {
    buses,
    routes,
    preferences,
    currentLanguage,
    currentLocation,
    hasLocationPermission,
    isOnline,
    updateBusPositions,
  } = useAppStore();

  const onRefresh = async () => {
    setRefreshing(true);
    updateBusPositions();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getNearbyBuses = () => {
    // If no location, show all buses
    if (!hasLocationPermission || !currentLocation) {
      return buses.slice(0, 5); // Show first 5 buses
    }
    // In a real app, this would calculate distance from current location
    return buses.filter(bus => bus.status !== 'breakdown').slice(0, 5);
  };

  const nearbyBuses = getNearbyBuses();

  const handleBusPress = (busId: string) => {
    router.push(`/live-tracking?busId=${busId}`);
  };

  const handleSearchPress = () => {
    router.push('/search');
  };

  const handleMapViewPress = () => {
    router.push('/(tabs)/track');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bus Traker</Text>
        <TouchableOpacity 
          style={styles.languageButton}
          onPress={() => router.push('/(tabs)/settings')}
        >
          <MaterialIcons name="language" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity style={styles.searchContainer} onPress={handleSearchPress}>
        <MaterialIcons name="search" size={20} color="#757575" />
        <Text style={styles.searchPlaceholder}>
          {getTranslation('searchPlaceholder', currentLanguage)}
        </Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Offline Mode Banner */}
        {!isOnline && (
          <View style={styles.offlineBanner}>
            <MaterialIcons name="wifi-off" size={20} color="#FF9800" />
            <Text style={styles.offlineText}>
              {getTranslation('offlineMode', currentLanguage)}
            </Text>
          </View>
        )}

        {/* Location Status */}
        <View style={styles.locationContainer}>
          <MaterialIcons 
            name={hasLocationPermission ? "location-on" : "location-off"} 
            size={16} 
            color={hasLocationPermission ? "#4CAF50" : "#757575"} 
          />
          <Text style={styles.locationText}>
            {hasLocationPermission 
              ? getTranslation('nearbyBuses', currentLanguage)
              : getTranslation('locationNotAvailable', currentLanguage)
            }
          </Text>
        </View>

        {/* Nearby Buses Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {getTranslation('nearbyBuses', currentLanguage)}
            </Text>
            <TouchableOpacity onPress={handleMapViewPress}>
              <Text style={styles.viewAllText}>
                {getTranslation('fullMapView', currentLanguage)}
              </Text>
            </TouchableOpacity>
          </View>

          {nearbyBuses.map((bus) => {
            const route = routes.find(r => r.id === bus.routeId);
            if (!route) return null;


            return (
              <BusCard
                key={bus.id}
                bus={bus}
                route={route}
                onPress={() => handleBusPress(bus.id)}
                currentLanguage={currentLanguage}
              />
            );
          })}

          {nearbyBuses.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialIcons name="directions-bus" size={48} color="#E0E0E0" />
              <Text style={styles.emptyStateText}>
                {getTranslation('busServiceUnavailable', currentLanguage)}
              </Text>
              <Text style={styles.emptyStateSubText}>
                {getTranslation('tryAgainLater', currentLanguage)}
              </Text>
            </View>
          )}
        </View>

        {/* Quick Access Section */}
        <View style={styles.quickAccessSection}>
          <Text style={styles.sectionTitle}>
            {getTranslation('quickAccess', currentLanguage)}
          </Text>
          
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity 
              style={styles.quickAccessCard}
              onPress={() => router.push('/(tabs)/routes')}
            >
              <MaterialIcons name="route" size={32} color="#4CAF50" />
              <Text style={styles.quickAccessText}>
                {getTranslation('routes', currentLanguage)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAccessCard}
              onPress={handleSearchPress}
            >
              <MaterialIcons name="history" size={32} color="#FF9800" />
              <Text style={styles.quickAccessText}>
                {getTranslation('recentSearches', currentLanguage)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAccessCard}
              onPress={handleMapViewPress}
            >
              <MaterialIcons name="map" size={32} color="#2196F3" />
              <Text style={styles.quickAccessText}>
                {getTranslation('fullMapView', currentLanguage)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    color: '#2196F3',
  },
  languageButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
    color: '#757575',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  offlineText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#F57C00',
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  quickAccessSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickAccessCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: (width - 48) / 3, // Account for margins
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickAccessText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
});