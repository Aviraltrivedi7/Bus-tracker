import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import useAppStore from '../store/useAppStore';
import { getTranslation } from '../utils/translations';

export default function RoutePlannerScreen() {
  const { suggestedRoute } = useLocalSearchParams<{ suggestedRoute?: string }>();
  const [selectedFromStop, setSelectedFromStop] = useState<string>('');
  const [selectedToStop, setSelectedToStop] = useState<string>('');
  
  const {
    routes,
    stops,
    currentLanguage,
  } = useAppStore();

  useEffect(() => {
    // If a suggested route is provided, pre-fill the stops
    if (suggestedRoute) {
      const route = routes.find(r => r.id === suggestedRoute);
      if (route && route.stops.length > 0) {
        setSelectedFromStop(route.stops[0].id);
        if (route.stops.length > 1) {
          setSelectedToStop(route.stops[route.stops.length - 1].id);
        }
      }
    }
  }, [suggestedRoute, routes]);

  const handlePlanWithStops = () => {
    const fromStop = stops.find(s => s.id === selectedFromStop);
    const toStop = stops.find(s => s.id === selectedToStop);
    
    if (fromStop && toStop) {
      // Navigate back to routes screen with these stops selected
      router.push({
        pathname: '/(tabs)/routes',
        params: { 
          fromStopId: fromStop.id, 
          toStopId: toStop.id 
        }
      });
    }
  };

  const suggestedRouteData = suggestedRoute ? routes.find(r => r.id === suggestedRoute) : null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {getTranslation('routePlanner', currentLanguage)}
        </Text>
      </View>

      <View style={styles.content}>
        {suggestedRouteData && (
          <View style={styles.suggestedSection}>
            <Text style={styles.sectionTitle}>
              Suggested Route: {suggestedRouteData.routeNumber}
            </Text>
            <Text style={styles.routeName}>
              {currentLanguage === 'hi' ? suggestedRouteData.routeNameHindi : suggestedRouteData.routeName}
            </Text>
            
            <View style={styles.stopsContainer}>
              <Text style={styles.stopsTitle}>Available Stops:</Text>
              {suggestedRouteData.stops.map((stop, index) => (
                <TouchableOpacity 
                  key={stop.id}
                  style={styles.stopOption}
                  onPress={() => {
                    if (!selectedFromStop) {
                      setSelectedFromStop(stop.id);
                    } else if (!selectedToStop && stop.id !== selectedFromStop) {
                      setSelectedToStop(stop.id);
                    } else {
                      // Reset selection
                      setSelectedFromStop(stop.id);
                      setSelectedToStop('');
                    }
                  }}
                >
                  <MaterialIcons 
                    name={
                      selectedFromStop === stop.id ? "radio-button-checked" :
                      selectedToStop === stop.id ? "place" : "radio-button-unchecked"
                    }
                    size={20} 
                    color={
                      selectedFromStop === stop.id ? "#4CAF50" :
                      selectedToStop === stop.id ? "#FF5722" : "#666"
                    }
                  />
                  <Text style={styles.stopName}>
                    {currentLanguage === 'hi' ? stop.nameHindi : stop.name}
                  </Text>
                  {selectedFromStop === stop.id && (
                    <Text style={styles.stopLabel}>From</Text>
                  )}
                  {selectedToStop === stop.id && (
                    <Text style={styles.stopLabel}>To</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.planButton, (!selectedFromStop || !selectedToStop) && styles.planButtonDisabled]}
              onPress={handlePlanWithStops}
              disabled={!selectedFromStop || !selectedToStop}
            >
              <MaterialIcons name="directions" size={20} color="white" />
              <Text style={styles.planButtonText}>
                {getTranslation('planJourney', currentLanguage)}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.helpSection}>
          <MaterialIcons name="info" size={20} color="#2196F3" />
          <Text style={styles.helpText}>
            Select your starting point and destination to plan your journey with real-time bus information.
          </Text>
        </View>
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
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  suggestedSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 8,
  },
  routeName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  stopsContainer: {
    marginBottom: 20,
  },
  stopsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  stopOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
  },
  stopName: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  stopLabel: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingVertical: 14,
  },
  planButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  planButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  helpSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
  },
  helpText: {
    fontSize: 14,
    color: '#1976D2',
    marginLeft: 12,
    flex: 1,
  },
});