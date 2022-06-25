import * as THREE from 'three';
import Stats from '../build/jsm/libs/stats.module.js';
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';
import KeyboardState from '../libs/util/KeyboardState.js'
import {
    onWindowResize,
    degreesToRadians,
    createGroundPlaneWired
} from "../libs/util/util.js";

import { default as Plane } from './classes/Plane.js';
import { default as Enemy } from './classes/Enemy.js';
import { default as GroundEnemy } from './classes/GroundEnemy.js';
import { default as Cura } from './classes/Cura.js';

var scene = new THREE.Scene();    // Create main scene

var renderer = new THREE.WebGLRenderer({alpha: true});
document.getElementById("webgl-output").appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap; // default
renderer.autoClear = false;

var clock = new THREE.Clock();
clock.start();
var stats = new Stats(); //Pra ver os status do FPS
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
// camera.position.set(0, 20, 70);
camera.lookAt(0, 15, 0);
scene.add(camera);

var camPosition = new THREE.Vector3( 0, -200, 30 );
var vcWidth = 400; 
var vcHeidth = 300; 
var virtualCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 300); 
  virtualCamera.position.copy(camPosition);
  scene.add(virtualCamera);
//********************************************//
//Criando os planos
var planos = [];

for (let i = 0; i < 3; i++) {
    planos[i] = createGroundPlaneWired(800.0, 200.0);
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
var material;
const afterLoadPlane = (object) => {
    planeClass.setObj(object);
    scene.add(object);
    planeHolder = planeClass.obj
    play = true;
};

const afterLoadGroundEnemy = (enemy, object) => {
    enemy.setObj(object);
    scene.add(object);
    planeHolder = enemy.obj
    play = true;
};

loader.load('./assets/Airplane.glb', function (gltf) {
    obj = gltf.scene;
    obj.position.set(0,46,0);
    obj.name = 'airplane';
    obj.visible = true;
    obj.traverse(function (child) {
        if (child) {
            child.castShadow = true;
        }
    });
    afterLoadPlane(obj);
}, onProgress, onError);

loader.load('./assets/ToonTank.glb', function (gltf) {
    obj = gltf.scene;
    obj.position.set(0,46,0);
    obj.name = 'airplane';
    obj.visible = true;
    obj.traverse(function (child) {
        if (child) {
            child.castShadow = true;
        }
    });
    // afterLoadPlane(obj);
}, onProgress, onError);

function onError() { };

function onProgress(xhr, model) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
    }
}

const planeClass = new Plane();
var planeHolder = new THREE.Object3D();
scene.add(planeHolder);
// scene.add(planeClass.mesh);
//********************************************//
var target = new THREE.Vector3();

//********************************************//
// Criando Adversários
var play = false;
var passTime = false;
var enemyVector = [];
var groundEnemyVector = [];
var curaVector = [];

// função para limitar quantos inimigos tem na tela
var cooldownType0 = false;
var cooldownType1 = true;
var cooldownType2 = true;
var cooldownType3 = true;
var cooldownType4 = true;
var cooldownType5 = true;
setTimeout( () => cooldownType1 = false, 5000);
setTimeout( () => cooldownType2 = false, 8000);
setTimeout( () => cooldownType3 = false, 12000);
setTimeout( () => cooldownType4 = false, 20000);
setTimeout( () => cooldownType5 = false, 6000);

function chamaAdversario() {
    if(!cooldownType0) {
        cooldownType0 = true;
        setTimeout( () => cooldownType0 = false, 10000);
        criarAdversario(0);
    } else if (!cooldownType1) {
        cooldownType1 = true;
        setTimeout( () => cooldownType1 = false, 25000);
        criarAdversario(1);
    } else if (!cooldownType2) {
        cooldownType2 = true;
        setTimeout( () => cooldownType2 = false, 50000);
        criarAdversario(2);
    } else if (!cooldownType3) {
        cooldownType3 = true;
        setTimeout( () => cooldownType3 = false, 45000);
        criarAdversario(3);
    }
    if(!cooldownType4){
        cooldownType4 = true;
        setTimeout( () => cooldownType4 = false, 30000);
        criarAdversarioChao();
    }
    if(!cooldownType5) {
        cooldownType5 = true;
        setTimeout( () => cooldownType5 = false, 10000);
        criarCura();
    }
}

function criarCura(){
    let cura = new Cura();
    var newpos = Math.floor(Math.random() * 95) + 1;
    //newpos = 0;
    const chance = Math.floor(Math.random() * 2) + 1;
    newpos = chance === 1 ? newpos : -newpos;
    cura.setPosition(newpos);
    scene.add(cura.mesh);
    curaVector.push(cura);
}

