import * as THREE from "three";
import Stats from "../build/jsm/libs/stats.module.js";
import { GLTFLoader } from "../../build/jsm/loaders/GLTFLoader.js";
import KeyboardState from "../libs/util/KeyboardState.js";
import { OrbitControls } from "../build/jsm/controls/OrbitControls.js";
import {
  onWindowResize,
  degreesToRadians,
  createGroundPlaneWired,
} from "../libs/util/util.js";

import { default as Plane } from "./classes/Plane.js";
import { default as EnemyAir } from "./classes/EnemyAir.js";
import { default as GroundEnemy } from "./classes/GroundEnemy.js";
import { default as Cura } from "./classes/Cura.js";
import { Water } from "./external/Water2.js";
import { Buttons } from "../libs/other/buttons.js";
var buttons = new Buttons(onButtonDown, onButtonUp);

var scene = new THREE.Scene(); // Create main scene

var renderer = new THREE.WebGLRenderer({ alpha: true });
document.getElementById("webgl-output").appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap; // default
renderer.autoClear = false;
const textureLoader = new THREE.TextureLoader();

var fwdValue = 0;
var bkdValue = 0;
var rgtValue = 0;
var lftValue = 0;
var tempVector = new THREE.Vector3();

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
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 600;
  dirLight.shadow.camera.left = -110;
  dirLight.shadow.camera.right = 110;
  dirLight.shadow.camera.top = 200;
  dirLight.shadow.camera.bottom = -200;
  scene.add(dirLight);
}
//********************************************//
//Criando a camera
var camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  300
);
camera.position.set(0, 100, 70);
camera.lookAt(0, 15, 0);
scene.add(camera);
var camPosition = new THREE.Vector3(0, -200, 30);
var vcWidth = 400;
var vcHeidth = 300;
var virtualCamera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  300
);
virtualCamera.position.copy(camPosition);
scene.add(virtualCamera);
//********************************************//

const loadingManager = new THREE.LoadingManager(() => {
  let loadingScreen = document.getElementById("loading-screen");
  loadingScreen.transition = 0;
  loadingScreen.style.setProperty("--speed1", "0");
  loadingScreen.style.setProperty("--speed2", "0");
  loadingScreen.style.setProperty("--speed3", "0");

  let button = document.getElementById("myBtn");
  button.style.backgroundColor = "Red";
  button.innerHTML = "Click to Enter";
  button.addEventListener("click", onButtonPressed);
});

function onButtonPressed() {
  const loadingScreen = document.getElementById("loading-screen");
  loadingScreen.transition = 0;
  loadingScreen.classList.add("fade-out");
  loadingScreen.addEventListener("transitionend", (e) => {
    const element = e.target;
    element.remove();
  });
  play = true;
  // Config and play the loaded audio
  // let sound = new THREE.Audio( new THREE.AudioListener() );
  // audioLoader.load( audioPath, function( buffer ) {
  //   sound.setBuffer( buffer );
  //   sound.setLoop( true );
  //   sound.play();
  // });
}

//********************************************//
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
  planos.forEach((item) => {
    item.translateY(-0.5);
    item.updateMatrixWorld(true);
    if (item.position.z == 50) {
      item.position.set(0, 0, -250);
    }
  });
}

const waterGeometry = new THREE.PlaneGeometry(300, 400);
const flowMap = textureLoader.load("textures/water/Water_1_M_Flow.jpg");

let water = new Water(waterGeometry, {
  scale: 2,
  textureWidth: 1024,
  textureHeight: 1024,
  flowMap: flowMap,
});

water.position.y = 1;
water.rotation.x = Math.PI * -0.5;
scene.add(water);

const geometryPlane = new THREE.PlaneGeometry(200, 700);
const materialPlane = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(geometryPlane, materialPlane);
// plane.position.set(1, 2, 2);
// plane.rotateX(degreesToRadians(90))
// scene.add( plane );
var grass = textureLoader.load("./textures/grass.jpg");

var planoRight = new THREE.Mesh(geometryPlane, materialPlane);
planoRight.position.set(170, 2, 2);
planoRight.rotateX(degreesToRadians(90));
planoRight.material.map = grass;
scene.add(planoRight);

