import * as THREE from 'three';
import { default as Bullet } from './Bullet.js';
import { default as Missile } from './Missile.js';
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';

export default class Plane {
   // Private
   #geometry = new THREE.ConeGeometry(5, 15, 64);
   // #material;
   #material = new THREE.MeshLambertMaterial({color:'rgb(180,180,255)'});
   //loader = new GLTFLoader();
   // Public
   mesh;
   obj;
   boundingBox = new THREE.Box3();
   bullets;
   missiles;
   target;
   vida;
   isMortal;
    
   
   constructor() {
      // this.loader.load('./assets/ToonTank.glb', function (gltf) {
      //  this.mesh = gltf.asset;    
      //  this.mesh.visible = true;
      //  this.mesh.traverse(function (child) {
      //      if (child) {
      //          child.castShadow = true;
      //          child.receiveShadow = true;
      //      }
      //  });
      // }, 
      // function onError() { }, 
      // function onProgress(xhr, model) {
      //     if (xhr.lengthComputable) {
      //         var percentComplete = xhr.loaded / xhr.total * 100;
      //     }
      // });
      this.mesh = new THREE.Mesh(this.#geometry, this.#material);
      this.mesh.opacity = 0;
      this.mesh.position.set(0,16,0);
      this.mesh.castShadow = true;
      this.mesh.rotateX(-1.6);
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

   setObj(obj) {
      this.obj = obj;
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
      this.vida = this.vida - dano;
      this.isMortal = false;
      setTimeout( () => this.isMortal = true, 200);
      console.log(this.vida)
   }
   
   recover(life){
      if(this.vida < 10)
         this.vida += life;
   }

   deletePlane(scene,planeHolder){
      scene.remove(this.mesh);
      scene.remove(this.boundingbox);
      this.mesh.translateY(-20);
   }

   getVida(){
      return this.vida;
   }

   getIsMortal(){
      return this.isMortal;
   }
   
}