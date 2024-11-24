import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, FlatList, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConsultaForm = ({ route, navigation }) => {
  const { idFormulario, nombre, formularios: formulariosDesdeNavegacion } = route.params || {};
  const [formularios, setFormularios] = useState(formulariosDesdeNavegacion || []);
  const [selectedValue, setSelectedValue] = useState(idFormulario || '');
  const [formularioAttributes, setFormularioAttributes] = useState(null);
  const [loading, setLoading] = useState(false); // Estado de carga
  const [atributoConditions, setAtributoConditions] = useState({}); // Condiciones de búsqueda
  const [resultados, setResultados] = useState([]);
  const [selectedForm, setSelectedForm] = useState(selectedValue); // Inicializamos el estado del Picker con el valor recibido


  useEffect(() => {
    if (selectedValue) {
      fetchFormularioAttributes(selectedValue);
    } else {
      setFormularioAttributes(null);
      setAtributoConditions({});
    }
  }, [selectedValue]);

  // Cargar formularios desde el servidor
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
          setFormularios(data.formularios.map((formulario) => ({
            id: formulario.id,
            nombre: formulario.nombre,
          })));
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

  // Cargar atributos de un formulario seleccionado
  const fetchFormularioAttributes = async (formularioId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        return Alert.alert('Error', 'Token no disponible. Inicie sesión nuevamente.');
      }

      const response = await fetch(`http://192.168.11.161:2025/formulario/${formularioId}?token=${token}`);
      const data = await response.json();

      if (data) {
        setFormularioAttributes(data);

        // Inicializamos las condiciones de atributos
        const initialConditions = data.atributos.reduce((acc, atributo) => {
          acc[atributo.id] = { condicion: 'ninguno', valor: '' };
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

  // Manejar cambio de selección en el formulario
  const handleValueChange = (itemValue) => {
    setSelectedValue(itemValue);
  
  if (itemValue) {
    fetchFormularioAttributes(itemValue);
  } else {
    setFormularioAttributes(null);
    setAtributoConditions({});
  }
};

  // Manejar el cambio de condición de un atributo
  const handleConditionChange = (atributoId, condicion) => {
    setAtributoConditions((prevState) => ({
      ...prevState,
      [atributoId]: { ...prevState[atributoId], condicion },
    }));
  };

  // Manejar el cambio de valor de un atributo
  const handleValueInputChange = (atributoId, value) => {
    setAtributoConditions((prevState) => ({
      ...prevState,
      [atributoId]: { ...prevState[atributoId], valor: value },
    }));
  };

  // Realizar la consulta con los criterios seleccionados
  const handleButtonPress = async () => {
    if (!selectedValue) {
      return Alert.alert('Error', 'Seleccione un formulario antes de consultar.');
    }

    setLoading(true); // Activamos la carga

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
        setLoading(false);
        return Alert.alert('Error', 'Debe configurar al menos un criterio de búsqueda.');
      }

      // Construir el cuerpo de la solicitud como x-www-form-urlencoded
      const requestBody = new URLSearchParams({
        token,
        idFormulario: selectedValue.toString(),
        criterios: JSON.stringify(criterios),
        incluirAtributos: 'true',
      });

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
        setLoading(false);
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
          formulario: item.formulario || 'No disponible',
          atributos: item.valoresAtributos.map((atributo) => ({
            nombre: atributo.nombre,
            valor: atributo.valor,
          })),
        })) || [];

        setResultados(resultadosFiltrados);
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
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Selecciona un formulario:</Text>
      <Picker selectedValue={selectedValue} onValueChange={handleValueChange}>
        <Picker.Item label="Selecciona un formulario" value="" />
        {formularios.map((formulario) => (
          <Picker.Item key={formulario.id} label={formulario.nombre} value={formulario.id} />
        ))}
      </Picker>
      {formularioAttributes ? (
        <View style={styles.attributesContainer}>
          <Text style={styles.attributesTitle}>Atributos del formulario:</Text>
          {formularioAttributes.atributos.map((atributo) => (
            <View key={atributo.id} style={styles.attributeContainer}>
              <Text style={styles.attribute}>{atributo.nombre}</Text>
              <Picker
                selectedValue={atributoConditions[atributo.id]?.condicion}
                onValueChange={(value) => handleConditionChange(atributo.id, value)}
                style={styles.picker}
              >
                <Picker.Item label="--" value="ninguno" />
                <Picker.Item label="IGUAL" value="igual" />
                <Picker.Item label="CONTIENE" value="contiene" />
                <Picker.Item label="DISTINTO" value="distinto" />
              </Picker>
              <TextInput
                style={styles.input}
                placeholder="Valor"
                value={atributoConditions[atributo.id]?.valor}
                onChangeText={(value) => handleValueInputChange(atributo.id, value)}
              />
            </View>
          ))}
        </View>
      ) : null}

      <TouchableOpacity onPress={handleButtonPress} style={styles.button}>
        <Text style={styles.buttonText}>Consultar</Text>
      </TouchableOpacity>

      {loading && <Text style={styles.loading}>Cargando...</Text>}

      {resultados.length > 0 && (
        <FlatList
          data={resultados}
          renderItem={({ item }) => (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>Nombre: {item.nombreArchivo}</Text>
              <Text style={styles.resultText}>Indexado por: {item.indexadoPor}</Text>
              <Text style={styles.resultText}>Páginas: {item.paginasCantidad}</Text>
              <Text style={styles.resultText}>Fecha indexado: {item.fechaIndexado}</Text>
              <Text style={styles.resultText}>Formulario: {item.formulario}</Text>
              <FlatList
                data={item.atributos}
                renderItem={({ item }) => (
                  <Text style={styles.attributeText}>
                    {item.nombre}: {item.valor}
                  </Text>
                )}
                keyExtractor={(item) => item.nombre}
              />
            </View>
          )}
          keyExtractor={(item) => item.nombreArchivo}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  attributesContainer: {
    marginBottom: 20,
  },
  attributesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  attributeContainer: {
    marginBottom: 10,
  },
  attribute: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  loading: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  resultContainer: {
    marginBottom: 20,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
  },
  attributeText: {
    fontSize: 12,
    marginLeft: 20,
  },
});

export default ConsultaForm;
