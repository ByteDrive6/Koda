import * as THREE from 'three';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { outputTime } from './audioManager.js';

export function myDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Funkcija za nastavitev scenarija
export async function loadScenario(scenario, scene) {
    try {
        console.log(`Nalagam scenarij: ${scenario}`);
        scene.userData.currentScenario = scenario;

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


export async function loadVehicleModel(vehicleType, scene, direction, mixer, dezEnabled) {
    let defaultTime = 0;
    const timeResult = await outputTime(defaultTime);
    console.log(`Začetni čas iz sceneManager: ${timeResult.startTime}`);

    await myDelay(timeResult.startTime * 1000);

    const currentScenario = scene.userData.currentScenario; 
    console.log("Trenutni scenarij:", currentScenario);

    let modelPlosca = null;

    const vehiclePaths = {
        resevalec: './scenariji/glb_objects/resevalniAvto.glb',
        gasilci:   './scenariji/glb_objects/gasilskiAvto.glb',
        policija:  './scenariji/glb_objects/policijskiAvto.glb',
    };
    const modelPath = vehiclePaths[vehicleType];
    if (!modelPath) {
        console.error("Napaka: Neznano vozilo!");
        return;
    }

    //  obstaja vozilo, ga odstrani
    if (scene.userData.currentVehicleModel) {
        scene.remove(scene.userData.currentVehicleModel);
        scene.userData.currentVehicleModel = null;
    }

    const normalScales = {
        resevalec: { x: 5, y: 3, z: 5 },
        gasilci:   { x: 12, y: 6, z: 12 },
        policija:  { x: 18, y: 11, z: 18 },
    };

    // MESTNE skale (če je scenarij = "mesto")
    const cityScales = {
        resevalec: { x: 5, y: 3, z: 5 },
        gasilci:   { x: 12, y: 6, z: 12 },
        policija:  { x: 18, y: 11, z: 18 },
    };

    let directionPositions = {
        levo:    { x: -1500, y: -8, z: 0,     rotationY: Math.PI / 2 },
        desno:   { x:  1500, y: -8, z: 0,     rotationY: -Math.PI / 2 },
        spredaj: { x: -40, y: -8, z: -1000,  rotationY: 0 },
        zadaj:   { x: -40, y: -8, z:  700,   rotationY: Math.PI },
    };

    let finalScale;

    // scenarij ni "mesto", uporabimo normalScales
    if (currentScenario !== "mesto") {
        finalScale = normalScales[vehicleType] || { x: 1, y: 1, z: 1 };

    } else {
        // SCENARIJ = "mesto"
        let cityScale = cityScales[vehicleType] || { x: 1, y: 1, z: 1 };

        // Če je levo/desno, dodatno povečaj 1.5×
        if (direction === "levo" || direction === "desno") {
            cityScale.x *= 1.5;
            cityScale.y *= 1.5;
            cityScale.z *= 1.5;
        }

        finalScale = cityScale;

        let seconds = timeResult.startTime;
        let frames = 600;//seconds * 20; 
        let speed = 1;
        let koorZ = -frames;

        if (direction === "levo") {
            directionPositions.levo.z = koorZ;
        } else if (direction === "desno") {
            directionPositions.desno.z = koorZ;
        }

        console.log("nalagam mesto, finalScale =", finalScale, "koorZ =", koorZ);
    }

    // 11) Iz `directionPositions` poberi pozicijo glede na "direction"
    const position = directionPositions[direction];
    if (!position) {
        console.error("Napaka: Neznan direction!");
        return;
    }

    // 12) Naloži model (asinhrono)
    let vehicleModel;
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

    loader.load(
        modelPath,
        function(gltf) {
            // Ko je model naložen
            vehicleModel = gltf.scene;

            // Nastavi scale
            vehicleModel.scale.set(finalScale.x, finalScale.y, finalScale.z);

            // Nastavi pozicijo in osnovno rotacijo
            vehicleModel.position.set(position.x, position.y, position.z);
            vehicleModel.rotation.y = position.rotationY;

            // Dodatna rotacija za določene tipe vozil
            if (vehicleType === "gasilci") {
                vehicleModel.rotation.y += Math.PI; // 180°
            }
            else if (vehicleType === "resevalec") {
                vehicleModel.rotation.y -= Math.PI / 2; // -90°
            }

            // Lucka
            vehicleModel.traverse((child) => {
                if (child.isMesh && child.name === "Lucka") {
                    child.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
                }
            });

            vehicleModel.traverse(function (child) {
                if (child.isMesh && child.name === "Lucka") {
                    child.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
                }
            });

            scene.add(vehicleModel);

            mixer = new THREE.AnimationMixer(vehicleModel);
            const clips = gltf.animations;
            clips.forEach((clip) => {
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

            scene.userData.currentVehicleModel = vehicleModel;
            console.log(`Model za ${vehicleType} iz smeri ${direction} uspešno naložen.`);
        },
        undefined,
        function(error) {
            console.error("Napaka pri nalaganju modela vozila:", error);
        }
    );

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
