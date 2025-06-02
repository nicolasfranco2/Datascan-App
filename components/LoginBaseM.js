// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Toast from 'react-native-toast-message'; // Importamos Toast

// const LoginBaseM = ({ navigation }) => {
//   const [usuario, setUsuario] = useState('');
//   const [contraseña, setContraseña] = useState('');
//   const [showSubMenu, setShowSubMenu] = useState(false);
//   const [ip, setIp] = useState('');
//   const [puerto, setPuerto] = useState('');

//   const handleLogin = async () => {
//     // Verificar si la IP y el puerto fueron ingresados
//     if (!ip || !puerto) {
//       Alert.alert('Error', 'Por favor ingrese una IP y un puerto válidos');
//       return;
//     }
  
//     try {
//       const url = `http://${ip}:${puerto}/datascan3-web/rest/login.json`;  // Usar IP y puerto proporcionados por el usuario
//       console.log('URL de solicitud:', url);
  
//       // Convertimos los datos a formato application/x-www-form-urlencoded
//       const data = new URLSearchParams({
//         aplicacion: 'datascan',  // Siempre enviar este parámetro
//         user: usuario,
//         password: contraseña,
//       }).toString();
  
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',  // Enviamos como x-www-form-urlencoded
//         },
//         body: data,  // Enviamos los datos como cadena de parámetros URL
//       });
  
//       const responseText = await response.text(); // Captura la respuesta como texto
//       console.log('Respuesta cruda del servidor:', responseText);
  
//       if (response.ok) {
//         const data = JSON.parse(responseText); // Intentamos analizar la respuesta como JSON
//         const token = data?.resultado?.token;  // Asegurarnos de que el token exista en la respuesta
  
//         // Verificación explícita del token antes de almacenarlo
//         if (token) {
//           console.log('Token recibido:', token);  // Verifica que el token esté presente
  
//           // Guardamos el token y el nombre de usuario que el usuario ingresó
//           await AsyncStorage.setItem('authToken', token);
//           await AsyncStorage.setItem('username', usuario);  // Guardamos el nombre de usuario que el usuario ingresó
  
//           Toast.show({
//             type: 'success',
//             position: 'bottom',
//             text1: 'Éxito',
//             text2: 'Autenticación exitosa',
//           });
//           setTimeout(() => {
//             navigation.navigate('AccesoMenu');
//           }, 1000);
//         } else {
//           console.log('Token no recibido, datos de respuesta:', data);  // Si el token no está presente, lo logueamos
//           Alert.alert('Error', 'Token no recibido del servidor');
//         }
//       } else {
//         Alert.alert('Error', `Error del servidor: ${response.status}`);
//       }
//     } catch (error) {
//       console.error('Error en la solicitud:', error);
//       Alert.alert('Error', 'No se pudo conectar al servidor');
//     }
//   };
  

//   const toggleSubMenu = () => {
//     setShowSubMenu(!showSubMenu);
//   };

//   const handleSaveConnection = async () => {
//     try {
//       if (!ip || !puerto) {
//         Alert.alert('Error', 'Por favor ingrese una IP y un puerto válidos');
//         return;
//       }

//       // Guardamos la IP y el puerto proporcionados por el usuario en AsyncStorage
//       await AsyncStorage.setItem('serverIP', ip);
//       await AsyncStorage.setItem('serverPort', puerto);
//       Toast.show({
//         type: 'success',
//         position: 'bottom',
//         text1: 'Conexión guardada',
//         text2: `IP: ${ip}, Puerto: ${puerto}`,
//         visibilityTime: 2000,
//       });
//       setShowSubMenu(false);
//     } catch (error) {
//       Alert.alert('Error', 'No se pudo guardar la conexión');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.LoginBuild}>
//         <Image source={require('../assets/logo-login.png')} style={styles.logo} />
//         <View style={styles.inputContainer}>
//           <Image source={require('../assets/icon_person.png')} style={styles.icon} />
//           <TextInput
//             placeholder="Usuario"
//             value={usuario}
//             onChangeText={setUsuario}
//             style={styles.input}
//           />
//         </View>
//         <View style={styles.inputContainer}>
//           <Image source={require('../assets/icon-lock-locked.png')} style={styles.icon} />
//           <TextInput
//             placeholder="Contraseña"
//             value={contraseña}
//             onChangeText={setContraseña}
//             secureTextEntry
//             style={styles.input}
//           />
//         </View>
//         <TouchableOpacity style={styles.button} onPress={handleLogin}>
//           <Text style={styles.buttonText}>Ingresar</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Botón de Conexión */}
//       <TouchableOpacity style={styles.buttonConexion} onPress={toggleSubMenu}>
//         <Text style={styles.buttonText}>Ingresar Conexion</Text>
//       </TouchableOpacity>

