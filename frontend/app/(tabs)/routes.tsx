import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import useAppStore from '../../store/useAppStore';
import { getTranslation } from '../../utils/translations';
import { BusStop, JourneyPlan, RouteOption } from '../../types';

export default function RoutesScreen() {
  const [fromStop, setFromStop] = useState<BusStop | null>(null);
  const [toStop, setToStop] = useState<BusStop | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    stops,
    preferences,
    currentLanguage,
    currentJourneyPlan,
    isPlanning,
    planJourney,
    clearCurrentJourneyPlan,
  } = useAppStore();

  const handlePlanJourney = async () => {
    if (fromStop && toStop) {
      try {
        await planJourney(fromStop, toStop);
      } catch (error) {
        console.error('Error planning journey:', error);
      }
    }
  };

  const handleSwapLocations = () => {
    const temp = fromStop;
    setFromStop(toStop);
    setToStop(temp);
  };

  const handleStopSelect = (stop: BusStop, isFrom: boolean) => {
    if (isFrom) {
      setFromStop(stop);
      setShowFromPicker(false);
    } else {
      setToStop(stop);
      setShowToPicker(false);
    }
    setSearchQuery('');
  };

  const getFilteredStops = () => {
    if (!searchQuery) return stops;
    return stops.filter(stop => 
      stop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stop.nameHindi.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const formatFare = (fare: number) => {
    return `₹${fare}`;
  };

  const getRouteTypeText = (option: RouteOption) => {
    if (option.transfers === 0) return currentLanguage === 'hi' ? 'सीधा' : 'Direct';
    return `${option.transfers} ${getTranslation('transfers', currentLanguage)}`;
  };

  const handleSelectRoute = (option: RouteOption) => {
    // Navigate to live tracking for the first bus in the selected route
    const firstBus = option.buses[0];
    if (firstBus) {
      router.push(`/live-tracking?busId=${firstBus.id}`);
    }
  };

  const renderStopPicker = (isFrom: boolean) => {
    const filteredStops = getFilteredStops();
    
    return (
      <Modal
        visible={isFrom ? showFromPicker : showToPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          if (isFrom) setShowFromPicker(false);
          else setShowToPicker(false);
          setSearchQuery('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isFrom ? getTranslation('fromLocation', currentLanguage) : getTranslation('toLocation', currentLanguage)}
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  if (isFrom) setShowFromPicker(false);
                  else setShowToPicker(false);
                  setSearchQuery('');
                }}
                style={styles.modalCloseButton}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={20} color="#757575" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search stops..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
            </View>

            <FlatList
              data={filteredStops}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.stopItem}
                  onPress={() => handleStopSelect(item, isFrom)}
                >
                  <MaterialIcons name="place" size={20} color="#4CAF50" />
                  <View style={styles.stopDetails}>
                    <Text style={styles.stopName}>
                      {currentLanguage === 'hi' ? item.nameHindi : item.name}
                    </Text>
                    {item.amenities.length > 0 && (
                      <Text style={styles.stopAmenities}>
                        {item.amenities.join(' • ')}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              style={styles.stopsList}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {getTranslation('routePlanner', currentLanguage)}
        </Text>
        {currentJourneyPlan && (
          <TouchableOpacity 
            onPress={clearCurrentJourneyPlan}
            style={styles.clearButton}
          >
            <MaterialIcons name="clear" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Journey Planner Form */}
        <View style={styles.plannerSection}>
          <Text style={styles.sectionTitle}>
            {getTranslation('planJourney', currentLanguage)}
          </Text>

          <View style={styles.locationInputs}>
            {/* From Location */}
            <TouchableOpacity 
              style={styles.locationInput}
              onPress={() => setShowFromPicker(true)}
            >
              <MaterialIcons name="radio-button-checked" size={20} color="#4CAF50" />
              <Text style={[styles.locationText, !fromStop && styles.locationPlaceholder]}>
                {fromStop 
                  ? (currentLanguage === 'hi' ? fromStop.nameHindi : fromStop.name)
                  : getTranslation('fromLocation', currentLanguage)
                }
              </Text>
            </TouchableOpacity>

            {/* Swap Button */}
            <TouchableOpacity 
              style={styles.swapButton}
              onPress={handleSwapLocations}
            >
              <MaterialIcons name="swap-vert" size={24} color="#2196F3" />
            </TouchableOpacity>

            {/* To Location */}
            <TouchableOpacity 
              style={styles.locationInput}
              onPress={() => setShowToPicker(true)}
            >
              <MaterialIcons name="place" size={20} color="#FF5722" />
              <Text style={[styles.locationText, !toStop && styles.locationPlaceholder]}>
                {toStop 
                  ? (currentLanguage === 'hi' ? toStop.nameHindi : toStop.name)
                  : getTranslation('toLocation', currentLanguage)
                }
              </Text>
            </TouchableOpacity>

            {/* Plan Journey Button */}
            <TouchableOpacity 
              style={[styles.planButton, (!fromStop || !toStop || isPlanning) && styles.planButtonDisabled]}
              onPress={handlePlanJourney}
              disabled={!fromStop || !toStop || isPlanning}
            >
              <MaterialIcons name="directions" size={20} color="white" />
              <Text style={styles.planButtonText}>
                {isPlanning 
                  ? getTranslation('loading', currentLanguage)
                  : getTranslation('planJourney', currentLanguage)
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Journey Results */}
        {currentJourneyPlan && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>
              {getTranslation('routeOptions', currentLanguage)}
            </Text>

            {currentJourneyPlan.routes.map((option, index) => (
              <View key={option.id} style={styles.routeOption}>
                <View style={styles.routeHeader}>
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeDuration}>
                      {formatDuration(option.totalDuration)}
                    </Text>
                    <Text style={styles.routeType}>
                      {getRouteTypeText(option)}
                    </Text>
                  </View>
                  <View style={styles.routeMeta}>
                    <Text style={styles.routeFare}>
                      {formatFare(option.estimatedFare)}
                    </Text>
                    {index === 0 && (
                      <View style={styles.recommendedBadge}>
                        <Text style={styles.recommendedText}>
                          {getTranslation('fastest', currentLanguage)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.routeSteps}>
                  {option.steps.map((step, stepIndex) => (
                    <View key={stepIndex} style={styles.stepContainer}>
                      <View style={styles.stepIcon}>
                        <MaterialIcons 
                          name={
                            step.type === 'bus' ? 'directions-bus' : 
                            step.type === 'walk' ? 'directions-walk' : 
                            'transfer-within-a-station'
                          }
                          size={16} 
                          color={
                            step.type === 'bus' ? '#2196F3' : 
                            step.type === 'walk' ? '#4CAF50' : 
                            '#FF9800'
                          }
                        />
                      </View>
                      <View style={styles.stepDetails}>
                        <Text style={styles.stepDescription}>
                          {currentLanguage === 'hi' ? step.descriptionHindi : step.description}
                        </Text>
                        <Text style={styles.stepDuration}>
                          {formatDuration(step.duration)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                <TouchableOpacity 
                  style={styles.selectRouteButton}
                  onPress={() => handleSelectRoute(option)}
                >
                  <Text style={styles.selectRouteButtonText}>
                    {getTranslation('selectRoute', currentLanguage)}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Recent Journeys */}
        {preferences.routePlanner.recentJourneys.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>
              {getTranslation('recentJourneys', currentLanguage)}
            </Text>

            {preferences.routePlanner.recentJourneys.slice(0, 3).map((journey) => (
              <TouchableOpacity 
                key={journey.id}
                style={styles.recentJourney}
                onPress={() => {
                  setFromStop(journey.fromStop);
                  setToStop(journey.toStop);
                }}
              >
                <View style={styles.journeyRoute}>
                  <MaterialIcons name="history" size={20} color="#666" />
                  <View style={styles.journeyDetails}>
                    <Text style={styles.journeyText}>
                      {currentLanguage === 'hi' ? journey.fromStop.nameHindi : journey.fromStop.name}
                      {' → '}
                      {currentLanguage === 'hi' ? journey.toStop.nameHindi : journey.toStop.name}
                    </Text>
                    <Text style={styles.journeyMeta}>
                      {formatDuration(journey.totalDuration)} • {journey.routes.length} options
                    </Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Stop Picker Modals */}
      {renderStopPicker(true)}
      {renderStopPicker(false)}
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
  clearButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  plannerSection: {
    backgroundColor: 'white',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  locationInputs: {
    gap: 12,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  locationPlaceholder: {
    color: '#666',
  },
  swapButton: {
    alignSelf: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    padding: 8,
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
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
  resultsSection: {
    backgroundColor: 'white',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  routeOption: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeDuration: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2196F3',
  },
  routeType: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  routeMeta: {
    alignItems: 'flex-end',
  },
  routeFare: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  recommendedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  recommendedText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  routeSteps: {
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepDetails: {
    flex: 1,
  },
  stepDescription: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  stepDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  selectRouteButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  selectRouteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  recentSection: {
    backgroundColor: 'white',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  recentJourney: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
  },
  journeyRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  journeyDetails: {
    marginLeft: 12,
    flex: 1,
  },
  journeyText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  journeyMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalCloseButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  stopsList: {
    maxHeight: 400,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  stopDetails: {
    marginLeft: 12,
    flex: 1,
  },
  stopName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  stopAmenities: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});