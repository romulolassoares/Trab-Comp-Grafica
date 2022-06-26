import * as THREE from 'three';

export default class Enemy {
   // Private
   #geometry;
   #material;
   // Public
   mesh;
   boundingBox = new THREE.Box3();
   velocity;
   obj;
   isDead;
   canShoot;
   target;

   constructor(geometry, material) {
      this.#geometry = geometry;
      this.#material = material;
      this.mesh = new THREE.Mesh(this.#geometry, this.#material);
      this.mesh.geometry.computeBoundingBox();
      this.mesh.material.transparent = true;
      this.mesh.material.opacity = 0;
      this.boundingBox.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
      this.isDead = false;
      this.canShoot = true;
      this.target = new THREE.Vector3();
   }

   setObj(obj) {
      this.obj = obj;
      this.obj.castShadow = true;
      // this.obj.rotateY(degreesToRadians(-90));
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

   getPositionY() {
      return this.mesh.position.y;
   }

   getBoundingBox() {
      return this.boundingBox;
   }

   animation(vector, scene) {
      if(this.isDead == true){
         console.log("dead");
         this.mesh.rotation.y += 0.1;
         this.mesh.rotation.x += 0.1;
         if(this.mesh.scale.x>=0){
             this.mesh.scale.x -=.1;
             this.mesh.scale.y -=.1;
             this.mesh.scale.z -=.1;
             this.obj.scale.x -=.1;
             this.obj.scale.y -=.1;
             this.obj.scale.z -=.1;
         }
         if(this.mesh.scale.x <= 0) {
             scene.remove(this.mesh);
             scene.remove(this.obj);
             let id = vector.indexOf(this);
             vector.splice(id, 1);
         }
     }
   }
}