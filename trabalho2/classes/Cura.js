import * as THREE from 'three';
import {degreesToRadians}from "../../libs/util/util.js";
import { CSG } from '../../libs/other/CSGMesh.js'

export default class Cura {
    auxMat = new THREE.Matrix4();

    cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.5, 20));
    cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 30, 0.5));
    cubeMesh2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 30, 0.5));
    
    csgObject;
    cylinderCSG;
    cubeCSG2;
    cubeCSG;
    meshCSG;

    boundingBox = new THREE.Box3();
    mesh;

    constructor(aviao) {
        this.cubeMesh.position.set(0.8, 0, 2);
        this.cubeMesh2.position.set(0.8, 0, 2);
        this.cubeMesh2.rotateY(degreesToRadians(90));
        this.cylinderMesh.position.set(0.8, 0, 2);
        this.cubeMesh.matrixAutoUpdate = false;
        this.cubeMesh.updateMatrix();
        this.cubeMesh2.matrixAutoUpdate = false;
        this.cubeMesh2.updateMatrix();
        this.cylinderMesh.matrixAutoUpdate = false;
        this.cylinderMesh.updateMatrix();

        this.cubeCSG = CSG.fromMesh(this.cubeMesh);
        this.cubeCSG2 = CSG.fromMesh(this.cubeMesh2);
        this.cylinderCSG = CSG.fromMesh(this.cylinderMesh);

        this.csgObject = this.cubeCSG.union(this.cubeCSG2);
        this.mesh = CSG.toMesh(this.csgObject, this.auxMat)
        this.meshCSG = CSG.fromMesh(this.mesh);
        this.csgObject = this.cylinderCSG.subtract(this.meshCSG);

        this.mesh = CSG.toMesh(this.csgObject, this.auxMat)
        this.mesh.material = new THREE.MeshPhongMaterial({ color: "rgb(178,34,34)", specular: "white" })

        this.mesh.geometry.computeBoundingBox();
        this.boundingBox
         .copy(this.mesh.geometry.boundingBox)
         .applyMatrix4(this.mesh.matrixWorld);
        this.mesh.rotateX(degreesToRadians(90));
        this.mesh.scale.set(2,2,2);
    }

    getBoundingBox() {
        return this.boundingBox;
    }

    setPosition(newpos) {
        this.mesh.position.set(newpos,20,-100);
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

}