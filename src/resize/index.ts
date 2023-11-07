import * as THREE from "three";

export function setupResize(
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
): void {
  function resize(): void {
    const height = window.innerHeight;
    const width = window.innerWidth;
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = width / height;
    }

    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener("resize", resize);
  resize();
}
