import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface MapPlaceholderProps {
  style?: any;
  buses?: any[];
  stops?: any[];
  userLocation?: any;
  selectedBus?: any;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ 
  style, 
  buses = [], 
  stops = [], 
  userLocation, 
  selectedBus 
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <MaterialIcons name="map" size={64} color="#E0E0E0" />
        <Text style={styles.title}>Interactive Map</Text>
        <Text style={styles.subtitle}>Live bus tracking in real-time</Text>
        
        {/* Mock map elements */}
        <View style={styles.mapElements}>
          {buses.slice(0, 3).map((bus, index) => (
            <View key={bus.id} style={[styles.busMarker, { 
              left: 50 + (index * 60), 
              top: 80 + (index * 20),
              backgroundColor: selectedBus?.id === bus.id ? '#FF9800' : '#4CAF50'
            }]}>
              <MaterialIcons name="directions-bus" size={16} color="white" />
            </View>
          ))}
          
          {stops.slice(0, 4).map((stop, index) => (
            <View key={stop.id} style={[styles.stopMarker, { 
              left: 40 + (index * 50), 
              top: 100 + (index * 15) 
            }]}>
              <MaterialIcons name="place" size={12} color="#666" />
            </View>
          ))}
          
          {userLocation && (
            <View style={[styles.userMarker, { left: 120, top: 110 }]}>
              <MaterialIcons name="my-location" size={12} color="#2196F3" />
            </View>
          )}
        </View>
        
        <View style={styles.stats}>
          <Text style={styles.statText}>
            {buses.length} buses • {stops.length} stops
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    minHeight: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  mapElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  busMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  stopMarker: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  userMarker: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  stats: {
    marginTop: 16,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default MapPlaceholder;