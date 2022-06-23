import * as THREE from 'three';
import Stats from '../build/jsm/libs/stats.module.js';
import {ConvexGeometry} from '../build/jsm/geometries/ConvexGeometry.js';
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';

import KeyboardState from '../libs/util/KeyboardState.js'
import {
    onWindowResize,
    degreesToRadians,
    createGroundPlane
} from "../libs/util/util.js";

import { default as Plane } from './classes/Plane.js';
import { default as Enemy } from './classes/Enemy.js';
import { default as GroundEnemy } from './classes/GroundEnemy.js';

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
var position = new THREE.Vector3(0, 100, 100);


var dirLight = new THREE.DirectionalLight("rgb(255,255,255)");
setDirectionalLighting(position);

function setDirectionalLighting(position) {
    dirLight.position.copy(position);
    dirLight.shadow.mapSize.width = 512;
    dirLight.shadow.mapSize.height = 512;
    dirLight.castShadow = true;

    dirLight.shadow.camera.near = .1;
    dirLight.shadow.camera.far = 600;
    dirLight.shadow.camera.left = -110;
    dirLight.shadow.camera.right = 110;
    dirLight.shadow.camera.top = 200;
    dirLight.shadow.camera.bottom = -200;
    scene.add(dirLight);
}
//********************************************//
//********************************************//
//Criando a camera
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 300);
camera.position.set(0, 100, 70);
// camera.position.set(0, 0, 70);
camera.lookAt(0, 15, 0);
scene.add(camera);
//********************************************//
//Criando os planos
var planos = [];

for (let i = 0; i < 3; i++) {
    planos[i] = createGroundPlane(800.0, 200.0, 60, 60, "rgb(160,160,160)");
    //planos[i] = createGroundPlane(800, 200);
    //Usar o rotate para se for plano sem ser wired
    planos[i].rotateX(degreesToRadians(-90));
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
var loader = new GLTFLoader();
var obj;
var mesh;
const xx = loader.load('./assets/Airplane.glb', function (gltf) {
    obj = gltf.scene;
    console.log(gltf)
    mesh = obj.children;
    obj.name = 'airplane';
    console.log(mesh);
    obj.visible = true;
    obj.traverse(function (child) {
        if (child) {
            child.castShadow = true;
        }
    });
}, onProgress, onError);

function onError() { };

function onProgress(xhr, model) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
    }
}
console.log(xx)
const planeClass = new Plane(obj);
var planeHolder = new THREE.Object3D();
planeHolder.add(planeClass.mesh);
scene.add(planeHolder);
//********************************************//
var target = new THREE.Vector3();

//********************************************//
// Criando Adversários
var enemyVector = [];
var groundEnemyVector = [];

// função para limitar quantos inimigos tem na tela
function chamaAdversario() {
    var chance = Math.floor(Math.random() * 900) + 1;
    if (chance <= 900) { // 0.01%
        criarAdversario();
    }
    if(chance <= 1){
        criarAdversarioChao();
    }
}

function criarAdversario() {
    let enemy = new Enemy();
    var newpos = Math.floor(Math.random() * 95) + 1;
    //newpos = 0;
    const chance = Math.floor(Math.random() * 2) + 1;
    newpos = chance === 1 ? newpos : -newpos;
    enemy.setPosition(newpos);
    const velocidade = Math.floor(Math.random() * 5) + 2;
    enemy.setVelocity(velocidade);
    scene.add(enemy.mesh);
    enemyVector.push(enemy);
}

function criarAdversarioChao() {
    let enemy = new GroundEnemy();
    var newpos = Math.floor(Math.random() * 95) + 1;
    //newpos = 30;
    const chance = Math.floor(Math.random() * 2) + 1;
    newpos = chance === 1 ? newpos : -newpos;
    enemy.setPosition(newpos);
    const velocidade = Math.floor(Math.random() * 5) + 2;
    enemy.setVelocity(velocidade);
    scene.add(enemy.mesh);
    groundEnemyVector.push(enemy);
}
// a ideia é fazer adversário se movimentarem aleatoriamente 
// sendo os tipo de movimento: vertical, horizontal, diagonal ...
function movimentarAdversario() {
    enemyVector.forEach(enemy => {
        // if(enemy.moveType === 0) {
        //     vertical(enemy);
        // } else if(enemy.moveType === 1) {
        //     diagonal(enemy);
        // } else if(enemy.moveType === 2) {
        //     verticalAndStop(enemy);
        // }
        // diagonal(enemy);
        // verticalAndStop(enemy);
        moveRotate(enemy);
    });
    groundEnemyVector.forEach(enemy => {
        verticalChao(enemy);
    })
}

