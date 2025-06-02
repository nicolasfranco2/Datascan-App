// // import React, { useState } from 'react';
// // import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
// // import { useNavigation } from '@react-navigation/native'; // Usamos para navegación
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { Linking } from 'react-native';

// // const ResultadosScreen = ({ route }) => {
// //   const { resultados, token } = route.params;
// //   const [selectedFormulario, setSelectedFormulario] = useState(null);
// // const ITEMS_PER_PAGE = 10; //cantidad de resultados por pagina
// // const [currentPage, setCurrentPage] = useState(1);//agrega estado a la pag actual
// // //calcular resultados
// // const totalPages = Math.ceil(resultados.length / ITEMS_PER_PAGE);

// // const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
// // const endIndex = startIndex + ITEMS_PER_PAGE;
// // const paginatedResultados = resultados.slice(startIndex, endIndex);


// //   const handleSelectFormulario = (formulario) => {
// //     if (selectedFormulario === formulario) {
// //       const documentoId = formulario.idDocumento;
// //       openDocument(documentoId);
// //     } else {
// //       setSelectedFormulario(formulario);
// //     }
// //   };

// //   const openDocument = async (idDocumento) => {
// //     try {
// //       const token = await AsyncStorage.getItem('authToken');
// //       if (!token) {
// //         return Alert.alert('Error', 'Token no disponible. Inicie sesión nuevamente.');
// //       }

// //       const url = `http://192.168.11.161:8080/datascan3-web/ws/download/${token}/${idDocumento}/file.pdf`;
// //       console.log('URL para abrir en el navegador:', url);

// //       const supported = await Linking.canOpenURL(url);
// //       if (supported) {
// //         await Linking.openURL(url);
// //       } else {
// //         Alert.alert('Error', 'No se puede abrir la URL en este dispositivo.');
// //       }
// //     } catch (error) {
// //       console.error('Error al intentar abrir el documento:', error);
// //       Alert.alert('Error', 'No se pudo abrir el documento.');
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Seleccione un formulario:</Text>

// //       {resultados.length === 0 ? (
// //         <Text style={styles.noResults}>No se encontraron resultados.</Text>
// //       ) : (
// //         <FlatList
// //           data={resultados}
// //           keyExtractor={(item, index) => index.toString()}
// //           renderItem={({ item }) => (
// //             <TouchableOpacity
// //               onPress={() => handleSelectFormulario(item)}
// //               style={[
// //                 styles.resultItem,
// //                 selectedFormulario === item && styles.resultItemSelected,
// //               ]}
// //             >
// //               <Text style={styles.formularioText}>{item.formulario}</Text>

              
// //               {item.atributos && item.atributos.length > 0 ? (
// //   <View style={styles.attributesContainer}>
// //     <Text style={styles.attributesTitle}>Atributos</Text>
// //      {item.atributos.map((atributo, index) => (
// //       <View key={index} style={styles.attributeItem}>
// //         <Text style={styles.attributeText}>
// //           <Text style={styles.boldText}>{atributo.nombre}:</Text> {atributo.valor}
// //         </Text>
// //       </View>
// //     ))}
// //   </View>
// // ) : (
// //   <Text style={styles.noAttributes}>No hay atributos disponibles.</Text>
// // )}


// //              {selectedFormulario === item && (
// //   <View style={styles.detailsContainer}>
// //     <Text style={styles.detailText}>
// //       <Text style={styles.boldText}>Nombre Archivo:</Text> {item.nombreArchivo}
// //     </Text>
// //     <Text style={styles.detailText}>
// //       <Text style={styles.boldText}>Páginas:</Text> {item.paginasCantidad}
// //     </Text>
// //     <Text style={styles.detailText}>
// //       <Text style={styles.boldText}>Indexado por:</Text> {item.indexadoPor}
// //     </Text>
// //     <Text style={styles.detailText}>
// //       <Text style={styles.boldText}>Id del documento:</Text> {item.idDocumento}
// //     </Text>
// //     <Text style={styles.detailText}>
// //       <Text style={styles.boldText}>Fecha de indexado:</Text> {item.fechaIndexado}
// //     </Text>
// //   </View>
// // )}

