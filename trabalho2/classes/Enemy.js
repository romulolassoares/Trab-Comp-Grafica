import * as THREE from 'three';
import { default as Bullet } from './Bullet.js';

export default class Plane {
   // Private
   #geometry = new THREE.BoxGeometry(10, 10, 10);
   #material = new THREE.MeshLambertMaterial({color:"rgb(120, 165, 30)"});
   #startPosition;
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
   moveType;
   dir;
   timeAlive;
   t=0;

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
      this.moveType = Math.floor(Math.random() * 3);
      this.timeAlive = 3;
      this.dir = 1;
   }

   setPosition(newpos) {
      this.#startPosition = new THREE.Vector3(newpos,16,-20);
      console.log(this.#startPosition)
      this.mesh.position.set(newpos,16,-20);
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
   
   move() {
      switch (this.moveType) {
         // case 0: vertical(enemy);
         // case 1: diagonal(enemy);
         default: ;
      }
   }

   verticalMove() {
      this.mesh.translateZ(0.2 * this.velocity);
   }

   rotateMove(path) {
      // points.forEach(point => {
      //    this.mesh.position.set(point.x, point.y, point.z)
      // })
      // const path = new THREE.Path();
      // path.quadraticCurveTo(this.#startPosition.x, this.#startPosition.z, -10, -100)
      // // const points = path.getPoints();

      // // const geometry = new THREE.BufferGeometry().setFromPoints( points );
      // // const material = new THREE.LineBasicMaterial( { color: 0xffffff } );

      // // const line = new THREE.Line( geometry, material );
      // // scene.add( line );
      this.t += 0.01;
      var pos = path.getPoint(this.t);
      if(pos != null) {
         // this.mesh.position.set(pos.x, this.mesh.position.y, this.mesh.position.z+pos.x)  
      }
      // this.mesh.translateZ(0.2 * this.velocity);
   }

   diagonalMove() {}
}