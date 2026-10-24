import * as THREE from 'three';

// Tudo é montado com caixas em coordenadas de "canto mínimo": box(parent, [x,y,z], [w,h,d], cor).
// A sala ocupa x,z ∈ [-12, 12], chão em y = 0, paredes ao fundo (z = -12) e à esquerda (x = -12).

const GEO = new THREE.BoxGeometry(1, 1, 1);
const mats = new Map();

function mat(color) {
  if (!mats.has(color)) mats.set(color, new THREE.MeshLambertMaterial({ color }));
  return mats.get(color);
}

function box(parent, [x, y, z], [w, h, d], color, { shadow = true } = {}) {
  const m = new THREE.Mesh(GEO, mat(color));
  m.scale.set(w, h, d);
  m.position.set(x + w / 2, y + h / 2, z + d / 2);
  m.castShadow = shadow;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

// Gera números pseudo-aleatórios estáveis para a cena ser sempre igual
function rng(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function shade(hex, amount) {
  return new THREE.Color(hex).offsetHSL(0, 0, amount);
}

// Grade de voxels instanciados com leve variação de cor
function voxelGrid(parent, cells, size, { shadow = false } = {}) {
  const mesh = new THREE.InstancedMesh(GEO, new THREE.MeshLambertMaterial({ color: 0xffffff }), cells.length);
  const m = new THREE.Matrix4();
  cells.forEach((c, i) => {
    const [w, h, d] = c.size || size;
    m.makeScale(w, h, d).setPosition(c.x + w / 2, c.y + h / 2, c.z + d / 2);
    mesh.setMatrixAt(i, m);
    mesh.setColorAt(i, c.color);
  });
  mesh.receiveShadow = true;
  mesh.castShadow = shadow;
  parent.add(mesh);
  return mesh;
}

function canvasPlane(parent, draw, [cw, ch], [w, h], position, rotationY = 0) {
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.LinearFilter;
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex }));
  plane.position.set(...position);
  plane.rotation.y = rotationY;
  parent.add(plane);
  let last = [];
  const redraw = (...args) => {
    if (args.length) last = args;
    draw(canvas.getContext('2d'), cw, ch, ...last);
    tex.needsUpdate = true;
  };
  redraw();
  canvases.push(redraw);
  return { plane, redraw };
}

// Redesenha as texturas de canvas (ex.: depois que as fontes carregarem)
const canvases = [];
export const refreshCanvases = () => canvases.forEach((r) => r());

/* ---------------- Sala ---------------- */

function buildRoom(scene) {
  const r = rng(7);
  const floor = [];
  for (let x = -12; x < 12; x++) {
    for (let z = -12; z < 12; z++) {
      // tábuas de madeira em faixas de 4 blocos
      const plank = Math.floor((z + 12 + (x % 2 === 0 ? 0 : 2)) / 4) % 2;
      floor.push({ x, y: -1, z, color: shade(plank ? '#b07a47' : '#a46d3d', (r() - 0.5) * 0.04) });
    }
  }
  voxelGrid(scene, floor, [1, 1, 1]);

  const walls = [];
  for (let y = 0; y < 16; y++) {
    const base = y === 0 ? '#7d5a44' : y < 6 ? '#c9b48f' : '#e8d9b5';
    for (let i = -13; i < 12; i++) {
      walls.push({ x: i, y, z: -13, color: shade(base, (r() - 0.5) * 0.03) });
      if (i >= -12) walls.push({ x: -13, y, z: i, color: shade(base, (r() - 0.5) * 0.03) });
    }
  }
  voxelGrid(scene, walls, [1, 1, 1]);
  // faixa decorativa da parede
  box(scene, [-12, 6, -12], [24, 0.3, 0.2], '#8a6a4a', { shadow: false });
  box(scene, [-12, 6, -11.8], [0.2, 0.3, 23.8], '#8a6a4a', { shadow: false });

  // tapete
  box(scene, [-10, 0, -7], [13, 0.1, 10], '#e0a458', { shadow: false });
  box(scene, [-9.5, 0.02, -6.5], [12, 0.1, 9], '#b5523b', { shadow: false });
  for (let i = 0; i < 6; i++) box(scene, [-8.5 + i * 2, 0.05, -4.5], [1, 0.1, 5], '#c86a4f', { shadow: false });
}

