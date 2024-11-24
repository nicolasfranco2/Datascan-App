import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const ResultadosScreen = ({ route }) => {
  const { resultados } = route.params;
  console.log(resultados); // Agrega esta línea para verificar los datos
  const [selectedFormulario, setSelectedFormulario] = useState(null);

  const handleSelectFormulario = (formulario) => {
    setSelectedFormulario((prevFormulario) =>
      prevFormulario === formulario ? null : formulario
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccione un formulario:</Text>

      {resultados.length === 0 ? (
        <Text style={styles.noResults}>No se encontraron resultados.</Text>
      ) : (
        <FlatList
          data={resultados}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectFormulario(item.formulario)}
              style={[
                styles.resultItem,
                selectedFormulario === item.formulario && styles.resultItemSelected,
              ]}
            >
              <Text style={styles.formularioText}>{item.formulario}</Text>

              {selectedFormulario === item.formulario && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailText}>Nombre Archivo: {item.nombreArchivo}</Text>
                  <Text style={styles.detailText}>Páginas: {item.paginasCantidad}</Text>
                  <Text style={styles.detailText}>Indexado por: {item.indexadoPor}</Text>
                  <Text style={styles.detailText}>
                    Fecha de indexado: {item.fechaIndexado}
                  </Text>

                  <Text style={styles.attributesTitle}>Atributos:</Text>
                  {item.atributos && item.atributos.length > 0 ? (
                    item.atributos.map((atributo, index) => (
                      <View key={index} style={styles.attributeItem}>
                        <Text style={styles.attributeText}>
                          {atributo.nombre}: {atributo.valor}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noAttributes}>No hay atributos disponibles.</Text>
                  )}

                  <Text style={styles.detailText}>
                    Firmado: {item.firmado ? 'Sí' : 'No'}
                  </Text>
                  <Text style={styles.detailText}>
                    Firmantes: {item.firmantes || 'No disponible'}
                  </Text>
                </View>
              )}
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
    borderTopColor: '#ddd',
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 4,
  },
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
  noAttributes: {
    fontSize: 14,
    color: 'gray',
  },
});

export default ResultadosScreen;
