import * as THREE from 'three';
import { degreesToRadians } from "../../libs/util/util.js";
import { default as Enemy } from './Enemy.js'
import { default as Bullet } from './Bullet.js';

export default class EnemyAir extends Enemy {
   // Private
   #startPosition;
   // Public
   bullets;
   bulletCooldown;
   moveType;
   dir;
   timeAlive;
   t=0;

   constructor(type) {
      const geometry = new THREE.BoxGeometry(10, 10, 10);
      const material = new THREE.MeshLambertMaterial({color:"rgb(120, 165, 30)"});
      super(geometry, material);
      this.bullets = [];
      this.bulletCooldown = false;
      // this.moveType = Math.floor(Math.random() * 4);
      this.moveType = type;
      this.timeAlive = 3;
      this.dir = 1;
   }

   setPosition(newpos) {
      if(this.moveType == 3) {
         this.mesh.position.set(-41.18956708386401,16,-200);
         this.obj.position.set(-41.18956708386401,16,-200);
      } else if(this.moveType == 0) {
         this.mesh.position.set(newpos,16,-200);
         this.obj.position.set(newpos,10,-200);
      } else if(this.moveType == 1) {
         this.mesh.position.set(newpos,16,-200);
         this.obj.position.set(newpos,10,-200);
      } else if(this.moveType == 2) {
         this.mesh.position.set(newpos,16,-200);
         this.obj.position.set(newpos,10,-200);
      } else {
         this.mesh.position.set(newpos,16,-200);
         this.obj.position.set(newpos,16,-200);
      }
   }

   getBullets() {
      return this.bullets;
   }

   setIsDead(scene) {
      this.deleteAllBullets(scene);
      this.isDead = true;
      this.velocity = 0;
   }

   createEnemyShoot(scene) {
      if(!this.bulletCooldown && this.canShoot) {
         let bullet = new Bullet();
         this.obj.getWorldPosition(this.target);
         bullet.setPosition(this.target);
         this.bullets.push(bullet);
         scene.add(bullet.mesh);
         this.bulletCooldown = true;
         setTimeout( () => this.bulletCooldown = false, 3000);
      }
   }

   moveBullets(plane) {
      let array = this.bullets;
      array.forEach(element => {
         element.findPlane(plane);
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
         // let id = array.indexOf(element);
         // array.splice(id, 1);
      });
      array.forEach(element => {
         // scene.remove(element.mesh);
         let id = array.indexOf(element);
         array.splice(id, 1);
      });
   }
   
   move(enemyVector, id, scene) {
      if(this.moveType === 0) {
         this.verticalMove(enemyVector, id, scene);
      } else if(this.moveType === 1) {
         this.diagonalMove(enemyVector, id, scene);
      } else if(this.moveType === 2) {
         this.verticalAndStopMove(enemyVector, id, scene);
      } else if(this.moveType === 3) {
         this.rotateMove(enemyVector, id, scene);
      }
   }

   verticalMove(enemyVector, id, scene) {
      this.obj.updateMatrixWorld(true);
      this.mesh.updateMatrixWorld(true);
      if (this.getPositionZ() >= 70) {
         scene.remove(this.obj);
         scene.remove(this.mesh);
         this.deleteAllBullets(scene);
         enemyVector.splice(id, 1);
      } else {
         this.mesh.translateZ(0.2 * this.velocity);
         this.obj.translateZ(0.2 * this.velocity);
      }
   }

   diagonalMove(enemyVector, id, scene) {
      this.mesh.updateMatrixWorld(true);
      this.obj.updateMatrixWorld(true);
      if (this.getPositionZ() >= 70) {
         scene.remove(this.mesh);
         scene.remove(this.obj);
         this.deleteAllBullets(scene);
         enemyVector.splice(id, 1);
      } else {
         if(this.getPositionX() >= 95 || this.getPositionX() < -95) {
            this.dir = -this.dir
         }
         if (this.getPositionZ() < 70) {
            var v = this.velocity;
            var x = this.dir;
            this.mesh.translateZ(0.2 * v);
            this.mesh.translateX(0.2 * v * x);
            this.obj.translateZ(0.2 * v);
            this.obj.translateX(0.2 * v * x);
         }
      }
   }

   verticalAndStopMove(enemyVector, id, scene) {
      this.mesh.updateMatrixWorld(true);
      if (this.getPositionZ() >= 70 || this.getPositionX() > 120 || this.getPositionX() < -120) {
         scene.remove(this.mesh);
         this.deleteAllBullets(scene);
         enemyVector.splice(id, 1);
      } else {
         if (this.getPositionZ() < -30) {
            this.verticalMove();
         }
         if(this.getPositionX() >= 95 || this.getPositionX() < -95) {
            this.dir = -this.dir;
            this.timeAlive--;
         }
         if(this.getPositionZ() >= -40) {
            var v = this.velocity;
            var x = this.dir;
            if(this.timeAlive > 0){
               this.mesh.translateX(0.2 * v * x);
               this.obj.translateX(0.2 * v * x);
            } else {
               this.mesh.translateX(0.2 * v);
               this.obj.translateX(0.2 * v);
            }
         }
      }
   }
   
   rotateMove(enemyVector, id, scene) {
      const path = new THREE.Path();
      path.absarc(0, 90, degreesToRadians(2360), degreesToRadians(0), degreesToRadians(180), true);

      this.mesh.updateMatrixWorld(true);
      if(this.getPositionZ() <= -200 && this.getPositionX() > 39) {
         scene.remove(this.mesh);
         scene.remove(this.obj);
         this.deleteAllBullets(scene);
         enemyVector.splice(id, 1);
      } else {
         if(this.mesh.position.z <= -88 || this.mesh.position.x > 39){
            if(this.mesh.position.x > 39) {
               this.dir = -1;
            }
            this.mesh.translateZ(0.2 * this.velocity * this.dir);
            this.obj.translateZ(0.2 * this.velocity * this.dir);
         } else {
            this.t += 0.005;
         
            var pos = path.getPoint(this.t);
            if(pos != null) {
               this.mesh.position.set(-pos.x, this.mesh.position.y, -pos.y);
               this.obj.position.set(-pos.x, this.mesh.position.y, -pos.y);
            }
         }
      }
   }

   deleteOneBullet(bullet, scene) {
      let id = this.bullets.indexOf(bullet);
      scene.remove(bullet.mesh);
      this.bullets.splice(id, 1);
   }
}