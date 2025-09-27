import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import useAppStore from '../store/useAppStore';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { requestPermissions, updateBusPositions } = useAppStore();

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      try {
        await requestPermissions();
        // Start real-time bus position updates
        const interval = setInterval(updateBusPositions, 30000); // Update every 30 seconds
        
        // Hide splash screen after initialization
        await SplashScreen.hideAsync();
        
        return () => clearInterval(interval);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, [requestPermissions, updateBusPositions]);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="search" />
        <Stack.Screen name="live-tracking" />
        <Stack.Screen name="route-details" />
      </Stack>
    </SafeAreaProvider>
  );
}