// Função para mover os inimigos na vertical
function vertical(enemy) {
    enemy.mesh.updateMatrixWorld(true);
    if (enemy.getPositionZ() >= 70) {
        scene.remove(enemy.mesh);
        let id = enemyVector.indexOf(enemy);
        // enemyVector.splice(id, 1);
    }
    if (enemy.getPositionZ() < 70) {
        enemy.verticalMove();
    }
}

function verticalAndStop(enemy) {
    enemy.mesh.updateMatrixWorld(true);
    if (enemy.getPositionZ() >= 70 || enemy.getPositionX() > 120 || enemy.getPositionX() < -120) {
        scene.remove(enemy.mesh);
        let id = enemyVector.indexOf(enemy);
        enemyVector.splice(id, 1);
    }
    if (enemy.getPositionZ() < -30) {
        enemy.verticalMove();
    }
    if(enemy.getPositionX() >= 95 || enemy.getPositionX() < -95) {
        enemy.dir = -enemy.dir;
        enemy.timeAlive--;
    }
    if(enemy.getPositionZ() >= -40) {
        var v = enemy.velocity;
        var x = enemy.dir;
        if(enemy.timeAlive > 0){
            enemy.mesh.translateX(0.2 * v * x);
        } else {
            enemy.mesh.translateX(0.2 * v);
        }
    }
}

function verticalChao(enemy) {
    enemy.mesh.updateMatrixWorld(true);
    if (enemy.getPositionZ() >= 70) {
        scene.remove(enemy.mesh);
        let id = groundEnemyVector.indexOf(enemy);
        groundEnemyVector.splice(id,1);
    }
    if (enemy.getPositionZ() < 70) {
        var v = enemy.velocity;
        enemy.mesh.translateZ(0.2 * v);
    }
}

function diagonal(enemy) {
    enemy.mesh.updateMatrixWorld(true);
    if (enemy.getPositionZ() >= 70) {
        scene.remove(enemy.mesh);
        let id = enemyVector.indexOf(enemy);
        enemyVector.splice(id, 1);
    }
    if(enemy.getPositionX() >= 95 || enemy.getPositionX() < -95) {
        enemy.dir = -enemy.dir
    }
    if (enemy.getPositionZ() < 70) {
        var v = enemy.velocity;
        var x = enemy.dir;
        enemy.mesh.translateZ(0.2 * v);
        enemy.mesh.translateX(0.2 * v * x);
    }
}


const path = new THREE.Path();
path.absarc(0, 90, degreesToRadians(2360), degreesToRadians(0), degreesToRadians(180), true)
const points = path.getPoints();

const geometry = new THREE.BufferGeometry().setFromPoints( points );
const material = new THREE.LineBasicMaterial( { color: 0xffffff } );

const line = new THREE.Line( geometry, material );
scene.add( line );
function moveRotate(enemy) {
    enemy.mesh.updateMatrixWorld(true);
    if (enemy.getPositionZ() >= 70) {
        scene.remove(enemy.mesh);
        let id = enemyVector.indexOf(enemy);
        // enemyVector.splice(id, 1);
    }
    if (enemy.getPositionZ() < 70) {
        enemy.rotateMove(path);
    }
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
            console.log(planeClass.vida);
            planeClass.damage(10);
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
function colisionMissileEnemy() {
    let missiles = planeClass.getMissiles();
    groundEnemyVector.forEach(enemy => {
        let enemyBox = box.copy(enemy.getBoundingBox()).applyMatrix4(enemy.mesh.matrixWorld);
        missiles.forEach(missile => {
            let missileBox = box2.copy(missile.getBoundingBox()).applyMatrix4( missile.mesh.matrixWorld )
            if(enemyBox.containsBox(missileBox) || enemyBox.intersectsBox(missileBox)) {
                planeClass.deleteOneMissile(missile, scene);
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
        planeClass.deletePlane(scene, planeHolder);
        // planeHolder.geometry.dispose();
        scene.remove(planeHolder);
        //Parece que a boudingBox ainda ta na cena
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
    groundEnemyVector.forEach(enemy => {
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
                let idEnemy = groundEnemyVector.indexOf(enemy);
                scene.remove(enemy.mesh);
                groundEnemyVector.splice(idEnemy, 1);
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
    if (keyboard.down("G")) {
        if (planeClass.getVida() > 10){
            planeClass.vida = 10
        }
        else
            planeClass.vida = 100000000000
    }
    if (keyboard.pressed("ctrl") && !cooldownBullet){
        planeClass.createShoot(scene);
        cooldownBullet = true;
        setTimeout( () => cooldownBullet = false, 500);
    }
    if (keyboard.pressed("space") && !cooldownMissile){
        planeClass.createMissiles(scene);
        cooldownMissile = true;
        setTimeout( () => cooldownMissile = false, 1000);
    }
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
    colisionMissileEnemy();
    animation();

    //if(acertouaviao) removePlane();

    if(planeClass.vida <= 0){
        removePlane();
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
}