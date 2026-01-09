import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { Bus, BusRoute } from '../types';
import { Theme } from '../utils/theme';

interface BusCardProps {
  bus: Bus;
  route: BusRoute;
  onPress: () => void;
  currentLanguage: 'en' | 'hi' | 'regional';
  index?: number;
}

const BusCard: React.FC<BusCardProps> = ({
  bus,
  route,
  onPress,
  currentLanguage,
  index = 0
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(index * 100, withSpring(0));
  }, [index, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.97);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  const getStatusColor = () => {
    switch (bus.status) {
      case 'on_time':
        return Theme.colors.status.onTime;
      case 'delayed':
        return Theme.colors.status.delayed;
      case 'early':
        return Theme.colors.status.early;
      case 'breakdown':
        return Theme.colors.status.breakdown;
      default:
        return Theme.colors.text.secondary;
    }
  };

  const getStatusText = () => {
    if (currentLanguage === 'hi') {
      switch (bus.status) {
        case 'on_time':
          return 'समय पर';
        case 'delayed':
          return `${bus.delayMinutes} मिनट देर`;
        case 'early':
          return 'जल्दी';
        case 'breakdown':
          return 'खराब';
        default:
          return 'अज्ञात';
      }
    }

    switch (bus.status) {
      case 'on_time':
        return 'On Time';
      case 'delayed':
        return `${bus.delayMinutes}min Late`;
      case 'early':
        return 'Early';
      case 'breakdown':
        return 'Breakdown';
      default:
        return 'Unknown';
    }
  };

  const formatETA = () => {
    const minutes = Math.ceil((bus.estimatedArrival.getTime() - Date.now()) / (1000 * 60));
    return minutes > 0 ? `${minutes} min` : 'Arriving';
  };

  const handlePlanRoute = () => {
    router.push(`/route-planner?suggestedRoute=${route.id}`);
  };

  const routeName = currentLanguage === 'hi' ? route.routeNameHindi : route.routeName;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View style={styles.header}>
          <View style={styles.busInfo}>
            <View style={styles.busNumberContainer}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="directions-bus" size={20} color={Theme.colors.primary} />
              </View>
              <Text style={styles.busNumber}>{route.routeNumber}</Text>
            </View>
            <Text style={styles.routeName} numberOfLines={1}>{routeName}</Text>
          </View>
          <TouchableOpacity onPress={handlePlanRoute} style={styles.planRouteButton}>
            <MaterialIcons name="route" size={20} color={Theme.colors.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
          <View style={styles.etaContainer}>
            <MaterialIcons name="access-time" size={16} color={Theme.colors.text.secondary} />
            <Text style={styles.etaText}>
              {currentLanguage === 'hi' ? 'अगला: ' : 'Next: '}
              <Text style={styles.etaTime}>{formatETA()}</Text>
            </Text>
          </View>

          <View style={[styles.statusContainer, { backgroundColor: getStatusColor() + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>{getStatusText()}</Text>
          </View>
        </View>

        <View style={styles.features}>
          <View style={styles.featureRow}>
            {bus.isAC && (
              <View style={styles.featureTag}>
                <MaterialIcons name="ac-unit" size={12} color={Theme.colors.primary} />
                <Text style={styles.featureText}>AC</Text>
              </View>
            )}
            <View style={styles.occupancyContainer}>
              <MaterialIcons name="people" size={14} color={Theme.colors.text.secondary} />
              <Text style={styles.occupancyText}>
                {bus.currentOccupancy}/{bus.capacity}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => router.push(`/route-details?routeId=${route.id}`)}
          >
            <Text style={styles.detailsButtonText}>
              {currentLanguage === 'hi' ? 'विवरण' : 'Details'}
            </Text>
            <MaterialIcons name="chevron-right" size={18} color={Theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    marginVertical: Theme.spacing.sm,
    marginHorizontal: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  busInfo: {
    flex: 1,
  },
  busNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  busNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    marginLeft: Theme.spacing.sm,
  },
  routeName: {
    fontSize: 14,
    color: Theme.colors.text.secondary,
    fontWeight: '500',
  },
  planRouteButton: {
    padding: 8,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.secondary + '15',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    paddingBottom: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  etaText: {
    fontSize: 14,
    color: Theme.colors.text.secondary,
    marginLeft: 6,
  },
  etaTime: {
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary + '10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.radius.sm,
    marginRight: Theme.spacing.md,
  },
  featureText: {
    fontSize: 11,
    color: Theme.colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  occupancyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  occupancyText: {
    fontSize: 12,
    color: Theme.colors.text.secondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 13,
    color: Theme.colors.primary,
    fontWeight: '600',
    marginRight: 2,
  },
});

export default BusCard;