function buildDesk(scene) {
  const wood = '#9a6634';
  const dark = '#6b4423';
  box(scene, [-10, 4.5, -11.8], [13, 0.5, 5], wood);
  for (const [x, z] of [[-10, -11.8], [2.4, -11.8], [-10, -7.4], [2.4, -7.4]]) box(scene, [x, 0, z], [0.6, 4.5, 0.6], dark);
  // gaveteiro
  box(scene, [-0.6, 1.2, -11.6], [3, 3.3, 4.4], '#8a5a2e');
  box(scene, [-0.6, 2.8, -7.25], [3, 0.1, 0.1], dark, { shadow: false });
  box(scene, [0.5, 3.4, -7.25], [0.8, 0.25, 0.15], '#d9c27a', { shadow: false });
  box(scene, [0.5, 1.9, -7.25], [0.8, 0.25, 0.15], '#d9c27a', { shadow: false });

  // luminária
  const lamp = new THREE.Group();
  box(lamp, [-9.4, 5, -11.3], [1.4, 0.3, 1.4], '#2f3e46');
  box(lamp, [-8.9, 5.3, -10.9], [0.4, 3.2, 0.4], '#2f3e46');
  box(lamp, [-9.1, 8.3, -10.9], [2, 0.7, 1.2], '#e8b04a');
  box(lamp, [-8.8, 8.1, -10.7], [1.4, 0.2, 0.8], '#fff3c4', { shadow: false });
  scene.add(lamp);
  const bulb = new THREE.PointLight(0xffc56b, 18, 14, 1.6);
  bulb.position.set(-8, 7.6, -10);
  scene.add(bulb);

  // caneca de café
  box(scene, [-1.6, 5, -11], [0.9, 1.1, 0.9], '#f4efe6');
  box(scene, [-1.5, 6.05, -10.9], [0.7, 0.1, 0.7], '#4a2c1a', { shadow: false });
  box(scene, [-0.7, 5.3, -10.7], [0.3, 0.5, 0.3], '#f4efe6');
}

function buildChair(scene) {
  const g = new THREE.Group();
  box(g, [-1.4, 2.5, -1.4], [2.8, 0.5, 2.8], '#3b5b8c');
  box(g, [-1.4, 3, 1], [2.8, 3.6, 0.5], '#3b5b8c');
  box(g, [-1.2, 3.4, 1.1], [2.4, 2.8, 0.5], '#4b6fa8');
  box(g, [-0.3, 0.5, -0.3], [0.6, 2, 0.6], '#333');
  box(g, [-1.4, 0, -0.3], [2.8, 0.5, 0.6], '#333');
  box(g, [-0.3, 0, -1.4], [0.6, 0.5, 2.8], '#333');
  g.position.set(-4, 0, -5);
  g.rotation.y = -0.35;
  scene.add(g);
}

function buildPlant(scene, [x, y, z], s = 1) {
  const g = new THREE.Group();
  box(g, [0, 0, 0], [1.6 * s, 1.6 * s, 1.6 * s], '#c06a3e');
  box(g, [0.1 * s, 1.6 * s, 0.1 * s], [1.4 * s, 0.2 * s, 1.4 * s], '#5a3a22');
  const r = rng(11);
  const leaves = ['#3f8f5a', '#4fa86a', '#2f7a4a'];
  for (let i = 0; i < 9; i++) {
    const h = 1.8 + r() * 2.6;
    box(
      g,
      [(0.1 + r() * 1) * s, (1.7 + h * 0.4) * s, (0.1 + r() * 1) * s],
      [0.5 * s, h * 0.7 * s, 0.5 * s],
      leaves[i % 3],
    );
  }
  g.position.set(x, y, z);
  scene.add(g);
}

