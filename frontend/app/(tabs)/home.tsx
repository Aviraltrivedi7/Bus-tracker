<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
<<<<<<< HEAD
=======

>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
<<<<<<< HEAD
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeInDown,
  FadeInRight
} from 'react-native-reanimated';
import useAppStore from '../../store/useAppStore';
import { getTranslation } from '../../utils/translations';
import BusCard from '../../components/BusCard';
import { Theme } from '../../utils/theme';

const { width } = Dimensions.get('window');

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

=======
import useAppStore from '../../store/useAppStore';
import { getTranslation } from '../../utils/translations';
import BusCard from '../../components/BusCard';

const { width } = Dimensions.get('window');

>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
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
<<<<<<< HEAD
    if (!hasLocationPermission || !currentLocation) {
      return buses.slice(0, 5);
    }
=======
    // If no location, show all buses
    if (!hasLocationPermission || !currentLocation) {
      return buses.slice(0, 5); // Show first 5 buses
    }
    // In a real app, this would calculate distance from current location
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
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
<<<<<<< HEAD
      <Animated.View
        entering={FadeInDown.duration(600)}
        style={styles.header}
      >
        <View>
          <Text style={styles.headerSubtitle}>{getTranslation('welcome', currentLanguage) || 'Welcome to'}</Text>
          <Text style={styles.headerTitle}>Bus Traker</Text>
        </View>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => router.push('/(tabs)/settings')}
        >
          <MaterialIcons name="language" size={24} color={Theme.colors.primary} />
        </TouchableOpacity>
      </Animated.View>
=======
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
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
<<<<<<< HEAD
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Theme.colors.primary]}
          />
        }
      >
        {/* Search Bar */}
        <AnimatedTouchableOpacity
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.searchContainer}
          onPress={handleSearchPress}
          activeOpacity={0.8}
        >
          <MaterialIcons name="search" size={22} color={Theme.colors.text.secondary} />
          <Text style={styles.searchPlaceholder}>
            {getTranslation('searchPlaceholder', currentLanguage)}
          </Text>
          <View style={styles.searchIconContainer}>
            <MaterialIcons name="tune" size={20} color={Theme.colors.primary} />
          </View>
        </AnimatedTouchableOpacity>

        {/* Offline Mode Banner */}
        {!isOnline && (
          <Animated.View
            entering={FadeInDown}
            style={styles.offlineBanner}
          >
            <MaterialIcons name="wifi-off" size={20} color={Theme.colors.status.delayed} />
            <Text style={styles.offlineText}>
              {getTranslation('offlineMode', currentLanguage)}
            </Text>
          </Animated.View>
        )}

        {/* Location Status */}
        <Animated.View
          entering={FadeInDown.delay(300)}
          style={styles.locationContainer}
        >
          <MaterialIcons
            name={hasLocationPermission ? "location-on" : "location-off"}
            size={16}
            color={hasLocationPermission ? Theme.colors.secondary : Theme.colors.text.secondary}
          />
          <Text style={styles.locationText}>
            {hasLocationPermission
=======
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
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
              ? getTranslation('nearbyBuses', currentLanguage)
              : getTranslation('locationNotAvailable', currentLanguage)
            }
          </Text>
<<<<<<< HEAD
        </Animated.View>

        {/* Quick Access Section */}
        <View style={styles.quickAccessSection}>
          <Text style={styles.sectionTitle}>
            {getTranslation('quickAccess', currentLanguage)}
          </Text>

          <View style={styles.quickAccessGrid}>
            {[
              { id: 'routes', icon: 'route', color: Theme.colors.secondary, label: 'routes', path: '/(tabs)/routes' },
              { id: 'recent', icon: 'history', color: Theme.colors.accent, label: 'recentSearches', path: '/search' },
              { id: 'map', icon: 'map', color: Theme.colors.primary, label: 'fullMapView', path: '/(tabs)/track' }
            ].map((item, index) => (
              <AnimatedTouchableOpacity
                key={item.id}
                entering={FadeInRight.delay(400 + index * 100)}
                style={styles.quickAccessCard}
                onPress={() => router.push(item.path as any)}
              >
                <View style={[styles.quickAccessIconBg, { backgroundColor: item.color + '15' }]}>
                  <MaterialIcons name={item.icon as any} size={28} color={item.color} />
                </View>
                <Text style={styles.quickAccessText}>
                  {getTranslation(item.label as any, currentLanguage)}
                </Text>
              </AnimatedTouchableOpacity>
            ))}
          </View>
