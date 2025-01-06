import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function setupCityScene(scene) {
    console.log("Nastavljam scenarij za mesto...");

    const loader = new GLTFLoader();
    const intersections = [];
    const buildings = []; 

    // Nalaganje ozadja (stalna cesta)
    loader.load('ozadje.glb', function (gltf) {
        const roadModel = gltf.scene;
        roadModel.scale.set(13, 2, -1);
        roadModel.position.set(-55, -8, -400);
        scene.add(roadModel);
    }, undefined, function (error) {
        console.error('Napaka pri nalaganju modela ceste:', error);
    });

    // Funkcija za generiranje zgradb
    function createBuilding(positionX, positionZ) {
        const randomBuildingIndex = String(Math.floor(Math.random() * 20) + 1).padStart(2, '0'); // Naključno število od 01 do 20
        const buildingPath = `scenariji/buildings/building_${randomBuildingIndex}.glb`;
    
        loader.load(buildingPath, function (gltf) {
            const building = gltf.scene.clone();
            building.scale.set(0.6, 0.6, 0.6); 
            building.position.set(positionX, -10, positionZ); 
            scene.add(building);
            buildings.push(building); 
        }, undefined, function (error) {
            console.error(`Napaka pri nalaganju zgradbe ${buildingPath}:`, error);
        });
    }
    


    function createIntersectionWithBuildings(positionZ) {
        // krizisca
        loader.load('krizisce.glb', function (gltf) {
            const intersection = gltf.scene.clone();
            intersection.scale.set(30, 2, 10);
            intersection.position.set(-55, -8, positionZ);
            scene.add(intersection);
            intersections.push(intersection);
        }, undefined, function (error) {
            console.error('Napaka pri nalaganju modela križišča:', error);
        });

        // zgradbe
        createBuilding(-350, positionZ - 100); // Levo od ceste
        createBuilding(250, positionZ - 100);  // Desno od ceste
        createBuilding(-350, positionZ + 100); // Levo naprej od ceste
        createBuilding(250, positionZ + 100);  // Desno naprej od ceste
    }

    const numIntersections = 6;
    for (let i = 1; i <= numIntersections; i++) {
        const positionZ = -100 - i * 200; 
        createIntersectionWithBuildings(positionZ);
    }

    // Funkcija za animacijo krizisc in zgradb
    scene.userData.animateCity = function () {
        intersections.forEach(intersection => {
            intersection.position.z += 1.0;
            if (intersection.position.z > 50) {
                intersection.position.z = -1500;
            }
        });

        buildings.forEach(building => {
            building.position.z += 1.0;
            if (building.position.z > 50) {
                building.position.z = -1500;
            }
        });
    };
}