function verticalCura() {
    curaVector.forEach(cura => {
        cura.mesh.updateMatrixWorld(true);
        if (cura.getPositionZ() >= 70) {
            scene.remove(cura.mesh);
            let id = curaVector.indexOf(cura);
            curaVector.splice(id, 1);
        }
        if (cura.getPositionX() < 70) {
            cura.mesh.translateY(0.5);
        }
    });
}


function criarAdversario(type) {
    let enemy = new Enemy(type);
    loader.load('./assets/Spacecraft.glb', function (gltf) {
        obj = gltf.scene;
        obj.position.set(0,46,0);
        obj.name = 'enemy';
        obj.visible = true;
        obj.traverse(function (child) {
            if (child) {
                child.castShadow = true;
            }
        });
        scene.add(obj);
        afterload(gltf.scene);
    }, onProgress, onError);
    var newpos = Math.floor(Math.random() * 95) + 1;
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
        let id = enemyVector.indexOf(enemy);
        enemy.move(enemyVector, id, scene);
    });
    groundEnemyVector.forEach(enemy => {
        verticalChao(enemy);
    })
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
//********************************************//

//********************************************//
const box = new THREE.Box3();
const box2 = new THREE.Box3();
const box3 = new THREE.Box3();

/**
 * Função para validar se ocorreu colisão entre os tiros e os inimigos.
 * Caso ocorra uma colisão o tiro e o inimigo são removidos da tela.
 */
