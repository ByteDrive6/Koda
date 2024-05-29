import requests
import datetime
import time
import folium
# import webbrowser

# glede na cas intervencije in trenutni cas, se bodo izpisovale intervencije, ki so najblizje 
# problem pri vecjemu obsegu? ni longitude in latitude, samo obcina -> https://spin3.sos112.si/javno/assets/data/vecjiObseg.json 
# vcasih jim zasteka ime 
#https://www.gps-coordinates.net/

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
python_variable = "halo?"

def update(data):
    global map
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

        if dateTime0 == str(dateOnly): # SPREMENI NAAAAAZAAAAJ
            folium.Marker(
                location=[wgsLat, wgsLon],
                popup=f"{dogodekNaziv} - {obcinaNaziv} - {nastanekCas}",
                icon=folium.Icon(color='red')
            ).add_to(map)
            print(dogodekNaziv, " ", obcinaNaziv, " ", nastanekCas)

def add_location(m, python_variable):
    mapJsVar = m.get_name()
    python_var_js = f"{python_variable}"  
    js_script = f"""
        <script>
            var python_var_js = "{python_var_js}";  // Define python_var_js in JavaScript scope

            function showPosition(position) {{
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                var text = "Latitude: " + lat + ", Longitude: " + lon;
                console.log("Latitude: " + lat + ", Longitude: " + lon);
                console.log(python_var_js);  // Log python_variable to console
                window.alert(text);  // Display alert with text
                L.marker([lat, lon]).addTo({mapJsVar}).bindPopup("Your current location: " + python_var_js).openPopup();
                L.circle([lat, lon], {{radius: 100000}}).addTo({mapJsVar}); // Add circle to map
            }}

            if (navigator.geolocation) {{
                navigator.geolocation.getCurrentPosition(showPosition);
            }} else {{
                console.log("Geolocation is not supported by this browser.");
            }}
        </script>
    """
    m.get_root().html.add_child(folium.Element(js_script))
    return m


while True:
    data = fetch_data()  
    if data:
        update(data)
        add_location(map, python_variable)  

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
    
    


'''import requests
import datetime
import time
import folium
# import webbrowser

# glede na cas intervencije in trenutni cas, se bodo izpisovale intervencije, ki so najblizje 
# problem pri vecjemu obsegu? ni longitude in latitude, samo obcina -> https://spin3.sos112.si/javno/assets/data/vecjiObseg.json 
# vcasih jim zasteka ime 
#https://www.gps-coordinates.net/

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

        if (str(hours - 2) <= hourPrijava <= str(hours + 2)) and dateTime0 == str(dateOnly):
            folium.Marker(
                location=[wgsLat, wgsLon],
                popup=f"{dogodekNaziv} - {obcinaNaziv} - {nastanekCas}",
                icon=folium.Icon(color='red')
            ).add_to(map)
            print(dogodekNaziv, " ", obcinaNaziv, " ", nastanekCas)

def add_location(m):
    mapJsVar = m.get_name()
    m.get_root().html.add_child(folium.Element("""
        <script>
            function showPosition(position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                var text = "Latitude: " + lat + ", Longitude: " + lon;
                console.log("Latitude: " + lat + ", Longitude: " + lon);
                window.alert(text)
                L.marker([lat, lon]).addTo({map}).bindPopup("Tvoja trenutna lokacija!").openPopup();
                L.circle([lat, lon], {{100000}}).addTo({map}); // vredu radius je 10000                
            }
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        </script>
    """.replace("{map}", mapJsVar)))
    m

while True:
    data = fetch_data()  
    if data:
        update(data)
        add_location(map)  

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
   
'''
    

