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
import { default as EnemyAir } from './classes/EnemyAir.js';
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
var tecoTecoObj;
var tieFifhterObj;
var alienPurpleObj;
var toonTankObj;
const afterLoadPlane = (object) => {
    planeClass.setObj(object);
    scene.add(object);
    planeHolder = planeClass.obj
    play = true;
};

const afterLoadEnemy = (enemy, object) => {
    let objCopy = new THREE.Object3D().copy(object);
    enemy.setObj(objCopy);
    scene.add(objCopy);
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
}, onProgress, null);

loader.load('./assets/ToonTank.glb', function (gltf) {
    toonTankObj = gltf.scene;
    toonTankObj.position.set(0,46,0);
    toonTankObj.scale.set(3,3,3);
    toonTankObj.name = 'airplane';
    toonTankObj.visible = true;
    toonTankObj.traverse(function (child) {
        if (child) {
            child.castShadow = true;
        }
    });
    // afterLoadPlane(obj);
}, onProgress, null);

loader.load('./assets/TecoTeco.glb', function (gltf) {
    tecoTecoObj = gltf.scene;
    tecoTecoObj.position.set(0,46,0);
    tecoTecoObj.scale.set(2,2,2);
    tecoTecoObj.name = 'enemy';
    tecoTecoObj.visible = true;
    tecoTecoObj.traverse(function (child) {
        if (child) {
            child.castShadow = true;
        }
    });
}, onProgress, null);

loader.load('./assets/tieFighter.glb', function (gltf) {
    tieFifhterObj = gltf.scene;
    tieFifhterObj.position.set(0,46,0);
    tieFifhterObj.scale.set(2,2,2);
    tieFifhterObj.name = 'enemy';
    tieFifhterObj.visible = true;
    tieFifhterObj.traverse(function (child) {
        if (child) {
            child.castShadow = true;
        }
    });
}, onProgress, null);

loader.load('./assets/AlienPurple.glb', function (gltf) {
    alienPurpleObj = gltf.scene;
    alienPurpleObj.position.set(0,46,0);
    alienPurpleObj.scale.set(3,3,3);
    alienPurpleObj.name = 'enemy';
    alienPurpleObj.visible = true;
    alienPurpleObj.traverse(function (child) {
        if (child) {
            child.castShadow = true;
        }
    alienPurpleObj.children.splice(5,1);
    });
}, onProgress, null);

function onProgress(xhr, model) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
    }
}

const planeClass = new Plane();
var planeHolder = new THREE.Object3D();
scene.add(planeHolder);
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
setTimeout( () => cooldownType3 = false, 10000);
setTimeout( () => cooldownType4 = false, 30000);
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
function criarAdversario(type) {
    let enemy = new EnemyAir(type);
    if(enemy.moveType === 0) {
        afterLoadEnemy(enemy, tecoTecoObj);
    } else if(enemy.moveType === 1) {
        afterLoadEnemy(enemy, tecoTecoObj);
    } else if(enemy.moveType === 2) {
        afterLoadEnemy(enemy, alienPurpleObj);
    } else if(enemy.moveType === 3) {
        afterLoadEnemy(enemy, tieFifhterObj);
    }
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
    afterLoadEnemy(enemy, toonTankObj);
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
function movimentarAdversario() {
    enemyVector.forEach(enemy => {
        let id = enemyVector.indexOf(enemy);
        enemy.move(enemyVector, id, scene);
    });
    groundEnemyVector.forEach(enemy => {
        let id = groundEnemyVector.indexOf(enemy);
        enemy.verticalChaoMove(groundEnemyVector, id ,scene);
    })
}
//********************************************//

//********************************************//
/**
 * Funções para valdar as colisões
 */
const box = new THREE.Box3();
const box2 = new THREE.Box3();
const box3 = new THREE.Box3();

function colisionPlaneEnemy(){
    enemyVector.forEach(enemy => {
        let planeBox = box3.copy(planeClass.getBoundingBox()).applyMatrix4(planeClass.mesh.matrixWorld);
        let enemyBox = box.copy(enemy.getBoundingBox()).applyMatrix4(enemy.mesh.matrixWorld);
        if(enemyBox.containsBox(planeBox) || enemyBox.intersectsBox(planeBox)) {
            enemy.deleteAllBullets(scene);
            enemy.setIsDead(scene);
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
function colisionMissilePlane() {
    groundEnemyVector.forEach(enemy => {
        let missiles = enemy.getMissiles();
        let planeBox = box.copy(planeClass.getBoundingBox()).applyMatrix4(planeClass.mesh.matrixWorld);
        missiles.forEach(missile => {
            let missileBox = box2.copy(missile.getBoundingBox()).applyMatrix4( missile.mesh.matrixWorld )
            if(planeBox.containsBox(missileBox) || planeBox.intersectsBox(missileBox)) {
                enemy.deleteOneMissile(missile, scene);
                if(planeClass.isMortal){
                    planeClass.damage(1);
                    takeOneHealthBar();
                }
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
 * Para efetuar a animações
 */
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
        enemy.animation(enemyVector, scene);
    });
    groundEnemyVector.forEach(enemy => {
        enemy.animation(groundEnemyVector, scene);
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
function keyboardUpdate() {
    keyboard.update();
    var speed = 40;
    var moveDistance = speed * clock.getDelta();
    planeClass.mesh.getWorldPosition(target);
    if (keyboard.pressed("down") && !passTime) {
        if (target.z <= 45) {
            planeClass.moveDown(moveDistance);
        }
    }
    if (keyboard.pressed("up") && !passTime) {
        if (target.z >= -150) {
            planeClass.moveUp(moveDistance);
        }
    }
    if (keyboard.pressed("right") && !passTime) {
        if (target.x <= 95) {
            planeClass.moveRight(moveDistance);
        }
    }
    if (keyboard.pressed("left") && !passTime) {
        if (target.x >= -95) {
            planeClass.moveLeft(moveDistance);
        }
    }
    if (keyboard.up("right") && !passTime) {
        planeClass.obj.rotateX(degreesToRadians(12));
    }
    if (keyboard.up("left") && !passTime) {
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
        console.log("Reseto")
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
        planeClass.obj.position.set(0,16,0);
        planeClass.mesh.position.set(0,16,0);
        planeClass.obj.scale.set(1,1,1);
        scene.add(planeClass.obj);
        resetHealthBar();
        clock.elapsedTime = 0;
        console.log(clock.getElapsedTime());
        passTime = false;
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
        let id = curaVector.indexOf(cura);
        cura.move(curaVector, id, scene);
    });
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
    
    keyboardUpdate();
    if(play && !passTime){
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

        colisionBulletEnemy();
        colisionBulletPlane();
        colisionPlaneEnemy();
        colisionMissileEnemy();
        colisionCuraPlane();
        colisionMissilePlane();
        animation();

        if(planeClass.vida <= 0){
            removePlane();
            play = false;
        }
    }

    if(clock.getElapsedTime() >= 120) {
        console.log("Acabou o jogo");
        passTime = true;
    }
    requestAnimationFrame(render);
    controlledRender();
}