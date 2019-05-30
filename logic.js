// set query URL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // create object for response data to the createFeatures function
  createFeatures(data.features);

});

function getColor(d) {
    if ( d > 0 & d <=1 ) 
    return "#00fa00" ;
    if (d > 1 & d <=2  ) 
    return  "#bfff00";
    if (d > 2 &d <=3) 
    return  "yellow";
    if (d > 3 &d<=4) 
    return   "orange";
    if (d > 4 & d<=5) 
    return "#ff8000";
    if (d > 5) 
    return  "red";
   
  
};

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
  
  
var earthquakes = L.geoJSON(earthquakeData, {

    pointToLayer: function(feature,latlng){
      
      return L.circle(latlng,{
          
          fillOpacity:0.95,
          weight:0.5,
          color:"black",
          fillColor:getColor(feature.properties.mag),
            
              
            
          // set circle radius to output of markerSize function
          radius: feature.properties.mag*15000

        });

    },
    

    onEachFeature: onEachFeature
  });

  // send 'earthquakes' layer to the createMap function
  createMap(earthquakes);
}


function createMap(earthquakes) {

  // define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.pirates",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // define baseMaps object to hold base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // create overlay object to hold overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // create map with streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // create layer control & pass in our baseMaps and overlayMaps to add to map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
         magnitudes = [0,1,2,3,4,5],
         labels = [];
  
      // loop through density intervals to generate label with colored square for each
      for (var i =0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
              magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);
  }