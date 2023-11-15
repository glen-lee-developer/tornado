import * as THREE from "three";
import { createCamera } from "./camera";
import { addLights } from "./lights";
import { setupControls } from "./controls";
import { setupResize } from "./resize";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

function init(): void {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const scene = new THREE.Scene();
  const camera = createCamera();
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

  addLights(scene);
  const controls = setupControls(camera, renderer);
  setupResize(camera, renderer);

  //  Test Mesh

  const geometry = new THREE.PlaneGeometry(1, 1, 50, 50);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader,
    fragmentShader,
  });
  const myMesh = new THREE.Mesh(geometry, material);
  scene.add(myMesh);

  //  Animate
  function animateFrame(): void {
    requestAnimationFrame(animateFrame);
    (myMesh.material as THREE.ShaderMaterial).uniforms.time.value += 0.01;
    renderer.render(scene, camera);
  }
  animateFrame();
}
init();
