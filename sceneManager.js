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
export function loadVehicleModel(vehicleType, scene) {
    const vehiclePaths = {
        resevalec: 'resevalnoVozilo.glb',
        gasilci: 'gasilskiAvto.glb',
        policija: 'policijskiAvto.glb',
    };

    // Pot do datoteke
    const modelPath = vehiclePaths[vehicleType];
    if (!modelPath) {
        console.error("Neznano vozilo:", vehicleType);
        return;
    }

    if (scene.userData.currentVehicleModel) {
        scene.remove(scene.userData.currentVehicleModel);
        scene.userData.currentVehicleModel = null;
    }

    // Nov model
    const loader = new GLTFLoader();
    loader.load(modelPath, function (gltf) {
        const vehicleModel = gltf.scene;
        vehicleModel.scale.set(1, 1, 1);
        vehicleModel.position.set(0, 0, 0);
        scene.add(vehicleModel);

        // Shranimo model, da ga lahko odstranimo kasneje
        scene.userData.currentVehicleModel = vehicleModel;

        console.log(`Model za ${vehicleType} uspešno naložen.`);
    }, undefined, function (error) {
        console.error("Napaka pri nalaganju modela vozila:", error);
    });
}
