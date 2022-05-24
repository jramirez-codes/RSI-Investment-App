import React, {useState, useEffect} from 'react';
import { Button, TextInput, Title} from 'react-native-paper';
import {Dimensions, View, ScrollView} from 'react-native';
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

// Get tinker search data from alpha vantage
async function getSearchData(keywords) {
  var apiKey = await AsyncStorage.getItem('@alphaVantageApiKey')
  var url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+keywords+"&apikey=" + apiKey
  var data = await fetch(url)
  .then((response) => response.json())
  .then((json) => {
    return json;
  })
  .then(data => {
    return data;
  })
  .catch((error) => {
    console.error(error);
  });

  return data;
}

// Get RSI data from alpha vantage
async function getData(stock) {
  var apiKey = await AsyncStorage.getItem('@alphaVantageApiKey')
  var url = "https://www.alphavantage.co/query?function=RSI&symbol="+stock+"&interval=daily&time_period=10&series_type=open&apikey="+apiKey
  var data = await fetch(url)
  .then((response) => response.json())
  .then((json) => {
    return json;
  })
  .then(data => {
    return data;
  })
  .catch((error) => {
    console.error(error);
  });

  return data;
}

// When Text input is changed
async function onTextInput(input) {
  return await getSearchData(input)
}

// When Button is clicked
async function onPress(stock) {
  if(stock === "") {
    console.log("No stock selected");
    return "No Stock Selected!";
  }
  console.log("Getting Data for " + stock);
  var data = await getData(stock);
  return data;
}

// Configure RSI data
async function augmentDataRSI(data) {
  // Variables
  var metaJson = data["Meta Data"];
  var rsiDataJson = data["Technical Analysis: RSI"];
  var rsiNumb = 0;
  
  // Parse Meta Data
  var metaData = []
  for(var i in metaJson) {
    metaData.push(metaJson[i])
  }

  // Parse RSI data
  var rsiData = [];
  var rsiLabels = [];
  for(var i in rsiDataJson) {
    rsiNumb = parseFloat(rsiDataJson[i]["RSI"]);
    rsiData.push(parseFloat(rsiNumb));
    rsiLabels.push(i)
  }

  // NOTE: I SET A HARD SET LIMIT TO 10 Entries for RSI DATA
  rsiData = rsiData.slice(0,10).reverse()
  rsiLabels = [rsiLabels[0], rsiLabels[2], rsiLabels[4], rsiLabels[6]].reverse()

  return [rsiLabels, rsiData, metaData]
}

// Configure Search Data
async function augmentDataSearch(data) {
  var searchData = []
  for(var x = 0; x < data.length; x++) {
    searchData.push([data[x]["1. symbol"], data[x]["2. name"]])
  }
  // Return array of tuples with symbol and name
  return searchData.slice(0,3);
}

async function onSaveData(data) {
  try {
    const jsonValue = await AsyncStorage.getItem('@rsiData')
    if(jsonValue === null) {
      try {
        // Saving Data
        var setData = {"data": data}
        await AsyncStorage.setItem('@rsiData', JSON.stringify(setData))
        console.log("data saved")
      } catch (e) {
        console.log(e)
      }
    }
    else {
      var oldData = JSON.parse(jsonValue)
      var concatData = []
      // Copy Data
      for(var i = 0; i < oldData["data"].length; i++) {
        concatData.push(oldData["data"][i])
      }

      // Pushing Data
      for(var i = 0; i < data.length; i++) {
        var alreadyHas = false;
        for(var j = 0; j < oldData["data"].length; j++) {
          if(oldData["data"][j].legend[0] === data[i].legend[0]) {
            alreadyHas = true;
            console.log("already have " + data[i].legend[0])
          }
        }
        if(!alreadyHas) {
          console.log("Pushed " + data[i].legend[0])
          concatData.push(data[i])
        }
      }

      // Saving data
      try {
        var setData = {"data": concatData}
        await AsyncStorage.setItem('@rsiData', JSON.stringify(setData))
        console.log("data Saved")
      } catch(e) {
        // save error
      }
    }
  } catch(e) {
    console.log(e)
  }
}

