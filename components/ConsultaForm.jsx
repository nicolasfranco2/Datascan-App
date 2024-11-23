  import React, { useState, useEffect } from 'react';
  import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, FlatList, ScrollView } from 'react-native';
  import { Picker } from '@react-native-picker/picker';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { useNavigation } from '@react-navigation/native';
  import { Button } from 'react-native';


  const AccesoMenu = () => {
    const [formularios, setFormularios] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [formularioAttributes, setFormularioAttributes] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state
    const [resultados, setResultados] = useState([]); // To store search results
    const [atributoConditions, setAtributoConditions] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
      const fetchFormularios = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');

          if (!token) {
            return Alert.alert('Error', 'Token no disponible. Inicie sesión nuevamente.');
          }

          const response = await fetch(`http://192.168.11.161:2025/formularios?token=${token}`);
          const data = await response.json();

          if (data.formularios) {
            setFormularios(
              data.formularios.map((formulario) => ({
                id: formulario.id,
                nombre: formulario.nombre,
              }))
            );
          } else {
            Alert.alert('Error', 'No se encontraron formularios');
          }
        } catch (error) {
          console.error('Error al cargar los formularios:', error);
          Alert.alert('Error', 'Hubo un problema al cargar los formularios.');
        }
      };

      fetchFormularios();
    }, []);

    const fetchFormularioAttributes = async (formularioId) => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          return Alert.alert('Error', 'Token no disponible. Inicie sesión nuevamente.');
        }

        const response = await fetch(
          `http://192.168.11.161:2025/formulario/${formularioId}?token=${token}`
        );
        const data = await response.json();

        if (data) {
          setFormularioAttributes(data);
          // Inicializamos el estado para almacenar las condiciones por atributo
          const initialConditions = data.atributos.reduce((acc, atributo) => {
            acc[atributo.id] = { condicion: 'ninguno', valor: '' }; // "igual" es el valor inicial
            return acc;
          }, {});
          setAtributoConditions(initialConditions);
        } else {
          Alert.alert('Error', 'No se encontraron los atributos del formulario');
        }
      } catch (error) {
        console.error('Error al cargar los atributos del formulario:', error);
        Alert.alert('Error', 'Hubo un problema al cargar los atributos.');
      }
    };

    const handleValueChange = (itemValue) => {
      setSelectedValue(itemValue);
      if (itemValue) {
        fetchFormularioAttributes(itemValue);
      } else {
        setFormularioAttributes(null);
        setAtributoConditions({});
      }
    };

    const handleConditionChange = (atributoId, condicion) => {
      setAtributoConditions((prevState) => ({
        ...prevState,
        [atributoId]: { ...prevState[atributoId], condicion },
      }));
    };

    const handleValueInputChange = (atributoId, value) => {
      setAtributoConditions((prevState) => ({
        ...prevState,
        [atributoId]: { ...prevState[atributoId], valor: value },
      }));
    };

    //BOTON PARA CONSULTAR
    const handleButtonPress = async () => {
      if (!selectedValue) {
        return Alert.alert('Error', 'Seleccione un formulario antes de consultar.');
      }
    
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token || token.trim() === '') {
          return Alert.alert('Error', 'Token no disponible. Inicie sesión nuevamente.');
        }
    
        // Filtrar los criterios según la condición
        const criterios = Object.entries(atributoConditions)
          .filter(([, condition]) => condition.condicion !== 'ninguno')
          .map(([atributoId, condition]) => ({
            condicion: condition.condicion.toUpperCase(),
            valor1: condition.valor,
            valor2: '',
            nombreAtributo: formularioAttributes?.atributos?.find(
              (atributo) => atributo.id === parseInt(atributoId, 10)
            )?.nombre || '',
          }));
    
        if (criterios.length === 0) {
          return Alert.alert('Error', 'Debe configurar al menos un criterio de búsqueda.');
        }
    
        // Construir el cuerpo como x-www-form-urlencoded
        const requestBody = new URLSearchParams({
          token,
          idFormulario: selectedValue.toString(),
          criterios: JSON.stringify(criterios),
          incluirAtributos: 'true',
        });
    
        console.log('Token:', token);
        console.log('Request Body:', requestBody.toString());
    
        // Realizar la solicitud a la API
        const response = await fetch(
          `http://192.168.11.161:8080/datascan3-web/rest/busqueda.json`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: requestBody.toString(),
          }
        );
    
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Respuesta no válida:', text);
          return Alert.alert('Error', 'El servidor no devolvió un JSON válido.');
        }
    
        const data = await response.json().catch(() => ({}));
    
        if (response.ok) {
          // Procesar los datos obtenidos de la API
          const resultadosFiltrados = data?.resultado?.documentos?.items?.map((item) => ({
            nombreArchivo: item.nombreArchivo,
            indexadoPor: item.archivoIndexadoPorUsuario,
            paginasCantidad: item.paginasArchivo,
            fechaIndexado: item.archivoIndexadoEnFecha,
            formulario: item.formulario || 'No disponible', // Agregar el formulario
            atributos: item.valoresAtributos.map((atributo) => ({
              nombre: atributo.nombre,
              valor: atributo.valor,
            })),
          })) || [];
    
          Alert.alert('Éxito', 'Consulta realizada correctamente.');
          navigation.navigate('Resultados', { resultados: resultadosFiltrados });
        } else {
          const errorMessage = data?.message || 'Hubo un problema con la consulta.';
          console.error('Error en la consulta:', data);
          Alert.alert('Error', errorMessage);
        }
      } catch (error) {
        console.error('Error al realizar la consulta:', error);
        Alert.alert('Error', 'Ocurrió un problema al conectar con la API.');
      }
    };
    
    

    return (
      <ScrollView  style={styles.container}>
        <Text style={styles.label}>Selecciona un formulario:</Text>
        <Picker selectedValue={selectedValue} onValueChange={handleValueChange} style={styles.picker}>
          <Picker.Item label="--Ninguno--" value="" />
          {formularios.map((formulario) => (
            <Picker.Item key={formulario.id} label={formulario.nombre} value={formulario.id} />
          ))}
        </Picker>

        {formularioAttributes ? (
    <View style={styles.attributesContainer}>
      <Text style={styles.attributesTitle}>Atributos del formulario:</Text>
      {formularioAttributes.atributos && formularioAttributes.atributos.length > 0 ? (
        formularioAttributes.atributos.map((atributo) => (
          <View key={atributo.id} style={styles.attributeContainer}>
            <Text style={styles.attribute}>{atributo.nombre}</Text>
            <Picker
              selectedValue={atributoConditions[atributo.id]?.condicion}
              onValueChange={(value) => handleConditionChange(atributo.id, value)}
              style={styles.picker}
            >
              <Picker.Item label="--" value="ninguno" />
              <Picker.Item label="IGUAL" value="igual" />
              <Picker.Item label="DISTINTO" value="distinto" />
              <Picker.Item label="CONTIENE" value="contiene" />
            </Picker>

            {/* Renderizamos el TextInput solo si la condición es distinta de "ninguno" */}
            {atributoConditions[atributo.id]?.condicion !== 'ninguno' && (
              <TextInput
                style={styles.input}
                placeholder="Ingrese valor..."
                value={atributoConditions[atributo.id]?.valor}
                onChangeText={(text) => handleValueInputChange(atributo.id, text)}
              />
            )}
          </View>
        ))
      ) : (
        <Text>No se encontraron atributos</Text>
      )}
    </View>
  ) : (
    <Text style={styles.loadingText}>Cargando atributos...</Text>
  )}
  <Button title="Consultar" onPress={handleButtonPress} />

  {/* Mostrar los resultados si están disponibles */}
  {loading ? (
    <Text style={styles.loadingText}>Cargando resultados...</Text>
  ) : (
    <FlatList
      data={resultados}
      keyExtractor={(item) => item.idDocumento}
      renderItem={({ item }) => (
        <View style={styles.resultItem}>
          <Text style={styles.resultText}>Nombre: {item.nombreArchivo}</Text>
          <Text style={styles.resultText}>Páginas: {item.paginasArchivo}</Text>
          <Text style={styles.resultText}>Indexado por: {item.archivoIndexadoPorUsuario}</Text>
          <Text style={styles.resultText}>Fecha indexado: {item.archivoIndexadoEnFecha}</Text>
        </View>
      )}
    />
  )}
  </ScrollView >
  );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    label: {
      fontSize: 18,
      marginBottom: 10,
    },
    picker: {
      marginBottom: 20,
    },
    attributesContainer: {
      marginVertical: 20,
    },
    attributesTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    attribute: {
      fontSize: 16,
      marginBottom: 5,
    },
    attributeContainer: {
      marginBottom: 20,
    },
    loadingText: {
      fontSize: 16,
      color: 'gray',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginTop: 10,
      paddingHorizontal: 10,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      padding: 10,
      backgroundColor: '#4CAF50',
      borderRadius: 5,
      margin: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });

  export default AccesoMenu;
