import * as THREE from 'three';
import Stats from '../build/jsm/libs/stats.module.js';
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
import { default as Cura } from './classes/Cura.js';

var scene = new THREE.Scene();    // Create main scene
var scene2 = new THREE.Scene();    // Create second scene

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

var lookAtVec   = new THREE.Vector3( 0.0, 0, -15.0 );
var lookUp   = new THREE.Vector3( 0.0, 1, 0 );
var camPosition = new THREE.Vector3( 0, -15, 0 );
var vcWidth = 400; 
var vcHeidth = 300; 
var virtualCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 300);
  virtualCamera.position.copy(camPosition);
  virtualCamera.up.copy(lookUp);
  virtualCamera.lookAt(lookAtVec);
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
var material;
// const afterload = (object) => {
//     // this.obj = object;
//     // this.obj.castShadow = true;
//     object.rotateY(degreesToRadians(-90))
//     planeClass.setObj(object);
//     // planeHolder.add(planeClass.obj);
//     scene.add(object);
// };

// loader.load('./assets/Airplane.glb', function (gltf) {
//     obj = gltf.scene;
//     // console.log(gltf)
//     obj.position.set(0,16,0);
//     mesh = obj.children;
//     obj.name = 'airplane';
//     // console.log(mesh);
//     obj.visible = true;
//     obj.traverse(function (child) {
//         if (child) {
//             child.castShadow = true;
//             material = child.material;
//         }
//     });
//     // scene.add(obj);
//     afterload(gltf.scene);
// }, onProgress, onError);

// function onError() { };

// function onProgress(xhr, model) {
//     if (xhr.lengthComputable) {
//         var percentComplete = xhr.loaded / xhr.total * 100;
//     }
// }
// // console.log(xx)

const planeClass = new Plane(material);
var planeHolder = new THREE.Object3D();
// planeHolder.position.set(planeClass.mesh.position);
planeHolder.add(planeClass.mesh);
scene.add(planeHolder);
//********************************************//
var target = new THREE.Vector3();

//********************************************//
// Criando Adversários
var createEnemy = true;
var enemyVector = [];
var groundEnemyVector = [];
var curaVector = [];

// função para limitar quantos inimigos tem na tela
function chamaAdversario() {
    var chance = Math.floor(Math.random() * 900) + 1;
    if (chance <= 6) { // 0.01%
        criarAdversario();
    }
    if(chance <= 2){
        criarAdversarioChao();
    }
    if(chance <= 4)
        criarCura();
}

function criarCura(){
    let cura = new Cura();
    var newpos = Math.floor(Math.random() * 95) + 1;
    newpos = 0;
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
        // } else if(enemy.moveType === 3) {
        //     moveRotate(enemy);
        // }
        let id = enemyVector.indexOf(enemy);
        enemy.move(enemyVector, id, scene);
    });
    groundEnemyVector.forEach(enemy => {
        verticalChao(enemy);
    })
}

// Função para mover os inimigos na vertical
function vertical(enemy) {
    // enemy.mesh.updateMatrixWorld(true);
    // if (enemy.getPositionZ() >= 70) {
    //     scene.remove(enemy.mesh);
    //     enemy.deleteAllBullets(scene);
    //     let id = enemyVector.indexOf(enemy);
    //     enemyVector.splice(id, 1);
    // }
    // if (enemy.getPositionZ() < 70) {
    //     enemy.verticalMove();
    // }
    let id = enemyVector.indexOf(enemy);
    enemy.verticalMove(enemyVector, id, scene);
    console.log(enemyVector.length);
}

// function verticalAndStop(enemy) {
//     // enemy.mesh.updateMatrixWorld(true);
//     // if (enemy.getPositionZ() >= 70 || enemy.getPositionX() > 120 || enemy.getPositionX() < -120) {
//     //     scene.remove(enemy.mesh);
//     //     enemy.deleteAllBullets(scene);
//     //     let id = enemyVector.indexOf(enemy);
//     //     enemyVector.splice(id, 1);
//     // } else {
//     //     enemy.verticalAndStopMove();
//     // }
// }

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

// function diagonal(enemy) {
//     enemy.mesh.updateMatrixWorld(true);
//     if (enemy.getPositionZ() >= 70) {
//         scene.remove(enemy.mesh);
//         enemy.deleteAllBullets(scene);
//         let id = enemyVector.indexOf(enemy);
//         enemyVector.splice(id, 1);
//     } else {
//         enemy.diagonalMove();
//     }
// }


