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
  const numInstances = 10000;
  const geometry = new THREE.IcosahedronGeometry();
  const material = new THREE.MeshPhongMaterial();
  const myMesh = new THREE.InstancedMesh(geometry, material, numInstances);

  const dummyObj = new THREE.Object3D();

  // const randPos = () => Math.random() * 40 - 20;
  // for (let i = 0; i < numInstances; i++) {
  //   dummyObj.position.set(randPos(), randPos(), randPos());

  //   dummyObj.scale.setScalar(Math.random());

  //   dummyObj.updateMatrix();
  //   myMesh.setMatrixAt(i, dummyObj.matrix);
  //   myMesh.setColorAt(i, new THREE.Color(Math.random() * 0xffffff));
  // }
  const minHeight = -50; // Adjust the minimum height of the tornado
  const maxHeight = 50; // Adjust the maximum height of the tornado

  for (let i = 0; i < numInstances; i++) {
    const theta = (i / numInstances) * Math.PI * 2; // Angle based on instance index

    // Calculate the height within the specified range
    const y = Math.random() * (maxHeight - minHeight) + minHeight;

    // Calculate radial distance based on height
    const innerRadius = 5 + ((y - minHeight) / (maxHeight - minHeight)) * 5; // Adjust as needed
    const outerRadius = 20 + ((y - minHeight) / (maxHeight - minHeight)) * 15; // Adjust as needed

    const radialDistance =
      Math.random() * (outerRadius - innerRadius) + innerRadius;

    const x = radialDistance * Math.cos(theta);
    const z = radialDistance * Math.sin(theta);

    dummyObj.position.set(x, y, z);

    // Do other modifications as needed, e.g., scaling or rotations

    dummyObj.updateMatrix();
    myMesh.setMatrixAt(i, dummyObj.matrix);
    myMesh.setColorAt(i, new THREE.Color(Math.random() * 0xffffff));
  }

  scene.add(myMesh);

  const matrix = new THREE.Matrix4();
  //  Animate
  console.log(myMesh);
  function animate(time: number): void {
    // for (let i = 0; i < numInstances; i++) {
    //   myMesh.getMatrixAt(i, matrix);
    //   matrix.decompose(
    //     dummyObj.position,
    //     new THREE.Quaternion().setFromEuler(dummyObj.rotation), //  Changing to quaternion to avoid gimbal lock
    //     dummyObj.scale
    //   );

    //   dummyObj.rotation.set(
    //     ((i / 10000) * time) / 1000,
    //     ((i / 10000) * time) / 500,
    //     ((i / 10000) * time) / 1200
    //   );
    //   myMesh.instanceMatrix.needsUpdate = true;

    //   dummyObj.updateMatrix();
    //   myMesh.setMatrixAt(i, dummyObj.matrix);
    //   myMesh.setColorAt(i, new THREE.Color(Math.random() * 0xffffff));
    // }

    // myMesh.rotation.y = time / 1000;
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);
}
init();
