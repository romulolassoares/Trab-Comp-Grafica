import * as THREE from 'three';

export default class Plane {
   // Private
   #geometry = new THREE.BoxGeometry(10, 10, 10);
   #material = new THREE.MeshLambertMaterial({color:"rgb(120, 165, 30)"});
   // Public
   mesh;
   boundingBox = new THREE.Box3();
   velocity;
   isDead;

   constructor() {
      this.mesh = new THREE.Mesh(this.#geometry, this.#material);
      this.mesh.geometry.computeBoundingBox();
      // this.mesh.position.set(newpos,10,-200);
      this.boundingBox.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
      this.isDead = false;
   }

   setPosition(newpos) {
      this.mesh.position.set(newpos,10,-200);
   }

   setVelocity(vel) {
      this.velocity = vel;
   }

   getPositionZ() {
      return this.mesh.position.z;
   }

   getBoundingBox() {
      return this.boundingBox;
   }

   setIsDead() {
      this.isDead = true;
      this.velocity = 0;
   }
}