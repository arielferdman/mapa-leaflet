    let route1 = [31.89657, 34.811875];
    // 31.897645, 34.798411
    let route2 = [31.897645, 34.798411];
    let map = L.map('map').setView([31.89610, 34.812], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    let marker = L.marker(route1).addTo(map);
    marker.bindPopup(`<div style="text-align: right"><b>אחד העם 1</b><br><br>כאן אני גר</div>`, {closeOnClick: false, autoClose: false}).openPopup();

    // let popup = L.popup();
    // function onMapClick(e) {
    //     popup
    //         .setLatLng(e.latlng)
    //         .setContent("You clicked the map at " + e.latlng.toString())
    //         .openOn(map);
    // }

    // map.on('click', (e) => {
    //     console.log(Object.values(e.latlng));
    //     console.log(getDist(...Object.values(e.latlng), ...route2));
    //     if ((getDist(...Object.values(e.latlng), ...route2)) < 0.04) {
    //     marker2.popup();        
    //     }
    // });

    let marker2 = L.marker(route2).addTo(map);
    marker2.bindPopup(`<div style="text-align: right"><b>המנוף 4</b><br><br>האקסטור</div>`, {closeOnClick: false, autoClose: false}).openPopup();

    marker2.addEventListener('click', function() {
        let popup2 = e.layer.getPopup();
        popup2.show();
    });


    const getDist = (lat1, lon1, lat2, lon2) => {
        let R = 6371; // Radius of the earth in km
        let dLat = deg2rad(lat2 - lat1); // deg2rad below
        let dLon = deg2rad(lon2 - lon1);
        console.log(dLat, dLon);
        let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c; // Distance in km
        return d;
    }

    const deg2rad = deg => deg * (Math.PI / 180);

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
        const json_object = XLSX.utils.sheet_to_json(worksheet);
        const term = Object.keys((json_object[0]))[1];
        console.log(searchAddress(term));
    }

    document.querySelector('.file-upload').addEventListener("change", handleDropAsync, false);

    const addMarker = (lat, lon, text) => {
        let marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(text).openPopup();
    }

    const searchAddress = (term) => {
        let url = `http://127.0.0.1:5000/search/${term}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Content-Type',
            }
        }).then(response => response.json()).then(data => {
            console.log(data);
            let lat = data[0].lat;
            let lon = data[0].lon;
            addMarker(lat, lon, `<div style="text-align: right"><b>${term}</b><br><br>${lat}, ${lon}</div>`);
        });
    }