import * as THREE from 'three';

 // 1. Escena 
const scene = new THREE.Scene();

 // 2. Cámara 
const camera = newTHREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); camera.position.z = 5; 

// 3. Renderizador 
const renderer = new THREE.WebGLRenderer({ 
canvas: document.querySelector('#bg'), }); 
renderer.setSize(window.innerWidth, window.innerHeight); 

// 4. Objeto (Un cubo verde) 
const geometry = newTHREE.BoxGeometry(1, 1, 1); 
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(geometry, material); 
scene.add(cube); 

// 5. Animación 
function animate() { 
requestAnimationFrame(animate); 

// Rotación del cubo 
cube.rotation.x += 0.01; 
cube.rotation.y += 0.01;

 renderer.render(scene, camera);
 } animate();
