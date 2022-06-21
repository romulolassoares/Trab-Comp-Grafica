import * as THREE from 'three';

export default class Missile {
   // Private
   #geometry = new THREE.CylinderGeometry(1, .5, 5, 32);
   #material = new THREE.MeshLambertMaterial({color:"rgb(255,165,0)"});
   // Public
   mesh;
   position;
   boundingBox = new THREE.Box3();

   constructor() {
      this.mesh = new THREE.Mesh(this.#geometry, this.#material);
      this.mesh.geometry.computeBoundingBox();
      this.boundingBox
         .copy(this.mesh.geometry.boundingBox)
         .applyMatrix4(this.mesh.matrixWorld);
   }

   setPosition(target) {
      this.mesh.position.set(target.x,target.y,target.z);
   }

   getPositionZ() {
      return this.mesh.position.z;
   }

   getPositionY() {
      return this.mesh.position.y;
   }
}