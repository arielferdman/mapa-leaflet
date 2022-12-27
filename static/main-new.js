const searchInput = document.querySelector('#search');
const resultList = document.querySelector('#results');
const mapContainer = document.querySelector('#map');
const form = document.querySelector('#search-form');
const searchButton = document.querySelector('#search-button');
const fileUpload = document.querySelector('.file-upload');

const currentMarkers = [];


let map = L.map('map').setView([31.89610, 34.812], 15);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);


fileUpload.addEventListener("change", handleDropAsync, false);


form.addEventListener("submit", event => {
    event.preventDefault();
});


searchButton.addEventListener('click', () => {
    searchAddresses();
});


function searchAddresses() {
    const query = searchInput.value;
    fetch('https://nominatim.openstreetmap.org/search?format=json&polygon=1&addressdetails=1&q=' + query)
        .then(result => result.json())
        .then(parsedResult => {
            setResultList(parsedResult);
        });
}

async function handleDropAsync(e) {
    e.stopPropagation();
    e.preventDefault();
    const f = document.querySelector('.file-upload').files[0]
    const data = await f.arrayBuffer();
    const workbook = XLSX.read(data);

    let addresses = getSheetData(workbook);

    let responses = await process_addresses_data(addresses);


    // get the body of all the responses with async await
    let bodies = await Promise.all(responses.map(res => {
        // log res to console
        let result = (async function() { return res.json() })();
        console.log(result);
    }));
    
    console.log(bodies);
}

function getSheet(workbook) {
    return workbook.Sheets[workbook.SheetNames[0]];
}


function getSheetKeys(workbook) {
    return Object.keys(getSheet(workbook)).filter(key => {
        return !key.includes('ref') && !key.includes('margins');
    });
}


function getSheetData(workbook) {
    let data = [];
    let sheet = getSheet(workbook);
    let sheetKeys = getSheetKeys(workbook);
    sheetKeys.forEach(key => {
        data.push(sheet[key]);
    });
    return data.map(value => { return value['v'] });
}


function setResultList(parsedResult) {
    mapZoomToNewMarker(parsedResult);
    
    for (const result of parsedResult) {
        const position = new L.LatLng(result.lat, result.lon);
        currentMarkers.push(new L.marker(position).addTo(map));
    }
}


function mapZoomToNewMarker(parsedResult) {
    map.flyTo(new L.LatLng(parsedResult[0].lat, parsedResult[0].lon), 16);
}


function parse_addresses_data(addresses) {
    let addrs_cursor = null;
    let addrs_data = [];
    
    for (let i = 0; i < addresses.length; i += 2) {
	    addrs_cursor = addresses[i];
	    addrs_data[addrs_cursor] = addresses[i + 1];
    }
    
    return addrs_data
}

async function process_addresses_data(addresses) {
    let addresses_data = parse_addresses_data(addresses);
    let markers_data = [];
    let promises = [];
    
    console.log(addresses_data);

    Object.keys(addresses_data).forEach((addr) => {
        promises.push(searchAddresses(addr, addresses_data[addr], markers_data));
    });

    return Promise.all(promises);
}