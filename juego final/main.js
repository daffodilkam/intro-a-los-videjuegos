import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 8);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const vidaTxt = document.getElementById('vida');
const floresTxt = document.getElementById('flores');
const estadoTxt = document.getElementById('estado');

const textureLoader = new THREE.TextureLoader();
const forestTexture = textureLoader.load('/textures/floor.jpg');
forestTexture.wrapS = THREE.RepeatWrapping;
forestTexture.wrapT = THREE.RepeatWrapping;
forestTexture.repeat.set(4, 4);

const sueloGeo = new THREE.PlaneGeometry(50, 50);
const sueloMat = new THREE.MeshStandardMaterial({ map: forestTexture });
const suelo = new THREE.Mesh(sueloGeo, sueloMat);
suelo.rotation.x = -Math.PI / 2;
scene.add(suelo);

let vida = 100;
let flores = 0;
let jugador, cabaña;
let ojos = [];
let hologramas = [];
let floresObjs = [];
let detenido = false;
let juegoIniciado = false;

let mixer;
const clock = new THREE.Clock();
const loader = new GLTFLoader();

function ajustarModelo(modelo, tamañoObjetivo = 2) {
  const box = new THREE.Box3().setFromObject(modelo);
  const size = new THREE.Vector3();
  box.getSize(size);

  const maxDim = Math.max(size.x, size.y, size.z);
  const escala = tamañoObjetivo / maxDim;

  modelo.scale.set(escala, escala, escala);

  box.setFromObject(modelo);
  const center = new THREE.Vector3();
  box.getCenter(center);
  modelo.position.sub(center);
  modelo.position.y = 0;
}

loader.load('/models/dog1.glb',
  (gltf) => {
    jugador = gltf.scene;
    ajustarModelo(jugador, 2);
    jugador.position.set(0, 0.5, 5);
    jugador.rotation.y = Math.PI; // de espaldas
    scene.add(jugador);

    if (gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(jugador);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    }
    console.log("Perro cargado:", jugador);
  },
  undefined,
  (error) => console.error('Error cargando dog1.glb:', error)
);

loader.load('/models/old_cottage.glb',
  (gltf) => {
    cabaña = gltf.scene;
    ajustarModelo(cabaña, 10);
    cabaña.position.set(0, 0, -50);
    scene.add(cabaña);
  }
);

setInterval(() => {
  loader.load('/models/geranium_flower.glb',
    (gltf) => {
      const flor = gltf.scene;
      ajustarModelo(flor, 1);
      flor.position.set((Math.random() - 0.5) * 10, 0, -10 - Math.random() * 30);
      floresObjs.push(flor);
      scene.add(flor);
    }
  );
}, 5000);

setInterval(() => {
  loader.load('/models/fish_hologram.glb',
    (gltf) => {
      const holo = gltf.scene;
      ajustarModelo(holo, 3);
      holo.position.set((Math.random() - 0.5) * 10, 0, -15 - Math.random() * 40);
      hologramas.push(holo);
      scene.add(holo);
    }
  );
}, 8000);

setInterval(() => {
  loader.load('/models/realistic_human_eye.glb',
    (gltf) => {
      const ojo = gltf.scene;
      ajustarModelo(ojo, 1.5);
      ojo.position.set((Math.random() - 0.5) * 10, 0, -20 - Math.random() * 50);
      ojos.push(ojo);
      scene.add(ojo);
    }
  );
}, 10000);

const teclas = { ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false, shift: false };
window.addEventListener('keydown', (e) => { if (e.key in teclas) teclas[e.key] = true; });
window.addEventListener('keyup', (e) => { if (e.key in teclas) teclas[e.key] = false; });

function animate() {
  requestAnimationFrame(animate);

  if (mixer) mixer.update(clock.getDelta());

  if (juegoIniciado && jugador && !detenido) {
    let speed = teclas.shift ? 0.12 : 0.06;
    if (teclas.ArrowUp) jugador.position.z -= speed;
    if (teclas.ArrowDown) jugador.position.z += speed;
    if (teclas.ArrowLeft) jugador.position.x -= speed;
    if (teclas.ArrowRight) jugador.position.x += speed;
  }

  floresObjs.forEach((flor) => {
    if (jugador && jugador.position.distanceTo(flor.position) < 1.5) {
      vida += 20;
      flores++;
      scene.remove(flor);
      floresObjs = floresObjs.filter(f => f !== flor);
    }
  });

  hologramas.forEach((holo) => {
    if (jugador && jugador.position.distanceTo(holo.position) < 2) {
      detenido = true;
      setTimeout(() => detenido = false, 3000);
    }
  });

  ojos.forEach((ojo) => {
    if (jugador && jugador.position.distanceTo(ojo.position) < 1.5) {
      vida = 0;
    }
  });

  if (jugador && cabaña && jugador.position.distanceTo(cabaña.position) < 3) {
    estadoTxt.innerText = "¡Victoria!";
    juegoIniciado = false;
  }

  vidaTxt.innerText = "Vida: " + vida;
  floresTxt.innerText = "Flores: " + flores;
  if (vida <= 0) {
    estadoTxt.innerText = "Game Over";
    juegoIniciado = false;
    setTimeout(() => window.location.reload(), 2000);
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener('click', () => {
  if (!juegoIniciado) {
    juegoIniciado = true;
    estadoTxt.innerText = "Jugando...";
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
