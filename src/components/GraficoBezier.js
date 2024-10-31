import React, { useRef } from 'react';
import { View, Button, Alert, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system'; // Manejo de archivos
import * as Sharing from 'expo-sharing'; // Para compartir archivos
import { captureRef } from 'react-native-view-shot';

export default function GraficoBezier({dataSalarios}) {
  const chartRef = useRef(); 

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
      doc.text("Reporte de Salarios", 10, 10);
      doc.addImage(`data:image/png;base64,${chartImage}`, "PNG", 10, 20, 180, 100); // Ajustar dimensiones según necesidad

      // Agregar los datos al PDF debajo del gráfico
      dataSalarios.labels.forEach((label, index) => {
        const salario = dataSalarios.datasets[0].data[index];
        doc.text(`${label}: C$${salario}`, 10, 130 + index * 10); // Formato de los datos
      });

      const pdfBase64 = doc.output('datauristring').split(',')[1];
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
      <View ref={chartRef} collapsable={false}>
        <LineChart
          data={dataSalarios}
          width={screenWidth - (screenWidth * 0.1)}
          height={300}
          chartConfig={{
            backgroundGradientFrom: "#00FFFF",
            backgroundGradientFromOpacity: 0.1,
            backgroundGradientTo: "#FFFFFF",
            backgroundGradientToOpacity: 1,
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
          }}
          style={{
            borderRadius: 10
          }}
          verticalLabelRotation={45}
          bezier={true}
        />
      </View>

      <View style={styles.button}>
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
