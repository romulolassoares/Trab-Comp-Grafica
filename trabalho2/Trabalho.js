import * as THREE from 'three';
import Stats from '../build/jsm/libs/stats.module.js';
import KeyboardState from '../libs/util/KeyboardState.js'
import {
    initRenderer,
    initDefaultBasicLight,
    createGroundPlaneWired
} from "../libs/util/util.js";

import { default as Plane } from './Plane.js';
import { default as Enemy } from './Enemy.js';
import { default as Bullet } from './Bullet.js';

var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();
var clock = new THREE.Clock();
clock.start();
var stats = new Stats(); //Pra ver os status do FPS
initDefaultBasicLight(scene);

//********************************************//
//Criando a camera
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth/ window.innerHeight, 1, 300 );
camera.position.set(0, 100, 70);
camera.lookAt(0, 15, 0);
scene.add( camera );
//********************************************//

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

//********************************************//
//Criando os planos
var planos = [];

for(let i = 0; i< 3; i++){
    planos[i] = createGroundPlaneWired(800, 200);
    planos[i].position.set(0,0,i*-100);
    scene.add(planos[i]);
}

function moverPlanos() {
    planos.forEach(item => {
        item.translateY(-0.5);
        item.updateMatrixWorld(true);
        if(item.position.z == 50) {
            item.position.set(0,0,-250);
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
scene.add( planeHolder );
//********************************************//

//********************************************//
//Criando os tiros
const espgeometry = new THREE.SphereGeometry(1, 20, 50);
const espmaterial = new THREE.MeshLambertMaterial({color:"rgb(255, 165, 0)"});
var target = new THREE.Vector3();

var bullets = []; // Vetor de todas as balas

// Função para criar um tiro
async function createShoot() {
    let bullet = new Bullet();
    planeClass.mesh.getWorldPosition(target);
    bullet.setPosition(target);
    scene.add(bullet.mesh);
    bullets.push(bullet);
    // -------------
    // let shoot = new THREE.Mesh(espgeometry, espmaterial);
    // planeClass.mesh.getWorldPosition(target);
    // shoot.position.set(target.x,target.y,target.z);
    // // shoot.geometry.computeBoundingBox();
    // scene.add(shoot);
    // shoot.geometry.computeBoundingBox();
    // bullets.push(shoot);
}

// Função para mover os tiros para frente
function moveBullets() {
    bullets.forEach(item => {
        item.mesh.translateZ(-1);
    });
}

// Função para deletar os tiros a partir de uma posição
function deleteBullets() {
    bullets.forEach(item => {
        item.mesh.updateMatrixWorld(true);
        if(item.mesh.position.z == -185) {
            scene.remove(item.mesh);
            let id = bullets.indexOf(item);
            bullets.splice(id, 1);
        }
    });
}
 //********************************************//

//********************************************//
// Criando Adversários
// var adversarios = [];
var enemyVector = [];
// var velocidades = [];
// var cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
// var cubeMaterial = new THREE.MeshLambertMaterial({color:"rgb(120, 165, 30)"});

// função para limitar quantos inimigos tem na tela
function chamaAdversario(){
    var chance = Math.floor(Math.random()*900) + 1;
    if(chance <=10){ // 0.01%
        criarAdversario();
    }
}

function criarAdversario(){
    let enemy = new Enemy();
    var newpos = Math.floor(Math.random()*95) + 1;
    const chance = Math.floor(Math.random()*2) + 1;
    newpos = chance === 1 ? newpos : -newpos;
    enemy.setPosition(newpos);
    const velocidade = Math.floor(Math.random()*5) + 2;
    enemy.setVelocity(velocidade);
    scene.add(enemy.mesh);
    enemyVector.push(enemy);
}

// a ideia é fazer adversário se movimentarem aleatoriamente 
// sendo os tipo de movimento: vertical, horizontal, diagonal ...
function movimentarAdversario(){
    var movimento = Math.floor(Math.random()*1);
    switch(movimento){
        case 0: vertical();
        default: ;
    } 
}

// Função para mover os inimigos na vertical
function vertical(){
    enemyVector.forEach(enemy => {
        enemy.mesh.updateMatrixWorld(true);
        if(enemy.getPositionZ() >= 70){
            scene.remove(enemy.mesh);
            let id = enemyVector.indexOf(enemy);
            enemyVector.splice(id, 1);
        }
        if(enemy.getPositionZ() < 70){
            var v = enemy.velocity;
            enemy.mesh.translateZ(0.2*v);
        }
    });
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
// var enemyBox;
// var bulletBox;
var acertouaviao = false;
var aux = new THREE.Mesh();

/**
 * Função para validar se ocorreu colisão entre os tiros e os inimigos.
 * Caso ocorra uma colisão o tiro e o inimigo são removidos da tela.
 */
function colisionPlane(){
    enemyVector.forEach(enemy => {
        let planeBox = box3.copy(planeClass.getBoundingBox()).applyMatrix4(planeClass.mesh.matrixWorld);
        let enemyBox = box.copy(enemy.getBoundingBox()).applyMatrix4(enemy.mesh.matrixWorld);
        if(enemyBox.containsBox(planeBox) || enemyBox.intersectsBox(planeBox)) {
            scene.remove(enemy.mesh);
            let x = aux.copy(enemy.mesh);
            acertouaviao = true;
            enemiesAnimation.push(x);
            let id2 = enemyVector.indexOf(enemy);
            enemyVector.splice(id2, 1);
        }
    });
}

function colision() {
    enemyVector.forEach(enemy => {
        let enemyBox = box.copy(enemy.getBoundingBox()).applyMatrix4(enemy.mesh.matrixWorld);
        bullets.forEach(bullet => {
            let bulletBox = box2.copy(bullet.getBoundingBox()).applyMatrix4( bullet.mesh.matrixWorld )
            if(enemyBox.containsBox(bulletBox) || enemyBox.intersectsBox(bulletBox)) {
                let idShoot = bullets.indexOf(bullet);
                let idEnemy = enemyVector.indexOf(enemy);
                let x = aux.copy(enemy.mesh);
                enemiesAnimation.push(x);
                scene.remove(enemy.mesh);
                scene.remove(bullet.mesh);
                bullets.splice(idShoot, 1);
                enemyVector.splice(idEnemy, 1);
            }
        });
    });
}

/**
 * Para efetuar a animação dos inimigos
 */
var enemiesAnimation = [];

function removePlane(){
    if(planeClass.mesh.scale.x>=0){
        planeClass.mesh.scale.x -=.1;
        planeClass.mesh.scale.y -=.1;
        planeClass.mesh.scale.z -=.1;
    }
    if(planeClass.mesh.scale.x <= 0){
        acertouaviao = false;
        planeHolder.position.set(0,6,0);
        planeClass.mesh.scale.set(1,1,1);
    }
}

function excluirInimgo(id){
    enemiesAnimation.forEach(item => {
        if(enemiesAnimation.indexOf(item) == id){
            scene.remove(item);
            enemiesAnimation.splice(id,1);
        }
    })
}

function animation() {
    enemiesAnimation.forEach(item => {
        scene.add(item);
        item.rotation.y += 0.1;
        item.rotation.x += 0.1;
        if(item.scale.x>=0){
            item.scale.x -=.1;
            item.scale.y -=.1;
            item.scale.z -=.1;
        }
        if(item.scale.x <= 0)
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
    if (keyboard.pressed("down")){
        if(target.z <= 45)
            planeHolder.translateZ(moveDistance);
    } 
    if (keyboard.pressed("up")) {
        if(target.z >= -150)
            planeHolder.translateZ(-moveDistance);
    }
    if (keyboard.pressed("right")){
        if(target.x <= 95)
        planeHolder.translateX(moveDistance); 
    } 
    if (keyboard.pressed("left")) {
        if(target.x >= -95)
        planeHolder.translateX(-moveDistance);
    }
    if (keyboard.pressed("ctrl")) createShoot();
    if (keyboard.down("space")) createShoot();
}
//********************************************//

//********************************************//
//Função para atualizar o tamanho da tela
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
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
    if(acertouaviao)
        removePlane();
    renderer.render(scene, camera) // Render scene
}