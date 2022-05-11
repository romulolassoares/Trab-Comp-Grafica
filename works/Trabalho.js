import * as THREE from 'three';
import Stats from '../build/jsm/libs/stats.module.js';
import KeyboardState from '../libs/util/KeyboardState.js'
import {
    initRenderer,
    initCamera,
    initDefaultBasicLight,
    InfoBox,
    onWindowResize,
    createGroundPlaneWired
} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();
var clock = new THREE.Clock();
var stats = new Stats(); //Pra ver os status do FPS
initDefaultBasicLight(scene);

//Criando a camera
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth/ window.innerHeight, 1, 500 );
camera.position.set(-2, 50, 50);
camera.lookAt(0, 5, 0);
scene.add( camera );

//Criando os planos
var planos = [];

for(let i = 0; i< 3; i++){
    planos[i] = createGroundPlaneWired(400, 200);
    planos[i].position.set(0,0,i*-50);
    scene.add(planos[i]);
}

//Para usar o Keyboard
var keyboard = new KeyboardState();

//Criando o avião
const geometry = new THREE.ConeGeometry( 3, 10, 64 );
const material = new THREE.MeshLambertMaterial( {color:'rgb(180,180,255)'} );
var cone = new THREE.Mesh( geometry, material );
cone.position.set(0,4,0);
cone.rotateX(-1.6);

//Criando o que vai movimentar o avião
var planeHolder = new THREE.Object3D();
planeHolder.add(cone);
scene.add( planeHolder );

//Criando os tiros
const espgeometry = new THREE.SphereGeometry(0.5, 20, 50);
const espmaterial = new THREE.MeshLambertMaterial({color:"rgb(255, 165, 0)"});
var target = new THREE.Vector3();

//Função pro tiro movimentar
function tiroAndar(){ 
    var speed = 40;
    var moveDistance = speed * clock.getDelta();
    tiroholder.translateZ(-moveDistance);

} 
//Função que cria o tiro e chama a função para movimenta-lo
var tiro = new THREE.Mesh(espgeometry,espmaterial);
var tiroholder = new THREE.Object3D();

function atirar(){
    cone.getWorldPosition(target);
    tiro.position.set(target.x,target.y,target.z);

    tiroholder.add(tiro)
    scene.add(tiroholder);
    tiroAndar();
    //scene.remove(tiro);
} 

//Função para usar as teclas
function keyboardUpdate() {

    keyboard.update();

    var speed = 40;
    var moveDistance = speed * clock.getDelta();

    // Keyboard.pressed - execute while is pressed
    if (keyboard.pressed("down")) planeHolder.translateZ(moveDistance);
    if (keyboard.pressed("up")) planeHolder.translateZ(-moveDistance);
    if (keyboard.pressed("right")) planeHolder.translateX(moveDistance);
    if (keyboard.pressed("left")) planeHolder.translateX(-moveDistance);

    // Keyboard.down - execute only once per key pressed
    if (keyboard.down("ctrl")) atirar();
    if (keyboard.down("space")) atirar();
}

render();

document.getElementById("webgl-output").appendChild(stats.domElement);//Pra mostrar o FPS

function render() {
    stats.update();
    keyboardUpdate();
    tiroAndar();
    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
}