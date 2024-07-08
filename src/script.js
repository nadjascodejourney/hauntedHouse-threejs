import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/**
 * Base
 */
// Debug
// const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/** 3D Models */
//++ Load 3D Models

const modelLoader = new GLTFLoader();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

//% door textures
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

//% brick textures
const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

//% grass textures
const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

//% roof textures
const roofColorTexture = textureLoader.load("/textures/roof/color.jpg");
const roofAmbientOcclusionTexture = textureLoader.load(
  "/textures/roof/ambientOcclusion.jpg"
);
const roofNormalTexture = textureLoader.load("/textures/roof/normal.jpg");
const roofRoughnessTexture = textureLoader.load("/textures/roof/roughness.jpg");

//% catacomp wall textures
const wallColorTexture = textureLoader.load("/textures/wall/color.jpg");
const wallAmbientOcclusionTexture = textureLoader.load(
  "/textures/wall/ambientOcclusion.jpg"
);
const wallNormalTexture = textureLoader.load("/textures/wall/normal.jpg");
const wallRoughnessTexture = textureLoader.load("/textures/wall/roughness.jpg");
const wallHeightTexture = textureLoader.load("/textures/wall/height.png");

// colorSpace
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
bricksColorTexture.colorSpace = THREE.SRGBColorSpace;
grassColorTexture.colorSpace = THREE.SRGBColorSpace;
roofColorTexture.colorSpace = THREE.SRGBColorSpace;
wallColorTexture.colorSpace = THREE.SRGBColorSpace;

//++ Fog

const myFog = new THREE.Fog("#262837", 2, 25); // color, near to the camera, far to the camera => how far from the camera the fog will be fully opaque
scene.fog = myFog; // add fog to the scene; dot notation works because fog is a property of the scene

//++ House group

const house = new THREE.Group();
// position the house group
house.position.x = 3; //* Move the house up by half of its height to sit on the floor
// rotate the house group 45 degrees to the left
house.rotation.y = Math.PI * -0.2;
scene.add(house);

//++ Walls

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4.5, 4, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture, // ambient occlusion map
    normalMap: bricksNormalTexture, // normal map
    roughnessMap: bricksRoughnessTexture, // roughness map
  })
);
walls.position.y = 3 / 2; //* Move the walls up by half of its height to sit on the floor
house.add(walls); //* Add walls to house group not to the scene directly

//++ Roof

// There is no pyramid geometry in three.js so we will use a cone geometry
const roof = new THREE.Mesh(
  new THREE.CylinderGeometry(0, 4, 6, 4, 1, false),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofAmbientOcclusionTexture, // ambient occlusion map
    transparent: true,
    normalMap: roofNormalTexture, // normal map
    roughnessMap: roofRoughnessTexture, // roughness map
  })
);
roofColorTexture.repeat.set(2, 1); // repeat the texture 2 times on the x-axis and 1 time on the y-axis
roofAmbientOcclusionTexture.repeat.set(2, 1);
roofNormalTexture.repeat.set(2, 1);
roofRoughnessTexture.repeat.set(2, 1);

// rotate the textures so that they are aligned with the roof
roofColorTexture.rotation = -Math.PI * 0.002;
roofAmbientOcclusionTexture.rotation = -Math.PI * 0.002;
roofNormalTexture.rotation = -Math.PI * 0.002;
roofRoughnessTexture.rotation = -Math.PI * 0.002;

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofRoughnessTexture.wrapS = THREE.RepeatWrapping;

roofColorTexture.wrapT = THREE.RepeatWrapping;
roofAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
roofNormalTexture.wrapT = THREE.RepeatWrapping;
roofRoughnessTexture.wrapT = THREE.RepeatWrapping;

roof.rotation.y = Math.PI * 0.25; //* Rotate the roof by 45 degrees
roof.position.y = 3 + 3; //* Move the roof up by the height of the walls plus half of its height (=> 6)
house.add(roof); //* Add roof to house group not to the scene directly

