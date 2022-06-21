import * as THREE from 'three';

export default class Plane {
   // Private
   #geometry = new THREE.ConeGeometry(5, 15, 64);
   #material = new THREE.MeshLambertMaterial({color:'rgb(180,180,255)'});
   // Public
   mesh;
   boundingBox = new THREE.Box3();

   constructor() {
      this.mesh = new THREE.Mesh(this.#geometry, this.#material);
      this.mesh.position.set(0,6,0);
      this.mesh.rotateX(-1.6);
      this.mesh.geometry.computeBoundingBox();
      this.boundingBox.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
   }

   getBoundingBox() {
      return this.boundingBox;
   }

}