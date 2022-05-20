import React, {useState} from 'react';
import { Button, TextInput } from 'react-native-paper';
import {Dimensions, View} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

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

// Get RSI data from alppha vantage
async function getData(stock) {
  var url = "https://www.alphavantage.co/query?function=RSI&symbol="+stock+"&interval=daily&time_period=10&series_type=open&apikey=ZKAWVVN5WJRWFHD2"
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

// When Button is clicked
async function onPress(stock) {
  if(stock === "") {
    console.log("No stock selected");
    return "NO Stock Selected!";
  }
  console.log("Pressed!");
  var data = await getData(stock);
  return data;
}

async function augmentData(data) {
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
  // console.log(rsiData);
  // console.log(rsiLabels);

  // NOTE: I SET A HARD SET LIMIT TO 10 Entries for RSI DATA
  rsiData = rsiData.slice(0,10).reverse()
  rsiLabels = [rsiLabels[0], rsiLabels[2], rsiLabels[4], rsiLabels[6]].reverse()

  return [rsiLabels, rsiData, metaData]
}

function StockSearch() {
  const [inputStock, setInputStock] = useState("");
  const [chartData, setChartData] = useState(0);

  const onButtonPress = async() => {
    // Update data and stock input
    var rsiData = await onPress(inputStock)
    if(Object.keys(rsiData).length === 0) {
      return
    }
    rsiData = await augmentData(rsiData)
    await setChartData({
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
  }

  return(
    <>
    <View style={[{justifyContent:'space-between', marginBottom: 10}]}>
      <TextInput label="TINKER Stock" value={inputStock} onChangeText={inputStock => setInputStock(inputStock)} />
    </View>
    <View style={[{justifyContent:'space-between', marginBottom: 10}]}>
      <Button style={[{ width: "60%", alignSelf:"center"}]} mode="contained" onPress={() => onButtonPress()}>
        Get RSI
      </Button>
    </View>
    <View style={[{marginBottom: 10, borderRadius: 30, backgroundColor: "black", width:"90%", alignSelf:"center"}]}>
      {chartData === 0 ? (null): (<LineChart data={chartData} width={screenWidth*0.9} height={250} chartConfig={chartConfig}  verticalLabelRotation={15} bezier/>)}
    </View>
    </>
  );
}

export default StockSearch;
