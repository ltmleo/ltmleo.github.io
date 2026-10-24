import * as THREE from 'three';
import './style.css';
import './story.css';
import { buildScene, makeMarker, refreshCanvases } from './scene.js';
import { createCats } from './cats.js';
import { renderPanel } from './panels.js';
import { I18N, OBJECT_ORDER, OBJECT_ICONS } from './content.js';
import { renderStory, storyText, STORY_ANCHOR } from './story.js';

const $ = (id) => document.getElementById(id);
const store = {
  get(k, fallback) {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
};

const state = {
  lang: store.get('lang', navigator.language?.startsWith('pt') ? 'pt' : 'en'),
  visited: new Set(store.get('visited', [])),
  open: null,
  hover: null,
};

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isNarrow = () => innerWidth <= 720;

/* ---------------- Three.js ---------------- */

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas: $('scene'), antialias: true, alpha: true });
} catch {
  renderer = null;
}

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera();
const OFFSET = new THREE.Vector3(1, 0.82, 1).normalize().multiplyScalar(80);
const HOME = { target: new THREE.Vector3(-0.5, 5.5, -1.5), zoom: 1 };
const cam = { target: HOME.target.clone(), zoom: reducedMotion ? 1 : 0.55 };
const goal = { target: HOME.target.clone(), zoom: 1 };
let frustumH = 30;

let world = { objects: {} };
let cats = null;
const markers = {};
const helpers = {};

if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  scene.add(new THREE.HemisphereLight(0xfff1dc, 0x4a3b5c, 1.6));
  const sun = new THREE.DirectionalLight(0xffe2b8, 2.6);
  sun.position.set(16, 28, 20);
  sun.target.position.set(-2, 0, -4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 90 });
  sun.shadow.bias = -0.0008;
  sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);

  world = buildScene(scene);
  cats = createCats(scene);
  if (import.meta.env.DEV) {
    window.__cats = cats;
    window.__focus = (v, z) => (goal.target.copy(v), (goal.zoom = z));
  }

  for (const [id, o] of Object.entries(world.objects)) {
    const m = makeMarker();
    m.position.set(o.center.x, o.box.max.y + 1.2, o.center.z);
    m.userData.baseY = m.position.y;
    m.visible = !state.visited.has(id);
    scene.add(m);
    markers[id] = m;

    const h = new THREE.Box3Helper(o.box.clone().expandByScalar(0.25), 0xffd23f);
    h.visible = false;
    scene.add(h);
    helpers[id] = h;
  }
}

function resize() {
  const aspect = innerWidth / innerHeight;
  // garante que a sala inteira caiba tanto em telas largas quanto em celulares em pé
  frustumH = Math.max(38, 40 / aspect);
  const w = frustumH * aspect;
  Object.assign(camera, { left: -w / 2, right: w / 2, top: frustumH / 2, bottom: -frustumH / 2, near: 0.1, far: 300 });
  camera.updateProjectionMatrix();
  renderer?.setSize(innerWidth, innerHeight, false);
  if (state.open) focusOn(state.open);
}

function focusOn(id) {
  const o = world.objects[id];
  if (!o) return;
  const maxDim = Math.max(o.size.x, o.size.y, o.size.z);
  const right = new THREE.Vector3(1, 0, -1).normalize();
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
  const t = o.center.clone();
  if (isNarrow()) {
    goal.zoom = THREE.MathUtils.clamp((frustumH * 0.22) / maxDim, 1, 4);
    t.addScaledVector(up, -(frustumH / goal.zoom) * 0.27);
  } else {
    goal.zoom = THREE.MathUtils.clamp((frustumH * 0.5) / maxDim, 1, 3.4);
    const visibleW = (camera.right - camera.left) / goal.zoom;
    t.addScaledVector(right, visibleW * 0.2);
  }
  goal.target.copy(t);
}