// Portinha de gato na parede esquerda e caminha das gatinhas
function buildCatStuff(scene) {
  box(scene, [-12, 0, 7.6], [0.16, 3, 2.4], '#6b4423', { shadow: false });
  box(scene, [-11.93, 0, 7.85], [0.12, 2.6, 1.9], '#2a2118', { shadow: false });
  box(scene, [-11.9, 2.15, 7.85], [0.14, 0.12, 1.9], '#8a5a2e', { shadow: false });

  box(scene, [5.8, 0, 4.8], [2.8, 0.25, 2.8], '#6b8fc7');
  box(scene, [5.8, 0.25, 4.8], [2.8, 0.45, 0.4], '#5a7cb3');
  box(scene, [5.8, 0.25, 7.2], [2.8, 0.45, 0.4], '#5a7cb3');
  box(scene, [5.8, 0.25, 5.2], [0.4, 0.45, 2], '#5a7cb3');
  box(scene, [8.2, 0.25, 5.2], [0.4, 0.45, 2], '#5a7cb3');
  box(scene, [6.2, 0.25, 5.2], [2, 0.12, 2], '#f4efe6', { shadow: false });
  // potinhos de comida e água
  box(scene, [-10.4, 0, 10.4], [1, 0.4, 1], '#d64545');
  box(scene, [-10.25, 0.4, 10.55], [0.7, 0.05, 0.7], '#8a5a2e', { shadow: false });
  box(scene, [-9.1, 0, 10.4], [1, 0.4, 1], '#3b5b8c');
  box(scene, [-8.95, 0.4, 10.55], [0.7, 0.05, 0.7], '#9fd8ff', { shadow: false });
}

/* ---------------- Objetos interativos ---------------- */

function buildComputer() {
  const g = new THREE.Group();
  box(g, [-5.2, 5, -10.6], [2, 0.3, 1.4], '#2b2b33');
  box(g, [-4.5, 5.3, -10.3], [0.6, 1, 0.5], '#2b2b33');
  box(g, [-7.2, 6.1, -10.4], [6, 4, 0.6], '#2b2b33');
  // teclado e mouse
  box(g, [-6.2, 5, -8.8], [4, 0.3, 1.4], '#3a3a44');
  for (let i = 0; i < 7; i++) box(g, [-6 + i * 0.52, 5.3, -8.6], [0.4, 0.1, 1], '#5c5c6a', { shadow: false });
  box(g, [-1.6, 5, -8.6], [0.6, 0.3, 0.9], '#3a3a44');
  // gabinete embaixo da mesa
  box(g, [-9.2, 0, -11.4], [1.8, 4, 3.6], '#2b2b33');
  box(g, [-8.6, 3.2, -7.85], [0.3, 0.3, 0.1], '#39ff88', { shadow: false });
  box(g, [-9, 0.8, -7.85], [1.4, 1.8, 0.1], '#3a3a44', { shadow: false });

  const screen = canvasPlane(
    g,
    (ctx, w, h, lang = 'pt', cursor = true) => {
      ctx.fillStyle = '#0d1b14';
      ctx.fillRect(0, 0, w, h);
      ctx.font = '22px "IBM Plex Mono", monospace';
      const green = '#5dff9c';
      const lines = [
        ['leo@office:~$ kubectl get projects', green],
        ['', green],
        ['NAME             STARS  LANG', '#a6e3b8'],
        ['k8s-clean-yaml   ★ 4    Python', '#e8ffe9'],
        ['blog             ★ 1    TypeScript', '#e8ffe9'],
        ['fullcyle         ★ 1    Go', '#e8ffe9'],
        ['caraiqbonito     ●      pages', '#e8ffe9'],
        ['receitas         ●      pages', '#e8ffe9'],
        ['omeletteaufromage ●     pages', '#e8ffe9'],
        ['', green],
        [lang === 'pt' ? '# clique para abrir' : '# click to open', '#7fa88c'],
        ['leo@office:~$ ' + (cursor ? '█' : ''), green],
      ];
      lines.forEach(([text, color], i) => {
        ctx.fillStyle = color;
        ctx.fillText(text, 18, 34 + i * 26);
      });
      // scanlines
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 2);
    },
    [512, 340],
    [5.4, 3.5],
    [-4.2, 8.1, -9.79],
  );
  return { group: g, screen };
}

