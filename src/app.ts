import * as THREE from "three";
import GUI from "lil-gui";
import { createCamera } from "./camera";
import { addLights } from "./lights";
import { setupControls } from "./controls";
import { setupResize } from "./resize";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

interface ModelData {
  geometry: THREE.BufferGeometry;
  materials: THREE.Material[];
}

function init(): void {
  const gui = new GUI();
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const scene = new THREE.Scene();
  const camera = createCamera();
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

  const loader = new GLTFLoader();

  addLights(scene);
  const controls = setupControls(camera, renderer);
  setupResize(camera, renderer);

  let params = {
    numInstances: 5000,
    height: 250,
    innerRadius: 10,
    outerRadius: 5,
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

  // Create a promise to handle the loading of the model
  const loadModel: Promise<ModelData> = new Promise((resolve, reject) => {
    loader.load("../models/emojis.glb", (glb) => {
      const emoji = glb.scene.getObjectByName(
        "Emoji_1_Love_0"
      ) as THREE.Object3D;

      if (emoji && emoji.children.length > 0) {
        // Extract geometries and materials from the children
        const geometries: THREE.BufferGeometry[] = [];
        const materials: THREE.Material[] = [];
        emoji.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            geometries.push(child.geometry);
            materials.push(child.material);
          }
        });

        const mergedGeometry =
          BufferGeometryUtils.mergeBufferGeometries(geometries);

        // Resolve the promise with the loaded model data
        resolve({
          geometry: mergedGeometry,
          materials: materials,
        });
      } else {
        reject(new Error("Emoji object or its children not found"));
      }
    });
  });

  loadModel
    .then((modelData: ModelData) => {
      generateTornado(modelData.geometry, modelData.materials);
    })
    .catch((error: Error) => {
      console.error(error.message);
    });

  const dummyObj = new THREE.Object3D();

  function generateTornado(
    loadedGeometry: THREE.BufferGeometry,
    loadedMaterials: THREE.Material[]
  ) {
    const helixMesh = new THREE.InstancedMesh(
      loadedGeometry,
      loadedMaterials[2],
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

  const matrix = new THREE.Matrix4();

  // Animate
  function animate(time: number): void {
    // scene.children.forEach((child) => {
    //   if (child instanceof THREE.InstancedMesh) {
    //     child.rotation.y = child.rotation.y + time / 2000000;
    //   }
    // });

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate);
}

init();
