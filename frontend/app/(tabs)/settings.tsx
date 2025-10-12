import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import useAppStore from '../../store/useAppStore';
import { getTranslation } from '../../utils/translations';

export default function SettingsScreen() {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  
  const {
    preferences,
    currentLanguage,
    hasLocationPermission,
    hasNotificationPermission,
    setLanguage,
    requestPermissions,
  } = useAppStore();

  const handleLanguageChange = async (language: 'en' | 'hi' | 'regional') => {
    await setLanguage(language);
    setShowLanguageModal(false);
  };

  const handlePermissionRequest = async () => {
    Alert.alert(
      'Permissions Required',
      'This app needs location and notification permissions to work properly. Please grant permissions in your device settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: requestPermissions },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {getTranslation('settings', currentLanguage)}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {getTranslation('language', currentLanguage)}
          </Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowLanguageModal(true)}
          >
            <MaterialIcons name="language" size={24} color="#2196F3" />
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>
                {getTranslation('language', currentLanguage)}
              </Text>
              <Text style={styles.settingSubtext}>
                {currentLanguage === 'hi' ? 'हिंदी' : currentLanguage === 'en' ? 'English' : 'Regional'}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {getTranslation('notifications', currentLanguage)}
          </Text>
          
          <View style={styles.settingItem}>
            <MaterialIcons name="notifications" size={24} color="#FF9800" />
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>
                {getTranslation('arrivalAlerts', currentLanguage)}
              </Text>
              <Text style={styles.settingSubtext}>
                Get notified when buses arrive
              </Text>
            </View>
            <Switch 
              value={preferences.notifications.arrivalAlert}
              onValueChange={() => {
                if (!hasNotificationPermission) {
                  handlePermissionRequest();
                }
              }}
              thumbColor={preferences.notifications.arrivalAlert ? "#2196F3" : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
            />
          </View>

          <View style={styles.settingItem}>
            <MaterialIcons name="vibration" size={24} color="#9C27B0" />
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>
                {getTranslation('vibrateOnAlert', currentLanguage)}
              </Text>
            </View>
            <Switch 
              value={preferences.notifications.vibration}
              onValueChange={() => {}}
              thumbColor={preferences.notifications.vibration ? "#2196F3" : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
            />
          </View>
        </View>

        {/* Data & Offline Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {getTranslation('dataAndOffline', currentLanguage)}
          </Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons name="download" size={24} color="#4CAF50" />
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>
                {getTranslation('preloadTimetables', currentLanguage)} Delhi
              </Text>
              <Text style={styles.settingSubtext}>
                Download offline timetables
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <MaterialIcons name="map" size={24} color="#2196F3" />
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>
                {getTranslation('useOpenStreetMap', currentLanguage)}
              </Text>
              <Text style={styles.settingSubtext}>
                Save mobile data usage
              </Text>
            </View>
            <Switch 
              value={true}
              onValueChange={() => {}}
              thumbColor={"#2196F3"}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
            />
          </View>
        </View>

        {/* Accessibility Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {getTranslation('accessibility', currentLanguage)}
          </Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons name="format-size" size={24} color="#FF5722" />
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>
                {getTranslation('largerText', currentLanguage)}
              </Text>
              <Text style={styles.settingSubtext}>
                Increase text size
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons name="record-voice-over" size={24} color="#3F51B5" />
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>
                {getTranslation('voiceAnnouncements', currentLanguage)}
              </Text>
              <Text style={styles.settingSubtext}>
                {getTranslation('comingSoon', currentLanguage)}
              </Text>
            </View>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>
                {getTranslation('comingSoon', currentLanguage)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Location Permission Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions</Text>
          
          <View style={styles.settingItem}>
            <MaterialIcons 
              name="location-on" 
              size={24} 
              color={hasLocationPermission ? "#4CAF50" : "#FF5722"} 
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>
                {getTranslation('locationPermission', currentLanguage)}
              </Text>
              <Text style={[
                styles.settingSubtext,
                { color: hasLocationPermission ? "#4CAF50" : "#FF5722" }
              ]}>
                {hasLocationPermission ? 'Granted' : 'Not granted'}
              </Text>
            </View>
            {!hasLocationPermission && (
              <TouchableOpacity 
                style={styles.grantButton}
                onPress={requestPermissions}
              >
                <Text style={styles.grantButtonText}>Grant</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.settingItem}>
            <MaterialIcons 
              name="notifications" 
              size={24} 
              color={hasNotificationPermission ? "#4CAF50" : "#FF5722"} 
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>
                {getTranslation('notificationPermission', currentLanguage)}
              </Text>
              <Text style={[
                styles.settingSubtext,
                { color: hasNotificationPermission ? "#4CAF50" : "#FF5722" }
              ]}>
                {hasNotificationPermission ? 'Granted' : 'Not granted'}
              </Text>
            </View>
            {!hasNotificationPermission && (
              <TouchableOpacity 
                style={styles.grantButton}
                onPress={requestPermissions}
              >
                <Text style={styles.grantButtonText}>Grant</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Bus Traker v1.0.0</Text>
          <Text style={styles.appInfoSubtext}>Made with ❤️ for commuters</Text>
        </View>
      </ScrollView>

      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {getTranslation('changeLanguage', currentLanguage)}
              </Text>
              <TouchableOpacity 
                onPress={() => setShowLanguageModal(false)}
                style={styles.modalCloseButton}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[
                styles.languageOption,
                currentLanguage === 'en' && styles.selectedLanguage
              ]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={styles.languageText}>English</Text>
              {currentLanguage === 'en' && (
                <MaterialIcons name="check" size={20} color="#2196F3" />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.languageOption,
                currentLanguage === 'hi' && styles.selectedLanguage
              ]}
              onPress={() => handleLanguageChange('hi')}
            >
              <Text style={styles.languageText}>हिंदी (Hindi)</Text>
              {currentLanguage === 'hi' && (
                <MaterialIcons name="check" size={20} color="#2196F3" />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.languageOption,
                currentLanguage === 'regional' && styles.selectedLanguage
              ]}
              onPress={() => handleLanguageChange('regional')}
            >
              <Text style={styles.languageText}>Regional (Coming Soon)</Text>
              {currentLanguage === 'regional' && (
                <MaterialIcons name="check" size={20} color="#2196F3" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
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
  settingItem: {
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
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  comingSoonBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 10,
    color: '#F57C00',
    fontWeight: '600',
  },
  grantButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  grantButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appInfoText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  appInfoSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
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
    paddingBottom: 32,
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
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  selectedLanguage: {
    backgroundColor: '#E3F2FD',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
});