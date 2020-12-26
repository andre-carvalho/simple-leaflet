var map,scale;
var latitude = -55.685277;
var longitude = -10.3;
var zlevels={};

$( document ).ready(function() {
    loadMapOnly();
});

/**
 * https://gis.stackexchange.com/questions/198435/how-to-get-current-scale-of-a-leaflet-map
 *
 */
function getMeterPerPixel(){
    // Get the y,x dimensions of the map
    var y = map.getSize().y,
    x = map.getSize().x;
    // calculate the distance the one side of the map to the other using the haversine formula
    var maxMeters = map.containerPointToLatLng([0, y]).distanceTo( map.containerPointToLatLng([x,y]));
    // calculate how many meters each pixel represents
    var MeterPerPixel = maxMeters/x;
    
    // This is the scale denominator
    console.log(MeterPerPixel*scale.options.maxWidth);

    return MeterPerPixel;
}


function loadMapOnly() {
    map = L.map('map', {
        scrollWheelZoom: true,
        fullscreenControl: {
            pseudoFullscreen: false
        }
        //timeDimension: true
    }).setView([longitude, latitude], 5);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution:
         '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' +
         ', Tiles courtesy of <a href="https://geo6.be/">GEO-6</a>',
     maxZoom: 18
    }).addTo(map);

    scale = L.control.scale().addTo(map);

    map.on("zoomend",
        ()=>{
            console.log("zlevel="+map.getZoom()+" scale="+scale._mScale.innerText);
            if(!zlevels[map.getZoom()]) {
                zlevels[map.getZoom()]=scale._mScale.innerText;
            }
        }
    );

    testScale();
}

function testScale(){
    var min=map.getMinZoom();
    var max=map.getMaxZoom();
    var zlvalues={0: "10000 km", 1: "5000 km", 2: "3000 km", 3: "1000 km", 4: "500 km", 5: "300 km", 6: "200 km", 7: "100 km", 8: "50 km", 9: "30 km", 10: "10 km", 11: "5 km", 12: "3 km", 13: "1 km", 14: "500 m", 15: "300 m", 16: "200 m", 17: "100 m", 18: "50 m"};
    var zlevels=document.getElementById("zlevels");

    for (let index = min; index <= max; index++) {
        var opt=document.createElement("option");
        opt.value=index;
        opt.innerText=zlvalues[index];
        if(index==map.getZoom()){
            opt.setAttribute("selected","selected");
        }
        zlevels.appendChild(opt);
    }
    //autoChangeZoom(0);
}

var autoChangeZoom=(zoomLevel)=>{
    var max=map.getMaxZoom();
    if(zoomLevel<=max){
        window.setTimeout(
            ()=>{
                setZoomLevel(zoomLevel);
                zoomLevel++;
                autoChangeZoom(zoomLevel);
            },
            1500
        );
    }
}

function setZoomLevel(zl){
    map.setZoom(zl);
}
