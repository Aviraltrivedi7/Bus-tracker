import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useAppStore from '../store/useAppStore';
import { getTranslation } from '../utils/translations';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const { isLoading, hasLocationPermission, currentLanguage } = useAppStore();

  useEffect(() => {
    // Animate logo entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to home after animation and permissions are loaded
    const timer = setTimeout(() => {
      if (!isLoading) {
        router.replace('/(tabs)/home');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isLoading, fadeAnim, scaleAnim]);

  return (
    <LinearGradient colors={['#1976D2', '#2196F3', '#42A5F5']} style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* App Logo */}
        <View style={styles.iconContainer}>
          <MaterialIcons name="directions-bus" size={80} color="white" />
        </View>
        
        {/* App Name */}
        <Text style={styles.appName}>Bus Traker</Text>
        <Text style={styles.tagline}>
          {getTranslation('appTagline', currentLanguage)}
        </Text>
        
        {/* Loading animation */}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {isLoading ? getTranslation('loading', currentLanguage) : getTranslation('checkingPermissions', currentLanguage)}
          </Text>
          <View style={styles.loadingIndicator}>
            <Animated.View
              style={[
                styles.loadingDot,
                {
                  opacity: fadeAnim,
                },
              ]}
            />
          </View>
        </View>
      </Animated.View>

      {/* City skyline silhouette */}
      <View style={styles.cityContainer}>
        <MaterialIcons name="location-city" size={40} color="rgba(255,255,255,0.2)" />
        <MaterialIcons name="apartment" size={35} color="rgba(255,255,255,0.15)" />
        <MaterialIcons name="business" size={45} color="rgba(255,255,255,0.2)" />
        <MaterialIcons name="location-city" size={30} color="rgba(255,255,255,0.1)" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    padding: 20,
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 40,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  loadingIndicator: {
    flexDirection: 'row',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 2,
  },
  cityContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: width * 0.8,
    justifyContent: 'space-around',
  },
});