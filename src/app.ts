import * as THREE from "three";
import GUI from "lil-gui";
import { createCamera } from "./camera";
import { addLights } from "./lights";
import { setupControls } from "./controls";
import { setupResize } from "./resize";

function init(): void {
  const gui = new GUI();
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const scene = new THREE.Scene();
  const camera = createCamera();
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

  addLights(scene);
  const controls = setupControls(camera, renderer);
  setupResize(camera, renderer);

  let params = {
    numInstances: 5000,
    height: 250, // Adjust the maximum height of the tornado
    innerRadius: 10, // Adjust the inner radius of the tornado
    outerRadius: 5, // Adjust the outer radius of the tornado
    numHelix: 1,
    twistTightness: 1,
    yRandomness: 0,
    xRandomness: 0,
    zRandomness: 0,
  };

  gui.add(params, "height", 0, 500, 1).onFinishChange(generateTornado);
  gui.add(params, "innerRadius", 0, 100, 1).onFinishChange(generateTornado);
  gui.add(params, "outerRadius", 0, 100, 1).onFinishChange(generateTornado);
  gui.add(params, "numHelix", 0, 20, 1).onFinishChange(generateTornado);
  gui.add(params, "twistTightness", 0, 50, 1).onFinishChange(generateTornado);
  gui.add(params, "xRandomness", 0, 200, 1).onFinishChange(generateTornado);
  gui.add(params, "zRandomness", 0, 200, 1).onFinishChange(generateTornado);
  gui.add(params, "yRandomness", 0, 200, 1).onFinishChange(generateTornado);

  const geometry = new THREE.IcosahedronGeometry();
  const material = new THREE.MeshPhongMaterial();

  const dummyObj = new THREE.Object3D();
  function generateTornado() {
    // Clear existing helix meshes from the scene
    scene.children.forEach((child) => {
      if (child instanceof THREE.InstancedMesh) {
        scene.remove(child);
      }
    });

    const helixMesh = new THREE.InstancedMesh(
      geometry,
      material,
      params.numInstances
    );
    const rotationIncrement = (Math.PI * 2) / params.numHelix;

    for (let i = 0; i < params.numInstances; i++) {
      const theta = (i / params.numInstances) * Math.PI * 2;
      const y =
        (i / params.numInstances) * params.height +
        (Math.random() - 0.5) * params.yRandomness;
      const outerRadius = params.outerRadius + (y / params.height) * 50;
      const innerRadius =
        (params.innerRadius / params.outerRadius) * outerRadius;
      const radialDistance =
        Math.random() * (outerRadius - innerRadius) + innerRadius;

      const twist = (y / params.height) * Math.PI * params.twistTightness;
      const x =
        radialDistance * Math.cos(theta + twist) +
        (Math.random() - 0.5) * params.xRandomness;
      const z =
        radialDistance * Math.sin(theta + twist) +
        (Math.random() - 0.5) * params.zRandomness;

      dummyObj.position.set(x, y, z);
      dummyObj.updateMatrix();

      helixMesh.setMatrixAt(i, dummyObj.matrix);
      helixMesh.setColorAt(i, new THREE.Color(Math.random() * 0xffffff));
    }

    for (let i = 0; i < params.numHelix; i++) {
      const clonedHelixMesh = helixMesh.clone();
      clonedHelixMesh.rotation.y = i * rotationIncrement;
      scene.add(clonedHelixMesh);
    }
  }
  generateTornado();

  const matrix = new THREE.Matrix4();
  //  Animate
  function animate(time: number): void {
    scene.children.forEach((child) => {
      if (child instanceof THREE.InstancedMesh) {
        child.rotation.y = child.rotation.y + time / 2000000;
      }
    });

    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);
}
init();
