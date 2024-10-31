import React, { useRef } from 'react';
import { View, Button, Alert, StyleSheet, Dimensions } from 'react-native';
import { ProgressChart } from "react-native-chart-kit";
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system'; // Manejo de archivos
import * as Sharing from 'expo-sharing'; // Para compartir archivos
import { captureRef } from 'react-native-view-shot'; 

export default function GraficoProgreso({ dataProgreso, colors }) {
  const chartRef = useRef(); // Referencia para el gráfico

  const generarPDF = async () => {
    try {
      const uri = await captureRef(chartRef, {
        format: "png",
        quality: 1,
        width: screenWidth - (screenWidth * 0.1),
        height: 300,
      });

      const chartImage = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Crear una instancia de jsPDF
      const doc = new jsPDF();
      doc.text("Reporte de Progreso", 10, 10);
      doc.addImage(`data:image/png;base64,${chartImage}`, "PNG", 10, 20, 180, 100); // Ajustar dimensiones según necesidad

      // Agregar los datos al PDF debajo del gráfico
      dataProgreso.labels.forEach((label, index) => {
        const progreso = (dataProgreso.data[index] * 100).toFixed(2); // Convertir a porcentaje
        doc.text(`${label}: ${progreso}%`, 10, 130 + index * 10); // Formato de los datos
      });

      const pdfBase64 = doc.output('datauristring').split(',')[1];
      const fileUri = `${FileSystem.documentDirectory}reporte_progreso.pdf`;

      // Guardar el archivo PDF
      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64
      });

      // Compartir el archivo PDF
      await Sharing.shareAsync(fileUri);

    } catch (error) {
      console.error("Error al generar o compartir el PDF: ", error);
      Alert.alert('Error', 'No se pudo generar o compartir el PDF.');
    }
  };

  let screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      <View ref={chartRef} collapsable={false}>
        <ProgressChart
          data={dataProgreso}
          width={screenWidth - (screenWidth * 0.1)}
          height={300}
          chartConfig={{
            backgroundColor: '#022173',
            backgroundGradientFrom: '#022173',
            backgroundGradientTo: '#1b3fa0',
            color: (opacity = 1, index) => colors[index] || `rgba(255, 255, 255, ${opacity})`,
          }}
          style={{
            borderRadius: 10,
          }}
          hideLegend={false}
          strokeWidth={10}
          radius={32}
        />
      </View>

      <View style={styles.button}>
        {/* Botón para generar y compartir PDF */}
        <Button title="Generar y Compartir PDF" onPress={generarPDF} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 10
  },
  button: {
    marginTop: 10
  },
});
