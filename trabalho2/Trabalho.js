import * as THREE from 'three';
import Stats from '../build/jsm/libs/stats.module.js';
import {ConvexGeometry} from '../build/jsm/geometries/ConvexGeometry.js';
import KeyboardState from '../libs/util/KeyboardState.js'
import {
    onWindowResize,
    degreesToRadians,
    createGroundPlaneWired
} from "../libs/util/util.js";

import { default as Plane } from './Plane.js';
import { default as Enemy } from './Enemy.js';

var scene = new THREE.Scene();    // Create main scene

var renderer = new THREE.WebGLRenderer();
document.getElementById("webgl-output").appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap; // default

var clock = new THREE.Clock();
clock.start();
var stats = new Stats(); //Pra ver os status do FPS
// initDefaultBasicLight(scene);
// var renderer = initRenderer();
//********************************************//
// Criando a luz
var position = new THREE.Vector3(0, 100, 70);


var dirLight = new THREE.DirectionalLight("rgb(255,255,255)");
setDirectionalLighting(position);

function setDirectionalLighting(position) {
    dirLight.position.copy(position);
    dirLight.shadow.mapSize.width = 256;
    dirLight.shadow.mapSize.height = 256;
    dirLight.castShadow = true;

    dirLight.shadow.camera.near = .1;
    dirLight.shadow.camera.far = 20;
    dirLight.shadow.camera.left = -2.5;
    dirLight.shadow.camera.right = 2.5;
    dirLight.shadow.camera.top = 2.5;
    dirLight.shadow.camera.bottom = -2.5;

    scene.add(dirLight);
}
//********************************************//

//********************************************//
//Criando a camera
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 300);
camera.position.set(0, 100, 70);
camera.lookAt(0, 15, 0);
scene.add(camera);
//********************************************//

//********************************************//
//Criando os planos
var planos = [];

for (let i = 0; i < 3; i++) {
    planos[i] = createGroundPlaneWired(800, 200);
    //Usar o rotate para se for plano sem ser wired
    // planos[i].rotateX(degreesToRadians(-90));
    planos[i].position.set(0, 0, i * -100);
    planos[i].receiveShadow = true;
    scene.add(planos[i]);
}

function moverPlanos() {
    planos.forEach(item => {
        item.translateY(-0.5);
        item.updateMatrixWorld(true);
        if (item.position.z == 50) {
            item.position.set(0, 0, -250);
        }
    });
}
//********************************************//

//Para usar o Keyboard
var keyboard = new KeyboardState();

//********************************************//
//Criando o avião
const planeClass = new Plane();
var planeHolder = new THREE.Object3D();
planeHolder.add(planeClass.mesh);
scene.add(planeHolder);
//********************************************//

//********************************************//
//Criando os tiros
const espgeometry = new THREE.SphereGeometry(1, 20, 50);
const espmaterial = new THREE.MeshLambertMaterial({ color: "rgb(255, 165, 0)" });
var target = new THREE.Vector3();

var bullets = []; // Vetor de todas as balas

// Função para criar um tiro
function createShoot() {
    let shoot = new THREE.Mesh(espgeometry, espmaterial);
    planeClass.mesh.getWorldPosition(target);
    shoot.position.set(target.x, target.y, target.z);
    // shoot.geometry.computeBoundingBox();
    scene.add(shoot);
    shoot.geometry.computeBoundingBox();
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
        if (item.position.z == -185) {
            scene.remove(item);
            let id = bullets.indexOf(item);
            bullets.splice(id, 1);
        }
    });
}
//********************************************//

//********************************************//
// Criando Adversários
var adversarios = [];
var enemyVector = [];
var velocidades = [];
var cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
var cubeMaterial = new THREE.MeshLambertMaterial({ color: "rgb(120, 165, 30)" });

// função para limitar quantos inimigos tem na tela
function chamaAdversario() {
    var chance = Math.floor(Math.random() * 900) + 1;
    if (chance <= 1) { // 0.01%
        criarAdversario();
    }
}

