import React from 'react'
import {Title} from "react-native-paper"
import { View, Text } from "react-native"
function About() {
    return (
        <View style={{backgroundColor: '#121212', height: "100%"}}>
            <View style={{marginBottom: 10}}>
                <Title style={{color: 'white', alignSelf: 'center'}}>About</Title>
            </View>
            <View style={{marginBottom: 10}}>
                <Text style={{color: 'white'}}>
                Description: This is an RSI searching app.  
                </Text>
            </View>
            <View style={{marginBottom: 10}}>
                <Text style={{color: 'white'}}>
                How to use: In the 'Search RSI' tab please input stock tinker in the box 'input stock'. 
                If you need help searching for the  stock, input more than 7 characters to get search results.
                Then click the get RSI button to get results. You can also search your searchs and 
                save the data at the bottom. Lastly to view saved data go to the 'Saved Data' tab.  
                </Text>
            </View>
            <View style={{marginBottom: 10}}>
                <Text style={{color: 'white'}}>
                How to use: In the 'Search RSI' tab please input stock tinker in the box 'input stock'. 
                If you need help searching for the  stock, input more than 7 characters to get search results. 
                Then click the get RSI button to get results. You can also clear your searchs and save the 
                data at the bottom. To view saved data go to the 'Saved Data' tab. Lastly, to delete the saved data click the botton at the bottom of the saved data tab.
                </Text>
            </View>
        </View>
    );
}

export default About;