// //                   {/*<Text style={styles.detailText}>
// //                     Firmado: {item.firmado ? 'Sí' : 'No'}
// //                   </Text>
// //                   <Text style={styles.detailText}>
// //                     Firmantes: {item.firmantes || 'No disponible'}
// //                   </Text>
                
// //               */}
// //             </TouchableOpacity>
// //           )}
// //         />
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 16,
// //     backgroundColor: '#fff',
// //   },
// //   /*Nuevo*/
// //   attributesContainer: {
// //     padding: 10,
// //     marginVertical: 8,
// //     backgroundColor: '#f0f8ff', // Fondo de color suave
// //     borderRadius: 8,
// //     borderWidth: 1,
// //     borderColor: '#00aaff', // Borde de color para resaltar
// //   },
// //   title: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     marginBottom: 16,
// //     color: '#333',
// //   },
// //   noResults: {
// //     fontSize: 16,
// //     textAlign: 'center',
// //     color: 'gray',
// //   },
// //   resultItem: {
// //     padding: 12,
// //     backgroundColor: '#f9f9f9',
// //     borderRadius: 8,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: '#ddd',
// //   },
// //   resultItemSelected: {
// //     backgroundColor: '#e6f7ff',
// //     borderColor: '#00aaff',
// //   },
// //   formularioText: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   detailsContainer: {
// //     marginTop: 8,
// //     paddingTop: 8,
// //     borderTopWidth: 1,
// //     borderTopColor: '#ddd',
// //   },
// //   detailText: {
// //     fontSize: 16,
// //     color: '#555',
// //     //fontWeight: 'bold',
// //     marginVertical: 4,
// //   },
// //   attributesTitle: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     textAlign: 'center', // Centra el texto
// //     marginVertical: 8,
// //     color: '#333',
// //   },
// //   attributeItem: {
// //     marginLeft: 12,
    
// //     marginVertical: 4,
// //   },
// //   attributeText: {
// //     fontSize: 15,
// //     color: '#555',
// //   },
// //   /*Nuevo */
// //   boldText: {
// //     fontWeight: 'bold', // Aplica negrita al nombre del atributo
// //   },
// //   noAttributes: {
// //     fontSize: 14,
// //     color: 'gray',
// //   },
// // });

// // export default ResultadosScreen;
// import React, { useState } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Linking } from 'react-native';

// const ITEMS_PER_PAGE = 4;

// const ResultadosScreen = ({ route }) => {
//   const { resultados, token } = route.params;
//   const [selectedFormulario, setSelectedFormulario] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalPages = Math.ceil(resultados.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;
//   const paginatedResultados = resultados.slice(startIndex, endIndex);

//   const handleSelectFormulario = (formulario) => {
//     if (selectedFormulario === formulario) {
//       const documentoId = formulario.idDocumento;
//       openDocument(documentoId);
//     } else {
//       setSelectedFormulario(formulario);
//     }
//   };

//   const openDocument = async (idDocumento) => {
//     try {
//       const token = await AsyncStorage.getItem('authToken');
//       if (!token) {
//         return Alert.alert('Error', 'Token no disponible. Inicie sesión nuevamente.');
//       }

//       const url = `http://192.168.11.161:8080/datascan3-web/ws/download/${token}/${idDocumento}/file.pdf`;
//       console.log('URL para abrir en el navegador:', url);

//       const supported = await Linking.canOpenURL(url);
//       if (supported) {
//         await Linking.openURL(url);
//       } else {
//         Alert.alert('Error', 'No se puede abrir la URL en este dispositivo.');
//       }
//     } catch (error) {
//       console.error('Error al intentar abrir el documento:', error);
//       Alert.alert('Error', 'No se pudo abrir el documento.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Seleccione un formulario:</Text>

