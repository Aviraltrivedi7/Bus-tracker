import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import useAppStore from '../../store/useAppStore';
import { getTranslation } from '../../utils/translations';

export default function TabLayout() {
  const { currentLanguage } = useAppStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#757575',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: getTranslation('home', currentLanguage),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: getTranslation('track', currentLanguage),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="my-location" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="routes"
        options={{
          title: getTranslation('routes', currentLanguage),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="route" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: getTranslation('settings', currentLanguage),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}