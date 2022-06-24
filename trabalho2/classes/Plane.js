import * as THREE from 'three';
import { default as Bullet } from './Bullet.js';
import { default as Missile } from './Missile.js';
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';
import { degreesToRadians } from '../../libs/util/util.js';

export default class Plane {
   // Private
   #geometry = new THREE.ConeGeometry(5, 15, 64);
   #material = new THREE.MeshLambertMaterial({color:'rgb(180,180,255)'});
   //loader = new GLTFLoader();
   // Public
   mesh;
   boundingBox = new THREE.Box3();
   bullets;
   missiles;
   target;
   vida;
   isMortal;
    
   
   constructor(geometry,material) {
      this.mesh = new THREE.Mesh(geometry, material);
      // this.mesh = aviao;
      // this.mesh.scale.set(5,5,5);
      this.mesh.position.set(0,16,0);
      this.mesh.castShadow = true;
      this.mesh.rotateX(degreesToRadians(-90));
      this.mesh.geometry.computeBoundingBox();
      this.boundingBox
         .copy(this.mesh.geometry.boundingBox)
         .applyMatrix4(this.mesh.matrixWorld);
      this.bullets = [];
      this.missiles = [];
      this.target = new THREE.Vector3();
      this.vida = 10;
      this.isMortal = true;
   }

   getBoundingBox() {
      return this.boundingBox;
   }

   getBullets() {
      return this.bullets;
   }
   getMissiles() {
      return this.missiles;
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

   deleteOneMissile(missile, scene) {
      let id = this.missiles.indexOf(missile);
      scene.remove(missile.mesh);
      this.missiles.splice(id, 1);
   }

   damage(dano){
      this.vida -= dano;
   }
   
   recover(life){
      if(this.vida < 10)
         this.vida += life;
   }

   deletePlane(scene,planeHolder){
      scene.remove(this.mesh);
      scene.remove(this.boundingbox);
      scene.remove(planeHolder);
   }
   getVida(){
      return this.vida;
   }

   getIsMortal(){
      return this.isMortal;
   }
   
}