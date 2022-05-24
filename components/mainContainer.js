import * as React from 'react';
import About from './about.js';
import StockSearch from './rsiStockSearch';
import SavedData from './savedData.js';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// '#bb86fc'
const Tab = createMaterialBottomTabNavigator();

function MainContainer() {
  return (
    <Tab.Navigator initialRouteName="RSI Search" inactiveColor='#bb86fc' activeColor='#03dac6' barStyle={{ backgroundColor: '#121212' }}>
      <Tab.Screen name="About" component={About} options={{
          tabBarLabel: 'About',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="help-box" color={color} size={16} />
          ),
        }}/>
      <Tab.Screen name="RSI Search" component={StockSearch} options={{
          tabBarLabel: 'RSI Search',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="note-search" color={color} size={16} />
          ),
        }}/>
      <Tab.Screen name="Saved Data" component={SavedData} options={{
          tabBarLabel: 'Saved Data',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="file-document" color={color} size={16} />
          ),
        }}/>
    </Tab.Navigator>
  );
}

export default MainContainer;