//++ Door

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 100, 100), //2 = width, 2 = height, 100 = width segments, 100 = height segments
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture, // ambient occlusion map
    displacementMap: doorHeightTexture, // height map
    displacementScale: 0.2, // how much the height map will affect the geometry so that the door has a bit of depth; add more vertices to the geometry so that you have a better displacement effect
    metalnessMap: doorMetalnessTexture, // metalness map
    normalMap: doorNormalTexture, // normal map
    roughnessMap: doorRoughnessTexture, // roughness map
  })
);
door.position.y = 0.9;
door.position.z = 2.01; //* Move the door to the front of the house => half the depth of the walls (=> 4) + half the depth of the door (=> 2) + a small offset (=> 0.01) to avoid z-fighting
house.add(door); //* Add door to house group not to the scene directly

//++ Floor

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.MeshStandardMaterial({ color: "#a9c388" })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;

// shadow
floor.receiveShadow = true; // enable shadows for the floor
floor.castShadow = true; // enable shadows for the floor
scene.add(floor);

//++ Bushes
// create only one bush geometry and material and use it to create multiple bushes

/* const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });
 */

//* three bushes separately:
/* const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

house.add(bush1, bush2, bush3); */

//++ Alternative: store the bushes in an array and loop through them like in this Code here:
// store the coordinates for the three bushes in an array:
const bushCoordinates = [
  { x: 1.2, y: 0.2, z: 2.2 },
  { x: 1.6, y: 0.1, z: 2.1 },
  { x: -1, y: 0.1, z: 2.2 },
  { x: -1, y: 0.05, z: 2.6 },
];
// bush scales array
const bushScales = [
  { x: 0.5, y: 0.5, z: 0.5 },
  { x: 0.25, y: 0.25, z: 0.25 },
  { x: 0.4, y: 0.4, z: 0.4 },
  { x: 0.15, y: 0.15, z: 0.15 },
];

// loop through the array and create a bush for each set of coordinates and scales:
for (let i = 0; i < bushCoordinates.length; i++) {
  const { x, y, z } = bushCoordinates[i];
  const { x: scaleX, y: scaleY, z: scaleZ } = bushScales[i]; // destructure the scales with the same index as the coordinates

  const bush = new THREE.Mesh(
    new THREE.SphereGeometry(1, 16, 16),
    new THREE.MeshStandardMaterial({ color: "#89c854" })
  );
  bush.scale.set(scaleX, scaleY, scaleZ);
  bush.position.set(x, y, z);
  bush.castShadow = true; // enable shadows for the bush
  house.add(bush);
}

//* for of loop if you only have coordinates:
/* for (const { x, y, z } of bushCoordinates) {
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);
  bush.scale.set(0.5, 0.5, 0.5);
  bush.position.set(x, y, z);
  house.add(bush);
} */

//++ Grass

// i could also use the floor geometry and material for the grass but i will create a separate geometry and material for the grass
const grass = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture, // ambient occlusion map
    normalMap: grassNormalTexture, // normal map
    roughnessMap: grassRoughnessTexture, // roughness map
  })
);
grass.rotation.x = -Math.PI * 0.5;
grass.position.y = 0.01; //* Move the grass up by a small offset to avoid z-fighting

//* The texture is too large. To fix that, we can simply repeat each grass texture with the repeat property:
// repeat is a Vector2 object that has an x and y property
grassColorTexture.repeat.set(9, 9);
grassAmbientOcclusionTexture.repeat.set(9, 9);
grassNormalTexture.repeat.set(9, 9);
grassRoughnessTexture.repeat.set(9, 9);

//* wrap the textures so that they repeat instead of stretching, because by default the textures do not repeat
// wrapS is for the x-axis and wrapT is for the y-axis
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

scene.add(grass);

