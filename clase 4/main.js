const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });

// ==========================================
// LUCES
// ==========================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(3, 5, 2);
scene.add(directionalLight);