//       {/* Submenú para ingresar IP y Puerto */}
//       {/* {showSubMenu && (
//         <View style={styles.subMenu}>
//           <Text style={styles.label}>IP del Servidor:</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Ingrese la IP"
//             value={ip}
//             onChangeText={setIp}
//             keyboardType="numeric"
//             placeholderTextColor="#aaa"  // Color del texto del placeholder
//           />
//           <Text style={styles.label}>Puerto del Servidor:</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Ingrese el puerto"
//             value={puerto}
//             onChangeText={setPuerto}
//             keyboardType="numeric"
//             placeholderTextColor="#aaa"  // Color del texto del placeholder
//           />
//           <TouchableOpacity style={styles.saveButton} onPress={handleSaveConnection}>
//             <Text style={styles.buttonText}>Guardar Conexión</Text>
//           </TouchableOpacity>
//         </View> */}
//         {showSubMenu && (
//   <View style={subMenuStyles.container}>
//     <Text style={subMenuStyles.label}>IP del Servidor:</Text>
//     <View style={subMenuStyles.inputContainer}>
//       <TextInput
//         style={subMenuStyles.input}
//         placeholder="Ingrese la IP"
//         value={ip}
//         onChangeText={setIp}
//         keyboardType="numeric"
//         placeholderTextColor="#999"
//       />
//     </View>

//     <Text style={subMenuStyles.label}>Puerto del Servidor:</Text>
//     <View style={subMenuStyles.inputContainer}>
//       <TextInput
//         style={subMenuStyles.input}
//         placeholder="Ingrese el puerto"
//         value={puerto}
//         onChangeText={setPuerto}
//         keyboardType="numeric"
//         placeholderTextColor="#999"
//       />
//     </View>

//     <TouchableOpacity style={subMenuStyles.saveButton} onPress={handleSaveConnection}>
//       <Text style={subMenuStyles.buttonText}>Guardar Conexión</Text>
//     </TouchableOpacity>
//   </View>
// )}
//     </View>
//   );
// };

