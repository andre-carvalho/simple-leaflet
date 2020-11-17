var map;
var tms_example;
var latitude = -55.685277;
var longitude = -10.3;
var api_key = "afdb1e8a9c8142739553e3942283d6c8";

$( document ).ready(function() {
    loadMosaicsFromApi();
});

function loadMosaicsFromApi(){
    let url="https://api.planet.com/basemaps/v1/mosaics?api_key="+api_key+"&_page_size=1000";
    
    $.ajax({url: url, success: function(result){
        let maxDate=new Date('2000-01-01');
        let layers=[],times=[];
        // first, read all periods from API
        result.mosaics.forEach(mosaic => {
            layers.push(mosaic.name);
            let startdt=mosaic.first_acquired.split('T')[0];
            let enddt=mosaic.last_acquired.split('T')[0];
            times.push({
                startdt:startdt,
                enddt:enddt,
                lname:mosaic.name
            });
            maxDate=(maxDate<new Date(startdt+'T12:00:00'))?(new Date(startdt+'T12:00:00')):(maxDate);
        });
        let selectedLayer='';
        maxDate=maxDate.toISOString().split('T')[0];
        let maxdt=maxDate.split('-')[0]+'-'+maxDate.split('-')[1];
        times.sort(function(a, b){return new Date(a.startdt) - new Date(b.startdt)});
        times.forEach(l=>{
            let selected='',type='Visual';
            if(l.lname.includes(maxdt)) {
                selectedLayer=l.lname;
                selected='selected';
            }
            if(l.lname.includes('normalized_analytic')){
                type='Normalizada';
            }
            let option='<option value="'+l.lname+'" '+selected+'>'+type+' de '+l.startdt.replaceAll('-','/')+' até '+l.enddt.replaceAll('-','/')+'</option>';
            $('#mosaics').append(option);
        });
        $('#mosaics').val(selectedLayer);
        // so, call map with the layer name
        loadMap(selectedLayer);
    }});
};

function changeMonth(ev) {
    reloadMap(ev.value);
};

function reloadMap(selectLayer){
    if(tms_example) tms_example.removeFrom(map);
    let url="https://tiles{s}.planet.com/basemaps/v1/planet-tiles/"+selectLayer+"/gmap/{z}/{x}/{y}.png?api_key="+api_key;

    tms_example = L.tileLayer(url, {
        tms: false,
        subdomains:'0123'
    }).addTo(map);
};

function loadMap(selectLayer) {
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

    reloadMap(selectLayer);
}


