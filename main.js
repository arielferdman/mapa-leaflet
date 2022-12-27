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
    const data = await f.arrayBuffer();
    const workbook = XLSX.read(data);

    let addresses = getSheetData(workbook);

    let responses = await process_addresses_data(addresses, addresses_data);


    // get the body of all the responses with async await
    let bodies = await Promise.all(responses.map(res => {
        // log res to console
        let result = (async function() { return res.json() })();
        console.log(result);
    }));
    
    console.log(bodies);
}

function addMarkers(markers_data) {
    markers_data.forEach(marker_datum => {
        addMarker(marker_datum['lat'], marker_datum['lon'], `<div style="text-align: right"><b>${marker_datum['address']}</b><br><br>${marker_datum['comment']}</div>`);
    });
}

document.querySelector('.file-upload').addEventListener("change", handleDropAsync, false);

function parse_addresses_data(addresses) {
    let addrs_cursor = null;
    let addrs = [];
    let addrs_data = [];
    for (let i = 0; i < addresses.length; i += 2) {
	    addrs_cursor = addresses[i];
	    addrs.push(addrs_cursor);
	    addrs_data[addrs_cursor] = addresses[i + 1];
    }
    return [addrs, addrs_data]
}

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

function getSheetData(workbook) {
	    let data = [];
	    let sheet = getSheet(workbook);
	    let sheetKeys = getSheetKeys(workbook);
	    sheetKeys.forEach(key => {
		            data.push(sheet[key]);
		        });
	    return data.map(value => {return value['v']});
}

function getSheetKeys(workbook) {
	    return Object.keys(getSheet(workbook)).filter(key => {
		        return !key.includes('ref') && !key.includes('margins');
	    });
}

function getSheet(workbook) {
	    return workbook.Sheets[workbook.SheetNames[0]];
}

const searchAddress = async (term, comment, markers_data) => {
    let url = `http://194.163.148.244/search/${term}`;
    return new Promise((resolve, reject) => resolve(fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type',
        }
    })));
}
