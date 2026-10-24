import * as THREE from 'three';

// As duas gatinhas: modelo voxel com esqueleto simples (corpo, cabeça, patas, rabo)
// e um "cérebro" feito de geradores que encadeiam comportamentos.
// O gato olha para +x no espaço local; root.rotation.y define a direção.

const V = 0.25; // tamanho do voxel
const LEG = 4.5 * V;
const GEO = new THREE.BoxGeometry(1, 1, 1);
const MAT = new THREE.MeshLambertMaterial({ color: 0xffffff });

/* ---------------- Pelagem ---------------- */

function hash(x, y, z, s) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(z | 0, 1440670441) + Math.imul(s, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function noise(x, y, z, s) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const f = (t) => t * t * (3 - 2 * t);
  const u = f(x - xi), v = f(y - yi), w = f(z - zi);
  const l = (a, b, t) => a + (b - a) * t;
  const c = (dx, dy, dz) => hash(xi + dx, yi + dy, zi + dz, s);
  return l(
    l(l(c(0, 0, 0), c(1, 0, 0), u), l(c(0, 1, 0), c(1, 1, 0), u), v),
    l(l(c(0, 0, 1), c(1, 0, 1), u), l(c(0, 1, 1), c(1, 1, 1), u), v),
    w,
  );
}

const WHITE = '#f4efe6';

export const COATS = [
  {
    // calico de olhos amarelos
    seed: 11,
    eye: '#f2c14e',
    pupil: '#1b1612',
    body(x, y, z) {
      const n = noise(x * 0.33, y * 0.33, z * 0.33, this.seed);
      if (n > 0.6) return '#2b2420';
      if (n > 0.36) return noise(x * 0.8, y, z * 0.8, 3) > 0.55 ? '#c46a24' : '#e0893a';
      return WHITE;
    },
    head(x, y, z) {
      if (y < 0 || (x === 3 && y === 0 && Math.abs(z) <= 1)) return WHITE;
      if (z < 0) return '#2b2420';
      return x <= 0 && z === 2 ? '#2b2420' : '#e0893a';
    },
    ear: (side) => (side < 0 ? '#2b2420' : '#e0893a'),
    tail: (i) => (i >= 7 ? '#2b2420' : i % 3 === 0 ? '#2b2420' : i % 3 === 1 ? '#e0893a' : '#c46a24'),
  },
  {
    // tricolor de olhos azuis
    seed: 29,
    eye: '#7cc0f0',
    pupil: '#1b2a3a',
    body(x, y, z) {
      const n = noise(x * 0.3, y * 0.3, z * 0.3, this.seed);
      if (n > 0.62) return '#3e2c22';
      if (n > 0.46) return '#8a6a52';
      return noise(x * 0.6, y * 0.6, z * 0.6, 7) > 0.5 ? '#c9a98a' : '#dcc4a6';
    },
    head(x, y, z) {
      if (y < 0) return WHITE;
      if (x === 3 && y === 0 && Math.abs(z) <= 1) return '#d9c0a3';
      if (x >= 2 && Math.abs(z) <= 1) return '#4a3428';
      if (y === 2 && x <= 1) return '#5e4433';
      return Math.abs(z) === 2 && x >= 1 ? '#c9a98a' : '#8a6a52';
    },
    ear: () => '#3e2c22',
    tail: (i) => (i >= 7 ? '#3e2c22' : i % 2 === 0 ? '#4a3428' : '#c9a98a'),
  },
];

/* ---------------- Modelo ---------------- */

function part(cells, shadow = true) {
  const mesh = new THREE.InstancedMesh(GEO, MAT, cells.length);
  const m = new THREE.Matrix4();
  const c = new THREE.Color();
  cells.forEach((cell, i) => {
    m.makeScale(V, V, V).setPosition(cell.x * V, cell.y * V, cell.z * V);
    mesh.setMatrixAt(i, m);
    mesh.setColorAt(i, c.set(cell.color));
  });
  mesh.castShadow = shadow;
  mesh.receiveShadow = true;
  return mesh;
}

