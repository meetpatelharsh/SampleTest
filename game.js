// Basic 3D obstacle dodger using Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.HemisphereLight(0xffffff, 0x444444);
light.position.set(0, 20, 0);
scene.add(light);

const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);

camera.position.z = 5;

const obstacles = [];
function spawnObstacle() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const obstacle = new THREE.Mesh(geometry, material);
  obstacle.position.x = Math.random() * 8 - 4;
  obstacle.position.y = Math.random() * 6 - 3;
  obstacle.position.z = -20;
  scene.add(obstacle);
  obstacles.push(obstacle);
}
setInterval(spawnObstacle, 1000);

const keys = {};
window.addEventListener('keydown', (e) => (keys[e.key] = true));
window.addEventListener('keyup', (e) => (keys[e.key] = false));

function animate() {
  requestAnimationFrame(animate);

  if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.position.x -= 0.1;
  if (keys['ArrowRight'] || keys['d'] || keys['D']) player.position.x += 0.1;
  if (keys['ArrowUp'] || keys['w'] || keys['W']) player.position.y += 0.1;
  if (keys['ArrowDown'] || keys['s'] || keys['S']) player.position.y -= 0.1;

  for (let i = obstacles.length - 1; i >= 0; i--) {
    const o = obstacles[i];
    o.position.z += 0.2;

    if (o.position.z > camera.position.z) {
      scene.remove(o);
      obstacles.splice(i, 1);
    } else if (o.position.distanceTo(player.position) < 1) {
      alert('Game Over! Refresh to try again.');
      window.location.reload();
      return;
    }
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