var planoLeft = new THREE.Mesh(geometryPlane, materialPlane);
planoLeft.position.set(-170, 2, 2);
planoLeft.rotateX(degreesToRadians(90));

scene.add(planoLeft);

// Set defaults
var repeatFactor = 2;
var wrapModeS = THREE.RepeatWrapping;
var wrapModeT = THREE.RepeatWrapping;
var minFilter = THREE.LinearFilter;
var magFilter = THREE.LinearFilter;
// updateTexture(true);
planoRight.material.map.wrapS = wrapModeS;
planoRight.material.map.wrapT = wrapModeT;
planoRight.material.map.minFilter = minFilter;
planoRight.material.map.magFilter = magFilter;
planoRight.material.map.repeat.set(repeatFactor, repeatFactor);

//********************************************//
//Para usar o Keyboard
var keyboard = new KeyboardState();
//********************************************//
// Carregando os gltfs
var loader = new GLTFLoader(loadingManager);
var obj;
var tecoTecoObj;
var tieFifhterObj;
var alienPurpleObj;
var toonTankObj;
var playVector = [false, false, false, false, false];
const afterLoadPlane = (object) => {
  planeClass.setObj(object);
  scene.add(object);
  planeHolder = planeClass.obj;
  playVector[0] = true;
  // play = true;
};
const afterLoadEnemy = (enemy, object) => {
  let objCopy = new THREE.Object3D();
  objCopy.copy(object);
  enemy.setObj(objCopy);
  scene.add(objCopy);
  // play = true;
};
loader.load(
  "./assets/Airplane.glb",
  function (gltf) {
    obj = gltf.scene;
    obj.position.set(0, 46, 0);
    obj.name = "airplane";
    obj.visible = true;
    obj.traverse(function (child) {
      if (child) {
        child.castShadow = true;
      }
    });
    afterLoadPlane(obj);
  },
  onProgress,
  null
);
loader.load(
  "./assets/ToonTank.glb",
  function (gltf) {
    toonTankObj = gltf.scene;
    toonTankObj.position.set(0, 46, 0);
    toonTankObj.scale.set(3, 3, 3);
    toonTankObj.name = "airplane";
    toonTankObj.visible = true;
    toonTankObj.traverse(function (child) {
      if (child) {
        child.castShadow = true;
      }
    });
    // afterLoadPlane(obj);
    playVector[1] = true;
  },
  onProgress,
  null
);
loader.load(
  "./assets/TecoTeco.glb",
  function (gltf) {
    tecoTecoObj = gltf.scene;
    tecoTecoObj.position.set(0, 46, 0);
    tecoTecoObj.scale.set(2, 2, 2);
    tecoTecoObj.name = "enemy";
    tecoTecoObj.visible = true;
    tecoTecoObj.traverse(function (child) {
      if (child) {
        child.castShadow = true;
      }
    });
    playVector[2] = true;
  },
  onProgress,
  null
);
loader.load(
  "./assets/tieFighter.glb",
  function (gltf) {
    tieFifhterObj = gltf.scene;
    tieFifhterObj.position.set(0, 46, 0);
    tieFifhterObj.scale.set(2, 2, 2);
    tieFifhterObj.name = "enemy";
    tieFifhterObj.visible = true;
    tieFifhterObj.traverse(function (child) {
      if (child) {
        child.castShadow = true;
      }
    });
    playVector[3] = true;
  },
  onProgress,
  null
);
loader.load(
  "./assets/AlienPurple.glb",
  function (gltf) {
    alienPurpleObj = gltf.scene;
    alienPurpleObj.position.set(0, 46, 0);
    alienPurpleObj.scale.set(3, 3, 3);
    alienPurpleObj.name = "enemy";
    alienPurpleObj.visible = true;
    alienPurpleObj.traverse(function (child) {
      if (child) {
        child.castShadow = true;
      }
      alienPurpleObj.children.splice(5, 1);
      playVector[4] = true;
    });
  },
  onProgress,
  null
);

