const searchInput = document.querySelector('#search');
const resultList = document.querySelector('#results');
const mapContainer = document.querySelector('#map');
const form = document.querySelector('#search-form');
const searchButton = document.querySelector('#search-button');
const currentMarkers = [];

let map = L.map('map').setView([31.89610, 34.812], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

form.addEventListener("submit", event => {
    event.preventDefault();
});

searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    fetch('https://nominatim.openstreetmap.org/search?format=json&polygon=1&addressdetails=1&q=' + query)
        .then(result => result.json())
        .then(parsedResult => {
            setResultList(parsedResult);
        });
});

function setResultList(parsedResult) {
    console.log(parsedResult);
    resultList.innerHTML = "";
    map.flyTo(new L.LatLng(parsedResult[0].lat, parsedResult[0].lon), 16);
    for (const result of parsedResult) {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'list-group-item-action');
        li.innerHTML = JSON.stringify({
            displayName: result.display_name,
            lat: result.lat,
            lon: result.lon
        }, undefined, 2);
        li.addEventListener('click', (event) => {
            for(const child of resultList.children) {
                child.classList.remove('active');
            }
            event.target.classList.add('active');
            const clickedData = JSON.parse(event.target.innerHTML);
            const position = new L.LatLng(clickedData.lat, clickedData.lon);
            map.flyTo(position, 10);
        })
        const position = new L.LatLng(result.lat, result.lon);
        currentMarkers.push(new L.marker(position).addTo(map));
        resultList.appendChild(li);
    }
}