const flat = (color) => new THREE.MeshBasicMaterial({ color });

function buildCat(coat) {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  // corpo: 9 x 4 x 5 voxels, só a casca, cantos arredondados
  const bodyCells = [];
  for (let x = -4; x <= 4; x++)
    for (let y = 0; y <= 3; y++)
      for (let z = -2; z <= 2; z++) {
        const edge = x === -4 || x === 4 || y === 0 || y === 3 || Math.abs(z) === 2;
        if (!edge) continue;
        if ((y === 0 || y === 3) && Math.abs(z) === 2 && Math.abs(x) === 4) continue;
        let color = coat.body(x, y, z);
        if (y === 0 || (x >= 3 && y <= 1)) color = WHITE; // barriga e peito
        bodyCells.push({ x, y: y + 0.5, z, color });
      }
  body.add(part(bodyCells));

  // patas
  const legs = [];
  [[3, 1], [3, -1], [-3, 1], [-3, -1]].forEach(([lx, lz], li) => {
    const leg = new THREE.Group();
    leg.position.set(lx * V, 0.5 * V, lz * V);
    const cells = [];
    for (let y = 0; y < 5; y++)
      for (const dx of [-0.5, 0.5])
        for (const dz of [-0.5, 0.5]) {
          const color = y === 4 ? WHITE : coat.body(lx + dx + 20 + li * 3, -y, lz + dz);
          cells.push({ x: dx, y: -y - 0.5, z: dz, color });
        }
    leg.add(part(cells));
    body.add(leg);
    legs.push(leg);
  });

  // cabeça
  const head = new THREE.Group();
  head.position.set(3.5 * V, 3 * V, 0);
  const headCells = [];
  for (let x = -1; x <= 3; x++)
    for (let y = -1; y <= 2; y++)
      for (let z = -2; z <= 2; z++) {
        if ((y === -1 || y === 2) && Math.abs(z) === 2 && (x === -1 || x === 3)) continue;
        if (y === -1 && x === 3 && Math.abs(z) === 2) continue;
        headCells.push({ x, y: y + 0.5, z, color: coat.head(x, y, z) });
      }
  // orelhas
  for (const side of [-1, 1]) {
    for (const x of [0, 1]) for (const z of [1, 2]) headCells.push({ x, y: 3.5, z: z * side, color: x === 1 && z === 1 ? '#e8a0a0' : coat.ear(side) });
    headCells.push({ x: 0.5, y: 4.5, z: 2 * side, color: coat.ear(side) });
  }
  head.add(part(headCells));

  // olhos (abertos e fechados) e nariz
  const eyes = [];
  for (const side of [-1, 1]) {
    const open = new THREE.Group();
    const iris = new THREE.Mesh(GEO, flat(coat.eye));
    iris.scale.set(0.04, V * 0.95, V * 0.95);
    const pupil = new THREE.Mesh(GEO, flat(coat.pupil));
    pupil.scale.set(0.05, V * 0.75, V * 0.32);
    pupil.position.x = 0.01;
    open.add(iris, pupil);
    const closed = new THREE.Mesh(GEO, flat('#1b1612'));
    closed.scale.set(0.05, V * 0.18, V * 0.95);
    closed.visible = false;
    for (const o of [open, closed]) o.position.set(3.5 * V + 0.02, 1.55 * V, side * V);
    head.add(open, closed);
    eyes.push({ open, closed });
  }
  const nose = new THREE.Mesh(GEO, flat('#e58a9a'));
  nose.scale.set(0.05, V * 0.45, V * 0.6);
  nose.position.set(3.5 * V + 0.02, 0.75 * V, 0);
  head.add(nose);
  body.add(head);

  // rabo: 8 segmentos de 1 voxel encadeados
  const tail = [];
  let parent = body;
  for (let i = 0; i < 8; i++) {
    const seg = new THREE.Group();
    seg.position.set(i === 0 ? -4.4 * V : -V, i === 0 ? 3 * V : 0, 0);
    seg.add(part([{ x: -0.5, y: 0, z: 0, color: coat.tail(i) }]));
    parent.add(seg);
    tail.push(seg);
    parent = seg;
  }

  return { root, body, legs, head, eyes, tail };
}

