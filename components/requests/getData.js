import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default getData;
  