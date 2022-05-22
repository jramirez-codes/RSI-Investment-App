import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import About from './about.js';
import StockSearch from './rsiStockSearch';
import SavedData from './savedData.js';

const AboutRoute = () => <About/>;
const RSISearchRoute = () => <StockSearch/>;
const SavedRoute = () => <SavedData/>;

const MainContainer = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'About', title: 'About', icon: "help-box" },
    { key: 'RSISearch', title: 'RSI Search', icon: "note-search" },
    { key: 'Saved', title: 'Saved Data', icon: "file-document" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    About: AboutRoute,
    RSISearch: RSISearchRoute,
    Saved: SavedRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default MainContainer;