import React, { useRef } from 'react';
import { View, Button, Alert, StyleSheet, Dimensions } from 'react-native';
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system'; // Manejo de archivos
import * as Sharing from 'expo-sharing'; // Para compartir archivos
import { BarChart } from "react-native-chart-kit";
import { captureRef } from 'react-native-view-shot'; // Importación de captureRef

export default function GraficoSalarios({ dataSalarios }) {
  const chartRef = useRef(); // Crear la referencia para el gráfico

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

      // Agregar la imagen del gráfico al PDF
      doc.addImage(`data:image/png;base64,${chartImage}`, "PNG", 10, 20, 150, 110);

      // Agregar título al PDF
      doc.text("Reporte de Salarios", 10, 140);

      // Agregar los datos al PDF debajo del gráfico
      dataSalarios.labels.forEach((label, index) => {
        const salario = dataSalarios.datasets[0].data[index];
        doc.text(`${label}: C$${salario}`, 10, 150 + index * 10); // Formato de los datos
      });

      // Generar el PDF como base64
      const pdfBase64 = doc.output('datauristring').split(',')[1];

      // Definir la ruta temporal para el archivo PDF en el sistema de archivos del dispositivo
      const fileUri = `${FileSystem.documentDirectory}reporte_salarios.pdf`;

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
      <View ref={chartRef} collapsable={false} style={styles.chartContainer}>
        <BarChart
          data={dataSalarios}
          width={screenWidth - (screenWidth * 0.1)}
          height={300}
          yAxisLabel="C$"
          chartConfig={{
            backgroundGradientFrom: "#00FFFF",
            backgroundGradientFromOpacity: 0.1,
            backgroundGradientTo: "#FFFFFF",
            backgroundGradientToOpacity: 1,
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            strokeWidth: 1,
            barPercentage: 0.5,
          }}
          style={{
            borderRadius: 10
          }}
          verticalLabelRotation={45}
          withHorizontalLabels={true}
          showValuesOnTopOfBars={true}
        />
      </View>
      
      <View style={styles.button}>
        <Button  title="Generar y Compartir PDF" onPress={generarPDF} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 10
  },
  chartContainer: {
    marginBottom: 20, 
  },
  button: {
    marginTop: 10
  },
});
