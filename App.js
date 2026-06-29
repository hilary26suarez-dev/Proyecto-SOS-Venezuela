import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from './src/context/AppContext';

import HomeScreen from './src/screens/HomeScreen';
import TriageScreen from './src/screens/TriageScreen';
import PatientSearchScreen from './src/screens/PatientSearchScreen';
import MARCHScreen from './src/screens/MARCHScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import WaterScreen from './src/screens/WaterScreen';
import BlackoutScreen from './src/screens/BlackoutScreen';
import ContactsScreen from './src/screens/ContactsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const NAV_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#CC0000',
    background: '#0A0A0A',
    card: '#111111',
    text: '#F0F0F0',
    border: '#222222',
    notification: '#CC0000',
  },
};

const HEADER_OPTS = {
  headerStyle: { backgroundColor: '#111111' },
  headerTintColor: '#F0F0F0',
  headerTitleStyle: { fontWeight: '900', letterSpacing: 1 },
};

const TAB_ICONS = {
  Inicio:  '🏠',
  Triaje:  '🚨',
  Buscar:  '🔍',
  MARCH:   '🩺',
  Kit: '🎒',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...HEADER_OPTS,
        tabBarStyle: {
          backgroundColor: '#111111',
          borderTopColor: '#222222',
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 60,
        },
        tabBarActiveTintColor: '#CC0000',
        tabBarInactiveTintColor: '#555555',
        tabBarLabelStyle: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20 }}>{TAB_ICONS[route.name] || '•'}</Text>
        ),
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{ title: 'SOS VENEZUELA', tabBarLabel: 'INICIO' }}
      />
      <Tab.Screen
        name="Triaje"
        component={TriageScreen}
        options={{ title: 'TRIAJE DE EMERGENCIA', tabBarLabel: 'TRIAJE' }}
      />
      <Tab.Screen
        name="Buscar"
        component={PatientSearchScreen}
        options={{ title: 'BUSCAR FAMILIAR', tabBarLabel: 'BUSCAR' }}
      />
      <Tab.Screen
        name="MARCH"
        component={MARCHScreen}
        options={{ title: 'PROTOCOLO MARCH', tabBarLabel: 'MARCH' }}
      />
      <Tab.Screen
        name="Kit"
        component={InventoryScreen}
        options={{ title: 'KIT 72 HORAS', tabBarLabel: 'KIT 72H' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer theme={NAV_THEME}>
            <StatusBar style="light" backgroundColor="#0A0A0A" />
            <Stack.Navigator screenOptions={{ ...HEADER_OPTS, headerShown: false }}>
              <Stack.Screen name="Main" component={MainTabs} />
              <Stack.Screen
                name="Agua"
                component={WaterScreen}
                options={{ headerShown: true, title: 'PURIFICACIÓN DE AGUA' }}
              />
              <Stack.Screen
                name="Blackout"
                component={BlackoutScreen}
                options={{ headerShown: true, title: 'PROTOCOLO APAGÓN' }}
              />
              <Stack.Screen
                name="Contacts"
                component={ContactsScreen}
                options={{ headerShown: true, title: 'CONTACTOS DE EMERGENCIA' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
