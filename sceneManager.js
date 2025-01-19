import * as THREE from 'three';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {  outputTime } from './audioManager.js';

// Funkcija za nastavitev scenarija
export async function loadScenario(scenario, scene) {
    try {
        console.log(`Nalagam scenarij: ${scenario}`);
        switch (scenario) {
            case "avtocesta":
                const { setupHighwayScene } = await import('./scenariji/avtocesta.js');
                setupHighwayScene(scene);
                break;
            case "prazna":
                const { setupEmptyRoadScene } = await import('./scenariji/samotna_cesta.js');
                setupEmptyRoadScene(scene);
                break;
            case "mesto":
                const { setupCityScene } = await import('./scenariji/mesto.js');
                setupCityScene(scene);
                break;
            default:
                console.error("Neznan scenarij!");
        }
    } catch (error) {
        console.error("Napaka pri nalaganju scenarija:", error);
    }
}


export async function loadVehicleModel(vehicleType, scene, direction, mixer) {
    let defaultTime = 0;

    // Pridobi začetni čas sirene (asinhrono)
    const timeResult = await outputTime(defaultTime);
    console.log(`Začetni čas iz sceneManager: ${timeResult.startTime}`);
    

    const vehiclePaths = {
        resevalec: './scenariji/glb_objects/resevalnoVozilo.glb',
        gasilci: './scenariji/glb_objects/gasilskiAvto.glb',
        policija: './scenariji/glb_objects/policijskiAvto.glb',
    };

    const vehicleScales = { // Skale za posamezna vozila
        resevalec: { x: 1, y: 1, z: 1 },
        gasilci: { x: 1, y: 1, z: 1 },
        policija: { x: 1, y: 1, z: 1 },
    };

    const directionPositions = { // generira pozicije
        levo: { x: -50, y: 0, z: 0, rotationY: Math.PI / 2 },
        desno: { x: 50, y: 0, z: 0, rotationY: -Math.PI / 2 },
        spredaj: { x: -10, y: 0, z: -50, rotationY: 0 },
        zadaj: { x: -10, y: 0, z: 50, rotationY: Math.PI },
    };


    const modelPath = vehiclePaths[vehicleType];
    const position = directionPositions[direction];
    const scale = vehicleScales[vehicleType] || { x: 1, y: 1, z: 1 };

    if (!modelPath || !position) {
        console.error("Napaka: Neznano vozilo ali smer.");
        return;
    }

    if (scene.userData.currentVehicleModel) {
        scene.remove(scene.userData.currentVehicleModel);
        scene.userData.currentVehicleModel = null;
    }

    const loader = new GLTFLoader();
    loader.load(modelPath, function (gltf) {
        const vehicleModel = gltf.scene;
        vehicleModel.scale.set(scale.x, scale.y, scale.z);
        vehicleModel.position.set(position.x, position.y, position.z);
        vehicleModel.rotation.y = position.rotationY;

        vehicleModel.rotation.y = position.rotationY;

        // gasilsko vozilo sem samo mogla za 180 obrnit ker se mi je nalagalo v drugo smer
        if (vehicleType === "gasilci") {
            vehicleModel.rotation.y += Math.PI;
        }

        vehicleModel.traverse(function (child) {
            if (child.isMesh && child.name === "Lucka") {
                child.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
            }
        });


        scene.add(vehicleModel);

        // Set up animation mixer for vehicle
        mixer = new THREE.AnimationMixer(vehicleModel);
        const clips = gltf.animations;
        clips.forEach(function (clip) {
            const action = mixer.clipAction(clip);
            action.play();
        });

        scene.userData.currentVehicleModel = vehicleModel;

        console.log(`Model za ${vehicleType} iz smeri ${direction} uspešno naložen.`);
    }, undefined, function (error) {
        console.error("Napaka pri nalaganju modela vozila:", error);
    });
}