// // const path = new THREE.Path();
// // path.absarc(0, 90, degreesToRadians(2360), degreesToRadians(0), degreesToRadians(180), true)
// // const points = path.getPoints();
// // const geometry = new THREE.BufferGeometry().setFromPoints( points );
// // const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
// // const line = new THREE.Line( geometry, material );
// // scene.add( line );
// function moveRotate(enemy) {
//     enemy.mesh.updateMatrixWorld(true);
//     if (enemy.getPositionZ() <= -200 && enemy.getPositionX() > 39) {
//         scene.remove(enemy.mesh);
//         enemy.deleteAllBullets(scene);
//         let id = enemyVector.indexOf(enemy);
//         enemyVector.splice(id, 1);
//     }
//     if (enemy.getPositionZ() < 70) {
//         enemy.rotateMove(path);
//     }
// }
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
            if(planeClass.getIsMortal())
                planeClass.damage(2);
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
            planeClass.recover(1);
            let id = curaVector.indexOf(cura);
            cura.setIsCaught();
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
            planeHolder.translateZ(moveDistance);
            // planeClass.obj.translateX(moveDistance);
        }
    }
    if (keyboard.pressed("up")) {
        if (target.z >= -150) {
            planeHolder.translateZ(-moveDistance);
            // planeClass.obj.translateX(-moveDistance)
        }
    }
    if (keyboard.pressed("right")) {
        if (target.x <= 95) {
            planeHolder.translateX(moveDistance);
            // planeClass.obj.translateZ(-moveDistance)
        }
    }
    if (keyboard.pressed("left")) {
        if (target.x >= -95) {
            planeHolder.translateX(-moveDistance);
            // planeClass.obj.translateZ(moveDistance)
        }
    }
    if (keyboard.down("G")) {
        if (planeClass.getIsMortal()){
            planeClass.isMortal = false;
        }
        else
            planeClass.isMortal = true;
    }
    if (keyboard.pressed("ctrl") && !cooldownBullet){
        planeClass.createShoot(scene);
        cooldownBullet = true;
        setTimeout( () => cooldownBullet = false, 800);
    }
    if (keyboard.pressed("space") && !cooldownMissile){
        planeClass.createMissiles(scene);
        cooldownMissile = true;
        setTimeout( () => cooldownMissile = false, 1000);
    }
    if (keyboard.pressed("enter")){
        createEnemy = false;
        enemyVector.forEach(enemy => {
            enemy.deleteAllBullets(scene);
            enemy.setIsDead(scene);
        });
        groundEnemyVector.forEach(enemy => {
            enemy.deleteAllBullets(scene);
            enemy.setIsDead(scene);
        });
        curaVector.forEach(cura => {
            cura.setIsCaught();
        });
        planeHolder.position.set(0,16,0);
        createEnemy = true;
    }
}
//********************************************//

//********************************************//
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
//********************************************//
render();

document.getElementById("webgl-output").appendChild(stats.domElement);//Pra mostrar o FPS
function controlledRender()
{
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.setClearColor("rgb(80, 70, 170)");    
  renderer.clear();   // Clean the window
  renderer.render(scene, camera);   

//   // Set virtual camera viewport 
//   var offset = 100; 
//   renderer.setViewport(offset, height-vcHeidth-offset, vcWidth, vcHeidth);  // Set virtual camera viewport  
//   renderer.setScissor(offset, height-vcHeidth-offset, vcWidth, vcHeidth); // Set scissor with the same size as the viewport
//   renderer.setScissorTest(true); // Enable scissor to paint only the scissor are (i.e., the small viewport)
//   renderer.setClearColor(0x000000);  // Use a darker clear color in the small viewport 
//   renderer.clear(); // Clean the small viewport
//   renderer.render(scene, virtualCamera);  // Render scene of the virtual camera
}

function render() {
    stats.update();
    onWindowResize();
    keyboardUpdate();

    moverPlanos();

    planeClass.moveBullets();
    planeClass.moveMissiles();
    planeClass.deleteBullets(scene);
    planeClass.deleteMissiles(scene);

    if(createEnemy){
        chamaAdversario();
        movimentarAdversario();
        verticalCura();
    }


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

    colisionBulletEnemy();
    colisionPlaneEnemy();
    colisionMissileEnemy();
    colisionCuraPlane();
    animation();
    //if(acertouaviao) removePlane();

    if(planeClass.vida <= 0){
        removePlane();
    }

    requestAnimationFrame(render);
    controlledRender();
}