// const subMenuStyles = StyleSheet.create({
//   container: {
//     marginTop: 20,
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//     width: 300,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 5,
//     alignSelf: 'flex-start',
//     color: '#000',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     marginBottom: 15,
//     width: '100%',
//     backgroundColor: '#f5f5f5',
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     fontSize: 16,
//     color: '#000',
//     paddingHorizontal: 10,
//   },
//   saveButton: {
//     backgroundColor: '#007bff',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginTop: 10,
//     alignItems: 'center',
//     width: '100%',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 20,
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//     width: 300,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 5,
//     alignSelf: 'flex-start',
//     color: '#000',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     marginBottom: 15,
//     width: '100%',
//     backgroundColor: '#f5f5f5',
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     fontSize: 16,
//     color: '#000',
//     paddingHorizontal: 10,
//   },
//   saveButton: {
//     backgroundColor: '#007bff',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginTop: 10,
//     alignItems: 'center',
//     width: '100%',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 16,
//     backgroundColor: '#2D7AFC',
//   },
//   LoginBuild: {
//     width: 300,
//     height: 380,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderWidth: 2,
//     borderColor: '#ccc',
//     borderRadius: 10,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     marginBottom: 20,
//   },
//  inputContainer: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   borderWidth: 1,
//   borderColor: '#ccc',
//   borderRadius: 8,
//   paddingHorizontal: 10,
//   paddingVertical: 8,
//   marginVertical: 10,
//   width: '80%',
//   backgroundColor: '#f5f5f5',
// },
//  icon: {
//     width: 20,
//     height: 20,
//     marginRight: 10,
//   },
//   input: {
//     height: 40,
//   flex: 1,                      // Esto ajusta el input al espacio restante
//   fontSize: 16,
//   color: '#000',
//   backgroundColor: '#f5f5f5',
//   paddingHorizontal: 10,
//     // height: 40,
//     // width: '100%',
//     // borderColor: '#ccc',
//     // borderWidth: 1,
//     // borderRadius: 8,
//     // paddingHorizontal: 10,
//     // marginBottom: 15,
//     // fontSize: 16,
//     // color: '#000',
//     // backgroundColor: '#f5f5f5', // Fondo de los inputs
//   },
//   button: {
//     backgroundColor: '#007bff',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginTop: 20,
//   },
//   buttonConexion: {
//     backgroundColor: '#2ECC71',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginTop: 20,
//   },
//   subMenu: {
//     marginTop: 20,
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//     alignItems: 'center',
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,  // Sombra en dispositivos Android
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 5,
//     alignSelf: 'flex-start',
//     color: '#000',
//   },
//   saveButton: {
//     backgroundColor: '#007bff',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginTop: 10,
//     alignItems: 'center',
//     width: '100%',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default LoginBaseM;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert,Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; // Importamos Toast
import { BlurView } from 'expo-blur';
import { ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginBaseM = ({ navigation }) => {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [ip, setIp] = useState('');
  const [puerto, setPuerto] = useState('');
const [mostrarContraseña, setMostrarContraseña] = useState(false);

  const handleLogin = async () => {
    // Verificar si la IP y el puerto fueron ingresados
    if (!ip || !puerto) {
      Alert.alert('Error', 'Por favor ingrese una IP y un puerto válidos');
      return;
    }
  
    try {
      const url = `http://${ip}:${puerto}/datascan3-web/rest/login.json`;  // Usar IP y puerto proporcionados por el usuario
      console.log('URL de solicitud:', url);
  
      // Convertimos los datos a formato application/x-www-form-urlencoded
      const data = new URLSearchParams({
        aplicacion: 'datascan',  // Siempre enviar este parámetro
        user: usuario,
        password: contraseña,
      }).toString();
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',  // Enviamos como x-www-form-urlencoded
        },
        body: data,  // Enviamos los datos como cadena de parámetros URL
      });
  
      const responseText = await response.text(); // Captura la respuesta como texto
      console.log('Respuesta cruda del servidor:', responseText);
  
      if (response.ok) {
        const data = JSON.parse(responseText); // Intentamos analizar la respuesta como JSON
        const token = data?.resultado?.token;  // Asegurarnos de que el token exista en la respuesta
  
        // Verificación explícita del token antes de almacenarlo
        if (token) {
          console.log('Token recibido:', token);  // Verifica que el token esté presente
  
          // Guardamos el token y el nombre de usuario que el usuario ingresó
          await AsyncStorage.setItem('authToken', token);
          await AsyncStorage.setItem('username', usuario);  // Guardamos el nombre de usuario que el usuario ingresó
  
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Éxito',
            text2: 'Autenticación exitosa',
          });
          setTimeout(() => {
            navigation.navigate('AccesoMenu');
          }, 1000);
        } else {
          console.log('Token no recibido, datos de respuesta:', data);  // Si el token no está presente, lo logueamos
          Alert.alert('Error', 'Token no recibido del servidor');
        }
      } else {
        Alert.alert('Error', `Error del servidor: ${response.status}`);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };
  

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  };

  const handleSaveConnection = async () => {
    try {
      if (!ip || !puerto) {
        Alert.alert('Error', 'Por favor ingrese una IP y un puerto válidos');
        return;
      }

      // Guardamos la IP y el puerto proporcionados por el usuario en AsyncStorage
      await AsyncStorage.setItem('serverIP', ip);
      await AsyncStorage.setItem('serverPort', puerto);
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Conexión guardada',
        text2: `IP: ${ip}, Puerto: ${puerto}`,
        visibilityTime: 2000,
      });
      setShowSubMenu(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la conexión');
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
{/*Se agrega un icono de vista previa de la contraseña*/}
  <TextInput
    placeholder="Contraseña"
    value={contraseña}
    onChangeText={setContraseña}
    secureTextEntry={!mostrarContraseña}
    style={[styles.input, { flex: 1 }]} // hace que el input use todo el espacio restante
  />

  <TouchableOpacity onPress={() => setMostrarContraseña(!mostrarContraseña)}>
    <Ionicons
      name={mostrarContraseña ? 'eye-off' : 'eye'}
      size={20}
      color="#999"
    />
  </TouchableOpacity>
</View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de Conexión */}
      <TouchableOpacity style={styles.buttonConexion} onPress={toggleSubMenu}>
        <Text style={styles.buttonText}>Ingresar Conexion</Text>
      </TouchableOpacity>

      {/* Submenú para ingresar IP y Puerto */}
      {/* {showSubMenu && (
        <View style={styles.subMenu}>
          <Text style={styles.label}>IP del Servidor:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese la IP"
            value={ip}
            onChangeText={setIp}
            keyboardType="numeric"
            placeholderTextColor="#aaa"  // Color del texto del placeholder
          />
          <Text style={styles.label}>Puerto del Servidor:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el puerto"
            value={puerto}
            onChangeText={setPuerto}
            keyboardType="numeric"
            placeholderTextColor="#aaa"  // Color del texto del placeholder
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveConnection}>
            <Text style={styles.buttonText}>Guardar Conexión</Text>
          </TouchableOpacity>
        </View> */}
        {/*---------------Este si funciona---------------*/}
        {/* {showSubMenu && (
  <View style={subMenuStyles.container}>
    <Text style={subMenuStyles.label}>IP del Servidor:</Text>
    <View style={subMenuStyles.inputContainer}>
      <TextInput
        style={subMenuStyles.input}
        placeholder="Ingrese la IP"
        value={ip}
        onChangeText={setIp}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />
    </View>

    <Text style={subMenuStyles.label}>Puerto del Servidor:</Text>
    <View style={subMenuStyles.inputContainer}>
      <TextInput
        style={subMenuStyles.input}
        placeholder="Ingrese el puerto"
        value={puerto}
        onChangeText={setPuerto}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />
    </View>

    <TouchableOpacity style={subMenuStyles.saveButton} onPress={handleSaveConnection}>
      <Text style={subMenuStyles.buttonText}>Guardar Conexión</Text>
    </TouchableOpacity>
  </View> 
  )}*/}
  {/*Funciona pero no es tan difuminado el fondo*/}
  {/* <Modal transparent animationType="fade" visible={showSubMenu} onRequestClose={toggleSubMenu}>
  <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={subMenuStyles.container}>
        <Text style={subMenuStyles.label}>IP del Servidor:</Text>
        <View style={subMenuStyles.inputContainer}>
          <TextInput
            style={subMenuStyles.input}
            placeholder="Ingrese la IP"
            value={ip}
            onChangeText={setIp}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <Text style={subMenuStyles.label}>Puerto del Servidor:</Text>
        <View style={subMenuStyles.inputContainer}>
          <TextInput
            style={subMenuStyles.input}
            placeholder="Ingrese el puerto"
            value={puerto}
            onChangeText={setPuerto}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={subMenuStyles.saveButton} onPress={handleSaveConnection}>
          <Text style={subMenuStyles.buttonText}>Guardar Conexión</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleSubMenu} style={{ marginTop: 10 }}>
          <Text style={{ color: '#007bff', fontWeight: 'bold' }}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </BlurView>
</Modal> */}<Modal transparent animationType="fade" visible={showSubMenu} onRequestClose={toggleSubMenu}>
  <View style={{ flex: 1 }}>
    {/* IMAGEN DE FONDO */}
    <ImageBackground source={require('../assets/cap.jpeg')} style={StyleSheet.absoluteFillObject} resizeMode="cover">

      {/* CAPA DE DESENFOQUE */}
      <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />
      
      {/* OPCIONAL: capa semitransparente azul sobre la imagen */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(32, 34, 35, 0.67)' }]} />

      {/* CONTENIDO DEL MODAL */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={subMenuStyles.container}>
          <Text style={subMenuStyles.label}>IP del Servidor:</Text>
          <View style={subMenuStyles.inputContainer}>
            <TextInput
              style={subMenuStyles.input}
              placeholder="Ingrese la IP"
              value={ip}
              onChangeText={setIp}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          <Text style={subMenuStyles.label}>Puerto del Servidor:</Text>
          <View style={subMenuStyles.inputContainer}>
            <TextInput
              style={subMenuStyles.input}
              placeholder="Ingrese el puerto"
              value={puerto}
              onChangeText={setPuerto}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={subMenuStyles.saveButton} onPress={handleSaveConnection}>
            <Text style={subMenuStyles.buttonText}>Guardar Conexión</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleSubMenu} style={{ marginTop: 10 }}>
            <Text style={{ color: '#007bff', fontWeight: 'bold' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  </View>
</Modal>
    </View>
  );
};

const subMenuStyles = StyleSheet.create({
  container: {
  marginTop: 20,
  backgroundColor: 'rgba(255, 255, 255, 0.73)', // blanco translúcido
  padding: 20,
  borderRadius: 10,
  width: 300,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
  /*container: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }*/
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
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
  borderColor: '#ccc',
  borderRadius: 8,
  paddingHorizontal: 10,
  paddingVertical: 8,
  marginVertical: 10,
  width: '80%',
  backgroundColor: '#f5f5f5',
},
 icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    height: 40,
  flex: 1,                      // Esto ajusta el input al espacio restante
  fontSize: 16,
  color: '#000',
  backgroundColor: '#f5f5f5',
  paddingHorizontal: 10,
    // height: 40,
    // width: '100%',
    // borderColor: '#ccc',
    // borderWidth: 1,
    // borderRadius: 8,
    // paddingHorizontal: 10,
    // marginBottom: 15,
    // fontSize: 16,
    // color: '#000',
    // backgroundColor: '#f5f5f5', // Fondo de los inputs
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonConexion: {
    backgroundColor: '#2ECC71',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  subMenu: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,  // Sombra en dispositivos Android
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LoginBaseM;
