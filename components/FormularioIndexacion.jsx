import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Única importación de Picker
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library'; // Paquete para permisos
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

//import mime from 'react-native-mime-types';


const FormularioIndexacion = ({ route, navigation }) => {
  const { idFormulario } = route.params || {};
  const [formularios, setFormularios] = useState([]);
  const [selectedValue, setSelectedValue] = useState(idFormulario || '');
  const [pdfUri, setPdfUri] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [fileName, setFileName] = useState('');
  const [formAttributes, setFormAttributes] = useState([]);
  const [showDatePickerIndex, setShowDatePickerIndex] = useState(null);


  useEffect(() => {
     const fetchFormularios = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const serverIP = await AsyncStorage.getItem('serverIP');
        const serverPort = await AsyncStorage.getItem('serverPort');
        if (!token || !serverIP || !serverPort) {
          Alert.alert('Error', 'Falta token o configuración de servidor.');
          return;
        }
        const url = `http://${serverIP}:${serverPort}/datascan3-web/rest/formularios.json?token=${token}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.resultado && Array.isArray(data.resultado.formularios)) {
          const mapped = data.resultado.formularios.map(f => ({
            id: f.id,
            nombre: f.nombre,
            atributos: f.atributos.map(a => ({ id: a.id, nombre: a.nombre, tipo: a.tipo })),
          }));
          setFormularios(mapped);
        } else {
          Alert.alert('Error', 'No se encontraron formularios.');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudo cargar los formularios.');
      }
    };
    fetchFormularios();
  }, []);
  

  
  useEffect(() => {
    if (selectedValue) {
      fetchFormulariosAttributes(selectedValue);
    }
  }, [selectedValue]);



  // Efecto: cargar atributos cuando cambia formulario
const fetchFormulariosAttributes = async (formularioId) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
        const serverIP = await AsyncStorage.getItem('serverIP');
        const serverPort = await AsyncStorage.getItem('serverPort');
        if (!token || !serverIP || !serverPort) {
          Alert.alert('Error', 'Falta token o configuración de servidor.');
          return;
        }

    // URL modificada para la API original
    const response = await fetch(`http://${serverIP}:${serverPort}/datascan3-web/rest/formularios.json?token=${token}`);
    const data = await response.json();

    if (data.resultado && data.resultado.formularios) {
      // Buscar el formulario por su ID
      const formulario = data.resultado.formularios.find(f => f.id === parseInt(formularioId, 10));
      
      if (formulario && formulario.atributos) {
        // Aquí guardamos los atributos del formulario
        setFormAttributes(formulario.atributos);
      } else {
        Alert.alert('Error', 'No se encontraron los atributos del formulario');
      }
    } else {
      Alert.alert('Error', 'No se encontraron formularios');
    }
  } catch (error) {
    console.error('Error al cargar los atributos del formulario:', error);
    Alert.alert('Error', 'Hubo un problema al cargar los atributos.');
  }
};


const handleAttributeChange = (index, newValue) => {
  setFormAttributes((prevAttributes) => {
    const updatedAttributes = [...prevAttributes];
    updatedAttributes[index].valor = newValue;
    return updatedAttributes;
  });
};


  // Verificar y pedir permisos de almacenamiento utilizando expo-media-library
  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Para seleccionar un archivo, necesita conceder acceso a la galería o almacenamiento.');
      return false;
    }
    return true;
  };

  const handleFileSelection = async () => {
    try {
      console.log('[LOG] Intentando seleccionar un archivo...');
      
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      
      console.log('[LOG] Resultado de selección de archivo:', result);
      
      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log('[LOG] Archivo encontrado en assets:', file);
      
        if (file.mimeType === 'application/pdf') {
          setPdfUri(file.uri);
          setFileName(file.name);
          setIsFileSelected(true);
          console.log('[LOG] Archivo PDF seleccionado correctamente:', file.name);
        } else {
          console.warn('[WARN] Archivo no es PDF:', file.mimeType);
          Alert.alert('Archivo no permitido', 'Solo se permiten archivos PDF.');
        }
      } else if (result.canceled) {
        console.log('[LOG] Usuario canceló la selección del archivo.');
      } else {
        console.error('[ERROR] No se seleccionó ningún archivo válido.');
        Alert.alert('Archivo no permitido', 'No se seleccionó ningún archivo.');
      }
    } catch (err) {
      console.error('[ERROR] Error al seleccionar archivo:', err);
      Alert.alert('Error', 'Hubo un problema al seleccionar el archivo.');
    }
  };
  
  const handleUploadFile = async () => {
  try {
    // ─── 1. Validaciones iniciales ───────────────────────────────────────────────
    const token      = await AsyncStorage.getItem('authToken');
    const serverIP   = await AsyncStorage.getItem('serverIP');
    const serverPort = await AsyncStorage.getItem('serverPort');

    if (!token || !serverIP || !serverPort) {
      return Alert.alert('Error', 'Falta token o configuración de servidor.');
    }
    if (!pdfUri || !fileName) {
      return Alert.alert('Error', 'No se ha seleccionado ningún archivo.');
    }

    // ─── 2. FormData para create_binary.pdf ──────────────────────────────────────
    const fileData = new FormData();
    fileData.append('token',    token);
    fileData.append('fileName', fileName);
    fileData.append('content',  { uri: pdfUri, type: 'application/pdf', name: fileName });

    const uploadUrl = `http://${serverIP}:${serverPort}/datascan3-web/rest/documentos/create_binary.pdf`;
    console.log('Subiendo PDF a:', uploadUrl);

    const uploadRes = await fetch(uploadUrl, { method: 'POST', body: fileData });

    if (!uploadRes.ok) {
      console.error('Error subida:', uploadRes.status, await uploadRes.text());
      return Alert.alert('Error', 'Hubo un problema al subir el archivo.');
    }
    console.log('El archivo se subió correctamente.');

const atributosIndexados = atributos
  .filter(attr => attr.valor !== '' && attr.valor !== null && attr.valor !== undefined)
  .map(attr => {
    let valor = attr.valor;

    // Si el tipo es decimal, corregimos posibles comas
    if (attr.tipo === 'decimal' && typeof valor === 'string') {
      valor = valor.replace(',', '.');
    }

    return {
      nombre: attr.nombre,
      tipo: attr.tipo,
      valor: valor
    };
  });


  //   const atributosValidos = formAttributes
  // .filter(a => {
  //   // Si es fecha, verificar si hay valor válido (no null ni undefined ni string vacío)
  //   if (a.tipo === 'FECHA') {
  //     return a.valor && typeof a.valor === 'string' && a.valor.trim() !== '';
  //   }
  //   return true; // El resto de los tipos se aceptan aunque estén vacíos (serán normalizados)
  // })
  // .map(a => {
  //   let { tipo = 'STRING', valor } = a;

  //   // Normalización por tipo
  //   if (valor === undefined || valor === '') {
  //     if (tipo === 'ENTERO') valor = 0;
  //     else if (tipo === 'BOOLEAN') valor = false;
  //     else if (tipo === 'STRING') valor = '';
  //   }

  //   return {
  //     nombre: a.nombre,
  //     tipo,
  //     valor
  //   };
  // });


  /*  const atributosValidos = formAttributes
      .map(a => {
        let { tipo = 'STRING', valor } = a;

        if (valor === '' || valor === undefined) {
          if (tipo === 'ENTERO') valor = 0;
          else if (tipo === 'BOOLEAN') valor = false;
          else if (tipo === 'STRING') valor = '';
          else if (tipo === 'FECHA') valor = null; // null si querés, pero lo vamos a filtrar
        }

        return { nombre: a.nombre, tipo, valor };
      })
      // Aquí filtramos para NO enviar fechas sin valor
      .filter(a => !(a.tipo === 'FECHA' && (a.valor === null || a.valor === '' || a.valor === undefined)));
*/



    // ─── 4. Construir cuerpo x-www-form-urlencoded ─────────────────────────────
    const formBody = new URLSearchParams();
    formBody.append('token', token);
    formBody.append('idFormulario', selectedValue);
    formBody.append('fileName', fileName);

    formBody.append('atributos', JSON.stringify(atributosValidos.length > 0 ? atributosValidos : []));



    console.log('Atributos válidos:', atributosValidos);
    console.log('Datos enviados en el body:', formBody.toString()); // <-- Aquí

    const attributesUrl = `http://${serverIP}:${serverPort}/datascan3-web/rest/documentos/create_attributes.pdf`;
    console.log('Enviando atributos a:', attributesUrl);

    const attrRes = await fetch(attributesUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
    });

    const attrText = await attrRes.text();
    console.log('Respuesta atributos:', attrText);

    if (!attrRes.ok) {
      console.error('Error atributos:', attrRes.status, attrText);
      return Alert.alert('Error', 'Hubo un problema al indexar los atributos.');
    }

    // ─── 5. Éxito ────────────────────────────────────────────────────────────────
    Alert.alert('Éxito', 'El documento ha sido indexado correctamente.');
        // Reseteo de estados para volver al estado inicial
    setPdfUri(null);
    setFileName('');
    setIsFileSelected(false); // <---- aquí reseteas para que el botón cambie



    } catch (err) {
      console.error('Error durante la subida:', err);
      Alert.alert('Error', 'Hubo un problema al subir el archivo y los atributos.');
    }

  }

  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        {/* Solo mostramos el Picker */}
        <Text style={styles.title}>Selecciona un formulario:</Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => setSelectedValue(itemValue)}
          style={styles.picker}
        >
          {formularios.map((formulario) => (
            <Picker.Item key={formulario.id} label={formulario.nombre} value={formulario.id} />
          ))}
        </Picker>
  
        {/* Mostrar el nombre del formulario seleccionado, si hay uno */}
        {selectedValue && (
          <Text style={styles.selectedFormName}>
            {formularios.find(f => f.id === selectedValue)?.nombre || 'Formulario no encontrado'}
          </Text>
        )}
  {formAttributes.length > 0 && (
  <View style={styles.attributesContainer}>
    {formAttributes.map((attribute, index) => (
      <View key={index} style={styles.attributeInputContainer}>
        <Text style={styles.attributeLabel}>{attribute.nombre}</Text>
        
        {attribute.tipo === 'FECHA' ? (
          <>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePickerIndex(index)}
            >
              <Text style={[styles.datePickerText, !attribute.valor && styles.placeholderText]}>
                {attribute.valor ? attribute.valor : 'Selecciona una fecha'}
              </Text>
            </TouchableOpacity>
            {showDatePickerIndex === index && (
              <DateTimePicker
              value={attribute.valor ? new Date(attribute.valor) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePickerIndex(null); // ocultar el picker
                if (event.type === 'dismissed') {
                  // Usuario canceló o tocó fuera, setear valor null
                  handleAttributeChange(index, null);
                } else if (selectedDate) {
                  // Usuario seleccionó fecha, formateamos
                  const day = String(selectedDate.getDate()).padStart(2, '0');
                  const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // enero es 0
                  const year = selectedDate.getFullYear();
                  const formattedDate = `${day}/${month}/${year}`;
                  handleAttributeChange(index, formattedDate);
                }
              }}
            />
            )}
          </>
        ) : attribute.tipo === 'CATALOGO' && attribute.catalogo ? (
                <Picker
                  selectedValue={attribute.valor || null}
                  onValueChange={(itemValue) => handleAttributeChange(index, itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccione..." value={null} />
                  {attribute.catalogo.items.map((item) => (
                    <Picker.Item key={item.id} label={item.valor} value={item.valor} />
                  ))}
                </Picker> ): (
          /*<TextInput
            style={styles.attributeInput}
            value={attribute.valor}
            onChangeText={(text) => handleAttributeChange(index, text)}
            placeholder={`Ingrese ${attribute.nombre}`}
          />*/
          <TextInput
  style={styles.input}
  value={attribute.valor}
  onChangeText={(text) => handleAttributeChange(index, text)}
  placeholder={attribute.nombre}
/>

        )}
      </View>
    ))}
  </View>
)}

        {/* Botón para seleccionar archivo */}
        {!isFileSelected ? (
          <TouchableOpacity style={styles.button} onPress={handleFileSelection}>
            <Text style={styles.buttonText}>Seleccionar archivo</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.fileSelected}>Archivo seleccionado: {fileName}</Text>
        )}
  
        {/* Botón para subir el archivo */}
        {isFileSelected && (
          <TouchableOpacity style={styles.button} onPress={handleUploadFile}>
            <Text style={styles.buttonText}>Subir archivo</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  /*picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },*/
  picker: {
  height: 50,
  width: '100%',
  marginBottom: 20,
  borderWidth: 1, // Agrega un borde
  borderColor: '#ccc', // Define el color del borde
  backgroundColor: '#fff', // Fondo blanco
  borderRadius: 5, // (Opcional) Bordes redondeados
},

  selectedFormName: {
    fontSize: 16,
    marginBottom: 20,
  },
  attributesContainer: {
    marginBottom: 20,
    
  },
  attributeInputContainer: {
    marginBottom: 10,
  },
  attributeLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold', // Esto hace que el texto sea en negrita
  },
  input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  marginBottom: 12,
  backgroundColor: '#fff',
  fontSize: 16,
},

 /* attributeInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 4,
  }*/
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  fileSelected: {
    fontSize: 16,
    color: 'green',
    marginBottom: 20,
  },
  
});

export default FormularioIndexacion;
