<<<<<<< HEAD
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  FadeIn
} from 'react-native-reanimated';
import useAppStore from '../store/useAppStore';
import { getTranslation } from '../utils/translations';
import { Theme } from '../utils/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { isLoading, currentLanguage } = useAppStore();

  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    // Entrance animation
    scale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.back(1.5))
    });
    opacity.value = withTiming(1, { duration: 1000 });

    // Pulse animation for the logo
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

=======
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
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
    const timer = setTimeout(() => {
      if (!isLoading) {
        router.replace('/(tabs)/home');
      }
    }, 2500);

    return () => clearTimeout(timer);
<<<<<<< HEAD
  }, [isLoading]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value * pulse.value }
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Theme.colors.primaryDark, Theme.colors.primary, '#818CF8']}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative background circles */}
      <View style={[styles.circle, { top: -50, right: -50, width: 200, height: 200, opacity: 0.1 }]} />
      <View style={[styles.circle, { bottom: 100, left: -80, width: 300, height: 300, opacity: 0.05 }]} />

      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="directions-bus" size={80} color="white" />
        </View>
        <Text style={styles.appName}>Bus Traker</Text>
        <Text style={styles.tagline}>
          {getTranslation('appTagline', currentLanguage)}
        </Text>
      </Animated.View>

      <Animated.View style={[styles.bottomContent, contentStyle]}>
=======
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
        <Text style={styles.appName}>Bus Tracker</Text>
        <Text style={styles.tagline}>
          {getTranslation('appTagline', currentLanguage)}
        </Text>
        
        {/* Loading animation */}
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {isLoading ? getTranslation('loading', currentLanguage) : getTranslation('checkingPermissions', currentLanguage)}
          </Text>
<<<<<<< HEAD
          <View style={styles.loaderBar}>
            <Animated.View
              entering={FadeIn.delay(500)}
              style={styles.loaderProgress}
            />
          </View>
        </View>

        <View style={styles.cityContainer}>
          <MaterialIcons name="location-city" size={40} color="rgba(255,255,255,0.2)" />
          <MaterialIcons name="apartment" size={35} color="rgba(255,255,255,0.15)" />
          <MaterialIcons name="business" size={45} color="rgba(255,255,255,0.2)" />
          <MaterialIcons name="location-city" size={30} color="rgba(255,255,255,0.1)" />
        </View>
      </Animated.View>
    </View>
=======
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
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
<<<<<<< HEAD
    backgroundColor: Theme.colors.primaryDark,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'white',
=======
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
<<<<<<< HEAD
    zIndex: 10,
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 40,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  appName: {
    fontSize: 40,
    fontWeight: '900',
    color: 'white',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    paddingHorizontal: 40,
    fontWeight: '500',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  loaderBar: {
    width: width * 0.6,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderProgress: {
    width: '40%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  cityContainer: {
=======
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
>>>>>>> daac1007b293e2ff28eac63363055d4df80a3f8b
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: width * 0.8,
    justifyContent: 'space-around',
  },
});