import React, { useState, useEffect } from 'react';
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
    if (!hasLocationPermission || !currentLocation) {
      return buses.slice(0, 5);
    }
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

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
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
              ? getTranslation('nearbyBuses', currentLanguage)
              : getTranslation('locationNotAvailable', currentLanguage)
            }
          </Text>
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

          {nearbyBuses.map((bus, index) => {
            const route = routes.find(r => r.id === bus.routeId);
            if (!route) return null;

            return (
              <BusCard
                key={bus.id}
                bus={bus}
                route={route}
                onPress={() => handleBusPress(bus.id)}
                currentLanguage={currentLanguage}
                index={index}
              />
            );
          })}

          {nearbyBuses.length === 0 && (
            <Animated.View
              entering={FadeInDown.delay(500)}
              style={styles.emptyState}
            >
              <View style={styles.emptyIconCircle}>
                <MaterialIcons name="bus-alert" size={48} color={Theme.colors.text.muted} />
              </View>
              <Text style={styles.emptyStateText}>
                {getTranslation('busServiceUnavailable', currentLanguage)}
              </Text>
              <Text style={styles.emptyStateSubText}>
                {getTranslation('tryAgainLater', currentLanguage)}
              </Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 14,
    borderRadius: Theme.radius.lg,
    ...Theme.shadows.sm,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
    color: Theme.colors.text.secondary,
    flex: 1,
  },
  searchIconContainer: {
    padding: 4,
    borderLeftWidth: 1,
    borderLeftColor: Theme.colors.border,
    paddingLeft: 12,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.status.delayed + '15',
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 12,
    borderRadius: Theme.radius.md,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.status.delayed,
  },
  offlineText: {
    marginLeft: 8,
    fontSize: 14,
    color: Theme.colors.status.delayed,
    fontWeight: '600',
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center',
  },
  emptyStateSubText: {
    fontSize: 14,
    color: Theme.colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
});