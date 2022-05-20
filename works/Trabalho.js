import * as THREE from 'three';
import Stats from '../build/jsm/libs/stats.module.js';
import KeyboardState from '../libs/util/KeyboardState.js'
import {
    initRenderer,
    initDefaultBasicLight,
    createGroundPlaneWired
} from "../libs/util/util.js";

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
const geometry = new THREE.ConeGeometry( 5, 15, 64 );
const material = new THREE.MeshLambertMaterial( {color:'rgb(180,180,255)'} );
var cone = new THREE.Mesh( geometry, material );
cone.position.set(0,6,0);
cone.rotateX(-1.6);

cone.geometry.computeBoundingBox();

//Criando o que vai movimentar o avião
var planeHolder = new THREE.Object3D();
planeHolder.add(cone);
scene.add( planeHolder );
//********************************************//

//********************************************//
//Criando os tiros
const espgeometry = new THREE.SphereGeometry(1, 20, 50);
const espmaterial = new THREE.MeshLambertMaterial({color:"rgb(255, 165, 0)"});
var target = new THREE.Vector3();

var bullets = []; // Vetor de todas as balas

// Função para criar um tiro
function createShoot() {
    let shoot = new THREE.Mesh(espgeometry, espmaterial);
    cone.getWorldPosition(target);
    shoot.position.set(target.x,target.y,target.z);
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
        if(item.position.z == -185) {
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
var velocidades = [];
var cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
var cubeMaterial = new THREE.MeshLambertMaterial({color:"rgb(120, 165, 30)"});

// função para limitar quantos inimigos tem na tela
function chamaAdversario(){
    var chance = Math.floor(Math.random()*900) + 1;
    if(chance <=10){
        criarAdversario();
    }
}

function criarAdversario(){
    let enemy = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // position the cube
    const newpos = Math.floor(Math.random()*95) + 1;
    const chance = Math.floor(Math.random()*2) + 1;
    if(chance == 1)
        enemy.position.set(newpos,10,-200);
    else
        enemy.position.set(-newpos,10,-200);
    enemy.geometry.computeBoundingBox();
    const velocidade = Math.floor(Math.random()*5) + 2;
    velocidades.push(velocidade);
    // add the enemy to the scene
    scene.add(enemy);
    adversarios.push(enemy);
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
    adversarios.forEach(item => {
        item.updateMatrixWorld(true);
        if(item.position.z >= 70){
            scene.remove(item);
            let id = adversarios.indexOf(item);
            adversarios.splice(id, 1);
            velocidades.splice(id, 1);
        }
        if(item.position.z < 70){
            let id = adversarios.indexOf(item);
            var v = velocidades.at(id);
            item.translateZ(0.2*v);
        }
    })
}
//********************************************//

//********************************************//
/**
 * Colisão entre tiro e inimigo e animção
 */
const box = new THREE.Box3();
const box2 = new THREE.Box3();
const box3 = new THREE.Box3();
var enemyBox;
var bulletBox;
var aviaoBox;
var acertouaviao = false;
/**
 * Função para validar se ocorreu colisão entre os tiros e os inimigos.
 * Caso ocorra uma colisão o tiro e o inimigo são removidos da tela.
 */
function colisionPlane(){
    adversarios.forEach(enemy => {
        enemyBox = box.copy( enemy.geometry.boundingBox ).applyMatrix4( enemy.matrixWorld )
        aviaoBox = box3.copy(cone.geometry.boundingBox).applyMatrix4(cone.matrixWorld);
        if(enemyBox.containsBox(aviaoBox) || enemyBox.intersectsBox(aviaoBox)) {
            scene.remove(enemy);
            let x = aux.copy(enemy);
            acertouaviao = true;
            removePlane();
            enemiesAnimation.push(x);
            let id2 = adversarios.indexOf(enemy);
            adversarios.splice(id2, 1);
        }
    });
}
var aux = new THREE.Mesh();
function colision() {
    adversarios.forEach(enemy => {
        enemyBox = box.copy( enemy.geometry.boundingBox ).applyMatrix4( enemy.matrixWorld )
        bullets.forEach(shoot => {
            bulletBox = box2.copy( shoot.geometry.boundingBox ).applyMatrix4( shoot.matrixWorld )
            if(enemyBox.containsBox(bulletBox) || enemyBox.intersectsBox(bulletBox)) {
                let x = aux.copy(enemy);
                enemiesAnimation.push(x);
                let id2 = adversarios.indexOf(enemy);
                scene.remove(enemy);
                scene.remove(shoot);
                let id = bullets.indexOf(shoot);
                bullets.splice(id, 1);
                adversarios.splice(id2, 1);
                velocidades.splice(id2, 1);
            }
        });
    });
}

/**
 * Para efetuar a animação dos inimigos
 */
var enemiesAnimation = [];

function removePlane(){
    if(cone.scale.x>=0){
        cone.scale.x -=.1;
        cone.scale.y -=.1;
        cone.scale.z -=.1;
    }
    if(cone.scale.x <= 0){
        acertouaviao = false;
        planeHolder.position.set(0,6,0);
        cone.scale.set(1,1,1);
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
    cone.getWorldPosition(target);
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
    if (keyboard.down("ctrl")) createShoot();
    if (keyboard.down("space")) createShoot();
}
//********************************************//

render();

document.getElementById("webgl-output").appendChild(stats.domElement);//Pra mostrar o FPS

function render() {
    stats.update();
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