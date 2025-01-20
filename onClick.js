import * as THREE from './node_modules/three';
export function onMouseClick(event, container, raycaster, camera, modelPlosca, selectedVehicle, selectedDirection) {
    const rect = container.getBoundingClientRect(); // da se bo samo container gledal

    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    if (modelPlosca) {
        const intersects = raycaster.intersectObject(modelPlosca, true);

        if (intersects.length > 0) {
            console.log("Clicked object:", intersects[0].object.name);

            if (intersects[0].object.name === 'Cube') {
                console.log("Pravi zaslon");
                if (selectedVehicle === "gasilci" && selectedDirection === 'spredaj' || selectedVehicle === "gasilci" && selectedDirection === 'zadaj') {
                    window.open(
                        "gasilci.html",
                        "POZOR",
                        "width=600,height=600,resizable=no,scrollbars=no"
                    );
                } 
                else if (selectedVehicle === "gasilci" && selectedDirection === 'levo' || selectedVehicle === "gasilci" && selectedDirection === 'desno') {
                    var popupWindow = window.open(
                        "", 
                        "POZOR", 
                        "width=600,height=600,resizable=no,scrollbars=no"
                    );

                    var message = '';
                    if (selectedDirection === 'levo') {
                        message = 'UMAKNITE SE NA DESNO!';
                    } else if (selectedDirection === 'desno') {
                        message = 'UMAKNITE SE NA LEVO!';
                    }
                    popupWindow.document.write(`
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="utf-8">
                            <title>POZOR GASILSKO VOZILO!!!!</title>
                            <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
                            <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
                            <script src="spin.js" defer></script>
                            <style>
                                body {
                                    margin: 0;
                                    padding: 0;
                                    justify-content: center;
                                    align-items: center;
                                    height: 100vh;
                                    background: linear-gradient(135deg, #ff4d4d, #ff9999);
                                    font-family: 'Arial', sans-serif;
                                    color: #ffffff;
                                    text-align: center;
                                }
                                h1 {
                                    font-size: 3rem;
                                    font-weight: bold;
                                    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
                                    animation: pulse 1.5s infinite;
                                }
                                @keyframes pulse {
                                    0%, 100% {
                                        transform: scale(1);
                                        color: #ffffff;
                                    }
                                    50% {
                                        transform: scale(1.1);
                                        color: #ffe6e6;
                                    }
                                }
                            </style>
                        </head>
                        <body>
                            <div id="map" style="height: 400px;"></div>
                            <h1>${message}</h1>
                        </body>
                        </html>
                    `);
                
                    popupWindow.document.close(); 
                }             
                else if (selectedVehicle === 'resevalec' && selectedDirection === 'spredaj' || selectedVehicle === "resevalec" && selectedDirection === 'zadaj') {
                    window.open(
                        "resevalec.html",
                        "POZOR",
                        "width=500,height=500,resizable=no,scrollbars=no"
                    );
                }
                else if (selectedVehicle === 'policija' && selectedDirection === 'spredaj' || selectedVehicle === "policija" && selectedDirection === 'zadaj') {
                    window.open(
                        "policija.html",
                        "POZOR",
                        "width=500,height=500,resizable=no,scrollbars=no"
                    );
                }
                else if (selectedVehicle === "gasilci" && selectedDirection === 'levo' || selectedVehicle === "gasilci" && selectedDirection === 'levo') {
                    var popupWindow = window.open(
                        "gasilci.html",
                        "POZOR",
                        "width=700,height=600,resizable=no,scrollbars=no"
                    );

                    popupWindow.onload = function () {
                        popupWindow.document.body.innerHTML = "<h1>Halo</h1>";
                    };
                }
                else if (selectedVehicle === "resevalec" && selectedDirection === 'levo' || selectedVehicle === "resevalec" && selectedDirection === 'desno') {
                    var popupWindow = window.open(
                        "resevalec.html",
                        "POZOR",
                        "width=700,height=600,resizable=no,scrollbars=no"
                    );

                    popupWindow.onload = function () {
                        if (selectedDirection === 'levo') {
                            popupWindow.document.body.innerHTML = "<h1>UMAKNITE SE NA DESNO!</h1>";
                        }
                        else {
                            popupWindow.document.body.innerHTML = "<h1>UMAKNITE SE NA LEVO!</h1>";
                        }

                    };
                }
                else if (selectedVehicle === "policija" && selectedDirection === 'levo' || selectedVehicle === "policija" && selectedDirection === 'desno') {
                    var popupWindow = window.open(
                        "policija.html",
                        "POZOR",
                        "width=700,height=600,resizable=no,scrollbars=no"
                    );

                    popupWindow.onload = function () {
                        if (selectedDirection === 'levo') {
                            popupWindow.document.body.innerHTML = "<h1>UMAKNITE SE NA DESNO!</h1>";
                        }
                        else {
                            popupWindow.document.body.innerHTML = "<h1>UMAKNITE SE NA LEVO!</h1>";
                        }

                    };
                }

            }
        } else {
            console.log("Ni intersekcij.");
        }
    }
}

//window.addEventListener('click', onMouseClick);
