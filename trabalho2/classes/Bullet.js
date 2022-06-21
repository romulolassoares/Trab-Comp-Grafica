import * as THREE from 'three';

export default class Bullet {
   // Private
   #geometry = new THREE.SphereGeometry(1, 20, 50);
   #material = new THREE.MeshLambertMaterial({color:"rgb(255, 165, 0)"});
   // Public
   position;
   boundingBox = new THREE.Box3();

   constructor() {
      this.mesh = new THREE.Mesh(this.#geometry, this.#material);
      this.mesh.geometry.computeBoundingBox();
      this.boundingBox.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
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

   randomMovimentation() {
      this.movimentation = Math.floor(Math.random()*2);
   }
}