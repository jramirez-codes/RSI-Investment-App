import React, { useState } from 'react';
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
        const value = await AsyncStorage.getItem('@rsiData')
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

async function onButtonPress() {
    await console.log("Button Pressed!")
    await getCashedData()
}

// Display Multiple RSI graphs for user
const DisplayCasheGraphs = async(props) => {
    var data = await props.data
    var key = 0
    // If there is no chart data
    if(data.length === 0) {
      return (<View>{null}</View>)
    }
    
    const allChartData = await data.map((chartData) => (
      <View key={key++} style={[{marginBottom: 10, borderRadius: 30, backgroundColor: "black", width:"90%", alignSelf:"center"}]}>
        <LineChart data={chartData} width={screenWidth*0.9} height={250} chartConfig={chartConfig}  verticalLabelRotation={15} bezier/>
      </View>
    ));

    return allChartData;
}

class SavedData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }
    
    componentDidMount() {
        this.setState({
            data: getCashedData()
        });
        console.log(this.state.data)
    }
    render() {
        return (
            <View>
                <ScrollView>
                    <Title>Saved RSI Data</Title>
                    <Button mode="contained" onPress={onButtonPress}>Get cash</Button>
                    <DisplayCasheGraphs data={this.state.data}/>
                </ScrollView>
            </View>
        );
    }
}

export default SavedData;