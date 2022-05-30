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
      // this.boundingBox.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
   }

   get mesh() {
      return this.mesh;
   }

   get boundingBox() {
      return this.boundingBox;
   }


}

//Criando o avião
// const geometry = new THREE.ConeGeometry( 5, 15, 64 );
// const material = new THREE.MeshLambertMaterial( {color:'rgb(180,180,255)'} );
// var cone = new THREE.Mesh( geometry, material );
// cone.position.set(0,6,0);
// cone.rotateX(-1.6);

// cone.geometry.computeBoundingBox();