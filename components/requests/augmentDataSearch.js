// Configure Search Data
async function augmentDataSearch(data) {
    var searchData = []
    for(var x = 0; x < data.length; x++) {
      searchData.push([data[x]["1. symbol"], data[x]["2. name"]])
    }
    // Return array of tuples with symbol and name
    return searchData.slice(0,3);
}

export default augmentDataSearch;