import React, { useState, useEffect, useCallback } from 'react';
import { Title, Button } from 'react-native-paper';
import {View, ScrollView, Dimensions} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import getData from './requests/getData';
import augmentDataRSI from './requests/augmentDataRSI';

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
      // For if data gets corrupted
      // var setData = {"data": []}
      // await AsyncStorage.setItem('@rsiData', JSON.stringify(setData) )
  
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
    const isFocused = useIsFocused()

    useEffect(() => {
      const getData = async() => {
        var data = await getCashedData()
        setCasheData(data)
      }
      getData()
    }, [isFocused]);

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
      
      // Update Cashe
      const updateCashe = async(newData) => {
        // Update Cashe and rendered data
        try {
          setCasheData(newData)
          var setData = {"data": newData}
          await AsyncStorage.setItem('@rsiData', JSON.stringify(setData))
        } catch(e) {
          console.log(e);
        }
      }

      // Deletes a data on button press
      const onSingleDelete = async (key) => {
        console.log("Deleting Item")
        // Remove Data Point
        var newData = []
        for(var i = 0; i< data.length; i++) {
          if(i !== key) {
            await newData.push(data[i])
          }
        }
        
        // Update Cashe and rendered data
        updateCashe(newData)
      }

      // Update data on button press
      const onSingleUpdate = async(key) => {
        // Get Data
        var tinker = data[key].legend[0]
        console.log("Updating " + tinker)
        var updateData = await getData(tinker)
        var rsiData = await augmentDataRSI(updateData)
        var graphData = {
          labels: rsiData[0],
          datasets: [
            { 
              data: rsiData[1],
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
              strokeWidth: 2
            }
          ],
          legend: [tinker]
        }

        // Change Data
        var newData = []
        for(var i = 0; i< data.length; i++) {
          if(i !== key) {
            await newData.push(data[i])
          }
          else {
            newData.push(graphData)
          }
        }
        updateCashe(newData)
      }

      // If there is no chart data
      if(data.length === 0) {
        var allChartData =  (<View>{null}</View>)
      }
      else {
        var allChartData = data.map((chartData, index) => (
          <View key={index.toString()} style={[{marginBottom: 10, borderRadius: 30, backgroundColor: "black", width:"90%", alignSelf:"center"}]}>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignSelf:'flex-end'}}>
              <View style={[{borderRadius: 50, overflow:'hidden', marginRight:10}]}>
                <Button mode='contained' color="#cf6679" icon="delete-forever" compact={true} onPress={() => onSingleDelete(index)}/>
              </View>
              <View style={[{borderRadius: 50, overflow:'hidden'}]}>
                <Button mode='contained' color="#03dac6" icon="reload" compact={true} onPress={() => onSingleUpdate(index)}/>
              </View>     
            </View>
            <View style={{marginTop: -20}}>
              <LineChart data={chartData} width={screenWidth*0.9} height={250} chartConfig={chartConfig}  verticalLabelRotation={15} bezier/>
            </View>
          </View>
        ));
      }

      return allChartData;
    }

    return (
      <View style={{backgroundColor: '#121212', height: "100%"}}>
        <ScrollView>
          <View style={[{justifyContent:'space-between', marginBottom: 10, alignSelf:"center"}]}>
            <Title style={{color: '#03dac6'}}>Saved RSI Data</Title>
          </View>
          <DisplayCasheGraphs data={casheData}/>
          <View style={[{justifyContent:'space-between', marginBottom: 10}]}>
            {casheData.length === 0 ? (null) : 
            (<Button color={'#cf6679'} onPress={() => onClearDataPress()}>Clear Data</Button>)}
          </View>
        </ScrollView>
      </View>
    );
}

export default SavedData;