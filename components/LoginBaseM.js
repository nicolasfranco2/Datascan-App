import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; // Importamos Toast



const LoginBaseM = ({ navigation }) => {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.8.14:2025/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: usuario, password: contraseña }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('username', usuario); // Guardamos el nombre de usuario
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Éxito',
          text2: 'Autenticación exitosa',
          visibilityTime: 1000, // Duración del mensaje en milisegundos (1 segundo)
        });
        setTimeout(() => {
          navigation.navigate('AccesoMenu');
        }, 1000);

      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      Alert.alert('Error', 'Error en el servidor');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.LoginBuild}>
      <Image source={require('../assets/logo-login.png')} style={styles.logo} />
      <View style={styles.inputContainer}>
        <Image source={require('../assets/icon_person.png')} style={styles.icon} />
        <TextInput
          placeholder="Usuario"
          value={usuario}
          onChangeText={setUsuario}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <Image source={require('../assets/icon-lock-locked.png')} style={styles.icon} />
        <TextInput
          placeholder="Contraseña"
          value={contraseña}
          onChangeText={setContraseña}
          secureTextEntry
          style={styles.input}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#2D7AFC',
  },
  LoginBuild: {

    width: 300,
    height: 380,
    //flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 2,  // Borde alrededor del contenedor
    borderColor: '#ccc',  // Color del borde del contenedor
    borderRadius: 10,  // Bordes redondeados
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 10,
    width: '80%',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LoginBaseM;