/* ---------------- Partículas (Zzz e corações) ---------------- */

const spriteCache = new Map();
function spriteMaterial(char, color) {
  const key = char + color;
  if (!spriteCache.has(key)) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    ctx.font = '40px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#1b1612';
    ctx.strokeText(char, 32, 34);
    ctx.fillStyle = color;
    ctx.fillText(char, 32, 34);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    spriteCache.set(key, tex);
  }
  return new THREE.SpriteMaterial({ map: spriteCache.get(key), transparent: true, depthWrite: false });
}

/* ---------------- Cenário compartilhado ---------------- */

const FLOOR = { minX: -10.3, maxX: 10.3, minZ: -2.4, maxZ: 10.4 };
const DOOR = { inside: [-10, 8.8], outside: [-14.6, 8.8] };
const DESK = { floor: [1.6, -5.3], top: [1.6, 5, -7.5], spot: [-0.4, -7.9] };
const BED = { x: 7.2, y: 0.4, z: 6.2 };

const rand = (a, b) => a + Math.random() * (b - a);
function randomFloorPoint() {
  for (;;) {
    const x = rand(FLOOR.minX + 1, FLOOR.maxX - 1), z = rand(FLOOR.minZ + 0.5, FLOOR.maxZ - 1);
    if (!(x > 4.6 && x < 9.8 && z > 3.6 && z < 8.8)) return [x, z]; // fora da caminha
  }
}
const angleTo = (dx, dz) => Math.atan2(-dz, dx);
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

function buildBall(scene) {
  const g = new THREE.Group();
  const s = 0.2;
  const yarn = [new THREE.MeshLambertMaterial({ color: '#d64545' }), new THREE.MeshLambertMaterial({ color: '#b83636' })];
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) {
        if (Math.abs(x) + Math.abs(y) + Math.abs(z) === 3) continue;
        const m = new THREE.Mesh(GEO, yarn[(x + y + z + 3) % 2]);
        m.scale.setScalar(s);
        m.position.set(x * s, y * s, z * s);
        m.castShadow = true;
        g.add(m);
      }
  g.position.set(3, 0.3, 4);
  scene.add(g);
  return { mesh: g, vel: new THREE.Vector3() };
}

/* ---------------- Gata ---------------- */

class Cat {
  constructor(scene, coat, index, world) {
    this.scene = scene;
    this.world = world;
    this.index = index;
    this.rig = buildCat(coat);
    this.root = this.rig.root;
    this.root.position.set(DOOR.outside[0], 0, DOOR.outside[1]);
    this.root.visible = false;
    this.root.traverse((o) => (o.userData.cat = index));
    scene.add(this.root);

    this.pose = { sit: 0, lie: 0, crouch: 0, move: 0, fly: 0, wiggle: 0 };
    this.target = { sit: 0, lie: 0, crouch: 0, wiggle: 0 };
    this.look = { yaw: 0, pitch: 0, curl: 0 };
    this.lookTarget = { yaw: 0, pitch: 0, curl: 0 };
    this.phase = Math.random() * 6;
    this.speed = 0;
    this.heading = 0;
    this.sleeping = false;
    this.happy = 0;
    this.blinkIn = rand(1, 4);
    this.blink = 0;
    this.zIn = 0;
    this.state = 'out';
    this.task = null;
    this.dt = 0;
  }

  get pos() {
    return this.root.position;
  }

