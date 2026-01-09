<<<<<<< HEAD
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
=======
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Bus, BusRoute } from '../types';
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b

interface BusCardProps {
  bus: Bus;
  route: BusRoute;
  onPress: () => void;
  currentLanguage: 'en' | 'hi' | 'regional';
<<<<<<< HEAD
  index?: number;
=======
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
}

const BusCard: React.FC<BusCardProps> = ({
  bus,
  route,
  onPress,
<<<<<<< HEAD
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
=======
  currentLanguage
}) => {
  const getStatusColor = () => {
    switch (bus.status) {
      case 'on_time':
        return '#4CAF50';
      case 'delayed':
        return '#FF9800';
      case 'early':
        return '#2196F3';
      case 'breakdown':
        return '#F44336';
      default:
        return '#757575';
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
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
<<<<<<< HEAD

=======
    
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
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
<<<<<<< HEAD
=======
    // Navigate to route planner with this route's stops as suggestions
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
    router.push(`/route-planner?suggestedRoute=${route.id}`);
  };

  const routeName = currentLanguage === 'hi' ? route.routeNameHindi : route.routeName;

  return (
<<<<<<< HEAD
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
=======
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.busInfo}>
          <View style={styles.busNumberContainer}>
            <MaterialIcons name="directions-bus" size={24} color="#2196F3" />
            <Text style={styles.busNumber}>{route.routeNumber}</Text>
          </View>
          <Text style={styles.routeName}>{routeName}</Text>
        </View>
        <TouchableOpacity onPress={handlePlanRoute} style={styles.planRouteButton}>
          <MaterialIcons name="route" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.details}>
        <View style={styles.etaContainer}>
          <MaterialIcons name="access-time" size={16} color="#666" />
          <Text style={styles.etaText}>
            {currentLanguage === 'hi' ? 'अगला आगमन: ' : 'Next Arrival: '}
            <Text style={styles.etaTime}>{formatETA()}</Text>
          </Text>
        </View>
        
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>
      
      <View style={styles.features}>
        {bus.isAC && (
          <View style={styles.featureTag}>
            <MaterialIcons name="ac-unit" size={12} color="#2196F3" />
            <Text style={styles.featureText}>AC</Text>
          </View>
        )}
        {bus.isAccessible && (
          <View style={styles.featureTag}>
            <MaterialIcons name="accessible" size={12} color="#2196F3" />
            <Text style={styles.featureText}>
              {currentLanguage === 'hi' ? 'सुलभ' : 'Accessible'}
            </Text>
          </View>
        )}
        <View style={styles.occupancyContainer}>
          <MaterialIcons name="people" size={12} color="#666" />
          <Text style={styles.occupancyText}>
            {bus.currentOccupancy}/{bus.capacity}
          </Text>
        </View>
        <TouchableOpacity style={styles.routeDetailsButton} onPress={() => router.push(`/route-details?routeId=${route.id}`)}>
          <MaterialIcons name="info-outline" size={14} color="#2196F3" />
          <Text style={styles.routeDetailsText}>
            {currentLanguage === 'hi' ? 'विवरण' : 'Details'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  );
};

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    marginVertical: Theme.spacing.sm,
    marginHorizontal: Theme.spacing.md,
    ...Theme.shadows.sm,
=======
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
<<<<<<< HEAD
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
=======
    alignItems: 'flex-start',
    marginBottom: 12,
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  },
  busInfo: {
    flex: 1,
  },
  busNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
<<<<<<< HEAD
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
=======
  busNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2196F3',
    marginLeft: 8,
  },
  routeName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  planRouteButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#E8F5E8',
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
<<<<<<< HEAD
    marginBottom: Theme.spacing.md,
    paddingBottom: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
=======
    marginBottom: 12,
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
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
=======
    flex: 1,
  },
  etaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  etaTime: {
    fontWeight: '600',
    color: '#2196F3',
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  features: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
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
=======
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 10,
    color: '#2196F3',
    fontWeight: '500',
    marginLeft: 2,
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  },
  occupancyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
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
=======
    marginRight: 8,
  },
  occupancyText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 2,
  },
  routeDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  routeDetailsText: {
    fontSize: 10,
    color: '#2196F3',
    marginLeft: 2,
    fontWeight: '500',
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  },
});

export default BusCard;