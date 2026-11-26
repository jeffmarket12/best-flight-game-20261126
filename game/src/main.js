import { CONFIG } from './config.js';
import { createWorld } from './world.js';
import { InputHandler } from './input.js';
import { renderGame } from './render.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const input = new InputHandler(canvas);

// Parse query params for shot mode
const urlParams = new URLSearchParams(window.location.search);
const shotMode = urlParams.get('shot');
const seedParam = parseInt(urlParams.get('seed') || '1', 10);

const world = createWorld(seedParam);

let state = {
  mode: shotMode ? shotMode : 'start', // start, play, end, paused, gameover
  score: 0,
  time: 0,
  ringsPassed: 0,
  totalRings: CONFIG.totalRings,
  rings: world.rings,
  runway: world.runway,
  clouds: world.clouds,
  birds: world.birds,
  popups: [],
  won: false,
  player: {
    x: 0,
    y: 350,
    z: 0,
    speed: 15,
    throttle: 0.8,
    pitch: 0,
    roll: 0,
    heading: 90
  }
};

if (shotMode === 'play') {
  state.mode = 'play';
  // Place the player just before a GOLD ring (first gold ring in state.rings)
  const goldRing = state.rings.find(r => r.isGold) || state.rings[0];
  state.player.z = goldRing.z - 300;
  state.player.x = goldRing.x;
  state.player.y = goldRing.y;
  state.ringsPassed = 2;
  state.score = 400;
} else if (shotMode === 'end') {
  state.mode = 'gameover';
  state.won = true;
  state.score = 3500;
  state.time = 45.2;
  state.player.x = state.runway.x;
  state.player.y = state.runway.y + 10;
  state.player.z = state.runway.z - 200;
}

// Audio setup
let audioCtx = null;
let osc = null;
let gain = null;

function initAudio() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    osc = audioCtx.createOscillator();
    gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
  } catch (e) {
    console.warn('WebAudio not allowed yet', e);
  }
}

function playChime(isGold = false) {
  if (!audioCtx) return;
  try {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(isGold ? 880 : 587.33, audioCtx.currentTime); // D5 or A5
    o.frequency.exponentialRampToValueAtTime(isGold ? 1320 : 880, audioCtx.currentTime + 0.3);
    g.gain.setValueAtTime(0.1, audioCtx.currentTime);
    g.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 0.3);
  } catch (e) {}
}

let lastTime = performance.now();

function update(dt) {
  if (input.isDown('KeyP')) {
    if (state.mode === 'play') state.mode = 'paused';
    else if (state.mode === 'paused') state.mode = 'play';
  }
  if (input.isDown('KeyR')) {
    window.location.reload();
  }

  // Update popups TTL
  state.popups.forEach(p => p.ttl -= dt);
  state.popups = state.popups.filter(p => p.ttl > 0);

  if (state.mode === 'start') {
    initAudio();
    if (input.isDown('Enter') || input.mouse.active) {
      state.mode = 'play';
    }
    return;
  }

  if (state.mode === 'paused' || state.mode === 'gameover') {
    return;
  }

  state.time += dt;

  // Throttle controls
  if (input.isDown('ShiftLeft') || input.isDown('ShiftRight') || input.isDown('Equal')) {
    state.player.throttle = Math.min(1, state.player.throttle + dt * 0.5);
  }
  if (input.isDown('ControlLeft') || input.isDown('ControlRight') || input.isDown('Minus')) {
    state.player.throttle = Math.max(0.1, state.player.throttle - dt * 0.5);
  }
  if (input.isDown('Space')) {
    state.player.throttle = 1.0;
  }

  // Target speed based on throttle
  const targetSpeed = 10 + state.player.throttle * 25;
  state.player.speed += (targetSpeed - state.player.speed) * dt * 2;

  // Steering / Pitch / Roll
  let steerX = 0;
  let steerY = 0;
  if (input.isDown('ArrowLeft') || input.isDown('KeyA')) steerX -= 1;
  if (input.isDown('ArrowRight') || input.isDown('KeyD')) steerX += 1;
  if (input.isDown('ArrowUp') || input.isDown('KeyW')) steerY -= 1;
  if (input.isDown('ArrowDown') || input.isDown('KeyS')) steerY += 1;

  if (input.mouse.active) {
    steerX += input.mouse.x;
    steerY += input.mouse.y;
  }

  state.player.roll += (steerX * 1.5 - state.player.roll) * dt * 5;
  state.player.pitch += (-steerY * 1.0 - state.player.pitch) * dt * 5;

  // Heading update based on roll
  state.player.heading -= state.player.roll * dt * 25;
  state.player.heading = (state.player.heading + 360) % 360;

  // Movement forward along Z
  state.player.z += state.player.speed * 50 * dt;
  state.player.x += steerX * state.player.speed * 20 * dt;
  state.player.y -= state.player.pitch * state.player.speed * 20 * dt;

  // Stall / Ground check
  if (state.player.y < 25) {
    const distToRunway = Math.hypot(state.player.x - state.runway.x, state.player.z - state.runway.z);
    if (distToRunway < 900 && state.player.speed < 22) {
      state.mode = 'gameover';
      state.won = true;
      state.score += 1000 + state.ringsPassed * 100;
    } else {
      state.mode = 'gameover';
      state.won = false;
    }
  }

  if (state.player.speed < 8) {
    state.mode = 'gameover';
    state.won = false; // Stall
  }

  // Check ring collisions
  state.rings.forEach(ring => {
    if (!ring.passed) {
      const dist = Math.hypot(state.player.x - ring.x, state.player.y - ring.y, state.player.z - ring.z);
      if (dist < ring.radius + 50) {
        ring.passed = true;
        state.ringsPassed++;
        const pts = ring.isGold ? 500 : 200;
        state.score += pts;
        playChime(ring.isGold);
        state.popups.push({
          x: ring.x,
          y: ring.y,
          z: ring.z,
          text: `+${pts}` + (ring.isGold ? ' GOLD!' : ''),
          ttl: 1.0
        });
      }
    }
  });

  // Update audio engine pitch/gain
  if (osc && gain && audioCtx) {
    osc.frequency.setValueAtTime(50 + state.player.throttle * 150, audioCtx.currentTime);
  }
}

function loop(timestamp) {
  const dt = Math.min(0.1, (timestamp - lastTime) / 1000);
  lastTime = timestamp;

  update(dt);
  renderGame(ctx, state);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
