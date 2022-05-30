import * as THREE from 'three';

export default class Plane {
   // Private
   #geometry = new THREE.BoxGeometry(10, 10, 10);
   #material = new THREE.MeshLambertMaterial({color:"rgb(120, 165, 30)"});
   // Public
   mesh;
   boundingBox = new THREE.Box3();

   constructor(newpos) {
      this.mesh = new THREE.Mesh(this.#geometry, this.#material);
      this.mesh.position.set(newpos,10,-200);
      // this.boundingBox.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
   }

   get mesh() {
      return this.mesh;
   }

   get boundingBox() {
      return this.boundingBox;
   }


}