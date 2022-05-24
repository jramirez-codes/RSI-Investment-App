import AsyncStorage from '@react-native-async-storage/async-storage'

async function testApiKey(key) {
    // Check if api key is working
    console.log("Testing Key: " + key)
    var url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=IBM&apikey="+key
    var data = await fetch(url).then((response) => response.json())

    // Check if json object is empty
    if(data.length === 0) {
        return false
    }

    // Saving Key
    console.log("Setting Key: " + key)
    await AsyncStorage.setItem('@alphaVantageApiKey', key)
    return true
}

export default testApiKey;