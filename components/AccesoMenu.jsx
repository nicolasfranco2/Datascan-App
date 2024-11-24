//Importación de Dependencias:

import React, { useState, useEffect } from 'react';// se utiliza para manejar estados en la visual

import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';//componentes para crear la interfaz  

import { Picker } from '@react-native-picker/picker'; // Componentes del combo box

import AsyncStorage from '@react-native-async-storage/async-storage'; //componentes para almacenar datos, como token datos que se quiere utilizar

import { useNavigation } from '@react-navigation/native'; // componentes para navegar

// inicializamos la interfaz del usuario
const AccesoMenu = () => {
  const [formularios, setFormularios] = useState([]);//guarda  los datos de los formularios en un array

  const [selectedValue, setSelectedValue] = useState('');// guarda el valor seleccionado 

  const [username, setUsername] = useState(''); //guardamos el valor seleccionado en un picker 

  const navigation = useNavigation(); // aplicamos la navegacion

  // efectos para cargar los datos al momento de inicializar la interfaz
  useEffect(() => {

    //definimos la funcion para montar lo necesario
    const fetchFormularios = async () => {

      try {
        // Recuperamos el token de AsyncStorage cuando nos logueamos
        const token = await AsyncStorage.getItem('authToken');

        //recuperamos el username del usuario y lo seteamos en vez de root
        const storedUsername = await AsyncStorage.getItem('username');
        setUsername(storedUsername || 'Root');

        //realizamos la peticion con el token adquirido para obtener nuestros formularios
        if (token) {
          const response = await fetch(
            `http://192.168.11.161:2025/formularios?token=${token}`
          );
          //La respuesta se convierte a formato JSON mediante response.json().
          const data = await response.json();

          //si tenemos resultado solo capturamos el id y el nombre del formulario
          if (data.formularios) {

            // Filtramos los formularios para que tengan solo id y nombre
            const formulariosFiltrados = data.formularios.map(formulario => ({
              id: formulario.id,
              nombre: formulario.nombre
            }));
            
            // Actualizamos el estado con los formularios filtrados
            setFormularios(formulariosFiltrados);

          } else {
            Alert.alert('Error', 'No se encontraron formularios');
          }
        } else {
          Alert.alert('Error', 'Token no disponible. Inicie sesión nuevamente.');
        }

      } catch (error) {
        console.error('Error al cargar los formularios:', error);
        Alert.alert('Error', 'Hubo un problema al cargar los formularios.');
      }
    };
//cerramos el useffet
    fetchFormularios();
  }, []); // Se ejecuta solo una vez al montar el componente

//ejecuta el boton de consulta
  const handleButtonPress = (action) => {

    //verifica si el formulario no esta vacio
    if (selectedValue !== '') {

      //buscamos el formulario con el id seleccionado
      const formularioSeleccionado = formularios.find(
        (formulario) => formulario.id === selectedValue
      );
  
      //si se encontro el formulario se navega al from de Consultaform
      if (formularioSeleccionado) {
        navigation.navigate('ConsultaForm', {
          idFormulario: selectedValue, //id del formulario seleccionado
          nombre: formularioSeleccionado.nombre, // el nombre del formulario
          formularios: formularios, // el formulario completo
          action: action,  // Pasamos la acción aquí
          selectedValue: selectedValue, // Pasamos el valor seleccionado del Picker

        });
      } else {
        Alert.alert('Error', 'Formulario seleccionado no válido');
      }
    } else {
      Alert.alert('Advertencia', 'Selecciona un formulario antes de continuar');
    }
  };
  

  return (
    <View style={styles.container}>
    {/* Picker */}
    <View style={styles.pickerContainer}>
      <Text style={styles.label}>Selecciona un formulario:</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => setSelectedValue(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="--Ninguno--" value="" />
        {formularios.map((formulario) => (
          <Picker.Item
            key={formulario.id}
            label={formulario.nombre}
            value={formulario.id}
          />
        ))}
      </Picker>
    </View>
     {/* Botones de Consultar e Indexar */}
     {selectedValue !== '' && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={ handleButtonPress}
          >
            <Text style={styles.buttonText}>Consultar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleButtonPress('Indexar')}
          >
            <Text style={styles.buttonText}>Indexar</Text>
          </TouchableOpacity>
        </View>
      )}

    <View style={styles.accesomenu}>
      <View style={styles.accesomenuChild} />
      <Image style={styles.accesomenuItem} source={require('../assets/Ellipse 2.png')} />
      <Text style={styles.root}>{username || 'Root'}</Text>
      <View style={styles.accesomenuInner} />
      <Image style={styles.logo1Icon} source={require('../assets/logo 1.png')} />
	{	/*
      <Image style={styles.vectorIcon1} source={require('../assets/Vector.svg')}/>
      <Text style={styles.iconSearch}>🦆 icon "search"</Text> 
      <Image style={styles.agregarArchivo1Icon} source={require('../assets/agregar-archivo 1.png')} />*/}
      <Image style={styles.emergencyExitIcon} source={require('../assets/Emergency Exit.svg')} />
	  
    
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center', // Centra todo en el contenedor
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: 20, // Agrega un poco de espaciado en los bordes
    },
    pickerContainer: {
      width: '100%', // Asegura que el Picker ocupe todo el ancho disponible
      marginBottom: 20, // Agrega espacio debajo del Picker
      alignItems: 'center', // Centra el Picker y su texto dentro de su contenedor
      backgroundColor: '#f5f5f5', // Reemplaza 'var(--color-gainsboro)' con color específico

    },
    label: {
      fontSize: 16,
      marginBottom: 8,
    },
    picker: {
      height: 50,
      width: '80%', // Hace el Picker un poco más pequeño
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 10, // Agrega un poco de espacio entre el Picker y el texto
    },
    text: {
      fontSize: 16,
    },
   accesomenu: {
      position: 'absolute', // Fija los íconos en la parte superior
      top: 0, // Ubica los íconos en la parte superior de la pantalla
      width: '100%', // Asegura que ocupe todo el ancho
      flexDirection: 'row', // Alinea los íconos en fila
      justifyContent: 'center', // Centra los íconos horizontalmente
      alignItems: 'center', // Centra los íconos verticalmente en su contenedor
      marginTop: 30, // Deja un espacio adicional si es necesario
    },
    accesomenuChild: {
      width: 600,
      height: 100,
      backgroundColor: 'gainsboro', // Reemplaza 'var(--color-gainsboro)' con color específico
      borderRadius: 15,
      position: 'absolute',
      top: 20,
      left: 34,
      marginTop: -50, // Ajustar para centrar en el medio
      marginLeft: -206,
    },
   accesomenuItem: {
      width: 42,
      height: 40,
      position: 'absolute',
      top: 18,
      left: 355,
     },
     root: {
      fontSize: 18, // Tamaño de la fuente
      fontWeight: 'bold', // Texto en negrita
      color: '#2D7AFC', // Azul claro
      textAlign: 'center', // Centrar el texto
      marginTop: 10, // Espaciado superior
      zIndex: 10, // Asegura que el texto esté sobre otros elementos
    },
    
    accesomenuInner: {
      width: 412,
      height: 74,
      backgroundColor: 'gainsboro', // Reemplaza 'var(--color-gainsboro)' con color específico
      borderRadius: 15,
      position: 'absolute',
      bottom: 0,
    },
    logo1Icon: {
      width: 200,
      height: 50,
    },
    vectorIcon: {
      width: 50,
      height: 50,
    },
    agregarArchivo1Icon: {
      width: 50, // Ajustar según sea necesario
      height: 50, // Ajustar según sea necesario
      position: 'absolute',
      bottom: 10,
      left: 200,
    },  
    iconSearch: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    emergencyExitIcon: {
      width: 50, // Ajustar según sea necesario
      height: 50, // Ajustar según sea necesario
      position: 'absolute',
      top: 10,
      left: 10,
    },
    buttonsContainer: { 
      marginTop: 20,
      width: '80%',
      alignItems: 'center',

     },
     button: {
      backgroundColor: '#007BFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });
  
export default AccesoMenu;