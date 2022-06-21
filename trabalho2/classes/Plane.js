import * as THREE from 'three';
import { default as Bullet } from './Bullet.js';
import { default as Missile } from './Missile.js';

export default class Plane {
   // Private
   #geometry = new THREE.ConeGeometry(5, 15, 64);
   #material = new THREE.MeshLambertMaterial({color:'rgb(180,180,255)'});
   // Public
   mesh;
   boundingBox = new THREE.Box3();
   bullets;
   missiles;
   target;

   constructor() {
      this.mesh = new THREE.Mesh(this.#geometry, this.#material);
      this.mesh.position.set(0,16,0);
      this.mesh.rotateX(-1.6);
      this.mesh.geometry.computeBoundingBox();
      this.boundingBox
         .copy(this.mesh.geometry.boundingBox)
         .applyMatrix4(this.mesh.matrixWorld);
      this.bullets = [];
      this.missiles = [];
      this.target = new THREE.Vector3();
   }

   getBoundingBox() {
      return this.boundingBox;
   }

   getBullets() {
      return this.bullets;
   }

   // Função para criar um tiro
   createShoot(scene) {
      let bullet = new Bullet();
      this.mesh.getWorldPosition(this.target);
      bullet.setPosition(this.target);
      scene.add(bullet.mesh);
      this.bullets.push(bullet);
   }

   moveBullets() {
      this.bullets.forEach(item => {
         item.mesh.translateZ(-1);
      });
   }

   deleteBullets(scene) {
      let array = this.bullets;
      array.forEach(element => {
         element.mesh.updateMatrixWorld(true);
         if(element.getPositionZ() == -185) {
            scene.remove(element.mesh);
            let id = array.indexOf(element);
            array.splice(id, 1);
         }
      });
   }

   deleteOneBullet(bullet, scene) {
      let id = this.bullets.indexOf(bullet);
      scene.remove(bullet.mesh);
      this.bullets.splice(id, 1);
   }

   createMissiles(scene) {
      let missile = new Missile();
      this.mesh.getWorldPosition(this.target);
      missile.setPosition(this.target);
      missile.mesh.rotateX(1.35);
      this.missiles.push(missile);
      scene.add(missile.mesh);
   }

   moveMissiles() {
      this.missiles.forEach(item => {
         item.mesh.translateY(-1);
      });
   }

   deleteMissiles(scene) {
      let array = this.missiles;
      array.forEach(element => {
         element.mesh.updateMatrixWorld(true);
         if(element.getPositionZ() <= -180) {
            scene.remove(element.mesh);
            let id = array.indexOf(element);
            array.splice(id, 1);
         }
      })
   }

}