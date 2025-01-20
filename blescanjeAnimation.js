import * as THREE from './node_modules/three';

import Stats from './node_modules/three/examples/jsm/libs/stats.module.js';

import { FlyControls } from './node_modules/three/examples/jsm/controls/FlyControls.js';
import { Lensflare, LensflareElement } from './node_modules/three/examples/jsm/objects/Lensflare.js';
import { DirectionalLight } from './node_modules/three/src/lights/DirectionalLight.js';
import { Sky } from './node_modules/three/examples/jsm/objects/Sky.js';

export function addSunlight(scene, selectedScenario) {
    const textureLoader = new THREE.TextureLoader();

    const textureFlare0 = textureLoader.load('textures/lensflare/lensflare0.png');
    const textureFlare3 = textureLoader.load('textures/lensflare/lensflare3.png');

    // Dodaj DirectionalLight (sonce - od desne proti levi)
    addDirectionalLight(scene, 0.08, 0.8, 0.5, 2000, 0, -1000, selectedScenario); 
    
    function addDirectionalLight(scene, h, s, l, x, y, z, selectedScenario) {
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.5, 2000, 0);
        sunLight.color.setHSL(h, s, l);
        sunLight.position.set(x, y, z); 
        sunLight.target.position.set(0, 0, 0); 
        scene.add(sunLight);

        const planeGeometry = new THREE.PlaneGeometry(5000, 5000);
        const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = - Math.PI / 2;
        plane.position.set(0, -5, 0);
        plane.receiveShadow = true;
        scene.add(plane);

        sunLight.castShadow = true; // Omogoči, da svetloba ustvarja sence

        // Animacija dreves za samotno cesto
        if (selectedScenario === "avtocesta") {
            sunLight.shadow.camera.far = 1500;
        }
        else if (selectedScenario === "mesto"){
            sunLight.shadow.camera.far = 5000;
        }
        else if (selectedScenario === "prazna") {
            sunLight.shadow.camera.far = 2000;   
        }

        sunLight.shadow.mapSize.width = 4096;  // Velikost senčne mape
        sunLight.shadow.mapSize.height = 4096;
        sunLight.shadow.camera.near = 0.5;

        sunLight.shadow.camera.left = -2500;
        sunLight.shadow.camera.right = 2500;
        sunLight.shadow.camera.top = 2500;
        sunLight.shadow.camera.bottom = -2500;

        
        const lensflare = new Lensflare();
        lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, sunLight.color));
        lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
        lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
        lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
        lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
        sunLight.add(lensflare);
    }

}

// Da je malo bolj svetlo
export function addLight(scene) {
    const sunLight = new THREE.DirectionalLight(0xffffff, 1); 
    sunLight.position.set(-100, 200, 100); 
    sunLight.target.position.set(0, 0, 0);
    scene.add(sunLight);
    scene.add(sunLight.target);

    // Nastavi sence
    sunLight.castShadow = true; // Omogoči sence
    sunLight.shadow.mapSize.width = 2048; // Velikost senčne mape (višja = bolj kakovostna senca)
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5; // Nastavi vidno polje senčne kamere
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -200; // Omejitev senčne kamere (na levo)
    sunLight.shadow.camera.right = 200; // Omejitev senčne kamere (na desno)
    sunLight.shadow.camera.top = 200; // Omejitev senčne kamere (zgoraj)
    sunLight.shadow.camera.bottom = -200; // Omejitev senčne kamere (spodaj)

    // Vizualizacija kamere sence (opcijsko za debugging)
    // const helper = new THREE.CameraHelper(sunLight.shadow.camera);
    // scene.add(helper);
}

