import { default as Cura } from '../classes/Cura.js';
// Criando os elementos de vida
function criarCura(curaVector, scene){
   let cura = new Cura();
   var newpos = Math.floor(Math.random() * 95) + 1;
   //newpos = 0;
   const chance = Math.floor(Math.random() * 2) + 1;
   newpos = chance === 1 ? newpos : -newpos;
   cura.setPosition(newpos);
   scene.add(cura.mesh);
   curaVector.push(cura);
}
function verticalCura(curaVector, scene) {
   curaVector.forEach(cura => {
       let id = curaVector.indexOf(cura);
       cura.move(curaVector, id, scene);
   });
}
function takeOneHealthBar(planeClass, scene, vidas) {
   if(planeClass.vida >=0)
       scene.remove(vidas.at(planeClass.vida));
}
function gainOneHealthBar(planeClass, vidas, scene){
   scene.add(vidas.at(planeClass.vida));
}
function resetHealthBar(planeClass, vidas, scene){
   if(planeClass.vida <= 5){
       planeClass.vida = 5;
       for(let i = 0; i < planeClass.vida; i++)
           scene.add(vidas.at(i));
   }
}

export {
   criarCura,
   verticalCura,
   takeOneHealthBar,
   gainOneHealthBar,
   resetHealthBar
}