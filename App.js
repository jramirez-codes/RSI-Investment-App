import React from 'react';
import { Title } from 'react-native-paper';
import {View, ScrollView} from 'react-native';
import StockSearch from './components/rsiStockSearch';

function App() {
  return(
    <>
    <View>
      <ScrollView>
        <Title style={{textAlign: 'center'}}>RSI App</Title>
        <StockSearch></StockSearch>
      </ScrollView>
    </View>
    </>
  );
}

export default App;
