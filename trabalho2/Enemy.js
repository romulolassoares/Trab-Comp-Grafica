import * as THREE from 'three';

export default class Plane {
   // Private
   #geometry = new THREE.BoxGeometry(10, 10, 10);
   #material = new THREE.MeshPhongMaterial({color:"rgb(120, 165, 30)"});
   // Public
   mesh;
   boundingBox = new THREE.Box3();
   velocity;
   movimentation;

   constructor() {
      this.mesh = new THREE.Mesh(this.#geometry, this.#material);
      this.mesh.geometry.computeBoundingBox();
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
      // this.mesh.position.set(newpos,10,-200);
      this.boundingBox.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
   }

   setPosition(newpos) {
      this.mesh.position.set(newpos,10,-100);
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

   randomMovimentation() {
      this.movimentation = Math.floor(Math.random()*2);
   }
}