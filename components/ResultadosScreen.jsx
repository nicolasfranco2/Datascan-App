import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const ResultadosScreen = ({ route }) => {
  const { resultados } = route.params; // Recibimos los resultados desde AccesoMenu
  const [selectedFormulario, setSelectedFormulario] = useState(null); // Para rastrear el formulario seleccionado

  const handleSelectFormulario = (formulario) => {
    setSelectedFormulario(formulario === selectedFormulario ? null : formulario); // Alternar selección
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccione un formulario:</Text>

      {resultados.length === 0 ? (
        <Text style={styles.noResults}>No se encontraron resultados.</Text>
      ) : (
        <FlatList
          data={resultados}
          keyExtractor={(item, index) => index.toString()} // Usamos el índice como key
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectFormulario(item.formulario)}
              style={[
                styles.resultItem,
                selectedFormulario === item.formulario && styles.resultItemSelected,
              ]}
            >
              {/* Mostrar el formulario */}
              <Text style={styles.formularioText}>{item.formulario}</Text>
              {/* Mostrar el formulario */}
              {selectedFormulario === item.formulario && (
                <View>
                  {/* Mostrar los valores de los atributos dinámicos */}
                  <View style={[styles.attributesContainer, styles.dynamicAttributes]}>
                    <Text style={styles.attributesTitle}>Atributos:</Text>
                    {item.atributos && item.atributos.length > 0 ? (
                      item.atributos.map((atributo, index) => (
                        <View key={index} style={styles.attributeItem}>
                          <Text style={styles.attributeText}>
                            <Text style={styles.attributeName}>{atributo.nombre}</Text>: {atributo.valor}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.noAttributes}>No hay atributos disponibles.</Text>
                    )}
                  </View>

                  {/* Detalles en duro del formulario */}
                  <View style={[styles.attributesContainer, styles.fixedAttributes]}>
                    <Text style={styles.detailText}>
                      <Text style={styles.fixedAttributeName}>Nombre Archivo:</Text> {item.nombreArchivo}
                    </Text>
                    <Text style={styles.detailText}>
                      <Text style={styles.fixedAttributeName}>Páginas:</Text> {item.paginasCantidad}
                    </Text>
                    <Text style={styles.detailText}>
                      <Text style={styles.fixedAttributeName}>Indexado por:</Text> {item.indexadoPor}
                    </Text>
                    <Text style={styles.detailText}>
                      <Text style={styles.fixedAttributeName}>Fecha de indexado:</Text> {item.fechaIndexado}
                    </Text>
                    <Text style={styles.detailText}>
                      <Text style={styles.fixedAttributeName}>Firmado:</Text> {item.firmado ? 'Sí' : 'No'}
                    </Text>
                    <Text style={styles.detailText}>
                      <Text style={styles.fixedAttributeName}>Firmantes:</Text> {item.firmantes || 'No disponible'}
                    </Text>
                  </View>
                </View>
              )}



              {/* Mostrar estado firmado y firmantes 
                  <Text style={styles.detailText}>
                    Firmado: {item.firmado ? 'Sí' : 'No'}
                  </Text>
                  <Text style={styles.detailText}>
                    Firmantes: {item.firmantes || 'No disponible'}
                  </Text>
                
              */}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
  },
  resultItem: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultItemSelected: {
    backgroundColor: '#e6f7ff',
    borderColor: '#00aaff',
  },
  formularioText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#00aacc',
  },

  detailText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 4,
    lineHeight: 22, // Espaciado entre líneas para mejorar la legibilidad.
    textAlign: 'justify', // Alineación justificada para un estilo más profesional.
    letterSpacing: 0.5, // Espaciado entre letras para mayor claridad.
  }

  /*detailText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 4,
  }*/,
  attributesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  attributeItem: {
    marginLeft: 12,
    marginVertical: 2,
  },
  attributeText: {
    fontSize: 15,
    color: '#555',
  },

  /*Nuevo*/
  attributeName: {
    fontWeight: 'bold', // Para destacar el nombre
    color: '#000', // Color más oscuro para diferenciación
  },

  noAttributes: {
    fontSize: 14,
    color: 'gray',
  },
  fixedAttributeName: {
    fontWeight: 'bold', // Resaltar el texto
    color: '#000', // Color distintivo (puedes cambiar según preferencias)
  },

  /*Nuevos */
  attributesContainer: {
    borderWidth: 1, // Bordes para el encuadre
    borderRadius: 8, // Esquinas redondeadas
    marginVertical: 8, // Espaciado entre secciones
    padding: 12, // Relleno interno
  },

  dynamicAttributes: {
    borderColor: '#00aaff', // Mismo color que `resultItemSelected`
    backgroundColor: '#f9f9f9', // Fondo invertido
  },

  fixedAttributes: {
    borderColor: '#00aaff', // Un color gris oscuro para diferenciación
    backgroundColor: '#e6f7ff', // Fondo invertido para contraste
  },


});

export default ResultadosScreen;