function buildWhiteboard() {
  const g = new THREE.Group();
  box(g, [-8.6, 10.4, -12], [10.6, 5.2, 0.3], '#9aa0a8');
  box(g, [-6.5, 10.1, -12], [6, 0.3, 0.7], '#9aa0a8');
  box(g, [-6, 10.4, -11.6], [1, 0.2, 0.2], '#e4572e', { shadow: false });
  box(g, [-4.6, 10.4, -11.6], [1, 0.2, 0.2], '#3b5b8c', { shadow: false });
  box(g, [-3.2, 10.4, -11.6], [1, 0.2, 0.2], '#3f8f5a', { shadow: false });
  canvasPlane(
    g,
    (ctx, w, h) => {
      ctx.fillStyle = '#fbfbf7';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#1f2a44';
      ctx.font = 'bold 40px "Press Start 2P", monospace';
      ctx.fillText('LEO', 28, 64);
      ctx.font = '22px "Press Start 2P", monospace';
      ctx.fillStyle = '#e4572e';
      ctx.fillText('Platform as a Product', 28, 112);
      // diagrama
      const boxes = [['DEV', 28], ['PLATFORM', 228], ['PROD', 498]];
      ctx.lineWidth = 5;
      ctx.font = '18px "Press Start 2P", monospace';
      boxes.forEach(([label, x], i) => {
        const bw = label === 'PLATFORM' ? 220 : 150;
        ctx.strokeStyle = ['#3b5b8c', '#3f8f5a', '#7a4fa0'][i];
        ctx.strokeRect(x, 160, bw, 70);
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillText(label, x + 18, 205);
        if (i < 2) {
          const ax = x + bw + 8;
          ctx.strokeStyle = '#1f2a44';
          ctx.beginPath();
          ctx.moveTo(ax, 195);
          ctx.lineTo(ax + 34, 195);
          ctx.lineTo(ax + 24, 185);
          ctx.moveTo(ax + 34, 195);
          ctx.lineTo(ax + 24, 205);
          ctx.stroke();
        }
      });
      ctx.fillStyle = '#1f2a44';
      ctx.font = '18px "Press Start 2P", monospace';
      ctx.fillText('DevEx  >  2.500 devs', 28, 290);
      ctx.fillText('lead time ↓  incidents ↓', 28, 330);
      // selo "in"
      ctx.fillStyle = '#0a66c2';
      ctx.fillRect(w - 110, 24, 80, 80);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 34px "Press Start 2P", monospace';
      ctx.fillText('in', w - 102, 82);
    },
    [700, 360],
    [10, 4.6],
    [-3.3, 13, -11.69],
  );
  return { group: g };
}

const WORLD = [
  '............................',
  '..######....##.....######...',
  '.#########.###...##########.',
  '..#######.......###########.',
  '...######......###########..',
  '....####......#######.####..',
  '.....###.....#########..#...',
  '......##......######........',
  '.......###.....####.....#...',
  '.......#####....###....###..',
  '........####....##......##..',
  '.........##.................',
  '.........#..................',
  '............................',
];

function buildMap() {
  const g = new THREE.Group();
  box(g, [-12, 6.5, -11], [0.35, 8, 15], '#6b4423');
  const r = rng(3);
  const cells = [];
  const s = 0.5;
  WORLD.forEach((row, ry) => {
    [...row].forEach((ch, cx) => {
      const land = ch === '#';
      cells.push({
        x: -11.65,
        y: 13.5 - (ry + 1) * s,
        z: 3.5 - (cx + 1) * s,
        size: [land ? 0.35 : 0.15, s, s],
        color: land ? shade(r() > 0.5 ? '#6bbf59' : '#86cf6b', (r() - 0.5) * 0.06) : shade('#3d7ebf', (r() - 0.5) * 0.04),
      });
    });
  });
  voxelGrid(g, cells, [0.15, s, s]);
  // alfinetes: Europa, Américas e Brasil
  for (const [row, col] of [[2, 15], [3, 13], [4, 4], [8, 9], [9, 10]]) {
    const y = 13.5 - (row + 1) * s;
    const z = 3.5 - (col + 1) * s + 0.07;
    box(g, [-11.3, y + 0.1, z], [0.6, 0.12, 0.12], '#ddd', { shadow: false });
    box(g, [-10.85, y, z - 0.1], [0.3, 0.35, 0.35], '#e63946');
  }
  return { group: g };
}

