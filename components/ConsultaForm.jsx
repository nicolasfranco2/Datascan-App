import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


const ConsultaForm = ({ route, navigation }) => {
  const { idFormulario, nombre, formularios: formulariosDesdeNavegacion } = route.params || {};
  const [formularios, setFormularios] = useState(formulariosDesdeNavegacion || []);
  const [selectedValue, setSelectedValue] = useState(idFormulario || '');
  const [formularioAttributes, setFormularioAttributes] = useState(null);
  const [loading, setLoading] = useState(false); // Estado de carga
  const [atributoConditions, setAtributoConditions] = useState({}); // Condiciones de búsqueda
  const [resultados, setResultados] = useState([]);
  const [selectedForm, setSelectedForm] = useState(selectedValue); // Inicializamos el estado del Picker con el valor recibido
  const [showDatePicker, setShowDatePicker] = useState(false); // To show the date picker


  useEffect(() => {
    if (selectedValue) {
      fetchFormularioAttributes(selectedValue);
    } else {
      setFormularioAttributes(null);
      setAtributoConditions({});
      setFecha_(null); // Limpiar el valor de fecha_ al volver atrás
    }
  }, [selectedValue]); //

 // Cargar formularios directamente desde la API original
useEffect(() => {
  const fetchFormularios = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
        const serverIP = await AsyncStorage.getItem('serverIP');
        const serverPort = await AsyncStorage.getItem('serverPort');
        if (!token || !serverIP || !serverPort) {
          Alert.alert('Error', 'Falta token o configuración de servidor.');
          return; }

      const url = `http://${serverIP}:${serverPort}/datascan3-web/rest/formularios.json?token=${token}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.resultado && data.resultado.formularios) {
        setFormularios(data.resultado.formularios.map((formulario) => ({
          id: formulario.id,
          nombre: formulario.nombre,
          atributos: formulario.atributos.map((atributo) => ({
            id: atributo.id,
            nombre: atributo.nombre,
            tipo: atributo.tipo,
          })),
        })));
        
      } else {
        Alert.alert('Error', 'No se encontraron formularios.');
      }
    } catch (error) {
      console.error('Error al cargar los formularios:', error);
      Alert.alert('Error', 'Hubo un problema al cargar los formularios.');
    }
  };

  fetchFormularios();
}, []);

 // Cargar atributos de un formulario seleccionado desde la API original
const fetchFormularioAttributes = async (formularioId) => {
  try {
        const token = await AsyncStorage.getItem('authToken');
        const serverIP = await AsyncStorage.getItem('serverIP');
        const serverPort = await AsyncStorage.getItem('serverPort');
        if (!token || !serverIP || !serverPort) {
          Alert.alert('Error', 'Falta token o configuración de servidor.');
          return;
        }

    const url = `http://${serverIP}:${serverPort}/datascan3-web/rest/formularios.json?token=${token}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.resultado && data.resultado.formularios) {
      // Filtrar el formulario por ID
      const formulario = data.resultado.formularios.find((f) => f.id === parseInt(formularioId, 10));

      if (formulario) {
        const formularioProcesado = {
          id: formulario.id,
          nombre: formulario.nombre,
          atributos: formulario.atributos.map((atributo) => ({
            id: atributo.id,
            nombre: atributo.nombre,
            tipo: atributo.tipo,
          })),
        };

        setFormularioAttributes(formularioProcesado);

        // Inicializamos las condiciones de atributos
        const initialConditions = formularioProcesado.atributos.reduce((acc, atributo) => {
          acc[atributo.id] = { condicion: 'ninguno', valor: '' };
          return acc;
        }, {});
        setAtributoConditions(initialConditions);
      } else {
        Alert.alert('Error', 'Formulario no encontrado.');
      }
    } else {
      Alert.alert('Error', 'No se encontraron formularios.');
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
  // Manejar el cambio de valor de un atributo
  const handleValueInputChange = (atributoId, value) => {
    setAtributoConditions((prevState) => ({
      ...prevState,
      [atributoId]: { ...prevState[atributoId], valor: value },
    }));
  };

  const handleDateChange = (atributoId, campo, selectedDate) => {
  if (selectedDate) {
    setAtributoConditions((prevState) => ({
      ...prevState,
      [atributoId]: {
        ...prevState[atributoId],
        [campo]: selectedDate, // Guardamos la fecha como un objeto Date
      },
    }));
    setShowDatePicker(null); // Ocultar el selector
  }
};
  
// Función para formatear las fechas a 'DD/MM/YYYY'
const formatDate = (date) => {
  if (!date) return ''; // Si la fecha es nula o indefinida
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan desde 0
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

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

    // Filtrar y construir los criterios según la condición
    // Filtrar y construir los criterios según la condición
    const criterios = Object.entries(atributoConditions)
      .filter(([, condition]) => condition.condicion !== 'ninguno') // Filtrar criterios válidos
      .map(([atributoId, condition]) => {
        const nombreAtributo = formularioAttributes?.atributos?.find(
          (atributo) => atributo.id === parseInt(atributoId, 10)
        )?.nombre || '';

        // Manejar condiciones específicas
        if (condition.condicion.toLowerCase() === 'intervalo') {
          return {
            condicion: condition.condicion.toUpperCase(),
            valor1: formatDate(condition.valorDesde) || '', // Formatear fecha desde
            valor2: formatDate(condition.valorHasta) || '', // Formatear fecha hasta
            nombreAtributo,
          };
        } else if (
          condition.condicion.toLowerCase() === 'mayor' ||
          condition.condicion.toLowerCase() === 'menor'
        ) {
          return {
            condicion: condition.condicion.toUpperCase(),
            valor1: condition.valor ? formatDate(condition.valor) : '', // Formato DD/MM/YYYY
            //valor2: '', // Sin valor2 para mayor/menor
            nombreAtributo,
          };
        }

        // Condición estándar
        return {
          condicion: condition.condicion.toUpperCase(),
          valor1: condition.valor || '',
          valor2: '', // vacío porque no aplica
          nombreAtributo,
        };
      });

    // Log para inspeccionar los criterios antes de enviarlos
    console.log('Criterios:', criterios);

    // Construir el cuerpo de la solicitud como x-www-form-urlencoded
    const requestBody = new URLSearchParams({
      token,
      idFormulario: selectedValue.toString(),
      criterios: criterios.length > 0 ? JSON.stringify(criterios) : '[]', // Enviar un array vacío si no hay criterios
      incluirAtributos: 'true',
    });

    // Log para ver el cuerpo de la solicitud antes de enviarla
    console.log('Cuerpo de la solicitud:', requestBody.toString());

    // Obtener configuración desde AsyncStorage
const serverIP = await AsyncStorage.getItem('serverIP');
const serverPort = await AsyncStorage.getItem('serverPort');

if (!token || !serverIP || !serverPort) {
  Alert.alert('Error', 'Faltan token o configuración de servidor.');
  setLoading(false);
  return;
}

// URL dinámica con los datos de configuración
const url = `http://${serverIP}:${serverPort}/datascan3-web/rest/busqueda.json`;
console.log('POST a:', url);

const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: requestBody.toString(),
});

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Respuesta no válida:', text);
      setLoading(false);
      return Alert.alert('Error', 'El servidor no devolvió un JSON válido.');
    }

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      // Log para ver los datos obtenidos de la API
      console.log('Datos de la API:', data);

      // Procesar los datos obtenidos de la API
      const resultadosFiltrados = data?.resultado?.documentos?.items?.map((item) => ({
        nombreArchivo: item.nombreArchivo,
        indexadoPor: item.archivoIndexadoPorUsuario,
        paginasCantidad: item.paginasArchivo,
        fechaIndexado: item.archivoIndexadoEnFecha,
        idDocumento: item.idDocumento,
        formulario: item.formulario || 'No disponible',
        atributos: item.valoresAtributos.map((atributo) => ({
          nombre: atributo.nombre,
          valor: atributo.valor,
        })),
      })) || [];

      console.log('Resultados filtrados:', resultadosFiltrados);

      // setResultados(resultadosFiltrados);
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
      <Picker
  selectedValue={selectedValue}
  onValueChange={handleValueChange}
  style={styles.picker}
>
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

        {/* Verificar si el atributo es de tipo 'FECHA' */}
        {atributo.tipo === 'FECHA' ? (
          <View>
            {/* Picker: Condiciones específicas para tipo 'FECHA' */}
            <Picker
              selectedValue={atributoConditions[atributo.id]?.condicion}
              onValueChange={(value) => handleConditionChange(atributo.id, value)}
              style={styles.picker}
            >
              <Picker.Item label="--" value="ninguno" />
              <Picker.Item label="MAYOR" value="mayor" />
              <Picker.Item label="MENOR" value="menor" />
              <Picker.Item label="INTERVALO" value="intervalo" />
            </Picker>

            {/* Mostrar DateTimePicker solo si se ha seleccionado una condición válida */}
            {atributoConditions[atributo.id]?.condicion !== 'ninguno' && atributoConditions[atributo.id]?.condicion !== 'intervalo' && (
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker({ id: atributo.id, field: 'valor' })}
              >
                <Text style={styles.inputText}>
                  {atributoConditions[atributo.id]?.valor
                    ? new Date(atributoConditions[atributo.id]?.valor).toLocaleDateString()
                    : 'Selecciona una fecha'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Mostrar campos "Desde" y "Hasta" solo si la condición es 'INTERVALO' */}
            {atributoConditions[atributo.id]?.condicion === 'intervalo' && (
              <View style={styles.intervalContainer}>
                <View>
                  <Text style={styles.intervalLabel}>Desde:</Text>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowDatePicker({ id: atributo.id, field: 'valorDesde' })}
                  >
                    <Text style={styles.inputText}>
                      {atributoConditions[atributo.id]?.valorDesde
                        ? new Date(atributoConditions[atributo.id]?.valorDesde).toLocaleDateString()
                        : 'Selecciona una fecha'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <Text style={styles.intervalLabel}>Hasta:</Text>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowDatePicker({ id: atributo.id, field: 'valorHasta' })}
                  >
                    <Text style={styles.inputText}>
                      {atributoConditions[atributo.id]?.valorHasta
                        ? new Date(atributoConditions[atributo.id]?.valorHasta).toLocaleDateString()
                        : 'Selecciona una fecha'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Mostrar el DateTimePicker si corresponde */}
            {showDatePicker?.id === atributo.id && (
              <DateTimePicker
                value={
                  atributoConditions[atributo.id]?.[showDatePicker.field] ||
                  new Date()
                }
                mode="date"
                display="default"
                onChange={(event, selectedDate) =>
                  handleDateChange(atributo.id, showDatePicker.field, selectedDate)
                }
              />
            )}
          </View>
        ) : (
          <View>
            {/* Picker: Condiciones generales para otros tipos */}
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

            {/* Mostrar TextInput solo si se seleccionó una condición distinta a "ninguno" */}
            {atributoConditions[atributo.id]?.condicion !== 'ninguno' && (
              <TextInput
                style={styles.input}
                placeholder="Valor"
                placeholder="Valor"
                value={atributoConditions[atributo.id]?.valor}
                onChangeText={(value) => handleValueInputChange(atributo.id, value)}
                onChangeText={(value) => handleValueInputChange(atributo.id, value)}
              />
            )}
          </View>
        )}
      </View>
    ))}

    {/* Botón de consulta */}
    <TouchableOpacity onPress={handleButtonPress} style={styles.button}>
      <Text style={styles.buttonText}>Consultar</Text>
    </TouchableOpacity>
  </View>
) : null}

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
              <Text style={styles.detailText}>Id del documento: {item.idDocumento}</Text>
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
  intervalContainer: {
    marginTop: 10,
  },
  intervalLabel: {
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 8,
  },
  /*picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1, // Establece el grosor del borde
    borderColor: '#ccc', // Color del borde
    borderRadius: 5, // Redondea las esquinas (opcional)
  }*/
    picker: {
      height: 50, // Altura del componente Picker (en píxeles).
      width: '100%', // Ancho del Picker, ocupa el 100% del ancho disponible del contenedor.
      marginBottom: 20, // Espaciado (en píxeles) debajo del Picker para separarlo de otros elementos.
      borderWidth: 1, // Grosor del borde del Picker (en píxeles).
      borderColor: '#ccc', // Color del borde del Picker (gris claro, código hexadecimal).
      borderRadius: 5, // Esquinas redondeadas del borde (en píxeles).
      backgroundColor: '#f9f9f9', // Color de fondo del Picker (gris muy claro).
      color: '#333', // Color del texto del Picker (gris oscuro).
      paddingHorizontal: 30, // Espaciado interno horizontal (en píxeles) dentro del Picker.
      fontSize: 16, // Tamaño del texto del Picker (en píxeles).
    },
  
  attributesContainer: {
    marginBottom: 20,
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10
  },
  attributesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  attributeContainer: {
    marginBottom: 15,
  },
  attribute: {
    fontSize: 16,
    fontWeight: '600',
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
  /*Nuevo */
  inputText: {
    fontSize: 16,
    color: 'black',
  },
 /* button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop:20,
  },*/
  /*button: {
    backgroundColor: '#007BFF', // Color de fondo
    paddingVertical: 12,         // Espaciado vertical
    paddingHorizontal: 20,       // Espaciado horizontal
    borderRadius: 5,            // Bordes redondeados
    alignItems: 'center',       // Centra el contenido en el eje horizontal
    justifyContent: 'center',   // Centra el contenido en el eje vertical
  },*/

  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
  resultContainer: {
    marginBottom: 15,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
  },
  /*Nuevo */
  detailText: {
    fontSize: 14,
    color: 'gray',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
  },
  attributeText: {
    fontSize: 14,
    color: 'black',
    marginLeft: 10,
  },
});

export default ConsultaForm;