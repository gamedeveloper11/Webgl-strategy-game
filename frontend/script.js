
// === MODULE IMPORTS (CDN-based) ===
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";

// === SOCKET.IO CONNECTION ===
const socket = io(); // Connects automatically to backend

// === 3D SCENE SETUP ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("gameCanvas"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87ceeb); // Sky blue

// Lighting
const ambient = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambient);

// === TERRITORIES ===
const textureLoader = new THREE.TextureLoader();

const territories = [
  {
    name: "Jungle",
    texture:
      "https://cdn.jsdelivr.net/gh/PolyHaven/textures@master/1024png/jungle_ground_diff_1k.png",
    position: [-4, 0, 0],
  },
  {
    name: "Desert",
    texture:
      "https://cdn.jsdelivr.net/gh/PolyHaven/textures@master/1024png/desert_sand_diff_1k.png",
    position: [0, 0, 0],
  },
  {
    name: "Mountain",
    texture:
      "https://cdn.jsdelivr.net/gh/PolyHaven/textures@master/1024png/rock_wall_diff_1k.png",
    position: [4, 0, 0],
  },
];

const geometry = new THREE.BoxGeometry(2, 0.5, 2);
const meshes = [];

territories.forEach((t) => {
  const mat = new THREE.MeshLambertMaterial({
    map: textureLoader.load(t.texture),
  });
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(...t.position);
  mesh.userData.name = t.name;
  scene.add(mesh);
  meshes.push(mesh);
});

camera.position.set(0, 3, 6);
const controls = new OrbitControls(camera, renderer.domElement);

// === RAYCASTER (CLICK DETECTION) ===
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(meshes);

  if (intersects.length > 0) {
    const name = intersects[0].object.userData.name;
    alert(`You selected: ${name} territory!`);
  }
});

// === ANIMATION LOOP ===
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === CHAT LOGIC ===
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendMessage = document.getElementById("sendMessage");

sendMessage.addEventListener("click", () => {
  const msg = chatInput.value.trim();
  if (msg) {
    socket.emit("chatMessage", msg);
    chatInput.value = "";
  }
});

socket.on("chatMessage", (msg) => {
  const div = document.createElement("div");
  div.textContent = msg;
  chatMessages.appendChild(div);
});

// === WALLET & NFT ===
document.getElementById("connectMetamask").onclick = async () => {
  alert("Connecting to MetaMask (simulated)...");
};

document.getElementById("connectPhantom").onclick = async () => {
  alert("Connecting to Phantom (simulated)...");
};

document.getElementById("mintNFT").onclick = async () => {
  const wallet = "0xTestWallet123";
  const res = await fetch("/mintNFT", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet }),
  });
  const data = await res.json();
  alert(data.message);
};