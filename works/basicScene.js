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

//buildObjects();
render();

function buildObjects() {
    let auxMat = new THREE.Matrix4();

    // Base objects
    let cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 2, 20))
    let cylinderMesh2 = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 2.5, 20))
    let torusMesh = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.1, 20, 20))

    // CSG holders
    let csgObject, cylinderCSG, cylinderCSG2, torusCSG, meshCSG;

    //torusMesh.rotateX(degreesToRadians(90));
    torusMesh.position.set(0.8, 0.0, 0.0); // reset position
    cylinderMesh2.position.set(0, 0.5, 0);
    updateObject(cylinderMesh2);
    updateObject(torusMesh);

    torusCSG = CSG.fromMesh(torusMesh);
    cylinderCSG = CSG.fromMesh(cylinderMesh);
    cylinderCSG2 = CSG.fromMesh(cylinderMesh2);

    csgObject = cylinderCSG.union(torusCSG);
    mesh = CSG.toMesh(csgObject, auxMat)
    meshCSG = CSG.fromMesh(mesh);
    csgObject = meshCSG.subtract(cylinderCSG2);

    mesh = CSG.toMesh(csgObject, auxMat)
    mesh.material = new THREE.MeshPhongMaterial({ color: 'white', specular: "blue" })
    mesh.position.set(0, 0, 1.02)
    mesh.rotateX(degreesToRadians(90));
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

const geometry2 = new THREE.CylinderGeometry( 0, 9.3, 2, 18 );
const material2 = new THREE.MeshBasicMaterial( {color: "red"} );
const cylinder = new THREE.Mesh( geometry2, material2 );
cylinder.position.set(0.8, 0, 1);
cylinder.scale.set(0.1, 0.1, 0.1);
scene.add( cylinder );

const cylinder2 = new THREE.Mesh(geometry2, material2);
cylinder2.position.set(0.8, 0, 1);
cylinder2.scale.set(0.1, 0.1, 0.1);
cylinder2.rotateY(degreesToRadians(180));
scene.add(cylinder2);

function render() {
    stats.update(); // Update FPS
    trackballControls.update();
    requestAnimationFrame(render); // Show events
    renderer.render(scene, camera) // Render scene
}