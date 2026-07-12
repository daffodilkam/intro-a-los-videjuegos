// 1. Crear el cargador de texturas
const textureLoader = new THREE.TextureLoader();

// 2. Cargar la imagen (al estar en la carpeta public, la ruta empieza con '/')
const texturaSuelo = textureLoader.load('/textura-suelo.jpg');

// Opcional: Si la imagen se ve muy estirada, puedes hacer que se repita (efecto mosaico)
texturaSuelo.wrapS = THREE.RepeatWrapping;
texturaSuelo.wrapT = THREE.RepeatWrapping;
texturaSuelo.repeat.set(4, 20); // Cuántas veces se repite en el eje X y Z

// 3. Crear el material usando la textura en la propiedad 'map'
const sueloMat = new THREE.MeshStandardMaterial({
map: texturaSuelo,
roughness: 0.8 // Evita que el suelo brille como espejo
});

// 4. Crear la geometría y el Mesh como de costumbre
const sueloGeo = new THREE.PlaneGeometry(10, 50);
const suelo = new THREE.Mesh(sueloGeo, sueloMat);
suelo.rotation.x = -Math.PI / 2;
scene.add(suelo);