=======
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
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

<<<<<<< HEAD
          {nearbyBuses.map((bus, index) => {
            const route = routes.find(r => r.id === bus.routeId);
            if (!route) return null;

=======
          {nearbyBuses.map((bus) => {
            const route = routes.find(r => r.id === bus.routeId);
            if (!route) return null;


>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
            return (
              <BusCard
                key={bus.id}
                bus={bus}
                route={route}
                onPress={() => handleBusPress(bus.id)}
                currentLanguage={currentLanguage}
<<<<<<< HEAD
                index={index}
=======
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
              />
            );
          })}

          {nearbyBuses.length === 0 && (
<<<<<<< HEAD
            <Animated.View
              entering={FadeInDown.delay(500)}
              style={styles.emptyState}
            >
              <View style={styles.emptyIconCircle}>
                <MaterialIcons name="bus-alert" size={48} color={Theme.colors.text.muted} />
              </View>
=======
            <View style={styles.emptyState}>
              <MaterialIcons name="directions-bus" size={48} color="#E0E0E0" />
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
              <Text style={styles.emptyStateText}>
                {getTranslation('busServiceUnavailable', currentLanguage)}
              </Text>
              <Text style={styles.emptyStateSubText}>
                {getTranslation('tryAgainLater', currentLanguage)}
              </Text>
<<<<<<< HEAD
            </Animated.View>
          )}
        </View>
=======
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
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: Theme.colors.background,
=======
    backgroundColor: '#F5F5F5',
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
<<<<<<< HEAD
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    ...Theme.shadows.sm,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Theme.colors.primary,
  },
  languageButton: {
    padding: 10,
    backgroundColor: Theme.colors.primary + '10',
    borderRadius: Theme.radius.md,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Theme.spacing.xl,
=======
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
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
    backgroundColor: Theme.colors.surface,
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 14,
    borderRadius: Theme.radius.lg,
    ...Theme.shadows.sm,
=======
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
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
<<<<<<< HEAD
    color: Theme.colors.text.secondary,
    flex: 1,
  },
  searchIconContainer: {
    padding: 4,
    borderLeftWidth: 1,
    borderLeftColor: Theme.colors.border,
    paddingLeft: 12,
=======
    color: '#757575',
    flex: 1,
  },
  content: {
    flex: 1,
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
    backgroundColor: Theme.colors.status.delayed + '15',
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 12,
    borderRadius: Theme.radius.md,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.status.delayed,
=======
    backgroundColor: '#FFF3E0',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  },
  offlineText: {
    marginLeft: 8,
    fontSize: 14,
<<<<<<< HEAD
    color: Theme.colors.status.delayed,
    fontWeight: '600',
=======
    color: '#F57C00',
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
    marginHorizontal: Theme.spacing.md,
    marginVertical: Theme.spacing.md,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 13,
    color: Theme.colors.text.secondary,
    fontWeight: '600',
  },
  section: {
    marginTop: Theme.spacing.md,
=======
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
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
<<<<<<< HEAD
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text.primary,
  },
  viewAllText: {
    fontSize: 14,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  quickAccessSection: {
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.md,
  },
  quickAccessCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: (width - (Theme.spacing.md * 3)) / 3,
    ...Theme.shadows.sm,
  },
  quickAccessIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickAccessText: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    textAlign: 'center',
=======
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
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
<<<<<<< HEAD
    padding: Theme.spacing.xl,
    backgroundColor: Theme.colors.surface,
    marginHorizontal: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    marginTop: Theme.spacing.sm,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.text.primary,
=======
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
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
    textAlign: 'center',
  },
  emptyStateSubText: {
    fontSize: 14,
<<<<<<< HEAD
    color: Theme.colors.text.secondary,
    marginTop: 4,
=======
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
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
    textAlign: 'center',
  },
});