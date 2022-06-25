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

render();

var geometry = new THREE.BoxGeometry(2, 5, 0.1);
var material = new THREE.MeshLambertMaterial({color:"rgb(0, 165, 0)"});
var cube = new THREE.Mesh(geometry, material);
cube.position.set(0,1,0);
scene.add(cube);



function render() {
    stats.update(); // Update FPS
    trackballControls.update();
    requestAnimationFrame(render); // Show events
    renderer.render(scene, camera) // Render scene
}