/* ---------------- Interação ---------------- */

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const groups = () => Object.values(world.objects).map((o) => o.group);

function pick(clientX, clientY) {
  if (!renderer) return null;
  const r = canvas.getBoundingClientRect();
  pointer.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects([...groups(), ...(cats?.roots ?? [])], true)[0];
  if (!hit) return null;
  return hit.object.userData.cat !== undefined ? `cat${hit.object.userData.cat}` : hit.object.userData.id;
}

function setHover(id, x, y) {
  if (state.hover !== id) {
    if (helpers[state.hover]) helpers[state.hover].visible = false;
    state.hover = id;
    if (helpers[id]) helpers[id].visible = true;
    document.body.style.cursor = id ? 'pointer' : '';
  }
  const tip = $('tooltip');
  if (id) {
    tip.textContent = id.startsWith('cat') ? I18N[state.lang].cat : I18N[state.lang].objects[id];
    tip.style.left = `${x}px`;
    tip.style.top = `${y}px`;
    tip.classList.add('show');
  } else {
    tip.classList.remove('show');
  }
}

let downAt = null;
const canvas = $('scene');
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerType === 'mouse') setHover(pick(e.clientX, e.clientY), e.clientX, e.clientY);
});
canvas.addEventListener('pointerdown', (e) => (downAt = [e.clientX, e.clientY]));
canvas.addEventListener('pointerup', (e) => {
  if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 8) return;
  const id = pick(e.clientX, e.clientY);
  if (id?.startsWith('cat')) cats.pet(Number(id.slice(3)));
  else if (id) open(id);
  else if (state.open) close();
});
canvas.addEventListener('pointerleave', () => setHover(null));

function open(id) {
  if (scrollY > 10) scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  state.open = id;
  const { kicker, title, html } = renderPanel(id, state.lang);
  $('panel-kicker').textContent = kicker;
  $('panel-title').textContent = title;
  $('panel-body').innerHTML = html;
  $('close').setAttribute('aria-label', I18N[state.lang].close);
  const panel = $('panel');
  panel.hidden = false;
  panel.querySelector('.panel-inner').scrollTop = 0;
  $('close').focus({ preventScroll: true });
  setHover(null);
  focusOn(id);

  const first = !state.visited.has(id);
  state.visited.add(id);
  store.set('visited', [...state.visited]);
  if (markers[id]) markers[id].visible = false;
  updateHotbar();
  if (first && state.visited.size === OBJECT_ORDER.length) toast(I18N[state.lang].achievement);
}

function close() {
  const was = state.open;
  state.open = null;
  $('panel').hidden = true;
  goal.target.copy(HOME.target);
  goal.zoom = HOME.zoom;
  updateHotbar();
  if (officeVisible) document.querySelector(`.slot[data-id="${was}"]`)?.focus({ preventScroll: true });
}

$('close').addEventListener('click', close);

$('story-link').addEventListener('click', () => {
  const id = state.open;
  close();
  document.getElementById(STORY_ANCHOR[id])?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
});

/* ---------------- História ---------------- */

const revealer =
  'IntersectionObserver' in window
    ? new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              revealer.unobserve(e.target);
            }
          }),
        { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
      )
    : null;

function renderStoryInto() {
  $('story').innerHTML = renderStory(state.lang);
  document.querySelectorAll('.reveal').forEach((el) => (revealer ? revealer.observe(el) : el.classList.add('in')));
}

// Só desenha a cena 3D enquanto o escritório está visível; fecha o painel ao rolar para a história
let officeVisible = true;
new IntersectionObserver(
  ([e]) => {
    officeVisible = e.isIntersecting;
    if (!officeVisible && state.open) close();
  },
  { threshold: 0.35 },
).observe($('office'));

addEventListener('keydown', (e) => {
  if (!started) return;
  if (e.key === 'Escape' && state.open) close();
  const n = Number(e.key);
  if (n >= 1 && n <= OBJECT_ORDER.length && !e.metaKey && !e.ctrlKey) open(OBJECT_ORDER[n - 1]);
});

