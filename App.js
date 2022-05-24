import React, {useEffect, useState} from 'react';
import MainContainer from './components/mainContainer';
import {View} from 'react-native'
import {TextInput, Button, Title, Text} from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import testApiKey from './components/testApiKey.js'

function App() {
  const [gotApiKey, setGotApiKey] = useState(false)
  const [textInput, setTextInput] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [attemptedInput, setAttemptedInput] = useState(false)
  useEffect(()=> {
    // Get API KEY
    const getAPIKey = async() => {
      // Get key from sotrage or if apiKey var is changed
      var testKey = ""
      if(apiKey === "") {
        testKey = await AsyncStorage.getItem('@alphaVantageApiKey')
      } else {
        testKey = apiKey
      }

      // Testing keys
      if(testKey === null | testKey === "") {
        setGotApiKey(false)
      }
      else {
        var testKey = testApiKey(testKey)
        setGotApiKey(testKey)
        setAttemptedInput(!testKey)
      }
    }
    getAPIKey()
  }, [apiKey]);

  return(
    <>
      {gotApiKey ? (<MainContainer/>): 
      (
        <View style={{backgroundColor: '#121212', height: "100%", alignItems:'center',
        flex: 1, justifyContent: 'center'}}>
          <View  style={{backgroundColor:"#121212", alignItems: "center"}}>
            <Title style={{color: "#03dac6" }}>Welcome</Title>
          </View>
            <View style={[{alignSelf:'center', justifyContent:'space-between', marginBottom: 10, width: "90%"}]}>
              <TextInput style={{backgroundColor: '#121212'}} mode='outlined' outlineColor='#bb86fc' selectionColor='#FFFFFF'
              label="Alpha Vantage API Key" value={textInput} onChangeText={text => setTextInput(text)} 
              theme={{colors:{placeholder:'#bb86fc', text:'white'}}} activeOutlineColor="#bb86fc"/>
          </View>
          {attemptedInput ? 
          (
            <View style={[{alignSelf:'center', justifyContent:'space-between', marginBottom: 10, width: "90%"}]}>
              <Text style={{alignSelf:'center', color: '#cf6679'}}>Invalid API Key, please try again</Text>
            </View>
          ) : (null)}
          <View style={[{justifyContent:'space-between', marginBottom: 10}]}>
            <Button style={[{ width: "60%", alignSelf:"center", backgroundColor:"#bb86fc"}]} 
            mode="contained" onPress={() => setApiKey(textInput)} >
              Set API Key
            </Button>
          </View>
        </View>
      )}
      
    </>
  );
}

export default App;