//       {resultados.length === 0 ? (
//         <Text style={styles.noResults}>No se encontraron resultados.</Text>
//       ) : (
//         <>
//           <FlatList
//             data={paginatedResultados}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 onPress={() => handleSelectFormulario(item)}
//                 style={[
//                   styles.resultItem,
//                   selectedFormulario === item && styles.resultItemSelected,
//                 ]}
//               >
//                 <Text style={styles.formularioText}>{item.formulario}</Text>

//                 {item.atributos && item.atributos.length > 0 ? (
//                   <View style={styles.attributesContainer}>
//                     <Text style={styles.attributesTitle}>Atributos</Text>
//                     {item.atributos.map((atributo, index) => (
//                       <View key={index} style={styles.attributeItem}>
//                         <Text style={styles.attributeText}>
//                           <Text style={styles.boldText}>{atributo.nombre}:</Text> {atributo.valor}
//                         </Text>
//                       </View>
//                     ))}
//                   </View>
//                 ) : (
//                   <Text style={styles.noAttributes}>No hay atributos disponibles.</Text>
//                 )}

//                 {selectedFormulario === item && (
//                   <View style={styles.detailsContainer}>
//                     <Text style={styles.detailText}>
//                       <Text style={styles.boldText}>Nombre Archivo:</Text> {item.nombreArchivo}
//                     </Text>
//                     <Text style={styles.detailText}>
//                       <Text style={styles.boldText}>Páginas:</Text> {item.paginasCantidad}
//                     </Text>
//                     <Text style={styles.detailText}>
//                       <Text style={styles.boldText}>Indexado por:</Text> {item.indexadoPor}
//                     </Text>
//                     <Text style={styles.detailText}>
//                       <Text style={styles.boldText}>Id del documento:</Text> {item.idDocumento}
//                     </Text>
//                     <Text style={styles.detailText}>
//                       <Text style={styles.boldText}>Fecha de indexado:</Text> {item.fechaIndexado}
//                     </Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//             )}
//           />

//           <View style={styles.paginationContainer}>
//             <TouchableOpacity
//               onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
//             >
//               <Text style={styles.pageButtonText}>Anterior</Text>
//             </TouchableOpacity>

//             <Text style={styles.pageInfo}>
//               Página {currentPage} de {totalPages}
//             </Text>