//++ Fence group

const fence = new THREE.Group();
// position the fence group
fence.position.y = 1 / 2; //* Move the fence up by half of its height to sit on the floor
scene.add(fence);

//++ Fences

const fenceBroken = modelLoader.load(
  "/models/Models/GLB format/fence-damaged.glb",
  function (fence) {
    fence.scene.scale.set(2, 2, 2.5);

    // move the fence next to the house
    fence.scene.position.set(-0.7, 0, -3.1);
    // rotate the fence around the y-axis so that it faces the house
    fence.scene.rotation.y = 5.7;

    fence.scene.traverse(function (node) {
      // .traverse() will go through all the children of the fence and apply the function to each of them
      if (node.isMesh) {
        node.castShadow = true; // Enable shadow casting
        node.receiveShadow = true; // Enable shadow receiving
        node.material.castShadow = true; // Enable shadow casting
        node.material.receiveShadow = true; // Enable shadow receiving
      }
    });
    scene.add(fence.scene);
  }
);

const fenceNotBroken = modelLoader.load(
  "/models/Models/GLB format/fence.glb",
  function (fence) {
    fence.scene.scale.set(2, 1.8, 2.5);

    // move the fence next to the house
    fence.scene.position.set(0.8, 0, -2);
    // rotate the fence around the y-axis so that it faces the house
    fence.scene.rotation.y = 5.7;

    fence.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true; // Enable shadow casting
        node.receiveShadow = true; // Enable shadow receiving
        node.material.roughness = 0.2;
        node.material.castShadow = true; // Enable shadow casting
        node.material.receiveShadow = true; // Enable shadow receiving
      }
    });
    scene.add(fence.scene);
  }
);

//++ Graveyard Wall group

const graveyardWall = new THREE.Group();
scene.add(graveyardWall);

// graveyard wall with three js geometry
const graveyardWallGeometry = new THREE.BoxGeometry(30, 6, 0.5); // width, height, depth
const graveyardWallMaterial = new THREE.MeshStandardMaterial({
  map: wallColorTexture,
  aoMap: wallAmbientOcclusionTexture,
  normalMap: wallNormalTexture,
  roughnessMap: wallNormalTexture,
});

//* The texture is too large
wallColorTexture.repeat.set(4, 1); // repeat the texture 4 times on the x-axis and 4 times on the y-axis
wallAmbientOcclusionTexture.repeat.set(4, 1);
wallNormalTexture.repeat.set(4, 1);
wallNormalTexture.repeat.set(4, 1);

// wrap the textures
wallColorTexture.wrapS = THREE.RepeatWrapping;
wallAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
wallNormalTexture.wrapS = THREE.RepeatWrapping;
wallRoughnessTexture.wrapS = THREE.RepeatWrapping;

wallColorTexture.wrapT = THREE.RepeatWrapping;
wallAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
wallNormalTexture.wrapT = THREE.RepeatWrapping;
wallRoughnessTexture.wrapT = THREE.RepeatWrapping;

const stonewall = new THREE.Mesh(graveyardWallGeometry, graveyardWallMaterial);
stonewall.position.set(0, 0, -14);

stonewall.castShadow = true;
stonewall.receiveShadow = true;

scene.add(stonewall);

// Graveyard Iron Fence group
const graveyardIronFence = new THREE.Group();
scene.add(graveyardIronFence);

// Graveyard Iron Fence model from the GLB file
// fence on the right side of the whole graveyard
const graveyardIronFenceModel = modelLoader.load(
  "/models/Models/GLB format/iron-fence-damaged.glb",
  function (fence) {
    fence.scene.scale.set(4, 4, 2);
    fence.scene.position.set(15, 0, 0);
    fence.scene.rotation.y = Math.PI * 0.5;

    fence.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.castShadow = true;
        node.material.receiveShadow = true;
      }
    });

    graveyardIronFence.add(fence.scene);
  }
);