function StockSearch() {
  // States
  const [inputStock, setInputStock] = useState("");
  const [stockSearch, setStockSearch] = useState(null)
  const [chartData, setChartData] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false)

  // When text is inputed into textInput
  const onTextSearch = async(searchText) => {
    // Set text to type text
    setInputStock(searchText);
    
    // Check if length is greater than 3 character
    if(searchText.length === 7) {
      var searchData = await onTextInput(searchText)
      searchData = await augmentDataSearch(searchData["bestMatches"])
      console.log(searchData)
      setStockSearch(searchData)
    }
    else if(searchText.length < 5) {
      setStockSearch(null)
    }
  } 

  // When "Get RSI" Button is clicked
  const onButtonPress = async(stock) => {
    // Change button to loading
    setLoadingButton(true);

    var rsiData
    if(stock !== null) {
      // Update data and stock input if submitted
      rsiData = await onPress(stock)
      // Update searchs back to 0
      setStockSearch(null)
    }else {
      rsiData = await onPress(inputStock)
    }
    await setInputStock("");

    // Catches if reaquest is a not a valid
    if(Object.keys(rsiData).length === 0) {
      return
    }
    // Transform data into useable form
    rsiData = await augmentDataRSI(rsiData)
    var allData = []
    // Pushing new data
    allData.push({
      labels: rsiData[0],
      datasets: [
        { 
          data: rsiData[1],
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
          strokeWidth: 2
        }
      ],
      legend: [rsiData[2][0]]
    })
    // Copying Old Data
    for(var i = 0; i < chartData.length; i++) {
      allData.push(chartData[i])
    }

    // Set data and loading button
    await setChartData(allData)
    setLoadingButton(false)
  }

  // Display Multiple Search Data for the user
  const DisplaySearchData = (props) => {
    // If there is no data
    if(props.data === null) {
      return(<View>{null}</View>);
    }
    
    // Update data
    var data = props.data
    var key = 0;
    var searchedData = data.map((stock) =>(
        <Button key={key++} style={[{alignSelf:"center"}]} mode="text" onPress={() => onButtonPress(stock[0])}>
          {stock[0] + " - " + stock[1]}
        </Button>
    ));
  
    return (
      <View style={[{justifyContent:'space-between', marginBottom: 10}]}>
        {searchedData}
      </View>
    );
  }

  // Display Multiple RSI graphs for user
  const DisplayMultipleGraphs = (props) => {
    var data = props.data
    var key = 0
    // If there is no chart data
    if(data.length === 0) {
      return (<View>{null}</View>)
    }
    
    var allChartData = data.map((chartData) => (
      <View key={key++} style={[{marginBottom: 10, borderRadius: 30, backgroundColor: "black", width:"90%", alignSelf:"center"}]}>
        <LineChart data={chartData} width={screenWidth*0.9} height={250} chartConfig={chartConfig}  verticalLabelRotation={15} bezier/>
      </View>
    ));

    return allChartData;
  }

  return(
    <>
    <View style={{backgroundColor: '#121212', height: '100%'}}>
      <ScrollView>
        <View style={[{alignSelf:'center', marginBottom: 10}]}>
          <Title style={{color: '#03dac6'}}>RSI Search</Title>
        </View>
        <View style={[{alignSelf:'center', justifyContent:'space-between', marginBottom: 10, width: "90%"}]}>
          <TextInput style={{backgroundColor: '#121212'}} mode='outlined' outlineColor='#bb86fc' selectionColor='#FFFFFF'
          label="Inut Stock" value={inputStock} onChangeText={inputStock => onTextSearch(inputStock)} 
          theme={{colors:{placeholder:'#bb86fc', text:'white'}}} activeOutlineColor="#bb86fc"/>
        </View>
        <DisplaySearchData data={stockSearch}/>
        <View style={[{justifyContent:'space-between', marginBottom: 10}]}>
          <Button style={[{ width: "60%", alignSelf:"center", backgroundColor:"#bb86fc"}]} 
          mode="contained" onPress={() => onButtonPress(null)} loading={loadingButton}>
            Get RSI
          </Button>
        </View>
        <DisplayMultipleGraphs data={chartData}/>
        <View style={[{justifyContent:'space-between', marginBottom: 10}]}>
          {chartData.length === 0 ? (null) : 
          (<Button color='#cf6679' onPress={() => {onSaveData(chartData); setChartData([])}}>Save Data and Clear Searches</Button>)}
        </View>
      </ScrollView>
    </View>
    </>
  );
}

export default StockSearch;
