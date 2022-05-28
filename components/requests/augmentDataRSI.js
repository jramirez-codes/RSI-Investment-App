// Configure RSI data
async function augmentDataRSI(data) {
    // Variables
    var metaJson = data["Meta Data"];
    var rsiDataJson = data["Technical Analysis: RSI"];
    var rsiNumb = 0;
    
    // Parse Meta Data
    var metaData = []
    for(var i in metaJson) {
      metaData.push(metaJson[i])
    }
  
    // Parse RSI data
    var rsiData = [];
    var rsiLabels = [];
    for(var i in rsiDataJson) {
      rsiNumb = parseFloat(rsiDataJson[i]["RSI"]);
      rsiData.push(parseFloat(rsiNumb));
      rsiLabels.push(i)
    }
  
    // NOTE: I SET A HARD SET LIMIT TO 10 Entries for RSI DATA
    rsiData = rsiData.slice(0,10).reverse()
    rsiLabels = [rsiLabels[0], rsiLabels[2], rsiLabels[4], rsiLabels[6]].reverse()
  
    return [rsiLabels, rsiData, metaData]
  }
  
export default augmentDataRSI;