  setPose(name) {
    const t = this.target;
    t.sit = name === 'sit' ? 1 : 0;
    t.lie = name === 'lie' || name === 'sleep' ? 1 : 0;
    t.crouch = name === 'crouch' ? 1 : 0;
    t.wiggle = 0;
    this.sleeping = name === 'sleep';
    this.lookTarget.curl = name === 'sleep' ? 1 : 0;
    if (name !== 'sit' && name !== 'lie') this.lookTarget.yaw = this.lookTarget.pitch = 0;
  }

  start(firstBehavior, delay = 0) {
    this.task = this.brain(firstBehavior, delay);
  }

  interrupt(gen) {
    const self = this;
    this.task = (function* () {
      yield* gen;
      yield* self.brain();
    })();
  }

  /* ----- ações básicas ----- */

  *wait(t) {
    for (let e = 0; e < t; e += this.dt) yield;
  }

  *turnTo(angle) {
    while (Math.abs(wrap(angle - this.heading)) > 0.05) {
      this.heading += Math.sign(wrap(angle - this.heading)) * Math.min(Math.abs(wrap(angle - this.heading)), 6 * this.dt);
      yield;
    }
  }

  *walkTo(x, z, speed = 1.6) {
    this.setPose('stand');
    const p = this.pos;
    for (;;) {
      const dx = x - p.x, dz = z - p.z;
      const d = Math.hypot(dx, dz);
      if (d < 0.06) break;
      const want = angleTo(dx, dz);
      const diff = wrap(want - this.heading);
      this.heading += Math.sign(diff) * Math.min(Math.abs(diff), 7 * this.dt);
      const step = Math.min(d, speed * this.dt * (Math.abs(diff) > 1.2 ? 0.3 : 1));
      p.x += (dx / d) * step;
      p.z += (dz / d) * step;
      this.speed = speed;
      yield;
    }
    this.speed = 0;
  }

  *jumpTo(x, y, z, height = 1) {
    yield* this.turnTo(angleTo(x - this.pos.x, z - this.pos.z));
    this.setPose('crouch');
    yield* this.wait(0.3);
    const from = this.pos.clone();
    const T = 0.45 + from.distanceTo(new THREE.Vector3(x, y, z)) * 0.05;
    const H = Math.max(height, y - from.y + height);
    this.setPose('stand');
    for (let t = 0; t < 1; t += this.dt / T) {
      this.pos.set(
        from.x + (x - from.x) * t,
        from.y + (y - from.y) * t + H * 4 * t * (1 - t),
        from.z + (z - from.z) * t,
      );
      this.pose.fly = 1;
      yield;
    }
    this.pos.set(x, y, z);
    this.pose.fly = 0;
    this.pose.crouch = 0.8;
  }

  *lookAround(t) {
    for (let e = 0; e < t; e += 1.2) {
      this.lookTarget.yaw = rand(-0.8, 0.8);
      this.lookTarget.pitch = rand(-0.2, 0.35);
      yield* this.wait(1.2);
    }
    this.lookTarget.yaw = this.lookTarget.pitch = 0;
  }

  /* ----- comportamentos ----- */

  *enter() {
    this.state = 'enter';
    this.root.visible = true;
    this.pos.set(DOOR.outside[0], 0, DOOR.outside[1]);
    this.heading = 0;
    yield* this.walkTo(...DOOR.inside, 1.4);
    this.setPose('sit');
    yield* this.lookAround(2.4);
  }

  *leave() {
    this.state = 'leave';
    yield* this.walkTo(...DOOR.inside);
    yield* this.walkTo(...DOOR.outside, 1.4);
    this.root.visible = false;
    yield* this.wait(rand(6, 12));
    yield* this.enter();
  }

  *wander() {
    this.state = 'wander';
    yield* this.walkTo(...randomFloorPoint());
    this.setPose(Math.random() < 0.6 ? 'sit' : 'stand');
    yield* this.lookAround(rand(2, 4));
  }

  *groom() {
    this.state = 'groom';
    this.setPose('sit');
    this.lookTarget.yaw = 0.9;
    this.lookTarget.pitch = -0.6;
    yield* this.wait(rand(2.5, 4));
    this.lookTarget.yaw = this.lookTarget.pitch = 0;
  }