function criarAdversario() {
    let enemy = new Enemy();
    var newpos = Math.floor(Math.random() * 95) + 1;
    newpos = 0;
    const chance = Math.floor(Math.random() * 2) + 1;
    newpos = chance === 1 ? newpos : -newpos;
    enemy.setPosition(newpos);
    const velocidade = Math.floor(Math.random() * 5) + 2;
    enemy.setVelocity(velocidade);
    enemy.castShadow = true;
    enemy.receiveShadow = true;
    scene.add(enemy.mesh);
    enemyVector.push(enemy);
}

// a ideia é fazer adversário se movimentarem aleatoriamente 
// sendo os tipo de movimento: vertical, horizontal, diagonal ...
function movimentarAdversario() {
    enemyVector.forEach(enemy => {
        enemy.movimentation = Math.floor(Math.random() * 2);
        switch (enemy.movimentation) {
            // case 0: vertical(enemy);
            case 1: diagonal(enemy);
            default: ;
        }
    });
}

// Função para mover os inimigos na vertical
function vertical(enemy) {
    enemy.mesh.updateMatrixWorld(true);
    if (enemy.getPositionZ() >= 70) {
        scene.remove(enemy.mesh);
        let id = enemyVector.indexOf(enemy);
        enemyVector.splice(id, 1);
    }
    if (enemy.getPositionZ() < 70) {
        var v = enemy.velocity;
        enemy.mesh.translateZ(0.2 * v);
    }
}

function diagonal(enemy) {
    enemy.mesh.updateMatrixWorld(true);
    if (enemy.getPositionZ() >= 70 && enemy.getPositionX() >= 95) {
        scene.remove(enemy.mesh);
        let id = enemyVector.indexOf(enemy);
        enemyVector.splice(id, 1);
    }
    if (enemy.getPositionX() < 95 || enemy.getPositionZ() < 70) {
        var v = enemy.velocity;
        enemy.mesh.translateZ(0.2 * v);
        enemy.mesh.translateX(0.2 * v);
    }
}
//********************************************//

//********************************************//
/**
 * Colisão en
      // aviaoBox = box3.copy(cone.geometry.boundingBox).applyMatrix4(cone.matrixWorld);tre tiro e inimigo e animção
 */
const box = new THREE.Box3();
const box2 = new THREE.Box3();
const box3 = new THREE.Box3();
var enemyBox;
var bulletBox;
var acertouaviao = false;
var aux = new THREE.Mesh();

/**
 * Função para validar se ocorreu colisão entre os tiros e os inimigos.
 * Caso ocorra uma colisão o tiro e o inimigo são removidos da tela.
 */
function colisionPlane() {
    enemyVector.forEach(enemy => {
        let planeBox = box3.copy(planeClass.getBoundingBox()).applyMatrix4(planeClass.mesh.matrixWorld);
        let enemyBox = box.copy(enemy.getBoundingBox()).applyMatrix4(enemy.mesh.matrixWorld);
        if (enemyBox.containsBox(planeBox) || enemyBox.intersectsBox(planeBox)) {
            scene.remove(enemy.mesh);
            let x = aux.copy(enemy.mesh);
            planeClass.acertouaviao = true;
            enemiesAnimation.push(x);
            let id2 = enemyVector.indexOf(enemy);
            enemyVector.splice(id2, 1);
            planeClass.damage(2);
            console.log(planeClass.vida);
        }
    });
}