const graveyardIronFenceModel2 = modelLoader.load(
  "/models/Models/GLB format/iron-fence-damaged.glb",
  function (fence2) {
    fence2.scene.scale.set(4, 4, 2);
    fence2.scene.position.set(15, 0, 4);
    fence2.scene.rotation.y = Math.PI * 0.5;

    fence2.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.castShadow = true;
        node.material.receiveShadow = true;
      }
    });
    graveyardIronFence.add(fence2.scene);
  }
);

const graveyardIronFenceModel3 = modelLoader.load(
  "/models/Models/GLB format/iron-fence.glb",
  function (fence3) {
    fence3.scene.scale.set(4, 4, 3);
    fence3.scene.position.set(15.5, 0, 8);
    fence3.scene.rotation.y = Math.PI * 0.5;

    fence3.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.castShadow = true;
        node.material.receiveShadow = true;
      }
    });
    graveyardIronFence.add(fence3.scene);
  }
);

const graveyardIronFenceModel4 = modelLoader.load(
  "/models/Models/GLB format/iron-fence-damaged.glb",
  function (fence4) {
    fence4.scene.scale.set(4, 4, 2);
    fence4.scene.position.set(15, 0, 12);
    fence4.scene.rotation.y = Math.PI * 0.5;

    fence4.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.castShadow = true;
        node.material.receiveShadow = true;
      }
    });
    graveyardIronFence.add(fence4.scene);
  }
);

const graveyardIronFenceModel5 = modelLoader.load(
  "/models/Models/GLB format/iron-fence-damaged.glb",
  function (fence5) {
    fence5.scene.scale.set(4, 4, 2);
    fence5.scene.position.set(15, 0, -4);
    fence5.scene.rotation.y = Math.PI * 0.5;

    fence5.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.castShadow = true;
        node.material.receiveShadow = true;
      }
    });
    graveyardIronFence.add(fence5.scene);
  }
);

const graveyardIronFenceModel6 = modelLoader.load(
  "/models/Models/GLB format/iron-fence.glb",
  function (fence6) {
    fence6.scene.scale.set(4, 4, 2);
    fence6.scene.position.set(15, 0, -8);
    fence6.scene.rotation.y = Math.PI * 0.5;

    fence6.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.castShadow = true;
        node.material.receiveShadow = true;
      }
    });
    graveyardIronFence.add(fence6.scene);
  }
);

const graveyardIronFenceModel7 = modelLoader.load(
  "/models/Models/GLB format/iron-fence.glb",
  function (fence7) {
    fence7.scene.scale.set(4, 4, 2);
    fence7.scene.position.set(15, 0, -12);
    fence7.scene.rotation.y = Math.PI * 0.5;

    fence7.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.castShadow = true;
        node.material.receiveShadow = true;
      }
    });
    graveyardIronFence.add(fence7.scene);
  }
);

// fence on the left side of the whole graveyard

const graveyardIronFenceModel8 = modelLoader.load(
  "/models/Models/GLB format/iron-fence.glb",
  function (fence8) {
    fence8.scene.scale.set(4, 4, 2);
    fence8.scene.position.set(-14, 0, 0);
    fence8.scene.rotation.y = Math.PI * 0.5;

    fence8.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.castShadow = true;
        node.material.receiveShadow = true;
      }
    });

    graveyardIronFence.add(fence8.scene);
  }
);

const graveyardIronFenceModel9 = modelLoader.load(
  "/models/Models/GLB format/iron-fence.glb",
  function (fence9) {
    fence9.scene.scale.set(4, 4, 2);
    fence9.scene.position.set(-14, 0, 4);
    fence9.scene.rotation.y = Math.PI * 0.5;

    fence9.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.castShadow = true;
        node.material.receiveShadow = true;
      }
    });
    graveyardIronFence.add(fence9.scene);
  }
);

