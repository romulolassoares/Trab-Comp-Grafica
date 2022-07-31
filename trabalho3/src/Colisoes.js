import * as THREE from 'three';

import {
   criarCura,
   verticalCura,
   takeOneHealthBar,
   gainOneHealthBar,
   resetHealthBar
} from "./Life.js"

const box = new THREE.Box3();
const box2 = new THREE.Box3();
const box3 = new THREE.Box3();

function colisionPlaneEnemy(enemyVector, planeClass, vidas, scene){
    enemyVector.forEach(enemy => {
        let planeBox = box3.copy(planeClass.getBoundingBox()).applyMatrix4(planeClass.mesh.matrixWorld);
        let enemyBox = box.copy(enemy.getBoundingBox()).applyMatrix4(enemy.mesh.matrixWorld);
        if(enemyBox.containsBox(planeBox) || enemyBox.intersectsBox(planeBox)) {
            enemy.deleteAllBullets(scene);
            enemy.setIsDead(scene);
            if(planeClass.getIsMortal()){
                planeClass.damage(1);
                takeOneHealthBar(planeClass, scene, vidas);
                planeClass.damage(1);
                takeOneHealthBar(planeClass, scene, vidas);
            }
        }
    });
}
function colisionBulletEnemy(planeClass, enemyVector, scene) {
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
function colisionBulletPlane(enemyVector, planeClass, vidas, scene) {
    enemyVector.forEach(enemy => {
        let bullets = enemy.getBullets();
        let planeBox = box.copy(planeClass.getBoundingBox()).applyMatrix4(planeClass.mesh.matrixWorld);
        bullets.forEach(bullet => {
            let bulletBox = box2.copy(bullet.getBoundingBox()).applyMatrix4( bullet.mesh.matrixWorld )
            if(planeBox.containsBox(bulletBox) || planeBox.intersectsBox(bulletBox)) {
                enemy.deleteOneBullet(bullet, scene);
                if(planeClass.isMortal){
                    planeClass.damage(1);
                    takeOneHealthBar(planeClass, scene, vidas);
                }
            }
        });
    });
}
function colisionMissileEnemy(planeClass, groundEnemyVector, scene) {
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
function colisionMissilePlane(groundEnemyVector, planeClass, vidas, scene) {
    groundEnemyVector.forEach(enemy => {
        let missiles = enemy.getMissiles();
        let planeBox = box.copy(planeClass.getBoundingBox()).applyMatrix4(planeClass.mesh.matrixWorld);
        missiles.forEach(missile => {
            let missileBox = box2.copy(missile.getBoundingBox()).applyMatrix4( missile.mesh.matrixWorld )
            if(planeBox.containsBox(missileBox) || planeBox.intersectsBox(missileBox)) {
                enemy.deleteOneMissile(missile, scene);
                if(planeClass.isMortal){
                    planeClass.damage(1);
                    takeOneHealthBar(planeClass, scene, vidas);
                }
            }
        });
    });
}
function colisionCuraPlane(curaVector, planeClass, vidas, scene) {
    curaVector.forEach(cura => {
        let planeBox = box3.copy(planeClass.getBoundingBox()).applyMatrix4(planeClass.mesh.matrixWorld);
        let curaBox = box.copy(cura.getBoundingBox()).applyMatrix4(cura.mesh.matrixWorld);
        if(curaBox.containsBox(planeBox) || curaBox.intersectsBox(planeBox)) {
            if(planeClass.canTakeLife){
                gainOneHealthBar(planeClass, vidas, scene);
                planeClass.recover(1);
                cura.setIsCaught();
            }
        }
    });
}


export {
   colisionPlaneEnemy,
   colisionBulletEnemy,
   colisionBulletPlane,
   colisionMissileEnemy,
   colisionMissilePlane,
   colisionCuraPlane
}