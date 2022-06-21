import * as THREE from 'three';
import Stats from '../build/jsm/libs/stats.module.js';
import KeyboardState from '../libs/util/KeyboardState.js'
import {
    initRenderer,
    initDefaultBasicLight,
    createGroundPlaneWired
} from "../libs/util/util.js";

import { default as Plane } from './classes/Plane.js';
import { default as Enemy } from './classes/Enemy.js';

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
// camera.position.set(0, 0, 70);
camera.lookAt(0, 15, 0);
scene.add( camera );
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
var target = new THREE.Vector3();

//********************************************//
// Criando Adversários
var enemyVector = [];

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
const box = new THREE.Box3();
const box2 = new THREE.Box3();
const box3 = new THREE.Box3();
var acertouaviao = false;

/**
 * Função para validar se ocorreu colisão entre os tiros e os inimigos.
 * Caso ocorra uma colisão o tiro e o inimigo são removidos da tela.
 */
function colisionPlaneEnemy(){
    enemyVector.forEach(enemy => {
        let planeBox = box3.copy(planeClass.getBoundingBox()).applyMatrix4(planeClass.mesh.matrixWorld);
        let enemyBox = box.copy(enemy.getBoundingBox()).applyMatrix4(enemy.mesh.matrixWorld);
        if(enemyBox.containsBox(planeBox) || enemyBox.intersectsBox(planeBox)) {
            acertouaviao = true;
            enemy.deleteAllBullets(scene);
            enemy.setIsDead(scene);
        }
    });
}

// Bug -> não deleta todos os tiros de um inimigo da tela
function colisionBulletEnemy() {
    let bullets = planeClass.getBullets();
    enemyVector.forEach(enemy => {
        let enemyBox = box.copy(enemy.getBoundingBox()).applyMatrix4(enemy.mesh.matrixWorld);
        bullets.forEach(bullet => {
            let bulletBox = box2.copy(bullet.getBoundingBox()).applyMatrix4( bullet.mesh.matrixWorld )
            if(enemyBox.containsBox(bulletBox) || enemyBox.intersectsBox(bulletBox)) {
                planeClass.deleteOneBullet(bullet, scene);
                enemy.deleteAllBullets(scene);
                enemy.setIsDead(scene);
            }
        });
    });
}
/**
 * Para efetuar a animação dos inimigos
 */
// var enemiesAnimation = [];
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

function animation() {
    enemyVector.forEach(enemy => {
        if(enemy.isDead == true){
            console.log("dead");
            enemy.mesh.rotation.y += 0.1;
            enemy.mesh.rotation.x += 0.1;
            if(enemy.mesh.scale.x>=0){
                enemy.mesh.scale.x -=.1;
                enemy.mesh.scale.y -=.1;
                enemy.mesh.scale.z -=.1;
            }
            if(enemy.mesh.scale.x <= 0) {
                let idEnemy = enemyVector.indexOf(enemy);
                scene.remove(enemy.mesh);
                enemyVector.splice(idEnemy, 1);
            }
        }
    })
}

//********************************************//

//********************************************//
let cooldownBullet = false;
let cooldownMissile = false;
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
    if (keyboard.pressed("ctrl") && !cooldownBullet){
        planeClass.createShoot(scene);
        cooldownBullet = true;
        setTimeout( () => cooldownBullet = false, 500);
    }
    if (keyboard.down("space") && !cooldownMissile){
        planeClass.createMissiles(scene);
        cooldownMissile = true;
        setTimeout( () => cooldownMissile = false, 800);
    }
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

    moverPlanos();

    planeClass.moveBullets();
    planeClass.moveMissiles();
    planeClass.deleteBullets(scene);
    planeClass.deleteMissiles(scene);

    chamaAdversario();
    movimentarAdversario();

    enemyVector.forEach(element => {
        element.createEnemyShoot(scene);
        element.moveBullets();
        if(element.getPositionZ() > 45) {
            element.deleteAllBullets(scene);
        }
    });

    colisionBulletEnemy();
    colisionPlaneEnemy();
    animation();

    if(acertouaviao) removePlane();

    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
}