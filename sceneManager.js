import * as THREE from 'three';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { outputTime } from './audioManager.js';

// Lahko si ustvariš univerzalno funkcijo za zamik.
// Vzame število milisekund in vrne Promise, ki se izpolni po tem času.
export function myDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


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



const texture = new THREE.TextureLoader().load(
    '/scenariji/klicaj.png'
)

export async function loadVehicleModel(vehicleType, scene, direction, mixer, dezEnabled, osebniAvtomobil, modelPlosca) {
    let defaultTime = 0;

    // Pridobi začetni čas sirene (asinhrono)
    const timeResult = await outputTime(defaultTime);
    console.log(`Začetni čas iz sceneManager: ${timeResult.startTime}`);

    await myDelay(timeResult.startTime * 1350); // 3,5 sekundi vec

    const vehiclePaths = {
        resevalec: './scenariji/glb_objects/resevalnoVozilo.glb',
        gasilci: './scenariji/glb_objects/gasilskiAvto.glb',
        policija: './scenariji/glb_objects/policijskiAvto.glb',
    };

    const vehicleScales = { // Skale za posamezna vozila
        resevalec: { x: 3, y: 2, z: 3 },
        gasilci: { x: 3, y: 2, z: 3 },
        policija: { x: 3, y: 2, z: 3 },
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

    const loadModelPlosca = new Promise((resolve, reject) => {
        loader.load('./scenariji/glb_objects/armaturna_plosca.glb', function (gltf) {
            modelPlosca = gltf.scene;
            modelPlosca.scale.set(19, 9, 9);
            modelPlosca.position.set(-1.9, -1.0, 0.3);
            modelPlosca.renderOrder = 1;
            scene.add(modelPlosca);
            resolve(modelPlosca);
        }, undefined, function (error) {
            console.error(error);
            reject(error); 
        });
    });

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

        mixer = new THREE.AnimationMixer(vehicleModel);
        const clips = gltf.animations;
        clips.forEach(function (clip) {
            const action = mixer.clipAction(clip);
            action.play();
        });

        if (modelPlosca) {
            console.log("uspesno")
        }
        else {
            console.log("neuspesno")
        }

        scene.userData.currentVehicleModel = vehicleModel;

        console.log(`Model za ${vehicleType} iz smeri ${direction} uspešno naložen.`);
    }, undefined, function (error) {
        console.error("Napaka pri nalaganju modela vozila:", error);
    });

    await loadModelPlosca;

    await myDelay(timeResult.startTime * 1000);

    if (modelPlosca) {
        modelPlosca.traverse(function (child) {
            if (child.isMesh && child.name === 'Cube') { // kadar se najde ta mesh se doda tekstura klicaja
                child.material.map = texture;
                child.material.needsUpdate = true;
            }
        });
    } else {
        console.log('modelPlosca ni');
    }

}
