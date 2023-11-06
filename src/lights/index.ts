import * as THREE from "three";

export function addLights(scene: THREE.Scene): void {
  const directionalLight = new THREE.DirectionalLight("gray");
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  const ambientLight = new THREE.AmbientLight("gray");
  scene.add(ambientLight);
}