const graveyardIronFenceModel10 = modelLoader.load(
  "/models/Models/GLB format/iron-fence-damaged.glb",
  function (fence10) {
    fence10.scene.scale.set(4, 4, 2);
    fence10.scene.position.set(-14, 0, 8);
    fence10.scene.rotation.y = Math.PI * 0.5;

    fence10.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.castShadow = true;
        node.material.receiveShadow = true;
      }
    });
    graveyardIronFence.add(fence10.scene);
  }
);

const graveyardIronFenceModel11 = modelLoader.load(
  "/models/Models/GLB format/iron-fence-damaged.glb",
  function (fence11) {
    fence11.scene.scale.set(4, 4, 2);
    fence11.scene.position.set(-14, 0, 12);
    fence11.scene.rotation.y = Math.PI * 0.5;

    fence11.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.castShadow = true;
        node.material.receiveShadow = true;
      }
    });
    graveyardIronFence.add(fence11.scene);
  }
);

const graveyardIronFenceModel12 = modelLoader.load(
  "/models/Models/GLB format/iron-fence-damaged.glb",
  function (fence12) {
    fence12.scene.scale.set(4, 4, 2);
    fence12.scene.position.set(-14, 0, -4);
    fence12.scene.rotation.y = Math.PI * 0.5;

    fence12.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.castShadow = true;
        node.material.receiveShadow = true;
      }
    });
    graveyardIronFence.add(fence12.scene);
  }
);

const graveyardIronFenceModel13 = modelLoader.load(
  "/models/Models/GLB format/iron-fence.glb",
  function (fence13) {
    fence13.scene.scale.set(4, 4, 2);
    fence13.scene.position.set(-14, 0, -8);
    fence13.scene.rotation.y = Math.PI * 0.5;

    fence13.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.castShadow = true;
        node.material.receiveShadow = true;
      }
    });
    graveyardIronFence.add(fence13.scene);
  }
);

const graveyardIronFenceModel14 = modelLoader.load(
  "/models/Models/GLB format/iron-fence.glb",
  function (fence14) {
    fence14.scene.scale.set(4, 4, 2);
    fence14.scene.position.set(-14, 0, -12);
    fence14.scene.rotation.y = Math.PI * 0.5;

    fence14.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.castShadow = true;
        node.material.receiveShadow = true;
      }
    });
    graveyardIronFence.add(fence14.scene);
  }
);

//? How can i create a long fence out of many fence models?

//++ Graves
// create only one grave geometry and material and use it to create multiple graves
// place them randomly on the floor

//* Grave group
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

// graves should be placed randomly on the floor in a circle/ellipse around the house
// each grave should have a random angle and distance from the house

const numberOfGraves = 60;

for (let i = 0; i < numberOfGraves; i++) {
  // angle that starts from 0 to a full circle = full circle = 2 * PI
  const angle = Math.random() * Math.PI * 2; // * 2 because we want a full circle => Pi * 2
  // distance from the house

  const x = Math.sin(angle); // sin and cos will give us a point on a circle; sin will give us the x coordinate; we pass the angle to sin and cos because this will give us the x and z coordinates of a point on a circle
  const z = Math.cos(angle); // sin and cos will give us a point on a circle; cos will give us the z coordinate

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  grave.position.set(x, 0, z);
  // the circle has a default radius of 1 because of math sin and math cos (radius can only go from 0 to  1)  so we need to scale it up to the size of the floor so that we can place the graves on the floor correctly
  // we need a random radius for the graves
  const radius = 5 + Math.random() * 8; // we want to go from the nearest distance to our max distance and then we have to multiply it by 6 because we want to go from 3 to 9
  grave.position.set(x * radius, 0.3, z * radius);

  grave.rotation.y = (Math.random() - 0.5) * 0.7; // random rotation around the y-axis; Math.random() is between 0 and 1 so we subtract 0.5 to get a random number between -0.5 and 0.5; we multiply it by 0.4 to get a small rotation
  grave.rotation.x = (Math.random() - 0.5) * 0.8;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;

  // shadow
  grave.castShadow = true; // enable shadows for the grave

  graves.add(grave);
}

