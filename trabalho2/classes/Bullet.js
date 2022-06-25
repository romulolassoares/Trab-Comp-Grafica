import * as THREE from 'three';

export default class Bullet {
   // Private
   #geometry = new THREE.SphereGeometry(1, 20, 50);
   #material = new THREE.MeshLambertMaterial({color:"rgb(255, 165, 0)"});
   // Public
   position;
   boundingBox = new THREE.Box3();
   find;

   constructor() {
      this.mesh = new THREE.Mesh(this.#geometry, this.#material);
      this.mesh.geometry.computeBoundingBox();
      this.boundingBox.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
      this.find = false;
   }

   setPosition(target) {
      this.mesh.position.set(target.x,target.y,target.z);
   }

   getBoundingBox() {
      return this.boundingBox;
   }

   getPositionZ() {
      return this.mesh.position.z;
   }

   getPositionY() {
      return this.mesh.position.y;
   }

   findPlane(plane) {
      if(!this.find) {
         this.mesh.lookAt(plane.position.x, 16, plane.position.z);
         this.find = true;
      }
   }

}