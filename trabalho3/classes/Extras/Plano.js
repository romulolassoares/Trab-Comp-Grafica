import * as THREE from 'three';
import { degreesToRadians } from "../../../libs/util/util.js";


import { Water } from '../../external/Water2.js';

export default class Plano{

   textureLoader = new THREE.TextureLoader();
   repeatFactor = 1;
   wrapModeS  = THREE.RepeatWrapping;
   wrapModeT  = THREE.RepeatWrapping;
   minFilter = THREE.LinearFilter;
   magFilter = THREE.LinearFilter;

   sand = this.textureLoader.load('./textures/sand.jpg');
   grass = this.textureLoader.load('./textures/grass.jpg');
   granite = this.textureLoader.load('./textures/granite.png');


   geometryPlaneSand = new THREE.PlaneGeometry( 800, 200 );
   materialPlaneSand = new THREE.MeshBasicMaterial( {color: "rgb(255,255,255)", side: THREE.DoubleSide} );

   geometryPlane = new THREE.PlaneGeometry( 200, 1000 );
   materialPlane = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

   geometryPlaneGround = new THREE.PlaneGeometry( 20, 1000 );
   materialPlaneGround = new THREE.MeshBasicMaterial( {color: "rgb(255,255,255)", side: THREE.DoubleSide} );

   waterGeometry = new THREE.PlaneGeometry(300, 1000);
   flowMap = this.textureLoader.load('./textures/water/Water_1_M_Flow.jpg');
   water;

   planos = [];
   planoBase;

   constructor(scene) {
      for (let i = 0; i < 3; i++) {
         // planos[i] = createGroundPlaneWired(800.0, 200.0);
         this.planos[i] = new THREE.Mesh( this.geometryPlaneSand, this.materialPlaneSand );
         this.planos[i].position.set(0, 0, i * -100);
         this.planos[i].rotateX(degreesToRadians(-90))
         this.planos[i].receiveShadow = true;
         scene.add(this.planos[i]);
      }

      this.configMap(this.materialPlaneSand, this.sand);

      this.water = new Water( this.waterGeometry, {
         scale: 2,
         textureWidth: 1024,
         textureHeight: 1024,
         flowMap: this.flowMap
      } );
      this.water.position.y = 3;
      this.water.rotation.x = Math.PI * - 0.5;
      scene.add(this.water);

      this.planoBase =  new THREE.Mesh( this.geometryPlane, this.materialPlaneSand );
      this.planoBase.position.set(0, 0, -760);
      this.planoBase.rotateX(degreesToRadians(-90))
      scene.add( this.planoBase );


      this.configMap(this.materialPlane, this.grass);

      this.planoGrassRight =  new THREE.Mesh( this.geometryPlane, this.materialPlane );
      this.planoGrassRight.position.set(170, 10, 2);
      this.planoGrassRight.rotateX(degreesToRadians(90))
      scene.add( this.planoGrassRight );

      this.planoGrassLeft =  new THREE.Mesh( this.geometryPlane, this.materialPlane );
      this.planoGrassLeft.position.set(-170, 10, 2);
      this.planoGrassLeft.rotateX(degreesToRadians(90))
      scene.add( this.planoGrassLeft );

      
      this.configMap(this.materialPlaneGround, this.granite);

      this.planoGroundRight =  new THREE.Mesh( this.geometryPlaneGround, this.materialPlaneGround );
      this.planoGroundRight.position.set(63, 3, 2);
      this.planoGroundRight.rotateX(degreesToRadians(90))
      this.planoGroundRight.rotateY(degreesToRadians(45))
      scene.add( this.planoGroundRight );

      this.planoGroundLeft =  new THREE.Mesh( this.geometryPlaneGround, this.materialPlaneGround );
      this.planoGroundLeft.position.set(-63, 3, 2);
      this.planoGroundLeft.rotateX(degreesToRadians(90))
      this.planoGroundLeft.rotateY(degreesToRadians(-45))
      scene.add( this.planoGroundLeft );      
   }

   configMap(material, texture) {
      material.map = texture;
      material.map.wrapS = this.wrapModeS;
      material.map.wrapT = this.wrapModeT;
      material.map.minFilter = this.minFilter;
      material.map.magFilter = this.magFilter;
      material.map.repeat.set(this.repeatFactor,this.repeatFactor); 
   }

   moverPlanos() {
      this.planos.forEach(item => {
          item.translateY(-0.5);
          item.updateMatrixWorld(true);
          if (item.position.z == 50) {
              item.position.set(0, 0, -250);
          }
      });
  }
}