function colision() {
    enemyVector.forEach(enemy => {
        let enemyBox = box.copy(enemy.getBoundingBox()).applyMatrix4(enemy.mesh.matrixWorld);
        bullets.forEach(shoot => {
            bulletBox = box2.copy(shoot.geometry.boundingBox).applyMatrix4(shoot.matrixWorld)
            if (enemyBox.containsBox(bulletBox) || enemyBox.intersectsBox(bulletBox)) {
                let idShoot = bullets.indexOf(shoot);
                let idEnemy = enemyVector.indexOf(enemy);
                let x = aux.copy(enemy.mesh);
                enemiesAnimation.push(x);
                scene.remove(enemy.mesh);
                scene.remove(shoot);
                bullets.splice(idShoot, 1);
                enemyVector.splice(idEnemy, 1);
            }
        })
    })
    // adversarios.forEach(enemy => {
    //     enemyBox = box.copy( enemy.geometry.boundingBox ).applyMatrix4( enemy.matrixWorld )
    //     bullets.forEach(shoot => {
    //         bulletBox = box2.copy( shoot.geometry.boundingBox ).applyMatrix4( shoot.matrixWorld )
    //         if(enemyBox.containsBox(bulletBox) || enemyBox.intersectsBox(bulletBox)) {
    //             let x = aux.copy(enemy);
    //             enemiesAnimation.push(x);
    //             let id2 = adversarios.indexOf(enemy);
    //             scene.remove(enemy);
    //             scene.remove(shoot);
    //             let id = bullets.indexOf(shoot);
    //             bullets.splice(id, 1);
    //             adversarios.splice(id2, 1);
    //             velocidades.splice(id2, 1);
    //         }
    //     });
    // });
}

/**
 * Para efetuar a animação dos inimigos
 */
var enemiesAnimation = [];

function removePlane() {
    if (planeClass.mesh.scale.x >= 0) {
        planeClass.mesh.scale.x -= .1;
        planeClass.mesh.scale.y -= .1;
        planeClass.mesh.scale.z -= .1;
    }
    if (planeClass.mesh.scale.x <= 0) {
        planeClass.acertouaviao = false;
        planeHolder.position.set(0, 6, 0);
        planeClass.mesh.scale.set(1, 1, 1);
    }
}

function excluirInimgo(id) {
    enemiesAnimation.forEach(item => {
        if (enemiesAnimation.indexOf(item) == id) {
            scene.remove(item);
            enemiesAnimation.splice(id, 1);
        }
    })
}

function animation() {
    enemiesAnimation.forEach(item => {
        scene.add(item);
        item.rotation.y += 0.1;
        item.rotation.x += 0.1;
        if (item.scale.x >= 0) {
            item.scale.x -= .1;
            item.scale.y -= .1;
            item.scale.z -= .1;
        }
        if (item.scale.x <= 0)
            excluirInimgo(enemiesAnimation.indexOf(item));
    })
}
//********************************************//

//********************************************//
//Função para usar as teclas
function keyboardUpdate() {
    keyboard.update();
    var speed = 40;
    var moveDistance = speed * clock.getDelta();
    // Keyboard.pressed - execute while is pressed
    planeClass.mesh.getWorldPosition(target);
    if (keyboard.pressed("down")) {
        if (target.z <= 45)
            planeHolder.translateZ(moveDistance);
    }
    if (keyboard.pressed("up")) {
        if (target.z >= -150)
            planeHolder.translateZ(-moveDistance);
    }
    if (keyboard.pressed("right")) {
        if (target.x <= 95)
            planeHolder.translateX(moveDistance);
    }
    if (keyboard.pressed("left")) {
        if (target.x >= -95)
            planeHolder.translateX(-moveDistance);
    }
    if (keyboard.pressed("ctrl")) createShoot();
    if (keyboard.pressed("space")) createShoot();
}
//********************************************//

//********************************************//
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
//********************************************//
render();

document.getElementById("webgl-output").appendChild(stats.domElement);//Pra mostrar o FPS

function render() {
    stats.update();
    onWindowResize();
    keyboardUpdate();
    moveBullets();
    deleteBullets();
    moverPlanos();
    chamaAdversario();
    movimentarAdversario();
    colision();
    colisionPlane();
    animation();
    requestAnimationFrame(render);
    if (planeClass.acertouaviao)
        removePlane();
    if (planeClass.vida == 0) {
        scene.remove(planeHolder);
    }
    renderer.render(scene, camera) // Render scene
}