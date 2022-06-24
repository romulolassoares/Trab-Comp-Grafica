import * as THREE from 'three';
import { default as Bullet } from './Bullet.js';

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
   bullets;
   bulletCooldown;
   canShoot;
   target;

   constructor() {
      this.mesh = new THREE.Mesh(this.#geometry, this.#material);
      this.mesh.geometry.computeBoundingBox();
      // this.mesh.position.set(newpos,10,-200);
      this.boundingBox.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
      this.isDead = false;
      this.isShooting = true;
      this.bullets = [];
      this.bulletCooldown = false;
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
      this.deleteAllBullets(scene);
      this.isDead = true;
      this.velocity = 0;
   }

   createEnemyShoot(scene) {
      if(!this.bulletCooldown && this.canShoot) {
         let bullet = new Bullet();
         this.mesh.getWorldPosition(this.target);
         bullet.setPosition(this.target);
         this.bullets.push(bullet);
         scene.add(bullet.mesh);
         this.bulletCooldown = true;
         setTimeout( () => this.bulletCooldown = false, 2500);
      }
   }

   moveBullets() {
      let array = this.bullets;
      array.forEach(element => {
         let v = this.velocity;
         element.mesh.translateZ(v*0.3);
      });
   }

   deleteAllBullets(scene) {
      this.canShoot = false;
      let array = this.bullets;
      this.bulletCooldown = true;
      array.forEach(element => {
         scene.remove(element.mesh);
         let id = array.indexOf(element);
         array.splice(id, 1);
      })
   }
}