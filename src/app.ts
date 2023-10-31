import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import "./styles.css";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

function init() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  let height = window.innerHeight;
  let width = window.innerWidth;
  window.addEventListener("resize", resize);

  const scene = new THREE.Scene();

  //  Camera
  const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 1000);
  camera.position.z = 1;

  //  Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
  });
  renderer.setSize(width, height);

  //  Lights
  const directionalLight = new THREE.DirectionalLight("gray");
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  const ambientLight = new THREE.AmbientLight("gray");
  scene.add(ambientLight);

  //  Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();

  //  Resize
  function resize() {
    height = window.innerHeight;
    width = window.innerWidth;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  resize();

  //  Test Mesh
  const geometry = new THREE.PlaneGeometry(1, 1, 50, 50);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });
  const testMesh = new THREE.Points(geometry, material);
  scene.add(testMesh);

  //  Animate
  const animate = () => {
    let time = 0.05;

    requestAnimationFrame(animate);
    testMesh.material.uniforms.time.value += time;

    renderer.render(scene, camera);
  };
  animate();
}
init();