  *nap() {
    this.state = 'nap';
    const bed = !this.world.bedTaken;
    if (bed) {
      this.world.bedTaken = true;
      yield* this.walkTo(BED.x + 1.8, BED.z + 0.3);
      yield* this.jumpTo(BED.x, BED.y, BED.z, 0.5);
    } else {
      yield* this.walkTo(...randomFloorPoint());
    }
    // dá uma voltinha antes de deitar
    yield* this.turnTo(this.heading + Math.PI);
    yield* this.turnTo(this.heading + Math.PI);
    this.setPose('lie');
    yield* this.wait(1.2);
    this.setPose('sleep');
    yield* this.wait(rand(10, 18));
    this.setPose('sit');
    yield* this.wait(1.5);
    if (bed) {
      yield* this.jumpTo(BED.x - 1.8, 0, BED.z - 0.4, 0.5);
      this.world.bedTaken = false;
    }
  }

  *desk() {
    this.state = 'desk';
    this.world.deskTaken = this.index;
    yield* this.walkTo(...DESK.floor);
    yield* this.jumpTo(...DESK.top, 1.2);
    yield* this.walkTo(DESK.spot[0], DESK.spot[1], 1.1);
    yield* this.turnTo(Math.PI / 2 + 0.3); // de frente para o monitor
    this.setPose('sit');
    this.lookTarget.pitch = 0.35;
    yield* this.wait(rand(3, 5));
    this.setPose('lie');
    yield* this.wait(1);
    this.setPose('sleep');
    yield* this.wait(rand(7, 12));
    this.setPose('stand');
    yield* this.walkTo(DESK.top[0], DESK.top[2] + 0.3, 1.1);
    yield* this.jumpTo(DESK.floor[0] + 0.4, 0, DESK.floor[1] + 0.9, 0.7);
    this.world.deskTaken = false;
  }

  *play() {
    this.state = 'play';
    const ball = this.world.ball.mesh.position;
    for (let n = Math.floor(rand(2, 4)); n > 0; n--) {
      const dx = ball.x - this.pos.x, dz = ball.z - this.pos.z;
      const d = Math.hypot(dx, dz) || 1;
      yield* this.walkTo(ball.x - (dx / d) * 1.6, ball.z - (dz / d) * 1.6, 2.2);
      yield* this.turnTo(angleTo(ball.x - this.pos.x, ball.z - this.pos.z));
      this.setPose('crouch');
      this.target.wiggle = 1;
      yield* this.wait(rand(0.6, 1.1));
      const dir = new THREE.Vector3(ball.x - this.pos.x, 0, ball.z - this.pos.z).normalize();
      yield* this.jumpTo(ball.x - dir.x * 0.6, 0, ball.z - dir.z * 0.6, 0.5);
      this.world.ball.vel.set(dir.x * rand(3, 5) + rand(-1, 1), 0, dir.z * rand(3, 5) + rand(-1, 1));
      this.setPose('stand');
      yield* this.wait(0.5);
    }
  }

  *chase() {
    const other = this.world.cats[1 - this.index];
    this.state = 'chase';
    if (['wander', 'groom', 'enter'].includes(other.state)) other.interrupt(other.flee(this));
    for (let t = 0; t < 7; t += this.dt) {
      const dx = other.pos.x - this.pos.x, dz = other.pos.z - this.pos.z;
      const d = Math.hypot(dx, dz);
      if (d < 1.8 || !other.root.visible || other.pos.y > 0.5) break;
      const want = angleTo(dx, dz);
      this.heading += Math.sign(wrap(want - this.heading)) * Math.min(Math.abs(wrap(want - this.heading)), 6 * this.dt);
      const sx = Math.cos(this.heading), sz = -Math.sin(this.heading);
      this.pos.x = THREE.MathUtils.clamp(this.pos.x + sx * 3.2 * this.dt, FLOOR.minX, FLOOR.maxX);
      this.pos.z = THREE.MathUtils.clamp(this.pos.z + sz * 3.2 * this.dt, FLOOR.minZ, FLOOR.maxZ);
      this.speed = 3.2;
      this.setPose('stand');
      yield;
    }
    this.speed = 0;
    this.setPose('sit');
    yield* this.lookAround(2);
  }

