window.onload = function() {

    var map = L.map('analysemap').setView([51.9, 7.6], 12);

    L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    /*
    var lautstärkedaten = {
        data: [{
            lat: 51.96361471843619,
            lng: 7.613263440306753,
            leq: 33
        }, {
            lat: 51.969528599670866,
            lng: 7.59592634835127,
            leq: 69
        },
    {
            lat: 51.96328416661444,
            lng: 7.626824595101709,
            leq: 44
        },
    {
            lat: 51.95441521073917,
            lng: 7.626777444234705,
            leq: 40
        },
    {
            lat: 51.968847127728424,
            lng: 7.649246592247607,
            leq: 25
        },{
            lat: 51.981783956039294,
            lng: 7.615430767309618,
            leq: 88
        },
    {
            lat: 51.94312577098023,
            lng: 7.613099861371978,
            leq: 90
        },
    {
            lat: 51.966603084231934,
            lng: 7.566420566041046,
            leq: 100
        },
    {
            lat: 51.953605537296994,
            lng: 7.617354899306434,
            leq: 35
        },
    {
            lat: 51.96235426614382,
            lng: 7.640903164348117,
            leq: 56
        },
    {
            lat: 51.967539832319716,
            lng: 7.64965937842544,
            leq: 62
        },
    {
            lat: 51.96858734860393,
            lng: 7.6477041073208625,
            leq: 49
        },
    {
            lat: 51.966701801663675,
            lng: 7.648044154469915,
            leq: 12
        },
    {
            lat: 51.97450535564653,
            lng: 7.568728157053158,
            leq: 98
        },
    {
            lat: 51.965758998444926,
            lng: 7.567963050968075,
            leq: 72
        },
    {
            lat: 51.96323461042476,
            lng: 7.627587804252187,
            leq: 59
        },
    {
            lat: 51.960565638439306,
            lng: 7.6295869320176735,
            leq: 78
        },
    {
            lat: 51.95767718992323,
            lng: 7.597438690847184,
            leq: 45
        },
    {
            lat: 51.957907007011954,
            lng: 7.593522891245414,
            leq: 39
        },
    {
            lat: 51.95595352420577,
            lng: 7.595853724342163,
            leq: 42
        },
    {
            lat: 51.94571726757627,
            lng: 7.625801442801048,
            leq: 89
        },
    {
            lat: 51.94576250919141,
            lng: 7.628847361524919,
            leq: 82
        },
    {
            lat: 51.947798334633404,
            lng: 7.628920757157005,
            leq: 79
        },
    {
            lat: 51.94460883375433,
            lng: 7.626498701304143,
            leq: 85
        },
    {
            lat: 51.996244395981336,
            lng: 7.5989416749507654,
            leq: 69
        },
    {
            lat: 51.995770973535485,
            lng: 7.610782687924683,
            leq: 72
        },
    {
            lat: 51.99226749184473,
            lng: 7.606323085636035,
            leq: 77
        },
    {
            lat: 51.98904783453318,
            lng: 7.592482940600718,
            leq: 75
        },
    {
            lat: 51.98298667511031,
            lng: 7.597865219225781,
            leq: 56
        }
    ]
    };

    var cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        "radius": 0.01,
        "maxOpacity": .2,
        // scales the radius based on map zoom
        "scaleRadius": true,
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries
        //   (there will always be a red spot with useLocalExtremas true)
        "useLocalExtrema": true,
        // which field name in your data represents the latitude - default "lat"
        latField: 'lat',
        // which field name in your data represents the longitude - default "lng"
        lngField: 'lng',
        // which field name in your data represents the data value - default "value"
        valueField: 'leq'
    };

    // spezielles Design für die Marker der Messungen
    var customLautstärkeIcon = L.icon({
    iconUrl: 'images/laut.png',
    iconSize: [50, 50], // size of the icon
    iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
    popupAnchor: [5, 0] // point from which the popup should open relative to the iconAnchor
    });
    // popup größe regulieren
    var customPoint = {
    'maxWidth': '500',
    }

    // Schleife zum iterieren über den lautstärkedaten Array zum erstellen der popups
    for(var i=0;i<lautstärkedaten.data.length;i++){

        var lat = lautstärkedaten.data[i].lat;
        var lng = lautstärkedaten.data[i].lng;

        var markerLocation = new L.LatLng(lat, lng);
        var marker = new L.Marker(markerLocation, {icon: customLautstärkeIcon }).addTo(map);
        marker.bindPopup("Leq um ... Uhr: " + lautstärkedaten.data[i].leq.toString())
    }

    var heatmapLayer = new HeatmapOverlay(cfg).addTo(map);
    heatmapLayer.setData(lautstärkedaten);
    */


    fetch("https://api.opensensemap.org/boxes/60f077874fb91e001c71b3b1?format=geojson").then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
        console.log(JSON.stringify(data));
        // show JSON as Text on Website

        document.getElementById("elements").innerHTML = JSON.stringify(data);


        // spezielles Design für die Marker der Messungen
        var boxstandort = L.icon({
            iconUrl: 'images/boxmarker.png',
            iconSize: [30, 30], // size of the icon
            iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
            popupAnchor: [-5, -10] // point from which the popup should open relative to the iconAnchor
        });

        var boxvisualisierung = new L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, { icon: boxstandort });
            },
            onEachFeature: function(feature, layer) {
                if (feature.properties) {
                    layer.bindPopup(Object.keys(feature.properties).map(function(k) {
                        return k + ": " + feature.properties[k];
                    }).join("<br />"), {
                        maxHeight: 200
                    });
                }
            }
        }).addTo(map);

        var baseLayer = { map };
        var overlays = { boxvisualisierung };

        var layerControl = L.control.layers(null, overlays).addTo(map);
        //layerControl.addOverlay(boxvisualisierung, 'Boxstandort');

        // export as .geojson
        var boxinfos = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        var a = document.createElement('a');
        a.href = boxinfos;
        a.download = 'boxinfos.geojson';
        a.innerHTML = "Herunterladen als (Geo)JSON"

        var container = document.getElementById('container');
        container.appendChild(a);

    }).catch(function(err) {
        console.log('Fetch Error :', err);
    });
}