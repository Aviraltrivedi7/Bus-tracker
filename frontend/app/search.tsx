import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import useAppStore from '../store/useAppStore';
import { getTranslation } from '../utils/translations';
import BusCard from '../components/BusCard';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    acOnly: false,
    accessibleOnly: false,
    timeOfDay: 'any',
  });

  const {
    buses,
    routes,
    stops,
    preferences,
    currentLanguage,
    addRecentSearch,
  } = useAppStore();

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedFilters]);

  const performSearch = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    const results: any[] = [];

    // Search bus routes by number or name
    routes.forEach(route => {
      const routeNumberMatch = route.routeNumber.toLowerCase().includes(lowercaseQuery);
      const routeNameMatch = route.routeName.toLowerCase().includes(lowercaseQuery);
      const routeNameHindiMatch = route.routeNameHindi.toLowerCase().includes(lowercaseQuery);

      if (routeNumberMatch || routeNameMatch || routeNameHindiMatch) {
        const routeBuses = buses.filter(bus => bus.routeId === route.id);
        
        // Apply filters
        const filteredBuses = routeBuses.filter(bus => {
          if (selectedFilters.acOnly && !bus.isAC) return false;
          if (selectedFilters.accessibleOnly && !bus.isAccessible) return false;
          return true;
        });

        if (filteredBuses.length > 0) {
          results.push({
            type: 'route',
            route,
            buses: filteredBuses,
          });
        }
      }
    });

    // Search bus stops
    stops.forEach(stop => {
      const stopNameMatch = stop.name.toLowerCase().includes(lowercaseQuery);
      const stopNameHindiMatch = stop.nameHindi.toLowerCase().includes(lowercaseQuery);

      if (stopNameMatch || stopNameHindiMatch) {
        // Find buses that serve this stop
        const stopsRoutes = routes.filter(route => 
          route.stops.some(routeStop => routeStop.id === stop.id)
        );
        
        const stopBuses: any[] = [];
        stopsRoutes.forEach(route => {
          const routeBuses = buses.filter(bus => bus.routeId === route.id);
          routeBuses.forEach(bus => {
            stopBuses.push({ bus, route });
          });
        });

        if (stopBuses.length > 0) {
          results.push({
            type: 'stop',
            stop,
            buses: stopBuses,
          });
        }
      }
    });

    setSearchResults(results);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery.trim());
      Keyboard.dismiss();
    }
  };

  const handleBusPress = (busId: string) => {
    router.push(`/live-tracking?busId=${busId}`);
  };

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filter]: !prev[filter as keyof typeof prev],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#757575" />
          <TextInput
            style={styles.searchInput}
            placeholder={getTranslation('searchPlaceholder', currentLanguage)}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            autoFocus={true}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <MaterialIcons name="clear" size={20} color="#757575" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <MaterialIcons 
            name="filter-list" 
            size={24} 
            color={showFilters || Object.values(selectedFilters).some(v => v !== false && v !== 'any') ? "#2196F3" : "#666"} 
          />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>
            {getTranslation('filters', currentLanguage)}
          </Text>
          
          <View style={styles.filterRow}>
            <TouchableOpacity 
              style={[
                styles.filterChip,
                selectedFilters.acOnly && styles.filterChipActive
              ]}
              onPress={() => handleFilterToggle('acOnly')}
            >
              <MaterialIcons 
                name="ac-unit" 
                size={16} 
                color={selectedFilters.acOnly ? "white" : "#666"} 
              />
              <Text style={[
                styles.filterChipText,
                selectedFilters.acOnly && styles.filterChipTextActive
              ]}>
                {getTranslation('acBuses', currentLanguage)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.filterChip,
                selectedFilters.accessibleOnly && styles.filterChipActive
              ]}
              onPress={() => handleFilterToggle('accessibleOnly')}
            >
              <MaterialIcons 
                name="accessible" 
                size={16} 
                color={selectedFilters.accessibleOnly ? "white" : "#666"} 
              />
              <Text style={[
                styles.filterChipText,
                selectedFilters.accessibleOnly && styles.filterChipTextActive
              ]}>
                {getTranslation('accessibleBuses', currentLanguage)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {/* Recent Searches */}
        {!searchQuery && preferences.recentSearches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {getTranslation('recentSearches', currentLanguage)}
            </Text>
            {preferences.recentSearches.slice(0, 5).map((search, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.recentItem}
                onPress={() => setSearchQuery(search)}
              >
                <MaterialIcons name="history" size={20} color="#666" />
                <Text style={styles.recentText}>{search}</Text>
                <MaterialIcons name="north-west" size={16} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Search Suggestions */}
        {!searchQuery && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Routes</Text>
            {routes.slice(0, 3).map(route => (
              <TouchableOpacity 
                key={route.id}
                style={styles.suggestionItem}
                onPress={() => setSearchQuery(route.routeNumber)}
              >
                <MaterialIcons name="directions-bus" size={20} color="#2196F3" />
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionText}>
                    {route.routeNumber} - {currentLanguage === 'hi' ? route.routeNameHindi : route.routeName}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Search Results ({searchResults.length})
            </Text>
            
            {searchResults.map((result, index) => {
              if (result.type === 'route') {
                return result.buses.map((bus: any) => {
                  return (
                    <BusCard
                      key={`${result.route.id}-${bus.id}`}
                      bus={bus}
                      route={result.route}
                      onPress={() => handleBusPress(bus.id)}
                      currentLanguage={currentLanguage}
                    />
                  );
                });
              }
              
              if (result.type === 'stop') {
                return (
                  <View key={`stop-${result.stop.id}`} style={styles.stopResult}>
                    <View style={styles.stopHeader}>
                      <MaterialIcons name="place" size={24} color="#4CAF50" />
                      <Text style={styles.stopName}>
                        {currentLanguage === 'hi' ? result.stop.nameHindi : result.stop.name}
                      </Text>
                    </View>
                    <Text style={styles.stopSubtext}>
                      {result.buses.length} buses serve this stop
                    </Text>
                    
                    <View style={styles.stopBuses}>
                      {result.buses.slice(0, 2).map((item: any, busIndex: number) => (
                        <TouchableOpacity
                          key={busIndex}
                          style={styles.stopBusItem}
                          onPress={() => handleBusPress(item.bus.id)}
                        >
                          <Text style={styles.stopBusNumber}>{item.route.routeNumber}</Text>
                          <Text style={styles.stopBusETA}>
                            {Math.ceil((item.bus.estimatedArrival.getTime() - Date.now()) / (1000 * 60))} min
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              }
              
              return null;
            })}
          </View>
        )}

        {/* No Results */}
        {searchQuery && searchResults.length === 0 && (
          <View style={styles.noResults}>
            <MaterialIcons name="search-off" size={48} color="#E0E0E0" />
            <Text style={styles.noResultsText}>
              No buses or stops found for "{searchQuery}"
            </Text>
            <Text style={styles.noResultsSubtext}>
              Try searching for bus numbers, route names, or stop names
            </Text>
          </View>
        )}
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
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    padding: 8,
    marginLeft: 8,
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterChipText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  recentText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  suggestionContent: {
    marginLeft: 12,
    flex: 1,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  stopResult: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  stopSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  stopBuses: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stopBusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  stopBusNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
  },
  stopBusETA: {
    fontSize: 12,
    color: '#2196F3',
    marginLeft: 8,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});