function buildShelf() {
  const g = new THREE.Group();
  const wood = '#7a4a26';
  box(g, [4.5, 0, -12], [0.5, 13, 3.2], wood);
  box(g, [10.5, 0, -12], [0.5, 13, 3.2], wood);
  box(g, [4.5, 13, -12], [6.5, 0.5, 3.2], wood);
  box(g, [5, 0, -12], [5.5, 13, 0.3], '#5e381c');
  const shelves = [0, 3.2, 6.4, 9.6];
  shelves.forEach((y) => box(g, [5, y, -12], [5.5, 0.4, 3.2], wood));

  const r = rng(42);
  const palette = ['#e4572e', '#3b5b8c', '#f2c14e', '#3f8f5a', '#7a4fa0', '#e8e1cf', '#2f3e46', '#c86a4f'];
  // livros nas prateleiras 2, 3 e 4
  [6.4, 9.6, 0].forEach((y, si) => {
    let x = 5.15;
    while (x < 10.1) {
      const w = 0.35 + r() * 0.35;
      if (x + w > 10.4) break;
      const h = 1.8 + r() * 0.9;
      const c = palette[Math.floor(r() * palette.length)];
      if (si === 1 && x > 8.6 && x < 9.3) {
        // livro inclinado
        const b = box(g, [x, y + 0.4, -11.4], [w, h, 2.2], c);
        b.rotation.z = 0.35;
        x += 1;
        continue;
      }
      box(g, [x, y + 0.4, -11.5], [w, h, 2.2], c);
      box(g, [x + 0.02, y + 0.4 + h * 0.7, -9.32], [w - 0.04, 0.12, 0.05], '#f4efe6', { shadow: false });
      x += w + 0.04;
    }
  });
  // prateleira das receitas: fichários xadrez
  [['#d64545', 5.2], ['#f2c14e', 6.4], ['#3f8f5a', 7.6]].forEach(([c, x]) => {
    box(g, [x, 3.6, -11.6], [1, 2.6, 2.3], c);
    for (let i = 0; i < 3; i++) box(g, [x + 0.05, 4 + i * 0.7, -9.32], [0.4, 0.35, 0.05], '#fff', { shadow: false });
    box(g, [x + 0.2, 5.4, -9.3], [0.6, 0.4, 0.06], '#fff8e7', { shadow: false });
  });
  // caixinha de fichas de receita
  box(g, [8.9, 3.6, -11], [1.4, 1, 1.6], '#c06a3e');
  for (let i = 0; i < 4; i++) box(g, [9 + i * 0.3, 4.4, -10.8], [0.2, 0.6, 1.2], '#fff8e7', { shadow: false });
  return { group: g };
}

function buildWalkman() {
  const g = new THREE.Group();
  box(g, [0, 0, 0], [1.6, 2.2, 0.6], '#e4572e');
  box(g, [0.2, 0.9, 0.6], [1.2, 0.9, 0.05], '#2b2b33', { shadow: false });
  box(g, [0.35, 1.2, 0.64], [0.3, 0.3, 0.03], '#e8e1cf', { shadow: false });
  box(g, [0.95, 1.2, 0.64], [0.3, 0.3, 0.03], '#e8e1cf', { shadow: false });
  // adesivo de omelete
  box(g, [0.25, 0.2, 0.61], [1.1, 0.55, 0.04], '#fff3c4', { shadow: false });
  box(g, [0.55, 0.3, 0.64], [0.45, 0.35, 0.03], '#ffc93c', { shadow: false });
  box(g, [0.15, 2.2, 0.15], [0.3, 0.2, 0.3], '#2b2b33');
  box(g, [0.65, 2.2, 0.15], [0.3, 0.2, 0.3], '#2b2b33');
  box(g, [1.15, 2.2, 0.15], [0.3, 0.2, 0.3], '#3f8f5a');
  // fones
  box(g, [2, 0, -0.2], [0.9, 0.5, 0.9], '#2b2b33');
  box(g, [2, 0, 1.4], [0.9, 0.5, 0.9], '#2b2b33');
  box(g, [2.3, 0.1, 0.6], [0.3, 0.25, 0.9], '#e4572e');
  box(g, [1.3, 0.05, 0.4], [0.8, 0.08, 0.08], '#222', { shadow: false });
  g.position.set(0.2, 5, -10.4);
  g.rotation.y = -0.25;
  return { group: g };
}

