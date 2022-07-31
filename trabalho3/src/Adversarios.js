import { default as EnemyAir } from '../classes/EnemyAir.js';
import { default as GroundEnemy } from '../classes/GroundEnemy.js';

function chamaAdversario(cooldownsType, enemyVector, groundEnemyVector) {
   if(!cooldownsType[0]) {
       cooldownsType[0] = true;
       setTimeout( () => cooldownsType[0] = false, 10000);
       criarAdversario(0, enemyVector);
   } else if (!cooldownsType[1]) {
       cooldownsType[1] = true;
       setTimeout( () => cooldownsType[1] = false, 25000);
       criarAdversario(1, enemyVector);
   } else if (!cooldownsType[2]) {
       cooldownsType[2] = true;
       setTimeout( () => cooldownsType[2] = false, 50000);
       criarAdversario(2, enemyVector);
   } else if (!cooldownsType[3]) {
       cooldownsType[3] = true;
       setTimeout( () => cooldownsType[3] = false, 45000);
       criarAdversario(3, enemyVector);
   }
   if(!cooldownsType[4]){
       cooldownsType[4] = true;
       setTimeout( () => cooldownsType[4] = false, 30000);
       criarAdversarioChao(groundEnemyVector);
   }
}
function criarAdversario(type, enemyVector) {
   let enemy = new EnemyAir(type);
   if(enemy.moveType === 0) {
       afterLoadEnemy(enemy, tecoTecoObj);
   } else if(enemy.moveType === 1) {
       afterLoadEnemy(enemy, tecoTecoObj);
   } else if(enemy.moveType === 2) {
       afterLoadEnemy(enemy, alienPurpleObj);
   } else if(enemy.moveType === 3) {
       afterLoadEnemy(enemy, tieFifhterObj);
   }
   var newpos = Math.floor(Math.random() * 95) + 1;
   const chance = Math.floor(Math.random() * 2) + 1;
   newpos = chance === 1 ? newpos : -newpos;
   enemy.setPosition(newpos);
   const velocidade = Math.floor(Math.random() * 5) + 2;
   enemy.setVelocity(velocidade);
   scene.add(enemy.mesh);
   enemyVector.push(enemy);
}
function criarAdversarioChao(groundEnemyVector) {
   let enemy = new GroundEnemy();
   afterLoadEnemy(enemy, toonTankObj);
   var newpos = Math.floor(Math.random() * 95) + 1;
   //newpos = 30;
   const chance = Math.floor(Math.random() * 2) + 1;
   newpos = chance === 1 ? newpos : -newpos;
   enemy.setPosition(newpos);
   const velocidade = Math.floor(Math.random() * 5) + 2;
   enemy.setVelocity(velocidade);
   scene.add(enemy.mesh);
   groundEnemyVector.push(enemy);
}
function movimentarAdversario(enemyVector, groundEnemyVector) {
   enemyVector.forEach(enemy => {
       let id = enemyVector.indexOf(enemy);
       enemy.move(enemyVector, id, scene);
   });
   groundEnemyVector.forEach(enemy => {
       let id = groundEnemyVector.indexOf(enemy);
       enemy.verticalChaoMove(groundEnemyVector, id ,scene);
   })
}

export {
   chamaAdversario,
   criarAdversario,
   criarAdversarioChao,
   movimentarAdversario
}