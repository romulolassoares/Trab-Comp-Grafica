import * as THREE from 'three';
import {
   onWindowResize,
   degreesToRadians,
   createGroundPlane
} from "../../libs/util/util.js";


export default class Missile {
   // Private
   #geometry = new THREE.CylinderGeometry(.5, 1, 5, 32);
   #material = new THREE.MeshLambertMaterial({color:"rgb(0,50,100)"});
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
         this.mesh.castShadow = true;
         this.mesh.receiveShadow = true;
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

   getPositionX() {
      return this.mesh.position.x;
   }

   getBoundingBox() {
      return this.boundingBox;
   }

   findPlane(plane) {
      // let angle = Math.atan2( plane.position.x - this.getPositionX(), plane.position.z - this.getPositionZ() ) * ( 180 / Math.PI );
      if(!this.find) {
         // this.mesh.rotateZ(degreesToRadians(Math.abs(angle)));
         this.mesh.lookAt(plane.position.x, 16, plane.position.z);
         this.find = true;
      }
   }
}