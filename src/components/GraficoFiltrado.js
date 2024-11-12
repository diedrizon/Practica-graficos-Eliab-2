import React, { useRef } from 'react';
import { View, Button, Alert, StyleSheet, Dimensions} from 'react-native';
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { BarChart } from "react-native-chart-kit";
import { Picker } from '@react-native-picker/picker';

export default function GraficoFiltrado({datosFiltrados, categoriaSeleccionada, setCategoriaSeleccionada, filtrarMontoPorFechaYCategoria}) {
  const chartRef = useRef();
  const screenWidth = Dimensions.get("window").width;

  console.log('Datos filtrados');
  console.log(datosFiltrados);

  // Generar el PDF con los datos filtrados
  const generarPDF = async () => {
    try {
      const uri = await captureRef(chartRef, {
        format: "png",
        quality: 1,
        width: screenWidth - screenWidth * 0.1,
        height: 300,
      });

      const doc = new jsPDF();
      doc.text("Reporte con datos filtrados", 10, 10);
      const chartImage = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      doc.addImage(`data:image/png;base64,${chartImage}`, "PNG", 10, 20, 180, 90);

      datosFiltrados.labels.forEach((label, index) => {
        const valor = datosFiltrados.datasets[0].data[index];
        doc.text(`${label}: C$${valor}`, 10, 120 + index * 10);
      });

      const pdfBase64 = doc.output('datauristring').split(',')[1];
      const fileUri = `${FileSystem.documentDirectory}reporte_filtrado.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error al generar o compartir el PDF: ", error);
      Alert.alert('Error', 'No se pudo generar o compartir el PDF.');
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={categoriaSeleccionada}
        onValueChange={(itemValue) => {
          setCategoriaSeleccionada(itemValue);
          filtrarMontoPorFechaYCategoria(itemValue); // Filtrar los datos cuando cambie la categoría seleccionada
        }}
      >
        {['Ventas', 'Servicios', 'Proyectos'].map((categoria) => (
          <Picker.Item label={categoria} value={categoria} key={categoria} />
        ))}
      </Picker>

      <View ref={chartRef} collapsable={false} style={styles.chartContainer}>
        <BarChart
          data={datosFiltrados}
          width={screenWidth - screenWidth * 0.1}
          height={300}
          chartConfig={{
            backgroundGradientFrom: "#00FFFF",
            backgroundGradientFromOpacity: 0.1,
            backgroundGradientTo: "#FFFFFF",
            backgroundGradientToOpacity: 1,
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            strokeWidth: 1,
            barPercentage: 0.5,
          }}
          style={{ borderRadius: 10 }}
          verticalLabelRotation={20}
          withHorizontalLabels={true}
          showValuesOnTopOfBars={true}
          fromZero={true}
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
    margin: 10,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
  },
});