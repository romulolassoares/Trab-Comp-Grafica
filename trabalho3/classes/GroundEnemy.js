import * as THREE from 'three';
import { degreesToRadians } from "../../libs/util/util.js";
import { default as Enemy } from './Enemy.js'
import { default as GroundMissile } from './GroundMissile.js';

export default class GroundEnemy extends Enemy {
   // Private
   #geometry = new THREE.SphereGeometry( 7, 32, 16 );
   #material = new THREE.MeshLambertMaterial({color:"rgb(120, 165, 30)"});
   // Public
   missiles;
   missileCooldown;

   constructor() {
      const geometry = new THREE.SphereGeometry( 7, 32, 16 );
      const material = new THREE.MeshLambertMaterial({color:"rgb(120, 165, 30)"});
      super(geometry, material);
      this.missiles = [];
      this.missileCooldown = false;
      // this.mesh.castShadow = true;
      // this.mesh.receiveShadow = true;
   }

   setPosition(newpos) {
      this.mesh.position.set(newpos,6,-200);
      this.obj.position.set(newpos,6,-200);
   }

   setIsDead(scene) {
      this.deleteAllMissiles(scene);
      this.isDead = true;
      this.velocity = 0;
   }

   createMissiles(scene) {
      if(!this.missileCooldown && this.canShoot) {
         let missile = new GroundMissile();
         this.mesh.getWorldPosition(this.target);
         missile.setPosition(this.target);
         this.missiles.push(missile);
         scene.add(missile.mesh);
         this.missileCooldown = true;
         setTimeout( () => this.missileCooldown = false, 10000);
      }
   }

   moveMissiles(plane) {
      let array = this.missiles;
      array.forEach(element => {
         let altura = false;
         let v = this.velocity;
         if(element.getPositionY() != 16 && !altura) {
            element.mesh.translateY(.5);
            
         } else {
            altura = true;
            if(element.mesh.rotation.x < degreesToRadians(89)) {
               element.findPlane(plane);
               element.mesh.rotateX(degreesToRadians(90));
            } else {
               element.mesh.translateY(v*.3);
            }
         }
      });
   }

   deleteAllMissiles(scene) {
      this.canShoot = false;
      let array = this.missiles;
      array.forEach(element => {
         scene.remove(element.mesh);
      })
      array.forEach(element => {
         let id = array.indexOf(element);
         array.splice(id, 1);
      })
   }

   getMissiles() {
      return this.missiles;
   }

   deleteOneMissile(missile, scene) {
      let id = this.missiles.indexOf(missile);
      scene.remove(missile.mesh);
      this.missiles.splice(id, 1);
   }

   verticalChaoMove(groundEnemyVector, id ,scene) {
      this.mesh.updateMatrixWorld(true);
      if (this.getPositionZ() >= 70) {
          scene.remove(this.mesh);
          scene.remove(this.obj);
          
          let id = groundEnemyVector.indexOf(this);
          groundEnemyVector.splice(id,1);
      }
      if (this.getPositionZ() < 70) {
          var v = this.velocity;
          this.mesh.translateZ(0.2 * v);
          this.obj.translateZ(0.2 * v);
      }
   }
}