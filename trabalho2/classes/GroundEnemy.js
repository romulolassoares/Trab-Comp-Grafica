import * as THREE from 'three';
import { default as Bullet } from './Bullet.js';
import { default as GroundMissile } from './GroundMissile.js';
import {
   onWindowResize,
   degreesToRadians,
   createGroundPlane
} from "../../libs/util/util.js";

export default class Plane {
   // Private
   #geometry = new THREE.SphereGeometry( 7, 32, 16 );
   #material = new THREE.MeshLambertMaterial({color:"rgb(120, 165, 30)"});
   // Public
   mesh;
   boundingBox = new THREE.Box3();
   velocity;
   isDead;
   isShooting;
   missiles;
   missileCooldown;
   canShoot;
   target;

   constructor() {
      this.mesh = new THREE.Mesh(this.#geometry, this.#material);
      this.mesh.geometry.computeBoundingBox();
      // this.mesh.position.set(newpos,10,-200);
      this.boundingBox.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
      this.isDead = false;
      this.isShooting = true;
      this.missiles = [];
      this.missileCooldown = false;
      this.canShoot = true;
      this.target = new THREE.Vector3();
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
   }

   setPosition(newpos) {
      this.mesh.position.set(newpos,6,-200);
   }

   setVelocity(vel) {
      this.velocity = vel;
   }

   getPositionZ() {
      return this.mesh.position.z;
   }

   getPositionX() {
      return this.mesh.position.x;
   }

   getBoundingBox() {
      return this.boundingBox;
   }

   setIsDead(scene) {
      this.deleteAllMissiles(scene);
      this.isDead = true;
      this.velocity = 0;
   }

   createMissiles(scene) {
      if(!this.missileCooldown) {
         let missile = new GroundMissile();
         this.mesh.getWorldPosition(this.target);
         missile.setPosition(this.target);
         this.missiles.push(missile);
         scene.add(missile.mesh);
         this.missileCooldown = true;
         setTimeout( () => this.missileCooldown = false, 800);
      }
   }

   moveMissiles(planeTarget) {
      let array = this.missiles;
      array.forEach(element => {
         let v = this.velocity;
         // element.mesh.translateZ(v*0.3);
         if(element.getPositionY() <= 16) {
            element.mesh.translateY(.5);
         } else {
            // element.mesh.rotateX(degreesToRadians(90));
            // element.mesh.translateY(v*.5);
            if(element.mesh.rotation.x != 1.5707963267948963) {
               element.mesh.rotateX(degreesToRadians(90));
            } else if (element.mesh.rotation.x == 1.5707963267948963) {
               // element.mesh.lookAt(planeTarget);
               element.mesh.translateY(v*.5);
            }
         }
      });
   }

    // if(cylinder.position.y <= 5 && canMove) {
  //   moveGroundMissile();
  // } else {
  //   if(cylinder.rotation.x != 1.5707963267948963) {
  //     canMove = false;
  //     cylinder.rotateX(degreesToRadians((90/6)));
  //     cylinder.translateZ(0.01);
  //   } else if(cylinder.rotation.x == 1.5707963267948963) {
  //     // cylinder.rotateY(degreesToRadians(45));
  //     // moveGroundMissile();
  //     findEnemy();
  //   }
  // }

   deleteAllMissiles(scene) {
      let array = this.missiles;
      array.forEach(element => {
         scene.remove(element.mesh);
         // let id = array.indexOf(element);
         // array.splice(id, 1);
      })
      array.forEach(element => {
         // scene.remove(element.mesh);
         let id = array.indexOf(element);
         array.splice(id, 1);
      })
   }
}