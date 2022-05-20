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

async function getSearchData(keywords) {
  var url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+keywords+"&apikey=ZKAWVVN5WJRWFHD2"
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
  console.log(data);
  return data;
}

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

async function augmentDataSearch(data) {
  var searchData = []
  for(var x = 0; x < data.length; x++) {
    searchData.push([data[x]["1. symbol"], data[x]["2. name"]])
  }
  // Return array of tuples with symbol and name
  return searchData.slice(0,3);
}

function StockSearch() {
  const [inputStock, setInputStock] = useState("");
  const [stockSearch, setStockSearch] = useState(null)
  const [chartData, setChartData] = useState(null);

  // When text is inputed into textInput
  const onTextSearch = async(searchText) => {
    // Set text to type text
    setInputStock(searchText);
    
    // Check if length is greater than 3 character
    if(searchText.length === 5 || searchText.length === 8) {
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
    var rsiData
    if(stock !== null) {
      // Update data and stock input if submitted
      rsiData = await onPress(stock)
      // Update searchs back to 0
      setStockSearch(null)
    }else {
      rsiData = await onPress(inputStock)
    } 

    if(Object.keys(rsiData).length === 0) {
      return
    }
    // Transform data into useable form
    rsiData = await augmentDataRSI(rsiData)
    console.log(rsiData)
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

  // Display Search Data for the user
  const DisplaySearchData = (props) => {
    if(props.data === null) {
      return(<View>{null}</View>);
    }
  
    var data = props.data
    var key = 0;
    const searchedData = data.map((stock) =>(
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

  return(
    <>
    <View style={[{justifyContent:'space-between', marginBottom: 10}]}>
      <TextInput label="TINKER Stock" value={inputStock} onChangeText={inputStock => onTextSearch(inputStock)} />
    </View>
    <DisplaySearchData data={stockSearch}/>
    <View style={[{justifyContent:'space-between', marginBottom: 10}]}>
      <Button style={[{ width: "60%", alignSelf:"center"}]} mode="contained" onPress={() => onButtonPress(null)}>
        Get RSI
      </Button>
    </View>
    <View style={[{marginBottom: 10, borderRadius: 30, backgroundColor: "black", width:"90%", alignSelf:"center"}]}>
      {chartData === null ? (null): (<LineChart data={chartData} width={screenWidth*0.9} height={250} chartConfig={chartConfig}  verticalLabelRotation={15} bezier/>)}
    </View>
    </>
  );
}

export default StockSearch;
