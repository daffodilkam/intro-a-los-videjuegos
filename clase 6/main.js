import * as THREE from 'three';

// CONFIGURACIÓN DE LA ESCENA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LUCES
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// VARIABLES
let buenas = 0;
let malas = 0;
const velocidadObstaculo = 0.15;

const buenasTxt = document.getElementById('buenas-txt');
const malasTxt = document.getElementById('malas-txt');

// SUELO
const sueloGeo = new THREE.PlaneGeometry(10, 50);
const sueloMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
const suelo = new THREE.Mesh(sueloGeo, sueloMat);
suelo.rotation.x = -Math.PI / 2;
scene.add(suelo);

// JUGADOR
const jugadorGeo = new THREE.BoxGeometry(1, 1, 1);
const jugadorMat = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const jugador = new THREE.Mesh(jugadorGeo, jugadorMat);
jugador.position.set(0, 0.5, 5);
scene.add(jugador);

// OBSTÁCULO
const obstaculoGeo = new THREE.SphereGeometry(0.5, 16, 16);
const obstaculoMat = new THREE.MeshStandardMaterial({ color: 0xff3333 });
const obstaculo = new THREE.Mesh(obstaculoGeo, obstaculoMat);

function reiniciarObstaculo() {
obstaculo.position.z = -20;
obstaculo.position.x = (Math.random() - 0.5) * 6;
obstaculo.position.y = 0.5;
}
reiniciarObstaculo();
scene.add(obstaculo);

// CONTROLES
const teclas = { Left: false, Right: false };

window.addEventListener('keydown', (e) => {
if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') teclas.Left = true;
if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') teclas.Right = true;
});

window.addEventListener('keyup', (e) => {
if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') teclas.Left = false;
if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') teclas.Right = false;
});

function animate() {
requestAnimationFrame(animate);

if (teclas.Left && jugador.position.x > -3) jugador.position.x -= 0.1;
if (teclas.Right && jugador.position.x < 3) jugador.position.x += 0.1;

obstaculo.position.z += velocidadObstaculo;

// Colisión
const distancia = jugador.position.distanceTo(obstaculo.position);
if (distancia < 1.0) {
malas++;
if(malasTxt) malasTxt.innerText = malas;
reiniciarObstaculo();
}

// Esquivado
if (obstaculo.position.z > jugador.position.z + 2) {
buenas++;
if(buenasTxt) buenasTxt.innerText = buenas;
reiniciarObstaculo();
}

renderer.render(scene, camera);
}

animate();