var del = 0;
function colisionPlaneEnemy(){
    enemyVector.forEach(enemy => {
        let planeBox = box3.copy(planeClass.getBoundingBox()).applyMatrix4(planeClass.mesh.matrixWorld);
        let enemyBox = box.copy(enemy.getBoundingBox()).applyMatrix4(enemy.mesh.matrixWorld);
        if(enemyBox.containsBox(planeBox) || enemyBox.intersectsBox(planeBox)) {
            enemy.deleteAllBullets(scene);
            enemy.setIsDead(scene);
            // console.log(planeClass.vida);
            if(planeClass.getIsMortal()){
                console.log(planeClass.vida);
                planeClass.damage(1);
                takeOneHealthBar();
                planeClass.damage(1);
                takeOneHealthBar();
            }
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
function colisionBulletPlane() {
    enemyVector.forEach(enemy => {
        let bullets = enemy.getBullets();
        let planeBox = box.copy(planeClass.getBoundingBox()).applyMatrix4(planeClass.mesh.matrixWorld);
        bullets.forEach(bullet => {
            let bulletBox = box2.copy(bullet.getBoundingBox()).applyMatrix4( bullet.mesh.matrixWorld )
            if(planeBox.containsBox(bulletBox) || planeBox.intersectsBox(bulletBox)) {
                enemy.deleteOneBullet(bullet, scene);
                if(planeClass.isMortal){
                    planeClass.damage(1);
                    takeOneHealthBar();
                }
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
                enemy.deleteAllMissiles(scene);
                enemy.setIsDead(scene);
            }
        });
    });
}
function colisionCuraPlane() {
    curaVector.forEach(cura => {
        let planeBox = box3.copy(planeClass.getBoundingBox()).applyMatrix4(planeClass.mesh.matrixWorld);
        let curaBox = box.copy(cura.getBoundingBox()).applyMatrix4(cura.mesh.matrixWorld);
        if(curaBox.containsBox(planeBox) || curaBox.intersectsBox(planeBox)) {
            if(planeClass.canTakeLife){
                gainOneHealthBar();
                planeClass.recover(1);
                cura.setIsCaught();
            }
        }
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
    curaVector.forEach(cura => {
        if(cura.isCaught)
        if(cura.mesh.scale.x>=0){
            cura.mesh.scale.x -=.1;
            cura.mesh.scale.y -=.1;
            cura.mesh.scale.z -=.1;
        }
    });
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
        if (target.z <= 45) {
            // planeHolder.translateZ(moveDistance);
            // planeHolder.translateX(moveDistance);
            planeClass.moveDown(moveDistance);
            // planeClass.obj.translateX(moveDistance);
        }
    }
    if (keyboard.pressed("up")) {
        if (target.z >= -150) {
            // planeHolder.translateZ(-moveDistance);
            // planeHolder.translateX(-moveDistance);
            // planeClass.obj.translateX(-moveDistance)
            planeClass.moveUp(moveDistance);
        }
    }
    if (keyboard.pressed("right")) {
        if (target.x <= 95) {
            // planeHolder.translateX(moveDistance);
            // planeHolder.translateZ(-moveDistance);
            // planeClass.obj.translateZ(-moveDistance)
            planeClass.moveRight(moveDistance);
        }
    }
    if (keyboard.pressed("left")) {
        if (target.x >= -95) {
            // planeHolder.translateX(-moveDistance);
            // planeHolder.translateZ(moveDistance);
            // planeClass.obj.translateZ(moveDistance)
            planeClass.moveLeft(moveDistance);
        }
    }
    if (keyboard.up("right")) {
        planeClass.obj.rotateX(degreesToRadians(12));
    }
    if (keyboard.up("left")) {
        planeClass.obj.rotateX(degreesToRadians(-12));
    }
    if (keyboard.down("G")) {
        planeClass.isMortal = !planeClass.isMortal;
    }
    if (keyboard.pressed("ctrl") && !cooldownBullet){
        planeClass.createShoot(scene);
        cooldownBullet = true;
        setTimeout( () => cooldownBullet = false, 1000);
    }
    if (keyboard.pressed("space") && !cooldownMissile){
        planeClass.createMissiles(scene);
        cooldownMissile = true;
        setTimeout( () => cooldownMissile = false, 2000);
    }
    if (keyboard.pressed("enter")){
        play = false;
        enemyVector.forEach(enemy => {
            enemy.deleteAllBullets(scene);
            enemy.setIsDead(scene);
        });
        groundEnemyVector.forEach(enemy => {
            enemy.deleteAllMissiles(scene);
            enemy.setIsDead(scene);
        });
        curaVector.forEach(cura => {
            cura.setIsCaught();
        });
        planeHolder.position.set(0,0,0);
        planeClass.mesh.position.set(0,16,0);
        resetHealthBar();
        play = true;
    }
}
//********************************************//

//********************************************//
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
document.getElementById("webgl-output").appendChild(stats.domElement);//Pra mostrar o FPS
render();
//********************************************//


//********************************************//
//Gerando viewport da vida
var vidas = [];
var geometry = new THREE.BoxGeometry(0.75, 1.5, 0.1);
var material = new THREE.MeshLambertMaterial({color:"rgb(0, 165, 0)"});
for (let i = 0; i < planeClass.vida; i++) {
    vidas[i] = new THREE.Mesh(geometry, material)
    vidas[i].position.set(-i*1.1+5, -200, 20);
    scene.add(vidas[i]);
    vidas.push(vidas[i]);
}

function takeOneHealthBar(){
    if(planeClass.vida >=0)
        scene.remove(vidas.at(planeClass.vida));
}

function gainOneHealthBar(){
        scene.add(vidas.at(planeClass.vida));
}

function resetHealthBar(){
    if(planeClass.vida <= 5){
        planeClass.vida = 5;
        for(let i = 0; i < planeClass.vida; i++)
            scene.add(vidas.at(i));
    }
}
//********************************************//
function controlledRender()
{
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.render(scene, camera);   

  // Set virtual camera viewport 
  var offset = -90; 
  renderer.setViewport(offset, height-vcHeidth-offset, vcWidth, vcHeidth);  // Set virtual camera viewport  
  renderer.setScissor(offset, height-vcHeidth-offset, vcWidth, vcHeidth); // Set scissor with the same size as the viewport
  renderer.setScissorTest(true); // Enable scissor to paint only the scissor are (i.e., the small viewport)
  renderer.render(scene, virtualCamera);  // Render scene of the virtual camera
}

function render() {
    stats.update();
    onWindowResize();
    
    if(play && !passTime){
        keyboardUpdate();
        moverPlanos();

        planeClass.moveBullets();
        planeClass.moveMissiles();
        planeClass.deleteBullets(scene);
        planeClass.deleteMissiles(scene);

        verticalCura();

        chamaAdversario();
        movimentarAdversario();
        
        enemyVector.forEach(element => {
            element.createEnemyShoot(scene);
            element.moveBullets(planeHolder);
            if(element.getPositionZ() > 45) {
                element.deleteAllBullets(scene);
            }
        });    

        groundEnemyVector.forEach(element => {
            element.createMissiles(scene);
            element.moveMissiles(planeHolder);
            if(element.getPositionZ() > 45) {
                element.deleteAllMissiles(scene);
            }
        });
        //if(acertouaviao) removePlane();

        colisionBulletEnemy();
        colisionBulletPlane();
        colisionPlaneEnemy();
        colisionMissileEnemy();
        colisionCuraPlane();
        animation();

        if(planeClass.vida <= 0){
            removePlane();
            play = false;
        }
    }

    // console.log(clock.getElapsedTime() + "s")
    if(clock.getElapsedTime() >= 120) {
        console.log("Acabou o jogo");
        // passTime = true;
    }
    // console.log("Passou " + clock.getDelta() + " tempo")

    requestAnimationFrame(render);
    controlledRender();
}