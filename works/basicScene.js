import * as THREE from 'three';
import Stats from '../build/jsm/libs/stats.module.js';
import GUI from '../libs/util/dat.gui.module.js'
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import {
    initRenderer,
    initCamera,
    initDefaultBasicLight,
    createGroundPlane,
    onWindowResize,
    degreesToRadians
} from "../libs/util/util.js";

import { CSG } from '../libs/other/CSGMesh.js'

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information

var renderer = initRenderer();    // View function in util/utils
renderer.setClearColor("rgb(30, 30, 40)");
var camera = initCamera(new THREE.Vector3(4, -8, 8)); // Init camera in this position
camera.up.set(0, 0, 1);

window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);
initDefaultBasicLight(scene, true, new THREE.Vector3(12, -15, 20), 28, 1024);

var groundPlane = createGroundPlane(20, 20); // width and height (x, y)
scene.add(groundPlane);

var trackballControls = new TrackballControls(camera, renderer.domElement);

// To be used in the interface
let mesh, mesh2;

buildObjects();
render();

function buildObjects() {
    let auxMat = new THREE.Matrix4();

    // Base objects
    let cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.5, 20));
    let cubeMesh = new THREE.Mesh(new THREE.BoxGeometry( 2.4, 30, 0.5 ));
    let cubeMesh2 = new THREE.Mesh(new THREE.BoxGeometry( 2.4, 30, 0.5 ));

    // CSG holders
    let csgObject, cylinderCSG, cubeCSG2, cubeCSG, meshCSG;

    //cubeMesh.rotateX(degreesToRadians(90));
    cubeMesh.position.set(0.8, 0, 2);
    cubeMesh2.position.set(0.8, 0, 2);
    cubeMesh2.rotateY(degreesToRadians(90));
    cylinderMesh.position.set(0.8, 0, 2);
    updateObject(cubeMesh2);
    updateObject(cubeMesh);
    updateObject(cylinderMesh);

    cubeCSG = CSG.fromMesh(cubeMesh);
    cubeCSG2 = CSG.fromMesh(cubeMesh2);
    cylinderCSG = CSG.fromMesh(cylinderMesh);

    csgObject = cubeCSG.union(cubeCSG2);
    mesh = CSG.toMesh(csgObject, auxMat)
    meshCSG = CSG.fromMesh(mesh);
    csgObject = cylinderCSG.subtract(meshCSG);

    mesh = CSG.toMesh(csgObject, auxMat)
    mesh.material = new THREE.MeshPhongMaterial({ color: "rgb(178,34,34)", specular: "white" })
    mesh.position.set(0, 0, 1.02)
    scene.add(mesh);

}

function updateObject(mesh) {
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
}

// const geometry = new THREE.CapsuleGeometry( 10, 10, 4, 8 );
// const material = new THREE.MeshBasicMaterial( {color: "red"} );
// const capsule = new THREE.Mesh( geometry, material );
// capsule.position.set(0.8, 0,1)
// scene.add( capsule );

// const geometry = new THREE.CylinderGeometry( 2, 2, 0.5, 20);
// const material = new THREE.MeshBasicMaterial( {color: "rgb(178,34,34)"} );
// const cylinder = new THREE.Mesh( geometry, material);
// cylinder.position.set(0.8, 0, 2);
// scene.add( cylinder );

// const cubegeometry = new THREE.BoxGeometry( 2.4, 30, 0.5 );
// const cubematerial = new THREE.MeshBasicMaterial( {color: "white"} );
// const cube = new THREE.Mesh( cubegeometry, cubematerial );
// cube.position.set(0.8, 0, 2);
// scene.add( cube );

// const cube2 = new THREE.Mesh( cubegeometry, cubematerial );
// cube2.position.set(0.8, 0, 2);
// cube2.rotateY(degreesToRadians(90));
// scene.add( cube2 );

function render() {
    stats.update(); // Update FPS
    trackballControls.update();
    requestAnimationFrame(render); // Show events
    renderer.render(scene, camera) // Render scene
}