import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AccesoMenu from './components/AccesoMenu';
import { AuthProvider } from './components/AuthContext'; // Ajusta la ruta según tu estructura
import ConsultaForm from './components/ConsultaForm'; // Asegúrate de que esté importado
import FormularioIndexacion from './components/FormularioIndexacion';
import LoginBaseM from './components/LoginBaseM';
import ResultadosScreen from './components/ResultadosScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="LoginBaseM" component={LoginBaseM} options={{ headerShown: false }} />
          <Stack.Screen name="AccesoMenu" component={AccesoMenu} />
          <Stack.Screen name="ConsultaForm" component={ConsultaForm} />
          <Stack.Screen name="Resultados" component={ResultadosScreen} />
          <Stack.Screen name="FormularioIndexacion" component={FormularioIndexacion} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
