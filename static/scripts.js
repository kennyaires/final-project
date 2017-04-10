
var map;

// execute when the DOM is fully loaded
$(function() {
    
    // get DOM node in which map will be instantiated
    var canvas = $("#map").get(0);
    
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2VubnlhaXJlcyIsImEiOiJjajExc3E5emUwNTl6MnFwZTNwbTRxbWY0In0.fcxuhxE38yX_qaho5eWMhw';
    
    var geojson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "message": "Foo",
                "iconSize": [60, 60]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    2.60926281,
                    46.48372145
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "message": "Bar",
                "iconSize": [50, 50]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    4.46993600,
                    50.49593874
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "message": "Baz",
                "iconSize": [40, 40]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    8.22751200,
                    46.81010721
                ]
            }
        }
    ]
    };

    
    map = new mapboxgl.Map({
    container: canvas, // container id
    style: 'mapbox://styles/mapbox/light-v9', //hosted style id
    center: [-10.38, 45], // starting position
    minZoom: 2,
    maxZoom: 4,
    zoom: 2 // starting zoom
    });
    
    // add markers to map
    geojson.features.forEach(function(marker) {
    // create a DOM element for the marker
    var el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = 'url(static/marker.fw.png)';
    el.style.width = '24px';
    el.style.height = '24px';

    el.addEventListener('click', function() {
        window.alert(marker.properties.message);
    });

    // add marker to map
    new mapboxgl.Marker(el, {offset: [-marker.properties.iconSize[0] / 2, -marker.properties.iconSize[1] / 2]})
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
    });
    
    // disable map rotation using right click + drag
    map.dragRotate.disable();

    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();
    
});