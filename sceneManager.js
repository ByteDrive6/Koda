import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';

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

// Funkcija za nalaganje modela vozila
export function loadVehicleModel(vehicleType, scene, direction) {
    const vehiclePaths = {
        resevalec: 'resevalnoVozilo.glb',
        gasilci: 'gasilskiAvto.glb',
        policija: 'policijskiAvto.glb',
    };

    const directionPositions = { // generira pozicije
        levo: { x: -50, y: 0, z: 0, rotationY: Math.PI / 2 }, 
        desno: { x: 50, y: 0, z: 0, rotationY: -Math.PI / 2 }, 
        spredaj: { x: 0, y: 0, z: -50, rotationY: 0 }, 
        zadaj: { x: 0, y: 0, z: 50, rotationY: Math.PI },
    };
    

    const modelPath = vehiclePaths[vehicleType];
    const position = directionPositions[direction];

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
        vehicleModel.scale.set(1, 1, 1);
        vehicleModel.position.set(position.x, position.y, position.z);
        vehicleModel.rotation.y = position.rotationY;

        scene.add(vehicleModel);

        scene.userData.currentVehicleModel = vehicleModel;

        console.log(`Model za ${vehicleType} iz smeri ${direction} uspešno naložen.`);
    }, undefined, function (error) {
        console.error("Napaka pri nalaganju modela vozila:", error);
    });
}