function buildPhoto() {
  const g = new THREE.Group();
  box(g, [0, 0, 0], [2, 2.4, 0.3], '#5a3a22');
  box(g, [0.7, 0, -0.6], [0.6, 1.2, 0.6], '#5a3a22');
  canvasPlane(
    g,
    (ctx, w, h) => {
      // ilustração provisória em pixel art: pôr do sol na montanha
      const px = (x, y, c) => {
        ctx.fillStyle = c;
        ctx.fillRect(x * 8, y * 8, 8, 8);
      };
      for (let y = 0; y < h / 8; y++) for (let x = 0; x < w / 8; x++) px(x, y, y < 6 ? '#ffb877' : y < 10 ? '#ff8f6b' : '#f2c14e');
      for (let x = 2; x < 6; x++) for (let y = 3; y < 7; y++) if ((x - 4) ** 2 + (y - 5) ** 2 < 4) px(x + 6, y, '#fff3c4');
      for (let x = 0; x < w / 8; x++) {
        const m1 = 10 - Math.abs(((x * 1.3) % 10) - 5);
        for (let y = Math.floor(m1 + 4); y < h / 8; y++) px(x, y, '#7a4fa0');
        const m2 = 14 - Math.abs(((x * 0.9 + 3) % 8) - 4);
        for (let y = Math.floor(m2 + 2); y < h / 8; y++) px(x, y, '#3b5b8c');
      }
      for (let x = 0; x < w / 8; x++) for (let y = 19; y < h / 8; y++) px(x, y, '#3f8f5a');
    },
    [128, 160],
    [1.6, 2],
    [1, 1.2, 0.31],
  );
  g.position.set(-9.7, 5, -8.6);
  g.rotation.y = 0.45;
  return { group: g };
}

function buildCorkboard() {
  const g = new THREE.Group();
  box(g, [-12, 7.8, 4], [0.35, 5.4, 7], '#6b4423');
  box(g, [-11.75, 8.1, 4.3], [0.15, 4.8, 6.4], '#c8945a');
  const notes = [
    ['#ffe066', 12.2, 4.7],
    ['#ff9fb2', 11.8, 6.8],
    ['#9fd8ff', 10.4, 5.4],
    ['#b8f2a0', 10.1, 8.4],
    ['#ffe066', 12, 8.9],
    ['#ffffff', 9.6, 6.8],
  ];
  notes.forEach(([c, y, z], i) => {
    box(g, [-11.62, y - 1.3, z], [0.06, 1.3, 1.3], c, { shadow: false });
    for (let l = 0; l < 3; l++) box(g, [-11.55, y - 0.5 - l * 0.28, z + 0.15], [0.02, 0.08, 1 - (l === 2 ? 0.4 : 0)], '#555', { shadow: false });
    box(g, [-11.6, y - 0.2, z + 0.55], [0.25, 0.2, 0.2], ['#e63946', '#3b5b8c', '#3f8f5a'][i % 3], { shadow: false });
  });
  // fio vermelho ligando ideias
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-11.45, 11.8, 5.2),
      new THREE.Vector3(-11.45, 9.9, 6),
      new THREE.Vector3(-11.45, 11.5, 7.3),
      new THREE.Vector3(-11.45, 9.6, 8.9),
    ]),
    new THREE.LineBasicMaterial({ color: '#e63946' }),
  );
  g.add(line);
  return { group: g };
}

/* ---------------- Montagem ---------------- */

export function buildScene(scene) {
  buildRoom(scene);
  buildDesk(scene);
  buildChair(scene);
  buildPlant(scene, [9.2, 0, -7.6], 1);
  buildPlant(scene, [9.2, 13.5, -11.2], 0.55);
  buildCatStuff(scene);

  const computer = buildComputer();
  const objects = {
    about: buildWhiteboard(),
    computer,
    map: buildMap(),
    shelf: buildShelf(),
    podcast: buildWalkman(),
    blog: buildCorkboard(),
    photo: buildPhoto(),
  };

  for (const [id, o] of Object.entries(objects)) {
    o.group.userData.id = id;
    o.group.traverse((c) => (c.userData.id = id));
    scene.add(o.group);
    o.box = new THREE.Box3().setFromObject(o.group);
    o.center = o.box.getCenter(new THREE.Vector3());
    o.size = o.box.getSize(new THREE.Vector3());
  }

  return { objects, screen: computer.screen };
}

// Marcador "!" flutuante estilo missão
export function makeMarker() {
  const g = new THREE.Group();
  const m = new THREE.MeshBasicMaterial({ color: '#ffd23f' });
  const top = new THREE.Mesh(GEO, m);
  top.scale.set(0.45, 1.1, 0.45);
  top.position.y = 0.9;
  const dot = new THREE.Mesh(GEO, m);
  dot.scale.set(0.45, 0.45, 0.45);
  g.add(top, dot);
  return g;
}