  *flee(from) {
    this.state = 'flee';
    for (let i = 0; i < 3; i++) {
      const [x, z] = randomFloorPoint();
      if (Math.hypot(x - from.pos.x, z - from.pos.z) < 4) continue;
      yield* this.walkTo(x, z, 3.6);
    }
    this.setPose('sit');
    this.lookTarget.yaw = 0.6;
    yield* this.wait(2);
  }

  *brain(first, delay = 0) {
    if (delay) yield* this.wait(delay);
    if (this.state === 'out') yield* this.enter();
    if (first) yield* this[first]();
    for (;;) {
      const other = this.world.cats[1 - this.index];
      const options = [
        [3, 'wander'],
        [2, 'nap'],
        [this.world.deskTaken === false ? 2 : 0, 'desk'],
        [2.2, 'play'],
        [other.root.visible && !other.sleeping && other.pos.y < 0.5 ? 1.5 : 0, 'chase'],
        [1.2, 'groom'],
        [0.4, 'leave'],
      ];
      let r = Math.random() * options.reduce((s, [w]) => s + w, 0);
      const pick = options.find(([w]) => (r -= w) < 0)?.[1] ?? 'wander';
      yield* this[pick]();
    }
  }

  /* ----- carinho ----- */

  pet() {
    this.happy = 1.6;
    for (let i = 0; i < 3; i++) this.world.emit(this.headWorld(), '♥', '#ff6b8b', i * 0.18);
  }

  headWorld() {
    return this.rig.head.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.7, 0));
  }

  /* ----- animação ----- */

  update(dt, time) {
    this.dt = dt;
    this.task?.next();
    if (!this.root.visible) return;

    const { pose, target, look, lookTarget, rig } = this;
    const k = 1 - Math.exp(-dt * 8);
    for (const key of ['sit', 'lie', 'crouch', 'wiggle']) pose[key] += (target[key] - pose[key]) * k;
    for (const key of ['yaw', 'pitch', 'curl']) look[key] += (lookTarget[key] - look[key]) * k * 0.6;
    pose.move += ((this.speed > 0 ? 1 : 0) - pose.move) * k;
    this.phase += dt * Math.max(this.speed, 0.0001) * 4.2;
    this.speed = 0;

    this.root.rotation.y = this.heading;
    // sombra só dentro da sala (a gata "atrás da parede" não projeta)
    const inside = this.pos.x > -12;
    if (inside !== this.inside) {
      this.inside = inside;
      rig.root.traverse((o) => o.isInstancedMesh && (o.castShadow = inside));
    }

    const { sit, lie, crouch, move, fly, wiggle } = pose;
    const swing = Math.sin(this.phase) * 0.6 * move;
    rig.body.position.y = LEG * (1 - crouch * 0.22 - sit * 0.28 - lie * 0.97) + Math.abs(Math.sin(this.phase)) * 0.04 * move;
    rig.body.rotation.z = 0.55 * sit - 0.08 * crouch + (fly ? 0.15 : 0);
    rig.body.rotation.x = Math.sin(time * 16) * 0.1 * wiggle;

    const [fl, fr, bl, br] = rig.legs;
    const flyF = fly ? 0.8 : 0, flyB = fly ? -0.8 : 0;
    fl.rotation.z = swing - 0.55 * sit + 1.45 * lie + flyF;
    fr.rotation.z = -swing - 0.55 * sit + 1.45 * lie + flyF;
    bl.rotation.z = -swing + 1.1 * sit + 1.45 * lie + flyB;
    br.rotation.z = swing + 1.1 * sit + 1.45 * lie + flyB;

    rig.head.rotation.y = look.yaw + 0.9 * look.curl;
    rig.head.rotation.z = look.pitch - 0.45 * sit - 0.35 * look.curl + (this.happy > 0 ? 0.25 : 0);
    rig.head.position.y = 3 * V - 0.2 * look.curl;

    const wStand = (1 - sit) * (1 - lie), wSit = sit * (1 - lie), wLie = lie;
    rig.tail.forEach((seg, i) => {
      const sway = Math.sin(time * (this.happy > 0 ? 9 : 2.2) + i * 0.6) * (0.22 + i * 0.02);
      if (i === 0) {
        seg.rotation.z = wStand * (fly ? -0.2 : -1.15) + wSit * 1.1 + wLie * 0.35;
        seg.rotation.y = 0;
      } else {
        seg.rotation.z = wStand * 0.22;
        seg.rotation.y = wStand * sway + wSit * 0.42 + wLie * 0.62 + (this.sleeping ? Math.sin(time * 0.8 + i) * 0.03 : 0);
      }
    });

    // olhos: piscar, dormir, feliz
    this.blinkIn -= dt;
    if (this.blinkIn < 0) {
      this.blink = 0.13;
      this.blinkIn = rand(2, 5);
    }
    this.blink -= dt;
    this.happy -= dt;
    const closed = this.sleeping || this.blink > 0 || this.happy > 0;
    rig.eyes.forEach((e) => {
      e.open.visible = !closed;
      e.closed.visible = closed;
    });

    if (this.sleeping) {
      this.zIn -= dt;
      if (this.zIn < 0) {
        this.world.emit(this.headWorld(), 'Z', '#fff8e7');
        this.zIn = 1.4;
      }
    }
  }
}

