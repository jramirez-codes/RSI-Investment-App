import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import About from './about.js';
import StockSearch from './rsiStockSearch';
import SavedData from './savedData.js';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

function MainContainer() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="About" component={About} />
      <Tab.Screen name="RSI Search" component={StockSearch} />
      <Tab.Screen name="Saved Data" component={SavedData} />
    </Tab.Navigator>
  );
}

export default MainContainer;