// loadGLTFObject(loadingManager, '../assets/objects/r2d2/scene.gltf');
function loadGLTFObject(manager, object) {
  var loader = new GLTFLoader(manager);
  loader.load(
    object,
    function (gltf) {
      r2d2 = gltf.scene;
      scene.add(r2d2);
    },
    null,
    null
  );
}

function onProgress(xhr, model) {
  if (xhr.lengthComputable) {
    var percentComplete = (xhr.loaded / xhr.total) * 100;
  }
}
//Criando o avião
const planeClass = new Plane();
var planeHolder = new THREE.Object3D();
scene.add(planeHolder);
//********************************************//
var target = new THREE.Vector3();
//********************************************//
// Criando Adversários
var play = false; // Variável para verificar se o jogo pode começar
var passTime = false; // Variável para verificar se o tempo de 2 minutos já passou
var enemyVector = []; // Vetor de inimigos aereos
var groundEnemyVector = []; // Vetor de inimigos do chão
var curaVector = []; // Vetor de curas
// função para limitar quantos inimigos tem na tela
var cooldownsType = [false, true, true, true, true, true];
setTimeout(() => (cooldownsType[1] = false), 5000);
setTimeout(() => (cooldownsType[2] = false), 8000);
setTimeout(() => (cooldownsType[3] = false), 10000);
setTimeout(() => (cooldownsType[4] = false), 30000);
setTimeout(() => (cooldownsType[5] = false), 6000);

