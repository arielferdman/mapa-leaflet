let map = L.map('map').setView([31.89610, 34.812], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);



// a function to import data from an excel file
async function handleDropAsync(e) {
    e.stopPropagation();
    e.preventDefault();
    const f = document.querySelector('.file-upload').files[0]
    /* f is a File */
    const data = await f.arrayBuffer();
    /* data is an ArrayBuffer */
    const workbook = XLSX.read(data);

    const first_sheet_name = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[first_sheet_name];
    const addresses_data = XLSX.utils.sheet_to_json(worksheet)[0];

    let addresses = Object.keys(addresses_data);


    let responses = await process_addresses_data(addresses, addresses_data);


    // get the body of all the responses with async await
    let bodies = await Promise.all(responses.map(res => {
        // log res to console
        console.log(res);
    });
    
    // log the body of all the responses
    console.log(bodies);
}

function addMarkers(markers_data) {
    markers_data.forEach(marker_datum => {
        addMarker(marker_datum['lat'], marker_datum['lon'], `<div style="text-align: right"><b>${marker_datum['address']}</b><br><br>${marker_datum['comment']}</div>`);
    });
}

document.querySelector('.file-upload').addEventListener("change", handleDropAsync, false);

async function process_addresses_data(addresses, addresses_data) {
    let markers_data = [];
    let promises = [];
    addresses.map((addr) => {
        promises.push(searchAddress(addr, addresses_data[addr], markers_data));
    });

    return Promise.all(promises);
}

const addMarker = (lat, lon, text) => {
    let marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(text).openPopup();
}

const searchAddress = async (term, comment, markers_data) => {
    let url = `http://sheetcoins.com/search/${term}`;
    return new Promise((resolve, reject) => res(fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type',
        }
    })));
}
