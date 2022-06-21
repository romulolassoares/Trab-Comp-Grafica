import * as THREE from 'three';

export default class Plane {
   // Private
   #geometry = new THREE.ConeGeometry(5, 15, 64);
   #material = new THREE.MeshPhongMaterial({color:'rgb(180,180,255)'});
   // Public
   mesh;
   boundingBox = new THREE.Box3();
   acertouaviao;
   vida;

   constructor() {
      this.mesh = new THREE.Mesh(this.#geometry, this.#material);
      this.mesh.position.set(0,6,0);
      this.mesh.rotateX(-1.6);
      this.mesh.geometry.computeBoundingBox();
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
      this.boundingBox.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
      this.acertouaviao = false;
      this.vida = 10;
   }

   getBoundingBox() {
      return this.boundingBox;
   }

   damage(dano){
      this.vida -= dano;
   }

}