import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './components/AuthContext'; // Ajusta la ruta según tu estructura
import LoginBaseM from './components/LoginBaseM';
import AccesoMenu from './components/AccesoMenu';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="LoginBaseM" component={LoginBaseM} options={{ headerShown: false }} />
          <Stack.Screen name="AccesoMenu" component={AccesoMenu} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
