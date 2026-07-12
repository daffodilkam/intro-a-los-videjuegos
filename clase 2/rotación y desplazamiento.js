import './style.css'; 
import * as THREE from 'three'; 
// 1. ESCENA 
const scene = new THREE.Scene(); 
// 2. CÁMARA 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); 
camera.position.z = 3; 
// 3. RENDERIZADOR 
const renderer = new THREE.WebGLRenderer({ antialias: true }); renderer.setSize(window.innerWidth, window.innerHeight); document.body.appendChild(renderer.domElement); 
// CÁPSULA 
const geometry = new THREE.CapsuleGeometry(0.5, 0.5, 10, 20); const material = new THREE.MeshPhongMaterial({ 
color: 0xffffff, 
transparent: true, 
opacity: 0.6, 
shininess: 100 
}); 
const capsule = new THREE.Mesh(geometry, material); scene.add(capsule); 
// LUZ IZQUIERDA 
const leftLight = new THREE.PointLight(0xfeba55, 2, 100); leftLight.position.set(-3, 0, 2); 
scene.add(leftLight); 
// LUZ DERECHA 
const rightLight = new THREE.PointLight(0xc7cc7d, 2, 100); rightLight.position.set(3, 0, 2); 
scene.add(rightLight); 
// LUZ BASE 
const ambient = new THREE.AmbientLight(0x404040, 0.5); scene.add(ambient); 
//PARPADEO
let blinking = false; 
window.addEventListener('keydown', (event) => { if (event.key.toLowerCase() === 'm') { 
blinking = !blinking; 
} 
}); 
// TECLAS 
const keys = { 
ArrowUp: false, 
ArrowDown: false, 
ArrowLeft: false, 
ArrowRight: false, 
shift: false, 
k: false, 
v: false, 
}; 
// DETECTAR TECLAS 
window.addEventListener('keydown', (event) => { let key = event.key; 
if (key === 'Shift') key = 'shift'; 
if (key in keys) keys[key] = true; 
}); 
window.addEventListener('keyup', (event) => { let key = event.key; 
if (key === 'Shift') key = 'shift'; 
if (key in keys) keys[key] = false; 
}); 
// 4. ANIMACIÓN 
function animate() { 
requestAnimationFrame(animate); 
// Movimiento 
let currentSpeed = keys.shift ? 0.12 : 0.05; 
if (keys.ArrowUp) capsule.position.y += currentSpeed; if (keys.ArrowDown) capsule.position.y -= currentSpeed; if (keys.ArrowLeft) capsule.position.x -= currentSpeed;
if (keys.ArrowRight) capsule.position.x += currentSpeed; if (keys.k) capsule.rotation.y -= currentSpeed; 
if (keys.v) capsule.rotation.z += currentSpeed; 
// LÍMITES 
capsule.position.x = Math.max(-5, Math.min(5, capsule.position.x)); capsule.position.y = Math.max(-3, Math.min(3, capsule.position.y)); 
// LUCES QUE PARPADEAN 
if (blinking) { 
const t = Date.now() * 0.005; 
leftLight.intensity = Math.abs(Math.sin(t)) * 2; 
rightLight.intensity = Math.abs(Math.cos(t)) * 2; 
} else { 
leftLight.intensity = 2; 
rightLight.intensity = 2; 
} 
renderer.render(scene, camera); 
} 
animate(); 
// 5. AJUSTE DE PANTALLA 
window.addEventListener('resize', () => { 
camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); 
renderer.setSize(window.innerWidth, window.innerHeight); });
