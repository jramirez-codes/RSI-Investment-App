import React from 'react'
import { Card, Title} from "react-native-paper"
import { View, Text } from "react-native"

function About() {
    return (
        <>
            <View style={{backgroundColor:"#121212", alignItems: "center"}}>
                <View  style={{backgroundColor:"#121212", alignItems: "center", marginBottom:10}}>
                    <Title style={{color: "#03dac6" }}>About</Title>
                </View>
                <View style={{backgroundColor: '#121212', height: "100%", alignItems:'center'
                /*flex: 1, flexDirection: 'row', justifyContent: 'center'*/}}>
                    <View style={{width:'80%', alignSelf:'center'}}>
                        <Card style={{backgroundColor: 'black', borderColor:"#bb86fc", borderRadius: 20}} mode='outlined' >
                            <Card.Content>
                                <View style={{marginBottom: 10}}>
                                    <Text style={{color: 'white'}}>
                                    Description: This is an RSI searching app.  
                                    </Text>
                                </View>
                                <View style={{marginBottom: 10}}>
                                    <Text style={{color: 'white'}}>
                                    How to use: In the 'Search RSI' tab please input stock tinker in the box 'input stock'. 
                                    If you need help searching for the  stock, input more than 7 characters to get search results.
                                    Then click the get RSI button to get results. You can also clear your searchs and 
                                    save the data at the bottom. Lastly to view saved data go to the 'Saved Data' tab.  
                                    </Text>
                                </View>
                                <View style={{marginBottom: 10}}>
                                    <Text style={{color: 'white'}}>
                                    Limitations: Alpha Vantage limits API calls to 5 / per min. 
                                    </Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </View>
                </View>
            </View>
            
        </>
    );
}

export default About;