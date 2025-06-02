import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Asegúrate de instalar esta librería
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation para navegación
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AccesoMenu = () => {
  const [formularios, setFormularios] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [username, setUsername] = useState('');
  const [ip, setIp] = useState('');
  const [puerto, setPuerto] = useState('');
  const navigation = useNavigation(); // Hook para navegar


 useEffect(() => {
    const fetchFormularios = async () => {

      try {
        // Recuperar configuración de servidor desde AsyncStorage
        const storedIp = await AsyncStorage.getItem('serverIP');
        const storedPort = await AsyncStorage.getItem('serverPort');
        if (!storedIp || !storedPort) {
          Alert.alert('Error', 'No se ha configurado la IP o el puerto del servidor.');
          return;
        }
        setIp(storedIp);
        setPuerto(storedPort);

        // Recuperar token y usuario
        const token = await AsyncStorage.getItem('authToken');

        //recuperamos el username del usuario y lo seteamos en vez de root
        const storedUsername = await AsyncStorage.getItem('username');
        setUsername(storedUsername || 'Root');

        if (!token) {
          Alert.alert('Error', 'Token no disponible. Inicie sesión nuevamente.');
          return;
        }

        // Construir URL dinámicamente
        const url = `http://${storedIp}:${storedPort}/datascan3-web/rest/formularios.json?token=${token}`;
        console.log('Fetch formularios:', url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }
        const data = await response.json();

        if (data.resultado && Array.isArray(data.resultado.formularios)) {
          const list = data.resultado.formularios.map(f => ({ id: f.id, nombre: f.nombre }));
          setFormularios(list);
        } else {
          Alert.alert('Error', 'No se encontraron formularios');
        }

      } catch (error) {
        console.error('Error al cargar los formularios:', error);
        Alert.alert('Error', 'Hubo un problema al cargar los formularios');
      }
    };
    fetchFormularios();
  }, []);
// Se ejecuta solo una vez al montar el componente

//ejecuta el boton de consulta
  const handleButtonPress = (action) => {

    //verifica si el formulario no esta vacio
    if (selectedValue !== '') {

      //buscamos el formulario con el id seleccionado
      const formularioSeleccionado = formularios.find(
        (formulario) => formulario.id === selectedValue
      );

      if (formularioSeleccionado) {
        // Si la acción es 'Consultar', navega a la pantalla de consulta
        if (action === 'Indexar') {
          // Si la acción es 'Indexar', navega a la pantalla de indexación
          navigation.navigate('FormularioIndexacion', {
            idFormulario: selectedValue,
            nombre: formularioSeleccionado.nombre,
            formularios: formularios,
            action: action,  // Pasamos la acción 'Indexar'
          });
        } else {
          // Acción de 'Consultar'
          navigation.navigate('ConsultaForm', {
            idFormulario: selectedValue,
            nombre: formularioSeleccionado.nombre,
            formularios: formularios,
            action: action,  // Pasamos la acción 'Consultar'
          });
        }
      }
    } else {
      Alert.alert('Advertencia', 'Selecciona un formulario antes de continuar');
    }
  };


  const handleIconPress = () => {
    console.log("Icono presionado");
    // Aquí puedes agregar lo que debe suceder cuando el ícono es tocado
  };

  return (
    <View style={styles.container}>
      {/* Picker */}
      <Image style={styles.container} source={require('../assets/fondo.png')} />
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
            onPress={() => handleButtonPress('Consultar')}
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
        <View style={styles.containerStyle}>
          <Image style={styles.logo1Icon} source={require('../assets/logo 1.png')} />
          <View style={styles.userGroup}>
            <Text style={styles.root}>{username || 'Root'}</Text>
            <Image style={styles.accesomenuItem} source={require('../assets/User.png')} />
          </View>
        </View>
        <Image style={styles.emergencyExitIcon} source={require('../assets/Emergency Exit.svg')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Contenedor principal que organiza todo el contenido de la pantalla
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute', // La imagen se posiciona detrás de cualquier contenido
    resizeMode: 'cover',  // Asegura que la imagen cubra todo el espacio proporcionalmente
    flex: 1, // Asegura que el contenedor ocupe toda la pantalla
    justifyContent: 'flex-start', // Empuja los elementos hacia arriba para evitar que se desborden
    alignItems: 'center', // Centra los elementos horizontalmente
    padding: 0, // Espaciado en los bordes
  },

  // Estilo para el contenedor del Picker
  pickerContainer: {
    width: '100%', // Asegura que el Picker ocupe todo el ancho disponible
    marginBottom: 20,  // Espacio reducido para que los botones no se alejen demasiado del Picker
    alignItems: 'center', // Centra el Picker horizontalmente
    //backgroundColor: '#f5f5f5',  // Fondo gris claro
    // borderWidth: 1,  // Añade borde alrededor del Picker
    // borderColor: '#ccc',  // Color gris del borde
    borderRadius: 8,  // Bordes redondeados
    padding: 5,  // Espaciado dentro del contenedor del Picker
    // Posiciona el contenedor con valores en píxeles
    position: 'absolute',  // Asegura que se ubique en la posición deseada
    top: 100, // Ajusta la posición hacia abajo desde el borde superior en 100px
  },

  // Estilo del Picker
  picker: {
    height: 52, // Altura ajustada del Picker
    width: '80%',  // Ancho ajustado a un 80% de la pantalla
    backgroundColor: '#f5f5f5',  // Fondo blanco para mejor contraste
    marginBottom: 10,  // Espacio debajo del Picker
    borderWidth: 0,  // Añade borde alrededor del Picker

  },

  // Etiqueta del Picker
  label: {
    fontSize: 20,  // Tamaño de fuente de la etiqueta
    marginBottom: 8,  // Espacio debajo de la etiqueta
    //backgroundColor: '#f5f5f5',  // Fondo blanco para mejor contraste
    borderColor: '#00000'
  },

  // Contenedor de los botones
  buttonsContainer: {
    marginTop: 250, // Ajusta el margen superior según sea necesario
    width: '80%',  // Puedes ajustar el ancho para que los botones no se estiren demasiado
    flexDirection: 'row-reverse',  // Esto hace que los botones estén uno al lado del otro
    justifyContent: 'space-between', // Asegura que haya espacio entre los botones
    alignItems: 'center',  // Centra los botones verticalmente si es necesario
  },

  // Estilo de cada botón
  button: {
    backgroundColor: '#007BFF', // Color de fondo azul para los botones
    paddingVertical: 10, // Relleno vertical
    paddingHorizontal: 20, // Relleno horizontal
    borderRadius: 5,  // Bordes redondeados
    marginBottom: 10, // Espacio debajo de cada botón
  },

  // Texto dentro de los botones
  buttonText: {
    color: '#fff',  // Color blanco para el texto
    fontSize: 16,  // Tamaño de fuente del texto
  },

  // Contenedor del menú de acceso (imagen y nombre de usuario)
  accesomenu: {
    position: 'absolute',  // Posición absoluta para ubicarlo en la parte superior
    top: 0, // Coloca el contenedor en la parte superior de la pantalla
    width: '100%',  // Ocupa todo el ancho
    flexDirection: 'row', // Coloca los elementos en fila (imagen y texto)
    justifyContent: 'space-between', // Deja espacio entre el logo y el ícono del usuario
    alignItems: 'center', // Centra los elementos verticalmente
    paddingHorizontal: 20, // Espacio en los bordes del contenedor
    marginTop: 30,  // Espacio desde la parte superior
  },

  // Contenedor del logo y el usuario
  containerStyle: {
    flexDirection: 'row', // Coloca los elementos en fila
    alignItems: 'center', // Centra los elementos verticalmente
    justifyContent: 'space-between', // Separa el logo y el ícono de usuario
    backgroundColor: 'gainsboro',  // Color de fondo gris claro
    borderBottomLeftRadius: 8,  // Bordes redondeados en la parte inferior
    borderBottomRightRadius: 8,  // Bordes redondeados en la parte inferior
    paddingHorizontal: 20,  // Espaciado horizontal
    paddingVertical: 5,  // Espaciado vertical
    position: 'absolute',  // Posición absoluta para ubicarlo en la parte superior
    top: -28.5, // Ajuste de la posición vertical
    left: 0,  // Ajuste de la posición horizontal
    right: 0, // Ajuste de la posición horizontal
  },

  // Contenedor del nombre de usuario y el ícono
  userGroup: {
    flexDirection: 'row', // Organiza el texto y el ícono en fila
    alignItems: 'center', // Centra los elementos verticalmente
  },

  // Estilo del ícono de usuario
  accesomenuItem: {
    width: 40,  // Ancho del ícono
    height: 40,  // Alto del ícono
    resizeMode: 'contain',  // Ajusta el ícono para que se mantenga proporcional
  },

  // Estilo para el nombre de usuario
  root: {
    fontSize: 18,  // Tamaño de la fuente del nombre
    fontWeight: 'bold',  // Texto en negrita
    color: 'darkblue',  // Color del texto
    marginRight: 5,  // Espacio entre el texto y el ícono
  },

  // Estilo del logo
  logo1Icon: {
    width: 150,  // Ancho del logo
    height: 40,  // Alto del logo
    resizeMode: 'contain',  // Mantiene las proporciones del logo
    position: 'static',  // Posición estática
    top: 10,  // Ajuste de la posición vertical
    left: 15,  // Ajuste de la posición horizontal
  },

  // Estilo del ícono de salida de emergencia
  emergencyExitIcon: {
    width: 50,  // Ancho del ícono
    height: 50,  // Alto del ícono
    position: 'absolute',  // Posición absoluta
    top: 10,  // Ajuste de la posición vertical
    left: 10,  // Ajuste de la posición horizontal
  },
});



export default AccesoMenu;