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
clock.start();
var stats = new Stats(); //Pra ver os status do FPS
initDefaultBasicLight(scene);

//Criando a camera
// var camera = new THREE.PerspectiveCamera( 60, window.innerWidth/ window.innerHeight, 1, 500 );
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth/ window.innerHeight, 1, 300 );
camera.position.set(0, 100, 70);
camera.lookAt(0, 15, 0);
scene.add( camera );

//Criando os planos
var planos = [];

for(let i = 0; i< 3; i++){
    planos[i] = createGroundPlaneWired(800, 200);
    planos[i].position.set(0,0,i*-100);
    scene.add(planos[i]);
}


function moverPlanos() {
    // console.log(planos[0].position.y + 'y');
    // console.log(planos[0].position.x+'x');
    // console.log(planos[0].position.z+'z');
    planos.forEach(item => {
        item.translateY(-0.5);
        item.updateMatrixWorld(true);
        
        if(item.position.z == 50) {
            // console.log("entrou no if");
            item.position.set(0,0,-250);
        }
    });
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

var bullets = []; // Vetor de todas as balas

// Função para criar um tiro
function createShoot() {
    let shoot = new THREE.Mesh(espgeometry, espmaterial);
    cone.getWorldPosition(target);
    shoot.position.set(target.x,target.y,target.z);
    scene.add(shoot);
    bullets.push(shoot);
}

// Função para mover os tiros para frente
function moveBullets() {
    bullets.forEach(item => {
        item.translateZ(-1);
    });
}

// Função para deletar os tiros a partir de uma posição
function deleteBullets() {
    bullets.forEach(item => {
        item.updateMatrixWorld(true);
        if(item.position.z == -120) {
            console.log(item + " passou do limite");
            scene.remove(item);
        }
    });
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
    // if (keyboard.down("ctrl")) atirar();
    // if (keyboard.down("space")) atirar();
    if (keyboard.down("ctrl")) createShoot();
    if (keyboard.down("space")) createShoot();
}

render();

document.getElementById("webgl-output").appendChild(stats.domElement);//Pra mostrar o FPS

function render() {
    stats.update();
    keyboardUpdate();
    // tiroAndar();
    moveBullets();
    deleteBullets();
    moverPlanos();
    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
}