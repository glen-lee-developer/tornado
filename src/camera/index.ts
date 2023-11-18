import * as THREE from "three";

let height = window.innerHeight;
let width = window.innerWidth;
export function createCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 2000);
  camera.position.z = 70;
  camera.position.y = 110;
  return camera;
}

// export function createCamera(): THREE.OrthographicCamera {
//   let frustumSize = height;
//   let aspect = width / height;
//   let camera = new THREE.OrthographicCamera(
//     (frustumSize * aspect) / -2,
//     (frustumSize * aspect) / 2,
//     frustumSize / 2,
//     frustumSize / -2,
//     -1000,
//     1000
//   );
//   return camera;
// }
