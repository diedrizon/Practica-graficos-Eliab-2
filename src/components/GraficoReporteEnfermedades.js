import React, { useRef } from 'react';
import { View, Button, Alert, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { ContributionGraph } from "react-native-chart-kit";
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system'; // Manejo de archivos
import * as Sharing from 'expo-sharing'; // Para compartir archivos
import { captureRef } from 'react-native-view-shot';

export default function GraficoReporteEnfermedades({ dataReporteEnfermedades }) {
  const chartRef = useRef(); // Crear la referencia para el gráfico
  const screenWidth = Dimensions.get("window").width;
  const squareSize = 30;
  const numDays = 365;

  // Función para personalizar las etiquetas de los meses en el gráfico
  const getMonthLabel = (monthIndex) => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return months[monthIndex];
  };

  // Función que maneja el evento de presionar un cuadrado en el gráfico (un día específico)
  const handleDayPress = (day) => {
    Alert.alert(`Reportes`, `Fecha: ${day.date}\nCantidad: ${day.count}`);
  };

  // Función para generar y compartir el PDF
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

      const doc = new jsPDF();
      doc.text("Reporte de Enfermedades", 10, 10);
      doc.addImage(`data:image/png;base64,${chartImage}`, "PNG", 10, 20, 150, 110);

      const pdfBase64 = doc.output('datauristring').split(',')[1];
      const fileUri = `${FileSystem.documentDirectory}reporte_enfermedades.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64
      });

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error al generar o compartir el PDF: ", error);
      Alert.alert('Error', 'No se pudo generar o compartir el PDF.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View ref={chartRef} collapsable={false}>
          <ContributionGraph
            values={dataReporteEnfermedades}
            endDate={new Date("2017-12-30")}
            numDays={numDays}
            width={1680}
            height={300}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#f0f0f0",
              backgroundGradientTo: "#f0f0f0",
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              strokeWidth: 2,
            }}
            gutterSize={0.4}
            bgColor={"transparent"}
            squareSize={squareSize} 
            getMonthLabel={getMonthLabel} 
            onDayPress={handleDayPress}
            style={{
              borderRadius: 10,
            }}
          />
        </View>
      </ScrollView>

      <View style={styles.button}>
        <Button title="Generar y Compartir PDF" onPress={generarPDF} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  button: {
    marginTop: 10,
  },
});
