import React, { useState, useEffect, useCallback } from 'react';
import { Title, Button } from 'react-native-paper';
import {View, ScrollView, Dimensions} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  // backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  // backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

async function getCashedData() {
    var data = []
    try {
      var value = await AsyncStorage.getItem('@rsiData')
      if(value !== null) {
        data = JSON.parse(value)["data"]
      }
    } catch(e) {
      console.log("didn't get")
    }
    console.log("Got cashed data")
    console.log(data)
    return data
}

function SavedData() {
    const [casheData, setCasheData] = useState([])

    useEffect(() => {
      const getData = async() => {
        var data = await getCashedData()
        setCasheData(data)
      }
      getData()
    }, []);

    const onClearDataPress = async() => {
      console.log("Clear Data")
      try {
        await AsyncStorage.removeItem("@rsiData");
        await setCasheData([]);
      } catch(e) {
        console.log(e);
      }
    }

    // Display Multiple RSI graphs for user
    const DisplayCasheGraphs = (props) => {   
      var data = props.data

      // If there is no chart data
      if(data.length === 0) {
        var allChartData =  (<View>{null}</View>)
      }
      else {
        var key = 0
        var allChartData = data.map((chartData) => (
          <View key={key++} style={[{marginBottom: 10, borderRadius: 30, backgroundColor: "black", width:"90%", alignSelf:"center"}]}>
            <LineChart data={chartData} width={screenWidth*0.9} height={250} chartConfig={chartConfig}  verticalLabelRotation={15} bezier/>
          </View>
        ));
      }

  return allChartData;
}

    return (
      <View>
        <ScrollView>
          <View style={[{justifyContent:'space-between', marginBottom: 10, alignSelf:"center"}]}>
            <Title>Saved RSI Data</Title>
          </View>
          <DisplayCasheGraphs data={casheData}/>
          <View style={[{justifyContent:'space-between', marginBottom: 10}]}>
            {casheData.length === 0 ? (null) : (<Button onPress={() => onClearDataPress()}>Clear Data</Button>)}
          </View>
        </ScrollView>
      </View>
    );
}

export default SavedData;