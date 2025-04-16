import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, LogBox, ScrollView, View, Text } from 'react-native';
import RNFS from 'react-native-fs';
import Papa from 'papaparse';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, LineChart, PieChart, PopulationPyramid, RadarChart } from "react-native-gifted-charts";

// suppress AggregateError warning from React Native Hermes if needed
LogBox.ignoreLogs(['[AggregateError]']);

const StatPage = () => {
  const [barData, setBarData] = useState([]);
  const [time, setTime] = useState(new Date());
  const [totalTime, setTotalTime] = useState(0);
  const [lineData, setLineData] = useState([]);
  useEffect(() => {
    const loadCSVData = async () => {
      try {
        let filePath;
        let csvText;

        if (Platform.OS === 'android') {
          filePath = 'BarChartData.csv';
          csvText = await RNFS.readFileAssets(filePath, 'utf8');
        } else {
          filePath = `${RNFS.MainBundlePath}/BarChartData.csv`;
          csvText = await RNFS.readFile(filePath, 'utf8');
        }

        const parsed = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
        });
        // console.log(parsed);
        // Convert and sanitize values
        const formatted = parsed.data.map((row) => {
          const value = parseFloat(row.B);
          return {
            value: isNaN(value) ? 0 : value,
            label: row.label || '',
          };
        });

        // console.log('Final Parsed Data:', formatted);
        setBarData(formatted);
      } catch (error) {
        console.error('Error reading CSV:', error);
      }
    };

    loadCSVData();
  }, []);

  useEffect(() => {
    if (totalTime < barData.length) {
      const interval = setInterval(() => {
        const next = barData[totalTime];
        // console.log(barData);
        if (next && !isNaN(next.value)) {
          setLineData(prev => [...prev, { value: next.value }]);
          setTotalTime(prev => prev + 1);
        }  else {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [totalTime, barData]);

  // useEffect(() => {
  //   console.log('Updated lineData:', lineData);
  // }, [lineData]);
  // console.log(lineData);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.graphStyle}>
            <Text style={styles.chartLabel} >Bar Chart</Text>
            <BarChart data={barData} />
          </View>
          <View style={styles.graphStyle}>
            <Text style={styles.chartLabel}>Line Chart</Text>
            <LineChart data={lineData} key={lineData.length} isAnimated='true' adjustToWidth='true' animateOnDataChange='true'/>
          </View>

          <View style={styles.graphStyle}>
            <Text style={styles.chartLabel}>Pie Chart</Text>
            <PieChart data={barData} style={styles.graphStyle} toggleFocusOnPress={true} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default StatPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  graphStyle: {
    marginVertical: 20,
    alignItems: 'center'
  },
  chartLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  }
});
