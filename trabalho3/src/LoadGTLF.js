import * as THREE from 'three';

// // Carregando os gltfs
// var loader = new GLTFLoader(loadingManager);
// var obj;
// var tecoTecoObj;
// var tieFifhterObj;
// var alienPurpleObj;
// var toonTankObj;
// var playVector = [false, false, false, false, false];

const afterLoadPlane = (object, planeClass, scene, planeHolder, playVector) => {
    planeClass.setObj(object);
    scene.add(object);
    planeHolder = planeClass.obj;
    playVector[0] = true;
    // play = true;
};
// const afterLoadEnemy = (enemy, object) => {
//     let objCopy = new THREE.Object3D();
//     objCopy.copy(object);
//     enemy.setObj(objCopy);
//     scene.add(objCopy);
//     // play = true;
// };

function loadGtlfsObjects(loader, obj, tecoTecoObj, tieFifhterObj, alienPurpleObj, toonTankObj, playVector, planeClass, scene, planeHolder) {
   loader.load('./assets/Airplane.glb', function (gltf) {
      obj = gltf.scene;
      obj.position.set(0,46,0);
      obj.name = 'airplane';
      obj.visible = true;
      obj.traverse(function (child) {
          if (child) {
              child.castShadow = true;
          }
      });
      afterLoadPlane(obj, planeClass, scene, planeHolder, playVector);
  }, onProgress, null);
  loader.load('./assets/ToonTank.glb', function (gltf) {
      toonTankObj = gltf.scene;
      toonTankObj.position.set(0,46,0);
      toonTankObj.scale.set(3,3,3);
      toonTankObj.name = 'airplane';
      toonTankObj.visible = true;
      toonTankObj.traverse(function (child) {
          if (child) {
              child.castShadow = true;
          }
      });
      // afterLoadPlane(obj);
      playVector[1] = true;
  }, onProgress, null);
  loader.load('./assets/TecoTeco.glb', function (gltf) {
      tecoTecoObj = gltf.scene;
      tecoTecoObj.position.set(0,46,0);
      tecoTecoObj.scale.set(2,2,2);
      tecoTecoObj.name = 'enemy';
      tecoTecoObj.visible = true;
      tecoTecoObj.traverse(function (child) {
          if (child) {
              child.castShadow = true;
          }
      });
      playVector[2] = true;
  }, onProgress, null);
  loader.load('./assets/tieFighter.glb', function (gltf) {
      tieFifhterObj = gltf.scene;
      tieFifhterObj.position.set(0,46,0);
      tieFifhterObj.scale.set(2,2,2);
      tieFifhterObj.name = 'enemy';
      tieFifhterObj.visible = true;
      tieFifhterObj.traverse(function (child) {
          if (child) {
              child.castShadow = true;
          }
      });
      playVector[3] = true;
  }, onProgress, null);
  loader.load('./assets/AlienPurple.glb', function (gltf) {
      alienPurpleObj = gltf.scene;
      alienPurpleObj.position.set(0,46,0);
      alienPurpleObj.scale.set(3,3,3);
      alienPurpleObj.name = 'enemy';
      alienPurpleObj.visible = true;
      alienPurpleObj.traverse(function (child) {
          if (child) {
              child.castShadow = true;
          }
      alienPurpleObj.children.splice(5,1);
      playVector[4] = true;
      });
  }, onProgress, null);  
}

// loadGLTFObject(loadingManager, '../assets/objects/r2d2/scene.gltf');

function onProgress(xhr, model) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
    }
}

export {loadGtlfsObjects}