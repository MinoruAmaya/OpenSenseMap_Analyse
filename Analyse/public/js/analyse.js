var map = L.map('analysemap').setView([51.9, 7.5], 12);

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

//var SBID;

function returnText() {
    let SBID = document.getElementById("userInput").value;
    alert(SBID)
}

let lautstärken = []

function fetchbox() {
    let SBID = document.getElementById("userInput").value;
    console.log(SBID)
    fetch(`https://api.opensensemap.org/boxes/${SBID}?format=geojson`).then(function (response) {
        return response.json();
        console.log(SBID)
    }).then(function (data) {
        console.log(data);
        console.log(JSON.stringify(data));

        // spezielles Design für die Marker der Messungen
        var boxstandort = L.icon({
            iconUrl: 'images/boxmarker.png',
            iconSize: [30, 30], // size of the icon
            iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
            popupAnchor: [-5, -10] // point from which the popup should open relative to the iconAnchor
        });

        var boxvisualisierung = new L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                    icon: boxstandort
                });
            },

            onEachFeature: function (feature, layer) {
                layer.bindPopup(feature.properties.name)

            }
        }).addTo(map);

        var baseLayer = {
            map
        };
        var overlays = {
            boxvisualisierung
        };

        //layerControl.addOverlay(boxvisualisierung, 'Boxstandort');// spezielles Design für die Marker der Messungen
        var boxstandort = L.icon({
            iconUrl: 'images/boxmarker.png',
            iconSize: [30, 30], // size of the icon
            iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
            popupAnchor: [-5, -10] // point from which the popup should open relative to the iconAnchor
        });

        var boxvisualisierung = new L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                    icon: boxstandort
                });
            },

            onEachFeature: function (feature, layer) {
                layer.bindPopup(feature.properties.name)

            }
        }).addTo(map);


    }).catch(function (err) {
        console.log('Fetch Error :', err);
    })

    // test box: 60f077874fb91e001c71b3b1
    // test sensor: 60f077874fb91e001c71b3b2
    let SID = document.getElementById("sid").value;
    console.log(SBID)
    console.log(SID)
    fetch(`https://api.opensensemap.org/boxes/${SBID}/data/${SID}`).then(function (response) {
        return response.json();
    }).then(function (dbdata) {
        console.log(dbdata);
        // Filter die letzten x Einträge heraus
        for (let i = 0; i < 30; i++) {

            lautstärken.push(dbdata[i].createdAt + ": " + dbdata[i].value)
        }
        console.log(lautstärken)

        document.getElementById("elements").innerHTML = JSON.stringify(lautstärken);

        // export as json
        var boxinfos = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dbdata));
        var a = document.createElement('a');
        a.href = boxinfos;
        a.download = 'boxinfos.json';
        a.innerHTML = "Herunterladen als JSON"

        var containerjson = document.getElementById('containerjson');
        containerjson.appendChild(a);

    });
}