let toastTimer;
function toast(text, ms = 4000) {
  const t = $('toast');
  t.textContent = text;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), ms);
}

/* ---------------- HUD e idioma ---------------- */

function buildHotbar() {
  $('hotbar').innerHTML = OBJECT_ORDER.map(
    (id, i) =>
      `<button class="slot" type="button" data-id="${id}"><span class="key">${i + 1}</span><span aria-hidden="true">${OBJECT_ICONS[id]}</span></button>`,
  ).join('');
  $('hotbar').addEventListener('click', (e) => {
    const slot = e.target.closest('.slot');
    if (!slot) return;
    state.open === slot.dataset.id ? close() : open(slot.dataset.id);
  });
}

function updateHotbar() {
  const t = I18N[state.lang];
  document.querySelectorAll('.slot').forEach((s) => {
    const id = s.dataset.id;
    s.title = t.objects[id];
    s.setAttribute('aria-label', t.objects[id]);
    s.classList.toggle('visited', state.visited.has(id));
    s.classList.toggle('active', state.open === id);
  });
  $('progress').textContent = `${t.explored} ${state.visited.size}/${OBJECT_ORDER.length}`;
}

function applyLang() {
  const t = I18N[state.lang];
  document.documentElement.lang = state.lang === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t[el.dataset.i18n]));
  $('lang').textContent = state.lang === 'pt' ? 'EN' : 'PT';
  $('hotbar').setAttribute('aria-label', state.lang === 'pt' ? 'Objetos do escritório' : 'Office objects');
  const st = storyText(state.lang);
  document.querySelectorAll('[data-i18n-story]').forEach((el) => (el.textContent = st[el.dataset.i18nStory]));
  $('story-link').textContent = st.readStory;
  renderStoryInto();
  world.screen?.redraw(state.lang, true);
  updateHotbar();
  if (state.open) {
    const { kicker, title, html } = renderPanel(state.open, state.lang);
    $('panel-kicker').textContent = kicker;
    $('panel-title').textContent = title;
    $('panel-body').innerHTML = html;
  }
}

$('lang').addEventListener('click', () => {
  state.lang = state.lang === 'pt' ? 'en' : 'pt';
  store.set('lang', state.lang);
  applyLang();
});

let started = false;
$('start').addEventListener('click', () => {
  started = true;
  document.body.classList.remove('locked');
  $('intro').classList.add('hide');
  goal.zoom = HOME.zoom;
  setTimeout(() => $('intro').remove(), 600);
  if (!renderer) toast(I18N[state.lang].noWebgl, 6000);
  cats?.start();
});

/* ---------------- Loop ---------------- */

const clock = new THREE.Clock();
let blinkAt = 0;
let cursorOn = true;

function tick() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const time = clock.elapsedTime;
  const k = reducedMotion ? 1 : 1 - Math.exp(-dt * 5);
  cam.target.lerp(goal.target, k);
  cam.zoom += (goal.zoom - cam.zoom) * k;
  camera.position.copy(cam.target).add(OFFSET);
  camera.lookAt(cam.target);
  camera.zoom = cam.zoom;
  camera.updateProjectionMatrix();
  cats?.update(dt, time);

  if (!reducedMotion) {
    Object.values(markers).forEach((m, i) => {
      m.position.y = m.userData.baseY + Math.sin(time * 3 + i) * 0.25;
      m.rotation.y = time * 1.5;
    });
    if (time - blinkAt > 0.55) {
      blinkAt = time;
      cursorOn = !cursorOn;
      world.screen.redraw(state.lang, cursorOn);
    }
  }

  if (officeVisible) renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

buildHotbar();
applyLang();
if (renderer) {
  addEventListener('resize', resize);
  resize();
  document.fonts?.ready.then(refreshCanvases);
  tick();
}
