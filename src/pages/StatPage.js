import React, { useEffect, useState, useRef } from 'react';
import { Platform, StyleSheet, LogBox, ScrollView, View, Text } from 'react-native';
import RNFS from 'react-native-fs';
import Papa from 'papaparse';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
import { Card } from 'react-native-ui-lib';

// Suppress AggregateError warning from Hermes
LogBox.ignoreLogs(['[AggregateError]']);

const StatPage = () => {
  const [barData, setBarData] = useState([]);
  const [barData1, setBarData1] = useState([]);
  const [barData2, setBarData2] = useState([]);
  const [lineData, setLineData] = useState({
    data: [],   // For first line
    data1: [],  // For second line
    data2: [],  // For third line
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const indexRef = useRef(0);

  // Load CSV Data
  useEffect(() => {
    const loadCSVData = async () => {
      try {
        let filePath, csvText;

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

        const formatData = (key) =>
          parsed.data.map((row) => ({
            value: isNaN(parseFloat(row[key])) ? 0 : parseFloat(row[key]),
            label: row.label || '',
          }));

        setBarData(formatData('B'));
        setBarData1(formatData('C'));
        setBarData2(formatData('D'));
        setLoading(false);
      } catch (error) {
        console.error('Error reading CSV:', error);
        setLoading(false);
      }
    };

    loadCSVData();
  }, []);

  // Streaming data to line chart
  useEffect(() => {
    if (loading || !barData.length || !barData1.length || !barData2.length) return;

    const maxLength = Math.min(barData.length, barData1.length, barData2.length);
    const interval = setInterval(() => {
      const i = indexRef.current;

      if (i >= maxLength) {
        clearInterval(interval);
        return;
      }

      const next0 = barData[i]?.value ?? 0;
      const next1 = barData1[i]?.value ?? 0;
      const next2 = barData2[i]?.value ?? 0;

      setLineData(prev => {
        const newData = [...prev.data, next0];
        const newData1 = [...prev.data1, next1];
        const newData2 = [...prev.data2, next2];

        const threshold1 = 0.7; // For Data1
        const threshold2 = 0.9; // For Data2
        const threshold3 = 0.8; // For Data3

        if (next0 > threshold1) setMessage('Data1 threshold exceeded!');
        else if (next1 > threshold2) setMessage('Data2 threshold exceeded!');
        else if (next2 > threshold3) setMessage('Data3 threshold exceeded!');
        else setMessage('');

        return { data: newData, data1: newData1, data2: newData2 };
      });

      indexRef.current = i + 1;
    }, 2000);

    return () => clearInterval(interval);
  }, [loading, barData, barData1, barData2]);

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text>Loading data...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Card style={styles.graphStyle}>
            <Text style={styles.chartLabel}>Bar Chart</Text>
            <BarChart
              spacing={40}
              data={lineData.data.map((val, index) => ({ value: val, frontColor: 'purple', label: 'Day ' + (index + 1) }))}
              isAnimated={true}
              adjustToWidth={true}
              animationDuration={500}
              barBorderRadius={10}
              xAxisThickness={0}
              yAxisThickness={0}
              noOfSections={4}
            />
          </Card>

          <Card style={styles.graphStyle}>
            <Text style={styles.chartLabel}>Line Chart</Text>
            {message && (
              <View style={styles.messageBox}>
                <Text style={styles.messageText}>{message}</Text>
              </View>
            )}
            <View style={{flexDirection: 'row'}}>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20}}>
                <View style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: "#ff9970" }}></View>
                <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>Data1</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20}}>
                <View style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: "#a970ff" }}></View>
                <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>Data2</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20}}>
                <View style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: "#88ff70" }}></View>
                <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>Data3</Text>
              </View>
            </View>
            <LineChart
              data={lineData.data.map(val => ({ value: val }))}
              data2={lineData.data1.map(val => ({ value: val }))}
              data3={lineData.data2.map(val => ({ value: val }))}
              color="#ff9970"
              color2="#a970ff"
              color3="#88ff70"
              width={350}
              height={250}
              spacing={34}
              initialSpacing={10}
              hideDataPoints={false}
              yAxisTextStyle={{ fontSize: 12 }}
              xAxisTextStyle={{ fontSize: 12 }}
              rulesThickness={0}
              xAxisThickness={0}
              yAxisThickness={0}
              noOfSections={5}
              curved
              curvature={0.07}
              focusEnabled
              showStripOnFocus
              showTextOnFocus
              showValuesAsDataPointsText
              focusedDataPointRadius={2}
            />

          </Card>

          <View style={styles.graphStyle}>
            <Text style={styles.chartLabel}>Pie Chart</Text>
            <PieChart data={barData} toggleFocusOnPress={true} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e5ebef',
  },
  graphStyle: {
    marginVertical: 20,
    alignItems: 'center',
    padding: 10
  },
  chartLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageBox: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default StatPage;
