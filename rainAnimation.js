import * as THREE from './node_modules/three';

// Spremenljivke za dež
let rainParticles = [];
let rainGeometry, rainMaterial, rain, windshield;

export function createRain(scene, osebniAvtomobil) {

  rainGeometry = new THREE.BufferGeometry();
    let vertices = [];
    let numRaindrops = 5000;
    for (let i = 0; i < numRaindrops; i++) {
      let x = Math.random() * 200 - 100; 
      let y = Math.random() * 10;       
      let z = Math.random() * 200 - 100; 

      // Preveri, ali kapljica pade na vetrobransko steklo 
      if (osebniAvtomobil && osebniAvtomobil.children[28]) {
          let windshield = osebniAvtomobil.children[28];
          const windshieldBoundingBox = new THREE.Box3().setFromObject(windshield);

          const raindropPosition = new THREE.Vector3(x, y, z);
          windshield.worldToLocal(raindropPosition);

          if (windshieldBoundingBox.containsPoint(raindropPosition)) {
              // Kapljica pade na vetrobransko steklo, zato jo ignoriraj
              continue;
          }
          else {
            vertices.push(x, y, z);
          }
      }
  }

    rainMaterial = new THREE.PointsMaterial({
        color: 0x0000ff,
        size: 0.1,
        transparent: true,
        opacity: 0.7
    });

    rainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    rain = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rain);

    // Preveri, če je vozilo že naloženo in nastavi vetrobransko steklo
    if (osebniAvtomobil && osebniAvtomobil.children[28]) {
      windshield = osebniAvtomobil.children[28]; // Uporabi 28. otrok kot vetrobransko steklo
      console.log("Vetrobransko steklo: ", windshield);
    } else {
        console.error("Vetrobranskega stekla ni mogoče najti.");
    }
}

// Animacija kapljic dežja
export function animateRain() {
    rainGeometry.attributes.position.array.forEach((value, index) => {
        if (index % 3 === 1) {
            rainGeometry.attributes.position.array[index] -= 0.5; // Premik kapljic navzdol
            if (value < -50) {
                rainGeometry.attributes.position.array[index] = Math.random() * 100; // Ponovno na vrh
            }
        }
    });

    // Preverjanje trkov kapljic z vetrobranskim steklom
    checkRainCollision();

    rainGeometry.attributes.position.needsUpdate = true;
}

export function checkRainCollision() {
    if (!windshield) return;

    let raycaster = new THREE.Raycaster();
    let intersects = raycaster.intersectObject(windshield);

    if (intersects.length > 0) {
        console.log("Kapljica trči z vetrobranskim steklom");
    }
}
