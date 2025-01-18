import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';

export function setupControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 50;
    controls.target.set(0, 0, 0);
    controls.update();
    return controls;
}