//             <TouchableOpacity
//               onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//               disabled={currentPage === totalPages}
//               style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
//             >
//               <Text style={styles.pageButtonText}>Siguiente</Text>
//             </TouchableOpacity>
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   attributesContainer: {
//     padding: 10,
//     marginVertical: 8,
//     backgroundColor: '#f0f8ff',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#00aaff',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     color: '#333',
//   },
//   noResults: {
//     fontSize: 16,
//     textAlign: 'center',
//     color: 'gray',
//   },
//   resultItem: {
//     padding: 12,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   resultItemSelected: {
//     backgroundColor: '#e6f7ff',
//     borderColor: '#00aaff',
//   },
//   formularioText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   detailsContainer: {
//     marginTop: 8,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#ddd',
//   },
//   detailText: {
//     fontSize: 16,
//     color: '#555',
//     marginVertical: 4,
//   },
//   attributesTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginVertical: 8,
//     color: '#333',
//   },
//   attributeItem: {
//     marginLeft: 12,
//     marginVertical: 4,
//   },
//   attributeText: {
//     fontSize: 15,
//     color: '#555',
//   },
//   boldText: {
//     fontWeight: 'bold',
//   },
//   noAttributes: {
//     fontSize: 14,
//     color: 'gray',
//   },
//   paginationContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   pageButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     backgroundColor: '#00aaff',
//     borderRadius: 6,
//   },
//   disabledButton: {
//     backgroundColor: '#ccc',
//   },
//   pageButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   pageInfo: {
//     fontSize: 16,
//   },
// });

// export default ResultadosScreen;
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Usamos para navegación
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';

const ResultadosScreen = ({ route }) => {
  const { resultados, token } = route.params;
  const [selectedFormulario, setSelectedFormulario] = useState(null);

  const ITEMS_PER_PAGE = 5; // Número de elementos por página
  const totalResults = resultados.length;
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  const [currentPage, setCurrentPage] = useState(1); // Página actual

  // Calcular los resultados de la página actual
  const paginatedResults = resultados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectFormulario = (formulario) => {
    if (selectedFormulario === formulario) {
      const documentoId = formulario.idDocumento;
      openDocument(documentoId);
    } else {
      setSelectedFormulario(formulario);
    }
  };

  const openDocument = async (idDocumento) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const serverIP = await AsyncStorage.getItem('serverIP');
      const serverPort = await AsyncStorage.getItem('serverPort');
        if (!token || !serverIP || !serverPort) {
          Alert.alert('Error', 'Falta token o configuración de servidor.');
          return;
        }

      const url = `http://${serverIP}:${serverPort}/datascan3-web/ws/download/${token}/${idDocumento}/file.pdf`;
      console.log('URL para abrir en el navegador:', url);

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No se puede abrir la URL en este dispositivo.');
      }
    } catch (error) {
      console.error('Error al intentar abrir el documento:', error);
      Alert.alert('Error', 'No se pudo abrir el documento.');
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccione un formulario:</Text>

      {/* Información de resultados */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          Mostrando {paginatedResults.length} de {totalResults} resultados
        </Text>
        <Text style={styles.resultsText}>
          Páginas: {totalPages}
        </Text>
      </View>

      {resultados.length === 0 ? (
        <Text style={styles.noResults}>No se encontraron resultados.</Text>
      ) : (
        <FlatList
          data={paginatedResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectFormulario(item)}
              style={[
                styles.resultItem,
                selectedFormulario === item && styles.resultItemSelected,
              ]}
            >
              <Text style={styles.formularioText}>{item.formulario}</Text>

              {item.atributos && item.atributos.length > 0 ? (
                <View style={styles.attributesContainer}>
                  <Text style={styles.attributesTitle}>Atributos</Text>
                  {item.atributos.map((atributo, index) => (
                    <View key={index} style={styles.attributeItem}>
                      <Text style={styles.attributeText}>
                        <Text style={styles.boldText}>{atributo.nombre}:</Text> {atributo.valor}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noAttributes}>No hay atributos disponibles.</Text>
              )}

              {selectedFormulario === item && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailText}>
                    <Text style={styles.boldText}>Nombre Archivo:</Text> {item.nombreArchivo}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.boldText}>Páginas:</Text> {item.paginasCantidad}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.boldText}>Indexado por:</Text> {item.indexadoPor}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.boldText}>Id del documento:</Text> {item.idDocumento}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.boldText}>Fecha de indexado:</Text> {item.fechaIndexado}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}

      {/* Botones de paginación */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={goToPreviousPage}
          disabled={currentPage === 1}
          style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
        >
          <Text style={styles.paginationButtonText}>Anterior</Text>
        </TouchableOpacity>
        <Text style={styles.paginationText}>Página {currentPage} de {totalPages}</Text>
        <TouchableOpacity
          onPress={goToNextPage}
          disabled={currentPage === totalPages}
          style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
        >
          <Text style={styles.paginationButtonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
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
  resultsInfo: {
    marginVertical: 8,
    alignItems: 'center',
  },
  resultsText: {
    fontSize: 16,
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
  attributesContainer: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00aaff',
  },
  attributesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
    color: '#333',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#00aaff',
    borderRadius: 8,
    backgroundColor: '#00aaff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#ddd',
    borderColor: '#bbb',
  },
  paginationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  paginationText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ResultadosScreen;
