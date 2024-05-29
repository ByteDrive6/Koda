import requests
import datetime
import time
import folium
import numpy as np
# import webbrowser

# glede na cas intervencije in trenutni cas, se bodo izpisovale intervencije, ki so najblizje 
# problem pri vecjemu obsegu? ni longitude in latitude, samo obcina -> https://spin3.sos112.si/javno/assets/data/vecjiObseg.json 

def fetch_data():
    try:
        r = requests.get('https://spin3.sos112.si/javno/assets/data/lokacija.json')

        if r.status_code == 200:
            data = r.json()
            output = data['value']
            return output
        else:
            print(f"Request failed, status code: {r.status_code}")
    except Exception as e:
        print(f"Error: {e}")
        
interval = 30  # po intervalih ti trenutno dela
now = datetime.datetime.now()
hours = datetime.datetime.now().hour
dateOnly = datetime.datetime.now().date()

map_center = [46.0, 14.5]  # slovenija
map = folium.Map(location=map_center, zoom_start=8)

def update(data):
    global map
    latitude = [] 
    longitude = []
    imena = []
    for entry in data:     
        dogodekNaziv = entry.get("dogodekNaziv")
        intervencijaVrstaNaziv = entry.get("intervencijaVrstaNaziv")
        
        if not dogodekNaziv and intervencijaVrstaNaziv: # vcasih jim zasteka in majo samo intervencijaVrstaNaziv in ti potem pise None
            dogodekNaziv = intervencijaVrstaNaziv
            
        obcinaNaziv = entry.get("obcinaNaziv")
        nastanekCas = entry.get("nastanekCas")
        wgsLat = entry.get('wgsLat')
        wgsLon = entry.get('wgsLon')
        dateTime0 = nastanekCas.split('T')[0]  # datum
        dateTime1 = nastanekCas.split('T')[1]  # cas
        hourPrijava = dateTime1.split(':')[0]  # ura
        hour2 = hours + 2

        #if dateTime0 == str("2024-05-28"): # tu mores potem samo nazaj popravit 
        if dateTime0 == str(dateOnly) and hourPrijava <= str(hour2): # SPREMENI NAAAAAZAAAAJ            
            folium.Marker(
                location=[wgsLat, wgsLon],
                popup=f"{dogodekNaziv} - {obcinaNaziv} - {nastanekCas} - {wgsLat} - {wgsLon}",
                icon=folium.Icon(color='red')
            ).add_to(map)
            print(dogodekNaziv, " ", obcinaNaziv, " ", nastanekCas)
            latitude.append(wgsLat)
            longitude.append(wgsLon)
            imena.append(dogodekNaziv)
            
    latitude_array = np.array(latitude)
    longitude_array = np.array(longitude)
    imena_array = np.array(imena)
    
    print(latitude_array)
    print(longitude_array)
    print(imena_array)
    
    return latitude_array, longitude_array, imena_array

def add_location(m, latitude_array, longitude_array, imena_array, radius=100000):
    mapJsVar = m.get_name()
    js_script = f"""
        <script>
            var latitude_array = {list(latitude_array)};
            var longitude_array = {list(longitude_array)};
            var imena_array = {list(imena_array)};
            var radius = {radius};
            var mapJsVar = "{mapJsVar}";  

            function haversine(lat1, lon1, lat2, lon2) {{
                var R = 6371e3;  // Earth radius in meters
                var phi1 = lat1 * Math.PI / 180;
                var phi2 = lat2 * Math.PI / 180;
                var deltaPhi = (lat2 - lat1) * Math.PI / 180;
                var deltaLambda = (lon2 - lon1) * Math.PI / 180;
                
                var a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                        Math.cos(phi1) * Math.cos(phi2) *
                        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                
                var d = R * c;  // Distance in meters
                return d;
            }}

            function showPosition(position) {{
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                var text = "Latitude: " + lat + ", Longitude: " + lon;
                console.log("Latitude: " + lat + ", Longitude: " + lon);

                console.log("Latitude array:", latitude_array);
                console.log("Longitude array:", longitude_array);

                L.marker([lat, lon]).addTo({mapJsVar}).bindPopup("Your current location").openPopup();
                L.circle([lat, lon], {{radius: radius}}).addTo({mapJsVar});

                for (var i = 0; i < latitude_array.length; i++) {{
                    var latIntervention = latitude_array[i];
                    var lonIntervention = longitude_array[i];
                    var nameIntervention = imena_array[i];
                    var distance = haversine(lat, lon, latIntervention, lonIntervention);
                    
                    if (distance <= radius) {{
                        console.log("Intervention within radius: Latitude=" + latIntervention + ", Longitude=" + lonIntervention);
                        L.marker([latIntervention, lonIntervention]).addTo({mapJsVar}).bindPopup(nameIntervention).openPopup();
                    }}
                }}
            }}

            if (navigator.geolocation) {{
                navigator.geolocation.getCurrentPosition(showPosition);
            }} else {{
                console.log("Geolocation is not supported by this browser.");
            }}
        </script>
    """
    js_script = js_script.replace('MAP_JS_VAR', mapJsVar)
    m.get_root().html.add_child(folium.Element(js_script))
    return m


while True:
    data = fetch_data() 
    if data:
        latitude_array, longitude_array, imena_array = update(data)
        add_location(map, latitude_array, longitude_array, imena_array, radius=100000)

        map.save("intervencije.html")

        html_file_path = "intervencije.html"
        with open(html_file_path, 'r', encoding='utf-8') as file:
            html_content = file.read()
            modified_html_content = html_content.replace('<head>', '<head><title>Map</title>')

        with open(html_file_path, 'w', encoding='utf-8') as file:
            file.write(modified_html_content)
            
    time.sleep(interval)
    print("NOVO NOVO NOVO NOVO NOVO")
    # webbrowser.open_new_tab('intervencije.html')  # zdaj se ti bo vsakic znova odprlo, mogoce boljse interval nastavit na vecji
    
    

