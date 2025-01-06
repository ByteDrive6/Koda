import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function setupHighwayScene(scene) {
    console.log("Nastavljam scenarij za avtocesto...");

    const loader = new GLTFLoader();
    const fences = []; 

    // Nalaganje ozadja za avtocesto
    loader.load('ozadje_avtocesta.glb', function (gltf) {
        const highwayBackground = gltf.scene;
        highwayBackground.scale.set(13, 2, -1); 
        highwayBackground.position.set(-450, -10, -400); 
        scene.add(highwayBackground);
    }, undefined, function (error) {
        console.error('Napaka pri nalaganju ozadja avtoceste:', error);
    });

    // Funkcija za generiranje ograj
    function createFence(positionX, positionZ) {
        loader.load('ograja.glb', function (gltf) {
            const fence = gltf.scene.clone();
            fence.scale.set(40, 6, 8); 
            fence.position.set(positionX, -8, positionZ); 
            scene.add(fence);
            fences.push(fence); 
        }, undefined, function (error) {
            console.error('Napaka pri nalaganju ograje:', error);
        });
    }

    // st ograj
    const numFences = 30; 
    const fenceLength = 100; 
    for (let i = 0; i < numFences; i++) {
        const positionZ = -100 - i * fenceLength; 
        createFence(-400, positionZ); // Leva stran
        createFence(-50, positionZ);  // Desna stran
    }

    // Funkcija za animacijo ograj
    scene.userData.animateHighway = function () {
        fences.forEach(fence => {
            fence.position.z += 1.0; 
            if (fence.position.z > 50) {
                fence.position.z = -2000 - (fences.length * fenceLength); 
            }
        });
    };
}
