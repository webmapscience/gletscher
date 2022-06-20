let hintereisferner = {
    lat: 46.7956981,
    lng: 10.7411067,
    zoom: 14
};

// WMTS Hintergrundlayer
const eGrundkarteTirol = {
    sommer: L.tileLayer(
        "http://wmts.kartetirol.at/gdi_summer/{z}/{x}/{y}.png", {
            attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
        }
    ),
    winter: L.tileLayer(
        "http://wmts.kartetirol.at/gdi_winter/{z}/{x}/{y}.png", {
            attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
        }
    ),
    ortho: L.tileLayer(
        "http://wmts.kartetirol.at/gdi_ortho/{z}/{x}/{y}.png", {
            attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
        }
    ),
    nomenklatur: L.tileLayer(
        "http://wmts.kartetirol.at/gdi_nomenklatur/{z}/{x}/{y}.png", {
            attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`,
            pane: "overlayPane",
        }
    )
}

// Sommer Karte als Startlayer
let startLayer = eGrundkarteTirol.sommer;



// Karte initialisieren
let map = L.map("map", {
    center: [hintereisferner.lat, hintereisferner.lng],
    zoom: hintereisferner.zoom,
    layers: [
        startLayer
    ],
});

let layerControl = L.control.layers({
    "BasemapAT Grau": startLayer,
    "Basemap Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "DOM": L.tileLayer.provider("BasemapAT.surface"),
    "DGM": L.tileLayer.provider("BasemapAT.terrain"),
    "Basemap mit Orthofoto und Beschriftung": L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"), L.tileLayer.provider("BasemapAT.overlay")
    ])
}).addTo(map);

layerControl.expand();

async function loadPoly(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    L.geoJSON(geojson).addTo(map);
    L.geoJSON(geojson, {
        style: function (feature) {
            // Farben von clrs.cc
            //console.log(feature.properties.gridcode)
            let colors = {
                0: "#001f3f",
                1: "#0074D9",
                2: "00FFFFFF",
            };

            return {
                color: `${colors[feature.properties.gridcode]}`
            }
        }
    });

}
loadPoly("data/prediction_RF.geojson");

// let testlayer = L.tileLayer('tiles/Mapnik/{z}/{x}/{y}.png', {
//     minZoom: 14,
//     maxZoom: 18,
//     tms: false,
//     attribution: 'Generated by Sussbauer / Wagner w/ TilesXYZ'
// }).addTo(map);

// Load Layer Fußgängerzonen Wien from Wien OGD as geoJSON
// async function loadZones(url) {
//     let response = await fetch(url);
//     let geojson = await response.json();
//     //console.log(geojson)

//     // Add to overlay
//     let overlay = L.featureGroup();
//     layerControl.addOverlay(overlay, "Fußgängerzonen");
//     overlay.addTo(map);

//     L.geoJSON(geojson, {
//         style: function (feature) {
//             return {
//                 color: "#111111",
//                 fillColor: "#F012BE",
//                 weight: 1,
//                 fillOpacity: 0.2
//             }
//         }
//     }).bindPopup(
//         function (layer) {
//             return `
//             <h4>Fußgängerzone ${layer.feature.properties.ADRESSE}</h4>
//             <h5>${layer.feature.properties.ZEITRAUM || ""}</h5>
//             ${layer.feature.properties.AUSN_TEXT || ""}
//             `;
//         }).addTo(overlay)
// }
// loadZones("data/testpoly.geojson");