import * as THREE from  'three';
import Stats from       '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ,
        degreesToRadians} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
initDefaultBasicLight(scene);

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// Create a cylinder
const geometry = new THREE.CylinderGeometry( 1, 1, 4, 32 );
const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
const cylinder = new THREE.Mesh( geometry, material );
cylinder.position.set(0, 2, 0)
scene.add( cylinder );

function moveGroundMissile() {
    cylinder.translateY(.05);
}

function findEnemy() {
  cylinder.rotateZ(0.3);
  // if(cylinder.rotation.x != 1.5707963267948963) {
  //   cylinder.rotateX(degreesToRadians((90/9)));
  //   // cylinder.translateZ(0.01);
  // } else if(cylinder.rotation.x == 1.5707963267948963) {
  //   // cylinder.rotateY(degreesToRadians(45));
  //   // moveGroundMissile();
  //   // canMove = true;
  // }
  
}

// Use this to show information onscreen
var controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

render();
var canMove = true;
function render()
{
  trackballControls.update(); // Enable mouse movements
  requestAnimationFrame(render);

  // VerifyAngle();

  if(cylinder.position.y <= 5 && canMove) {
    moveGroundMissile();
  } else {
    if(cylinder.rotation.x != 1.5707963267948963) {
      canMove = false;
      cylinder.rotateX(degreesToRadians((90/9)));
      cylinder.translateZ(0.01);
    } else if(cylinder.rotation.x == 1.5707963267948963) {
      // cylinder.rotateY(degreesToRadians(45));
      // moveGroundMissile();
      findEnemy();
    }
  }

  // cylinder.rotateOnAxis((1,1,1), 0);
  renderer.render(scene, camera) // Render scene
}