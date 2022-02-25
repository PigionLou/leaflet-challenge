
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
 
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + "Time: " + new Date(feature.properties.time) +
            "</p><p>" + "Magnitude: " + (feature.properties.mag));
    }

    function markerSize(magnitude) {
        console.log(magnitude)
        return magnitude * 10000;
    }

    function markerColor(magnitude) {
        if (magnitude > 5) {
            return "#ff0000"
        }
        else if (magnitude > 4) {
            return "#ff9f00"
        }
        else if (magnitude > 3) {
            return "#ffff00"
        }
        else if (magnitude > 2) {
            return "#00ff00"
        }
        else if (magnitude > 1) {
            return "#00ffff"
        }
        else {
            return "#0000ff"
        }
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (earthquakeData, latlng) {
            return L.circle(latlng, {
                radius: markerSize(earthquakeData.properties.mag),
                color: markerColor(earthquakeData.properties.mag)
            });
        },
        onEachFeature: onEachFeature
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var newLayer = new L.LayerGroup();
 
    var baseMaps = {
        "Light Map": lightmap,
        "Dark Map": darkmap
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };
 
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [lightmap, earthquakes, newLayer]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Magnitude</h4>";
        div.innerHTML += '<i style="background: #ff0000"></i><span>>5</span><br>';
        div.innerHTML += '<i style="background: #ff9f00"></i><span>>4</span><br>';
        div.innerHTML += '<i style="background: #ffff00"></i><span>>3</span><br>';
        div.innerHTML += '<i style="background: #00ff00"></i><span>>2</span><br>';
        div.innerHTML += '<i style="background: #00ffff"></i><span>>1</span><br>';
        div.innerHTML += '<i style="background: #0000ff"></i><span>&#8804;1</span><br>'

        return div;
    };

    legend.addTo(myMap);
};