function chamaAdversario() {
  if (!cooldownsType[0]) {
    cooldownsType[0] = true;
    setTimeout(() => (cooldownsType[0] = false), 10000);
    criarAdversario(0);
  } else if (!cooldownsType[1]) {
    cooldownsType[1] = true;
    setTimeout(() => (cooldownsType[1] = false), 25000);
    criarAdversario(1);
  } else if (!cooldownsType[2]) {
    cooldownsType[2] = true;
    setTimeout(() => (cooldownsType[2] = false), 50000);
    criarAdversario(2);
  } else if (!cooldownsType[3]) {
    cooldownsType[3] = true;
    setTimeout(() => (cooldownsType[3] = false), 45000);
    criarAdversario(3);
  }
  if (!cooldownsType[4]) {
    cooldownsType[4] = true;
    setTimeout(() => (cooldownsType[4] = false), 30000);
    criarAdversarioChao();
  }
  if (!cooldownsType[5]) {
    cooldownsType[5] = true;
    setTimeout(() => (cooldownsType[5] = false), 10000);
    criarCura();
  }
}
function criarAdversario(type) {
  let enemy = new EnemyAir(type);
  if (enemy.moveType === 0) {
    afterLoadEnemy(enemy, tecoTecoObj);
  } else if (enemy.moveType === 1) {
    afterLoadEnemy(enemy, tecoTecoObj);
  } else if (enemy.moveType === 2) {
    afterLoadEnemy(enemy, alienPurpleObj);
  } else if (enemy.moveType === 3) {
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
  enemyVector.forEach((enemy) => {
    let id = enemyVector.indexOf(enemy);
    enemy.move(enemyVector, id, scene);
  });
  groundEnemyVector.forEach((enemy) => {
    let id = groundEnemyVector.indexOf(enemy);
    enemy.verticalChaoMove(groundEnemyVector, id, scene);
  });
}
//********************************************//

//********************************************//
/**
 * Funções para valdar as colisões
 */
const box = new THREE.Box3();
const box2 = new THREE.Box3();
const box3 = new THREE.Box3();

function colisionPlaneEnemy() {
  enemyVector.forEach((enemy) => {
    let planeBox = box3
      .copy(planeClass.getBoundingBox())
      .applyMatrix4(planeClass.mesh.matrixWorld);
    let enemyBox = box
      .copy(enemy.getBoundingBox())
      .applyMatrix4(enemy.mesh.matrixWorld);
    if (enemyBox.containsBox(planeBox) || enemyBox.intersectsBox(planeBox)) {
      enemy.deleteAllBullets(scene);
      enemy.setIsDead(scene);
      if (planeClass.getIsMortal()) {
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
  enemyVector.forEach((enemy) => {
    let enemyBox = box
      .copy(enemy.getBoundingBox())
      .applyMatrix4(enemy.mesh.matrixWorld);
    bullets.forEach((bullet) => {
      let bulletBox = box2
        .copy(bullet.getBoundingBox())
        .applyMatrix4(bullet.mesh.matrixWorld);
      if (
        enemyBox.containsBox(bulletBox) ||
        enemyBox.intersectsBox(bulletBox)
      ) {
        planeClass.deleteOneBullet(bullet, scene);
        enemy.deleteAllBullets(scene);
        enemy.setIsDead(scene);
      }
    });
  });
}
function colisionBulletPlane() {
  enemyVector.forEach((enemy) => {
    let bullets = enemy.getBullets();
    let planeBox = box
      .copy(planeClass.getBoundingBox())
      .applyMatrix4(planeClass.mesh.matrixWorld);
    bullets.forEach((bullet) => {
      let bulletBox = box2
        .copy(bullet.getBoundingBox())
        .applyMatrix4(bullet.mesh.matrixWorld);
      if (
        planeBox.containsBox(bulletBox) ||
        planeBox.intersectsBox(bulletBox)
      ) {
        enemy.deleteOneBullet(bullet, scene);
        if (planeClass.isMortal) {
          planeClass.damage(1);
          takeOneHealthBar();
        }
      }
    });
  });
}
function colisionMissileEnemy() {
  let missiles = planeClass.getMissiles();
  groundEnemyVector.forEach((enemy) => {
    let enemyBox = box
      .copy(enemy.getBoundingBox())
      .applyMatrix4(enemy.mesh.matrixWorld);
    missiles.forEach((missile) => {
      let missileBox = box2
        .copy(missile.getBoundingBox())
        .applyMatrix4(missile.mesh.matrixWorld);
      if (
        enemyBox.containsBox(missileBox) ||
        enemyBox.intersectsBox(missileBox)
      ) {
        planeClass.deleteOneMissile(missile, scene);
        enemy.deleteAllMissiles(scene);
        enemy.setIsDead(scene);
      }
    });
  });
}
function colisionMissilePlane() {
  groundEnemyVector.forEach((enemy) => {
    let missiles = enemy.getMissiles();
    let planeBox = box
      .copy(planeClass.getBoundingBox())
      .applyMatrix4(planeClass.mesh.matrixWorld);
    missiles.forEach((missile) => {
      let missileBox = box2
        .copy(missile.getBoundingBox())
        .applyMatrix4(missile.mesh.matrixWorld);
      if (
        planeBox.containsBox(missileBox) ||
        planeBox.intersectsBox(missileBox)
      ) {
        enemy.deleteOneMissile(missile, scene);
        if (planeClass.isMortal) {
          planeClass.damage(1);
          takeOneHealthBar();
        }
      }
    });
  });
}
function colisionCuraPlane() {
  curaVector.forEach((cura) => {
    let planeBox = box3
      .copy(planeClass.getBoundingBox())
      .applyMatrix4(planeClass.mesh.matrixWorld);
    let curaBox = box
      .copy(cura.getBoundingBox())
      .applyMatrix4(cura.mesh.matrixWorld);
    if (curaBox.containsBox(planeBox) || curaBox.intersectsBox(planeBox)) {
      if (planeClass.canTakeLife) {
        gainOneHealthBar();
        planeClass.recover(1);
        cura.setIsCaught();
      }
    }
  });
}
// Funções para efetuar as animações de romoção da tela
function removePlane() {
  if (planeClass.mesh.scale.x >= 0) {
    planeClass.mesh.scale.x -= 0.1;
    planeClass.mesh.scale.y -= 0.1;
    planeClass.mesh.scale.z -= 0.1;
  }
  planeClass.deletePlane(scene, planeHolder);
  // planeHolder.geometry.dispose();
  scene.remove(planeHolder);
  //Parece que a boudingBox ainda ta na cena
}
function animation() {
  enemyVector.forEach((enemy) => {
    enemy.animation(enemyVector, scene);
  });
  groundEnemyVector.forEach((enemy) => {
    enemy.animation(groundEnemyVector, scene);
  });
  curaVector.forEach((cura) => {
    if (cura.isCaught)
      if (cura.mesh.scale.x >= 0) {
        cura.mesh.scale.x -= 0.1;
        cura.mesh.scale.y -= 0.1;
        cura.mesh.scale.z -= 0.1;
      }
  });
}
//********************************************//
let cooldownBullet = false;
let cooldownMissile = false;
let pause = false;
function keyboardUpdate() {
  keyboard.update();

  if (keyboard.down("P")) {
    pause = !pause;
    play = !play;
  }
  if (play) {
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
    if (keyboard.down("ctrl")) {
      planeClass.createShoot(scene);
    } else if (keyboard.pressed("ctrl") && !cooldownBullet) {
      planeClass.createShoot(scene);
      cooldownBullet = true;
      setTimeout(() => (cooldownBullet = false), 500);
    }
    if (keyboard.down("space")) {
      planeClass.createMissiles(scene);
    } else if (keyboard.pressed("space") && !cooldownMissile) {
      planeClass.createMissiles(scene);
      cooldownMissile = true;
      setTimeout(() => (cooldownMissile = false), 1000);
    }
    if (keyboard.pressed("enter")) {
      play = false;
      enemyVector.forEach((enemy) => {
        enemy.deleteAllBullets(scene);
        enemy.setIsDead(scene);
      });
      groundEnemyVector.forEach((enemy) => {
        enemy.deleteAllMissiles(scene);
        enemy.setIsDead(scene);
      });
      curaVector.forEach((cura) => {
        cura.setIsCaught();
      });
      planeClass.obj.position.set(0, 16, 0);
      planeClass.mesh.position.set(0, 16, 0);
      planeClass.obj.scale.set(1, 1, 1);
      scene.add(planeClass.obj);
      resetHealthBar();
      clock.elapsedTime = 0;
      passTime = false;
      play = true;
    }
  }
}

function onButtonDown(event) {
	switch(event.target.id)
	{
		case "A":
			if (!cooldownBullet) {
                planeClass.createShoot(scene);
                cooldownBullet = true;
                setTimeout(() => (cooldownBullet = false), 500);
            }
		break;
		case "B":
			if (!cooldownMissile) {
                planeClass.createMissiles(scene);
                cooldownMissile = true;
                setTimeout(() => (cooldownMissile = false), 1000);
            }
		break;    
		case "full":
			buttons.setFullScreen();
		break;    
	}
}
  
function onButtonUp(event) {
	// actions.acceleration = false;	
	// actions.braking = false;	
}


let upVector = new THREE.Vector3(0, 1, 0);
var pressedA = false;        
var pressedB = false;     
var controls = new OrbitControls(camera, renderer.domElement);
function updatePlayer() {
  // move the player
  const angle = controls.getAzimuthalAngle();
  var speed = 40;
  var moveDistance = speed * clock.getDelta();
  if (fwdValue > 0) {
    if (target.z >= -150) {
      planeClass.moveUp(fwdValue);
    }
  }

  if (bkdValue > 0) {
    if (target.z <= 45) {
      planeClass.moveDown(bkdValue);
    }
  }

  if (lftValue > 0) {
    if (target.x >= -95) {
        planeClass.moveLeft(lftValue);
    }
  }

  if (rgtValue > 0) {
    if (target.x <= 95) {
        planeClass.moveRight(rgtValue);
    }
  }

  planeClass.mesh.updateMatrixWorld();
}

//********************************************//
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
); // Resize the screen
document.getElementById("webgl-output").appendChild(stats.domElement); //Pra mostrar o FPS
render();
//********************************************//
//Gerando viewport da vida
var vidas = [];
var geometry = new THREE.BoxGeometry(0.75, 1.5, 0.1);
var material = new THREE.MeshLambertMaterial({ color: "rgb(0, 165, 0)" });
for (let i = 0; i < planeClass.vida; i++) {
  vidas[i] = new THREE.Mesh(geometry, material);
  vidas[i].position.set(-i * 1.1 + 5, -200, 20);
  scene.add(vidas[i]);
  vidas.push(vidas[i]);
}

function validatePlay() {
  let count = 0;
  playVector.forEach((element) => {
    if (element) {
      count++;
    }
  });
  // if(count === playVector.length && !pause) play = true;
}

// Criando os elementos de vida
function criarCura() {
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
  curaVector.forEach((cura) => {
    let id = curaVector.indexOf(cura);
    cura.move(curaVector, id, scene);
  });
}
function takeOneHealthBar() {
  if (planeClass.vida >= 0) scene.remove(vidas.at(planeClass.vida));
}
function gainOneHealthBar() {
  scene.add(vidas.at(planeClass.vida));
}
function resetHealthBar() {
  if (planeClass.vida <= 5) {
    planeClass.vida = 5;
    for (let i = 0; i < planeClass.vida; i++) scene.add(vidas.at(i));
  }
}
//********************************************//
function controlledRender() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.render(scene, camera);

  // Set virtual camera viewport
  var offset = -90;
  renderer.setViewport(offset, height - vcHeidth - offset, vcWidth, vcHeidth); // Set virtual camera viewport
  renderer.setScissor(offset, height - vcHeidth - offset, vcWidth, vcHeidth); // Set scissor with the same size as the viewport
  renderer.setScissorTest(true); // Enable scissor to paint only the scissor are (i.e., the small viewport)
  renderer.render(scene, virtualCamera); // Render scene of the virtual camera
}

function addJoysticks() {
  // Details in the link bellow:
  // https://yoannmoi.net/nipplejs/

  let joystickL = nipplejs.create({
    zone: document.getElementById("joystickWrapper1"),
    mode: "static",
    position: { top: "-80px", left: "80px" },
  });

  joystickL.on("move", function (evt, data) {
    const forward = data.vector.y;
    const turn = data.vector.x;
    fwdValue = bkdValue = lftValue = rgtValue = 0;

    if (forward > 0) fwdValue = Math.abs(forward);
    else if (forward < 0) bkdValue = Math.abs(forward);

    if (turn > 0) rgtValue = Math.abs(turn);
    else if (turn < 0) lftValue = Math.abs(turn);
  });

  joystickL.on("end", function (evt) {
    bkdValue = 0;
    fwdValue = 0;
    lftValue = 0;
    rgtValue = 0;
  });

  // let joystickR = nipplejs.create({
  //   zone: document.getElementById('joystickWrapper2'),
  //   mode: 'static',
  //   lockY: true, // only move on the Y axis
  //   position: { top: '-80px', right: '80px' },
  // });

  // joystickR.on('move', function (evt, data) {
  //   const changeScale = data.vector.y;

  //   if(changeScale > previousScale) scale+=0.1;
  //   if(changeScale < previousScale) scale-=0.1;
  //   if(scale > 4.0) scale = 4.0;
  //   if(scale < 0.5) scale = 0.5;

  //   previousScale = changeScale;
  // })
}

addJoysticks();

function render() {
  stats.update();
  onWindowResize();

  if (!play) validatePlay();

  keyboardUpdate();
  updatePlayer();
  if (play && !passTime) {
    moverPlanos();
    planeClass.moveBullets();
    planeClass.moveMissiles();
    planeClass.deleteBullets(scene);
    planeClass.deleteMissiles(scene);
    verticalCura();
    chamaAdversario();
    movimentarAdversario();
    enemyVector.forEach((element) => {
      element.createEnemyShoot(scene);
      element.moveBullets(planeHolder);
      if (element.getPositionZ() > 45) {
        element.deleteAllBullets(scene);
      }
    });
    groundEnemyVector.forEach((element) => {
      element.createMissiles(scene);
      element.moveMissiles(planeHolder);
      if (element.getPositionZ() > 45) {
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
    if (planeClass.vida <= 0) {
      removePlane();
      play = false;
      passTime = true;
    }
  }
  if (clock.getElapsedTime() >= 120) {
    passTime = true;
  }
  requestAnimationFrame(render);
  controlledRender();
}
