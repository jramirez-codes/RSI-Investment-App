import React from 'react';
import { Title } from 'react-native-paper';
import {View} from 'react-native';
import StockSearch from './components/rsiStockSearch';

function App() {
  return(
    <>
    <View>
      <Title style={{textAlign: 'center'}}>RSI App</Title>
      <StockSearch></StockSearch>
    </View>
    </>
  );
}

export default App;
