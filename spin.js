// trenutno so mock podatki, ker dispecerji stavkajo
const mockData = [
    {
        "dogodekNaziv": "Požar v stanovanju",
        "intervencijaVrstaNaziv": "Požar",
        "obcinaNaziv": "Maribor",
        "nastanekCas": "2025-01-20T14:30:00",
        "wgsLat":  46.561667,
        "wgsLon": 15.649917
    },
    {
        "dogodekNaziv": "Prometna nesreča",
        "intervencijaVrstaNaziv": "Nesreča",
        "obcinaNaziv": "Maribor",
        "nastanekCas": "2025-01-20T13:45:00",
        "wgsLat": 46.55472,
        "wgsLon": 15.64588
    }
];

function fetchData() {
    return mockData;
}

const map = L.map('map').setView([46.0, 14.5], 8);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function update(data) {
    const latitude = [];
    const longitude = [];
    const imena = [];

    const now = new Date();
    const dateOnly = now.toISOString().split('T')[0];
    const hourNow = now.getHours();

    data.forEach(entry => {
        const { dogodekNaziv, intervencijaVrstaNaziv, obcinaNaziv, nastanekCas, wgsLat, wgsLon } = entry;

        const [date, time] = nastanekCas.split('T');
        const hourPrijava = parseInt(time.split(':')[0]);

        if (date === dateOnly && hourPrijava <= (hourNow + 2)) {
            L.marker([wgsLat, wgsLon])
                .addTo(map)
                .bindPopup(`${dogodekNaziv} - ${obcinaNaziv} - ${nastanekCas} - ${wgsLat} - ${wgsLon}`)
                .openPopup();

            latitude.push(wgsLat);
            longitude.push(wgsLon);
            imena.push(dogodekNaziv);
        }
    });

    return { latitude, longitude, imena };
}

// formula za distanco
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371e3; 
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; 
    return d;
}


function addLocation(latitudeArray, longitudeArray, imenaArray, radius = 100000) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            L.marker([lat, lon]).addTo(map).bindPopup("Moja trenutna lokacija").openPopup();
            L.circle([lat, lon], { radius }).addTo(map);


            for (let i = 0; i < latitudeArray.length; i++) {
                const latIntervention = latitudeArray[i];
                const lonIntervention = longitudeArray[i];
                const nameIntervention = imenaArray[i];
                const distance = haversine(lat, lon, latIntervention, lonIntervention);

                if (distance <= radius) {
                    L.marker([latIntervention, lonIntervention])
                        .addTo(map)
                        .bindPopup(nameIntervention)
                        .openPopup();
                }
            }
        });
    } else {
        console.log("Geolocation ni podprta v brskalniku.");
    }
}


function updateMapPeriodically() {
    const data = fetchData();
    const { latitude, longitude, imena } = update(data);
    addLocation(latitude, longitude, imena, 100000);

// vsako 30 sekund se mapa updejta -> to bi blo ce bi bli pravi podatki in bi prihajali konstantno
    setTimeout(updateMapPeriodically, 30000);
}


updateMapPeriodically();
