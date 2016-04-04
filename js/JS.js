///////////////////////////////// Functions ////////////////////////////////
// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};
Round_2 = function(num) {
  return Math.round(num * 100) / 100;
};
function getColor(d) {
 // console.log(d)
    c1 = chroma.scale(['#1a9850', '#a6d96a', '#fee08b','#fdae61', '#f46d43', '#d73027']).
    domain([20, 70], 20, 'log');
    return c1(d)
}
function style(feature) {
  // console.log(feature.properties.bldgarea)
            return {
                weight: 0.3,
                opacity: 1,
                color: 'black',
                dashArray: '',
                fillOpacity: 1,
                fillColor: getColor(Math.degrees(Math.atan(10*feature.properties.numfloors/Math.sqrt(feature.properties.lotarea)))),
            };
    }
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 4,
        color: '#fff',
        dashArray: '',
        fillOpacity: 1
    });
    info.update(layer.feature.properties);
    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

}
function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
    info.update();
}
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

///////////////////////////////// MAP INIT ////////////////////////////////
map = new L.Map('map', { 
  center: [40.7119,-73.99704],
  zoom: 14
})
L.tileLayer('https://dnv9my2eseobd.cloudfront.net/v3/cartodb.map-4xtxp73f/{z}/{x}/{y}.png', {
  attribution: 'Mapbox <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>'
}).addTo(map);
var geojsonLayer = new L.GeoJSON
.AJAX("ManhattanSouth.geojson",{style:style, onEachFeature: onEachFeature});   

///////////////////////////////// INFO BOX ////////////////////////////////
var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
info.update = function (props) {
    this._div.innerHTML = '<h3> Lot View Angle </h3>' + 
        '<h3>     </h3>' + (props ?
        '<b>' + '</b><br />'  + props.address +
        '</b><br />'  + 'h :  ' + Round_2(10*props.numfloors) + ' feet' +
        '</b><br />' + 'd :  ' + Round_2(Math.sqrt(props.lotarea)) + ' feet' +
        '</b><br />' + 'angle :  ' + Round_2(Math.
          degrees(Math.atan(10*props.numfloors/Math.sqrt(props.lotarea))))
        + ' degrees' : '                   ');
};
info.addTo(map);


/////////////////////////////////  LEGEND BOX  ////////////////////////////////
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 5, 10, 15, 20, 25, 30, 40],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};
legend.addTo(map);
geojsonLayer.addTo(map)

////////////////////////////////  CANVAS BOX  ////////////////////////////////
//get a reference to the canvas
var ctx = $('#canvas')[0].getContext("2d");
//the frame rectangle
ctx.fillStyle = "rgba(0, 0, 0, 0)"
ctx.beginPath();
ctx.rect(0, 0, 200, 200);
ctx.closePath();
ctx.fill();
//the building rectangle
ctx.fillStyle = "rgba(255, 0, 255, .8)"
ctx.beginPath();
ctx.rect(50, 10, 150, 150);
ctx.closePath();
ctx.fill();
//the baseline
ctx.beginPath(); 
ctx.lineWidth="6";
ctx.strokeStyle="rgba(0, 0, 0, .7)";
ctx.moveTo(0,160+3);
ctx.lineTo(200,160+3);
ctx.stroke(); // Draw it
//the angle line
ctx.beginPath(); 
ctx.lineWidth="4";
ctx.strokeStyle="rgba(0, 0, 255, .8)"; 
ctx.moveTo(50+1,160-1);
ctx.lineTo(200-1,10+1);
ctx.stroke(); // Draw it
//draw a circle
ctx.fillStyle = "rgba(255, 255, 255, 1)";
ctx.beginPath();
ctx.lineWidth="4";
ctx.arc(50, 160, 20, 1.75*Math.PI, 2*Math.PI);
ctx.closePath();
ctx.fill();
//draw text
ctx.font="14px Georgia";
ctx.fillStyle="rgba(255, 255, 255, .9)";
ctx.fillText("angle",50+25,160-8);
//draw text
ctx.font="16px Georgia";
ctx.fillStyle="rgba(0, 0, 0, .9)";
ctx.fillText("h",200-12,90+5);
//draw text
ctx.font="16px Georgia";
ctx.fillStyle="rgba(0, 0, 0, .9)";
ctx.fillText("d",130,160-2);
//draw text
ctx.font="14px Georgia";
ctx.fillStyle="rgba(0, 0, 0, .9)";
ctx.fillText("street",2,160+20);
//draw text
ctx.font="14px Georgia";
ctx.fillStyle="rgba(0, 0, 0, .9)";
ctx.fillText("lot",110,160+20);
