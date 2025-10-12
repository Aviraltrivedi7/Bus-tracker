import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Bus, BusRoute } from '../types';

interface BusCardProps {
  bus: Bus;
  route: BusRoute;
  onPress: () => void;
  currentLanguage: 'en' | 'hi' | 'regional';
}

const BusCard: React.FC<BusCardProps> = ({
  bus,
  route,
  onPress,
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
    // Navigate to route planner with this route's stops as suggestions
    router.push(`/route-planner?suggestedRoute=${route.id}`);
  };

  const routeName = currentLanguage === 'hi' ? route.routeNameHindi : route.routeName;

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  busInfo: {
    flex: 1,
  },
  busNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
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
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  occupancyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
});

export default BusCard;