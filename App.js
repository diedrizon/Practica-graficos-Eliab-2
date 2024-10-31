import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Button } from 'react-native';
import Formulario from './src/components/Formulario';
import Graficos from './src/components/Graficos';

import { collection, getDocs, query } from 'firebase/firestore';
import db from './firebaseconfig';

// Datos iniciales
const data2 = [
  { x: '1', y: 0 },
  { x: '2', y: 0 },
  { x: '3', y: 0 },
];

export default function App() {
  const [data, setData] = useState(data2); // Inicializa con datos iniciales
  const [bandera, setBandera] = useState(false); // Variable bandera

  useEffect(() => {

    const recibirDatos = async () => {
      try {
        const q = query(collection(db, "personas"));
        const querySnapshot = await getDocs(q);
        const d = [];

        querySnapshot.forEach((doc) => {
          const datosBD = doc.data();
          const { nombre, salario } = datosBD;

          // Asegúrate de que 'salario' sea un número
          if (typeof salario === 'number' && nombre) {
            d.push({ x: nombre, y: salario });
          }
        });

        setData(d);
        console.log(d);
      } catch (error) {
        console.error("Error al obtener documentos: ", error);
      }
    };

    recibirDatos(); 
  }, [bandera]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Formulario setBandera={setBandera} />
        <Graficos />
        <View style={styles.graphContainer}>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 10,
  },
  graphContainer: {
    marginTop: 10,
    padding: 10,
  },
});

import GraficoReporteEnfermedades from './src/components/GraficoReporteEnfermedades';


  const dataReporteEnfermedades = [
    { date: "2017-01-05", count: 8 }, 
    { date: "2017-01-19", count: 5 }, 
    { date: "2017-02-06", count: 2 }, 
    { date: "2017-02-20", count: 4 }, 
    { date: "2017-03-07", count: 1 }, 
    { date: "2017-03-21", count: 3 }, 
    { date: "2017-04-05", count: 6 }, 
    { date: "2017-04-19", count: 2 }, 
    { date: "2017-05-03", count: 4 },
    { date: "2017-05-17", count: 7 },
    { date: "2017-06-06", count: 9 }, 
    { date: "2017-06-20", count: 5 }, 
    { date: "2017-07-05", count: 3 }, 
    { date: "2017-07-19", count: 4 }, 
    { date: "2017-08-07", count: 2 },  
    { date: "2017-08-21", count: 8 },  
    { date: "2017-09-06", count: 3 },
    { date: "2017-09-20", count: 7 },
    { date: "2017-10-04", count: 5 },
    { date: "2017-10-18", count: 6 },
    { date: "2017-11-06", count: 2 },
    { date: "2017-11-20", count: 9 }, 
    { date: "2017-12-05", count: 4 },
    { date: "2017-12-19", count: 7 } 
  ];
  
  

        <GraficoReporteEnfermedades dataReporteEnfermedades={dataReporteEnfermedades}/>