/* ---------------- Gerente ---------------- */

export function createCats(scene) {
  const particles = [];
  const world = {
    deskTaken: false,
    bedTaken: false,
    ball: buildBall(scene),
    cats: [],
    emit(pos, char, color, delay = 0) {
      const s = new THREE.Sprite(spriteMaterial(char, color));
      s.scale.setScalar(0.7);
      s.position.copy(pos);
      s.visible = false;
      scene.add(s);
      particles.push({ s, age: -delay, drift: rand(-0.3, 0.3) });
    },
  };
  world.cats = COATS.map((coat, i) => new Cat(scene, coat, i, world));

  function updateBall(dt) {
    const { mesh, vel } = world.ball;
    const p = mesh.position;
    p.addScaledVector(vel, dt);
    for (const [axis, min, max] of [['x', FLOOR.minX, FLOOR.maxX], ['z', FLOOR.minZ, FLOOR.maxZ]]) {
      if (p[axis] < min || p[axis] > max) {
        p[axis] = THREE.MathUtils.clamp(p[axis], min, max);
        vel[axis] *= -0.6;
      }
    }
    const speed = vel.length();
    if (speed > 0.01) {
      mesh.rotation.z -= (vel.x * dt) / 0.3;
      mesh.rotation.x += (vel.z * dt) / 0.3;
    }
    vel.multiplyScalar(Math.exp(-dt * 1.6));
  }

  return {
    roots: world.cats.map((c) => c.root),
    cats: world.cats,
    start() {
      world.cats[0].start('desk', 0.4);
      world.cats[1].start('play', 3.2);
    },
    pet(i) {
      world.cats[i]?.pet();
    },
    update(dt, time) {
      world.cats.forEach((c) => c.update(dt, time));
      updateBall(dt);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += dt;
        if (p.age < 0) continue;
        p.s.visible = true;
        p.s.position.y += dt * 0.8;
        p.s.position.x += dt * p.drift;
        p.s.material.opacity = Math.max(0, 1 - p.age / 2);
        if (p.age > 2) {
          scene.remove(p.s);
          p.s.material.dispose();
          particles.splice(i, 1);
        }
      }
    },
  };
}
