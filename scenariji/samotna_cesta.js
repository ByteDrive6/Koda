import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function setupEmptyRoadScene(scene) {
    console.log("Nastavljam scenarij za samotno cesto...");

    const loader = new GLTFLoader();
    const trees = []; 

    // Nalaganje ozadja (cesta)
    loader.load('./scenariji/glb_objects/ozadje.glb', function (gltf) {
        const roadModel = gltf.scene;
        roadModel.scale.set(13, 2, -1);
        roadModel.position.set(-55, -8, -400);
        roadModel.traverse(function (child) {
            if (child instanceof THREE.Mesh) {

                child.receiveShadow = true;  
            }
        });        
        scene.add(roadModel);
    }, undefined, function (error) {
        console.error('Napaka pri nalaganju modela samotne ceste:', error);
    });

    // Dodaj drevesa in travo ob cesti - to se morem malo optimizirat
    for (let i = 0; i < 10; i++) {
        loader.load('./scenariji/glb_objects/tree.glb', function (gltf) {
            const tree = gltf.scene.clone();
            tree.scale.set(14, 6, -1);
            tree.position.set(
                (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 600), 
                6,
                -i * 50 
            );
            tree.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;  
                    child.receiveShadow = true;  
                }
            });
            scene.add(tree);
            trees.push(tree); 
        }, undefined, function (error) {
            console.error('Napaka pri nalaganju drevesa:', error);
        });
        loader.load('./scenariji/glb_objects/grass.glb', function (gltf) {
            const grass = gltf.scene.clone();
            grass.scale.set(14, 6, -1);
            grass.position.set(
                (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 600), 
                -8,
                -i * 50 
            );
            grass.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;  
                    child.receiveShadow = true;  
                }
            });
            scene.add(grass);
            trees.push(grass); 
        }, undefined, function (error) {
            console.error('Napaka pri nalaganju trave:', error);
        });
    }

    // animacija dreves -  premik proti kameri
    scene.userData.animateTrees = function () {
        trees.forEach(tree => {
            tree.position.z += 0.5; 
            if (tree.position.z > 50) {
                tree.position.z = -500; 
            }
        });
    };
}