//++ Load shovel model

const shovel = modelLoader.load(
  "/models/Models/GLB format/shovel.glb",
  function (shovel) {
    shovel.scene.scale.set(2, 2, 2); // Make the shovel two times larger
    shovel.scene.position.set(-5, 0, 10); // Move the shovel 5 units to the left and 10 units to the front
    shovel.scene.rotation.y = Math.PI * 0.25; // Rotate the shovel 45 degrees around the y-axis

    shovel.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true; // Enable shadow casting
        node.receiveShadow = true; // Enable shadow receiving
        node.material.metalness = 0.7; // Make the shovel look like metal
        node.material.roughness = 0.2; // Make the shovel look like metal
        node.material.castShadow = true; // Enable shadow casting
        node.material.receiveShadow = true; // Enable shadow receiving
      }
    });
    scene.add(shovel.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

//++ Load broken bench model

const bench = modelLoader.load(
  "/models/Models/GLB format/bench-damaged.glb",
  function (bench) {
    bench.scene.scale.set(2, 2, 2);
    bench.scene.position.set(-12, 0, 10); // Move the bench 10 units to the front
    bench.scene.rotation.y = Math.PI * 0.25; // Rotate the bench 45 degrees around the y-axis

    bench.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true; // Enable shadow casting
        node.receiveShadow = true; // Enable shadow receiving
        node.material.metalness = 0.7; // Make the bench look like metal
        node.material.roughness = 0.2; // Make the bench look like metal
        node.material.castShadow = true; // Enable shadow casting
        node.material.receiveShadow = true; // Enable shadow receiving
      }
    });
    scene.add(bench.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

//++ Load old coffin

const coffin = modelLoader.load(
  "/models/Models/GLB format/coffin-old.glb",
  function (coffin) {
    coffin.scene.scale.set(2, 2, 2);
    coffin.scene.position.set(-6, 0, -8);
    coffin.scene.rotation.y = Math.PI * 0.5;

    coffin.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.roughness = 0.2;
        node.material.castShadow = true;
        node.material.receiveShadow = true;
      }
    });
    scene.add(coffin.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

//++ Ghost 1
const characterghost = modelLoader.load(
  "/models/Models/GLB format/character-ghost.glb",
  function (ghost) {
    ghost.scene.scale.set(2, 2, 2);
    // move the ghost to the front of the house
    ghost.scene.position.set(-3, 0, 2);

    ghost.scene.traverse(function (node) {
      if (node.isMesh) {
        node.material.transparent = true; // Setzen Sie das Material auf transparent
        node.material.opacity = 0.5; // Setzen Sie die Transparenz auf 50%
        node.material.depthWrite = false; // Deaktivieren Sie das Schreiben in den Tiefenpuffer, um sicherzustellen, dass das Material korrekt gerendert wird
      }
    });

    scene.add(ghost.scene);

    // Bewegung des Geistes
    let t = clock.getElapsedTime(); // t wird auf die aktuelle Zeit gesetzt

    function animate() {
      requestAnimationFrame(animate); // fordern Sie die nächste Aktualisierung an

      // Aktualisieren Sie die Position des Geistes entlang eines Kreises
      t += 0.01; // t wird mit 0.01 erhöht, um die Bewegung des Geistes zu animieren

      const elapsedTime = clock.getElapsedTime();
      ghost.scene.position.x = Math.cos(elapsedTime * 0.5) * 6.5;
      ghost.scene.position.z = Math.sin(elapsedTime * 0.5) * 6.5;
      ghost.scene.position.y = Math.sin(elapsedTime * 2); // make the ghost move up and down
      // let the ghost rotate randomly
      // ghost.scene.rotation.x = Math.cos(elapsedTime * 0.5) * 6.5;
      ghost.scene.rotation.y = Math.sin(elapsedTime * 2);

      renderer.render(scene, camera);
    }

    animate(); // Starten Sie die Animation
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

//++ Ghost2
const characterghost2 = modelLoader.load(
  "/models/Models/GLB format/character-ghost.glb",
  function (ghost2) {
    ghost2.scene.scale.set(2, 2, 2);
    // move the ghost2 to the front of the house
    ghost2.scene.position.set(-4, 0, 2);

    ghost2.scene.traverse(function (node) {
      if (node.isMesh) {
        node.material.transparent = true; // Setzen Sie das Material auf transparent
        node.material.opacity = 0.5; // Setzen Sie die Transparenz auf 50%
        node.material.depthWrite = false; // Deaktivieren Sie das Schreiben in den Tiefenpuffer, um sicherzustellen, dass das Material korrekt gerendert wird
      }
    });

    scene.add(ghost2.scene);

    // Bewegung des Geistes
    let t = clock.getElapsedTime(); // t wird auf die aktuelle Zeit gesetzt

    function animate() {
      requestAnimationFrame(animate); // fordern Sie die nächste Aktualisierung an

      // Aktualisieren Sie die Position des Geistes entlang eines Kreises
      t += 0.01; // t wird mit 0.01 erhöht, um die Bewegung des Geistes zu animieren

      const elapsedTime = clock.getElapsedTime();
      ghost2.scene.position.x = Math.cos(-elapsedTime * 0.32) * 7.5;
      ghost2.scene.position.z = Math.sin(-elapsedTime * 0.32) * 7.5;
      ghost2.scene.position.y =
        Math.sin(-elapsedTime * 2) + Math.sin(-elapsedTime * 2.5); // make the ghost2 move up and down
      // let the ghost2 rotate randomly
      ghost2.scene.rotation.y = Math.sin(-elapsedTime * 2);

      renderer.render(scene, camera);
    }
    animate(); // Starten Sie die Animation
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const characterghost3 = modelLoader.load(
  "/models/Models/GLB format/character-ghost.glb",
  function (ghost3) {
    ghost3.scene.scale.set(2, 2, 2);
    // move the ghost3 to the front of the house
    ghost3.scene.position.set(-4, 0, 2);

    ghost3.scene.traverse(function (node) {
      if (node.isMesh) {
        node.material.transparent = true; // Setzen Sie das Material auf transparent
        node.material.opacity = 0.5; // Setzen Sie die Transparenz auf 50%
        node.material.depthWrite = false; // Deaktivieren Sie das Schreiben in den Tiefenpuffer, um sicherzustellen, dass das Material korrekt gerendert wird
      }
    });

    scene.add(ghost3.scene);

    // Bewegung des Geistes
    let t = clock.getElapsedTime(); // t wird auf die aktuelle Zeit gesetzt

    function animate() {
      requestAnimationFrame(animate); // fordern Sie die nächste Aktualisierung an

      // Aktualisieren Sie die Position des Geistes entlang eines Kreises
      t += 0.01; // t wird mit 0.01 erhöht, um die Bewegung des Geistes zu animieren

      const elapsedTime = clock.getElapsedTime();

      const ghost3Angle = -elapsedTime * 0.21;
      ghost3.scene.position.x =
        Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32)); // 7 is the radius of the circle, Math sin will give us a value between -1 and 1, elapsedTime * 0.32 will make the ghost move up and down
      ghost3.scene.position.z =
        Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
      ghost3.scene.position.y =
        Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2);

      renderer.render(scene, camera);
    }
    animate(); // Starten Sie die Animation
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

//++ Lights

//++ Ambient light

const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.11);
// gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

//++ Directional light

const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.6); // color, intensity
moonLight.position.set(10, 10, -8.7); // x, y, z

// broaden the angle of the moonLight so that it covers the whole floor
moonLight.shadow.mapSize.width = 256; // the higher the resolution, the better the shadows but the more performance it will cost
moonLight.shadow.mapSize.height = 256;
// size of the area that the light will cover
moonLight.shadow.camera.top = 30; // the top of the camera
moonLight.shadow.camera.right = 30; // the right of the camera
moonLight.shadow.camera.bottom = -30; // the bottom of the camera
moonLight.shadow.camera.left = -30; // the left of the camera
moonLight.shadow.camera.near = 0.1; // how close the camera can get to the light
moonLight.shadow.camera.far = 30; // how far the camera can get to the light, // how far the light will cast shadows
moonLight.shadow.bias = -0.002; // to avoid shadow acne = shadows that are not aligned with the geometry
/* 
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-10).max(10).step(0.001); // start at -5 and go to 5 with a step of 0.001
gui.add(moonLight.position, "y").min(-10).max(10).step(0.001);
gui.add(moonLight.position, "z").min(-20).max(20).step(0.001); */
scene.add(moonLight);

// const cameraHelper = new THREE.CameraHelper(moonLight.shadow.camera);
// scene.add(cameraHelper);

//++ Door light

const doorLight = new THREE.PointLight("#ff7d46", 3, 7); // color, intensity, distance
doorLight.position.set(0, 2.7, 2.7); // 0 because the door is in the center of the house, 2.2 because the door is 2.2 units high, 2.7 because the door is 2.7 units in front of the house
house.add(doorLight);

//++ ghost2 light

const ghost1 = new THREE.PointLight("white", 6, 3);
// 3 is the distance from the light to the point where the light intensity is 0 and in this case it fades out very quickly
const ghost2 = new THREE.PointLight("lightyellow", 6, 3);
const ghost3 = new THREE.PointLight("aqua", 6, 3);

scene.add(ghost1, ghost2, ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// set the clear color to the fog color so that there is a seamless transition between the fog and the sky
renderer.setClearColor("#262837");

/**
 * Shadows
 */
renderer.shadowMap.enabled = true; // enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // soft shadows

// enable shadows for the light
moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
// bush.castShadow = true;
fence.castShadow = true;

// enable shadows for the objects that should cast shadows
walls.castShadow = true;
roof.castShadow = true;
fence.castShadow = true;

// enable shadows for the floor
grass.receiveShadow = true;

// optimize shadows

doorLight.shadow.mapSize.width = 256; // the higher the resolution, the better the shadows but the more performance it will cost
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7; // how far the light will cast shadows

ghost1.shadow.mapSize.width = 256; // the higher the resolution, the better the shadows but the more performance it will cost
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7; // how far the light will cast shadows

ghost2.shadow.mapSize.width = 256; // the higher the resolution, the better the shadows but the more performance it will cost
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7; // how far the light will cast shadows

ghost3.shadow.mapSize.width = 256; // the higher the resolution, the better the shadows but the more performance it will cost
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7; // how far the light will cast shadows

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //++ Update ghostlights
  // ghost should rotate in a circle around the house
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 6.5; // 6.5 is the radius of the circle
  ghost1.position.z = Math.sin(ghost1Angle) * 6.5;
  ghost1.position.y = Math.sin(elapsedTime * 2); // make the ghost move up and down

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 7.5; // 7.5 is the radius of the circle, the ghost will move in a circle around the house
  ghost2.position.z = Math.sin(ghost2Angle) * 7.5;
  ghost2.position.y = Math.sin(elapsedTime * 2) + Math.sin(elapsedTime * 2.5); // we add the two sin values to get a more interesting, random movement which is more unpredictable

  const ghost3Angle = -elapsedTime * 0.21;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32)); // 7 is the radius of the circle, Math sin will give us a value between -1 and 1, elapsedTime * 0.32 will make the ghost move up and down
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
