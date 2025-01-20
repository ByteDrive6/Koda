import * as THREE from './node_modules/three';

import Stats from './node_modules/three/examples/jsm/libs/stats.module.js';

import { FlyControls } from './node_modules/three/examples/jsm/controls/FlyControls.js';
import { Lensflare, LensflareElement } from './node_modules/three/examples/jsm/objects/Lensflare.js';
import { DirectionalLight } from './node_modules/three/src/lights/DirectionalLight.js';


export function addSunlight(scene) {
    const textureLoader = new THREE.TextureLoader();

    const textureFlare0 = textureLoader.load('textures/lensflare/lensflare0.png');
    const textureFlare3 = textureLoader.load('textures/lensflare/lensflare3.png');

    // Dodaj DirectionalLight (sonce - od desne proti levi)
    addDirectionalLight(scene, 0.08, 0.8, 0.5, 2000, 0, -1000); 
    
    function addDirectionalLight(scene, h, s, l, x, y, z) {
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

        sunLight.shadow.mapSize.width = 2048;  // Velikost senčne mape
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 5000;
        sunLight.shadow.camera.left = -2000;
        sunLight.shadow.camera.right = 2000;
        sunLight.shadow.camera.top = 2000;
        sunLight.shadow.camera.bottom = -2000;

        
        const lensflare = new Lensflare();
        lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, sunLight.color));
        lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
        lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
        lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
        lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
        sunLight.add(lensflare);
    }

}
