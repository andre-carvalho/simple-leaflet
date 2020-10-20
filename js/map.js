var map;
var tms_example;
var latitude = -55.685277;
var longitude = -10.3;
var api_key = "afdb1e8a9c8142739553e3942283d6c8";

$( document ).ready(function() {
    loadMosaicsFromApi();
    loadMap('08','2020');
});

function loadMosaicsFromApi(){
    let url="https://api.planet.com/basemaps/v1/mosaics?api_key="+api_key+"&_page_size=1000";
    $.ajax({url: url, success: function(result){
        result.mosaics.forEach(mosaic => {
            let dt=mosaic.first_acquired.split('T')[0];
            let y=dt.split('-')[0];
            let m=dt.split('-')[1];
            let option='<option value="'+m+'-'+y+'">'+m+'/'+y+'</option>';
            $('#mosaics').append(option);
        });
    }});
};

function changeMonth(ev) {
    let m=ev.value.split('-')[0];
    let y=ev.value.split('-')[1];
    reloadMap(m,y);
};

function reloadMap(m,y){
    if(tms_example) tms_example.removeFrom(map);

    let url="https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_"+y+"_"+m+"_mosaic/gmap/{z}/{x}/{y}.png?api_key="+api_key;

    tms_example = L.tileLayer(url, {
        tms: false
    }).addTo(map);
};

function loadMap(m,y) {
    map = L.map('map', {
        scrollWheelZoom: true,
        fullscreenControl: {
            pseudoFullscreen: false
        }
    }).setView([longitude, latitude], 12);

    // map.fitBounds([
    //     [-4.8587000, 39.8772333],
    //     [-6.4917667, 39.0945000]
    // ]);

    reloadMap(m,y);
}


