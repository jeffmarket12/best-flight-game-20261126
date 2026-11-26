export function renderGame(ctx, state) {
  const { width, height } = ctx.canvas;
  
  // 1. Richer golden-hour sky: deep orange top to magenta band to deep purple bottom
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#d94e34');
  grad.addColorStop(0.35, '#ff7e5f');
  grad.addColorStop(0.6, '#b83b5e');
  grad.addColorStop(0.85, '#2b1055');
  grad.addColorStop(1, '#0d021a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Bigger sun with layered halo (two translucent circles) and lens-flare dots on a diagonal
  const sunX = width * 0.75;
  const sunY = height * 0.3;

  ctx.fillStyle = 'rgba(255, 180, 50, 0.2)';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 140, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 220, 150, 0.4)';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 95, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fffaed';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 65, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = '#ffb703';
  ctx.shadowBlur = 60;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Lens-flare dots along a diagonal from sun down-left
  const flareColors = ['rgba(255, 200, 100, 0.4)', 'rgba(100, 220, 255, 0.3)', 'rgba(255, 150, 200, 0.35)', 'rgba(200, 255, 220, 0.25)'];
  const flareRadii = [12, 6, 18, 8];
  for (let f = 0; f < 4; f++) {
    const fx = sunX - (f + 1) * 110;
    const fy = sunY + (f + 1) * 80;
    ctx.fillStyle = flareColors[f];
    ctx.beginPath();
    ctx.arc(fx, fy, flareRadii[f], 0, Math.PI * 2);
    ctx.fill();
  }

  // Horizon line calculation
  const horizonY = height * 0.5 + state.player.pitch * 200;

  // Sea (left) with sun glitter path
  ctx.fillStyle = '#11223b';
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, horizonY);
  ctx.lineTo(width * 0.5, horizonY);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Sun glitter on water (double band)
  ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
  ctx.beginPath();
  ctx.moveTo(width * 0.15, horizonY);
  ctx.lineTo(width * 0.35, horizonY);
  ctx.lineTo(width * 0.55, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 180, 50, 0.18)';
  ctx.beginPath();
  ctx.moveTo(width * 0.3, horizonY);
  ctx.lineTo(width * 0.45, horizonY);
  ctx.lineTo(width * 0.7, height);
  ctx.lineTo(width * 0.1, height);
  ctx.closePath();
  ctx.fill();

  // Layered mountain ridges on the land side (far ridge lighter purple, near ridge darker, snowcaps as small white triangles)
  // Far mountain ridge
  ctx.fillStyle = '#68507a';
  ctx.beginPath();
  ctx.moveTo(width, height);
  ctx.lineTo(width, horizonY - 40);
  for (let mx = width; mx >= width * 0.3; mx -= 50) {
    const mh = 30 + Math.sin(mx * 0.008 + 1) * 50;
    ctx.lineTo(mx, horizonY - mh);
  }
  ctx.lineTo(width * 0.3, height);
  ctx.closePath();
  ctx.fill();

  // Snowcaps on far peaks (deterministic Math.sin check)
  ctx.fillStyle = '#ffffff';
  for (let mx = width - 100; mx >= width * 0.35; mx -= 100) {
    const mh = 30 + Math.sin(mx * 0.008 + 1) * 50;
    if (mh > 60) {
      ctx.beginPath();
      ctx.moveTo(mx, horizonY - mh);
      ctx.lineTo(mx - 12, horizonY - mh + 18);
      ctx.lineTo(mx + 12, horizonY - mh + 18);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Near mountain ridge
  ctx.fillStyle = '#3d2c4f';
  ctx.beginPath();
  ctx.moveTo(width, height);
  ctx.lineTo(width, horizonY - 15);
  for (let mx = width; mx >= width * 0.25; mx -= 40) {
    const mh = 20 + Math.cos(mx * 0.01) * 35;
    ctx.lineTo(mx, horizonY - mh);
  }
  ctx.lineTo(width * 0.25, height);
  ctx.closePath();
  ctx.fill();

  // Land base (right)
  ctx.fillStyle = '#354244';
  ctx.beginPath();
  ctx.moveTo(width, height);
  ctx.lineTo(width, horizonY);
  ctx.lineTo(width * 0.3, horizonY);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // City: more buildings with varied heights and warm lit windows (tiny gold rectangles)
  for (let bx = width * 0.38; bx < width; bx += 32) {
    const bh = 50 + Math.sin(bx * 0.15) * 45 + ((bx % 7) * 8);
    ctx.fillStyle = '#1d2628';
    ctx.fillRect(bx, horizonY - bh, 28, bh);

    // Warm lit windows (tiny gold rectangles, deterministic pattern)
    ctx.fillStyle = '#ffd166';
    for (let wy = horizonY - bh + 8; wy < horizonY - 8; wy += 14) {
      if ((bx + wy) % 3 === 0) {
        ctx.fillRect(bx + 6, wy, 5, 8);
        ctx.fillRect(bx + 16, wy, 5, 8);
      }
    }
  }

  // A lighthouse on the coast point with a rotating light beam (angle from state.time)
  const lhX = width * 0.33;
  const lhY = horizonY;
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(lhX - 8, lhY - 90, 16, 90);
  ctx.fillStyle = '#d90429';
  ctx.fillRect(lhX - 8, lhY - 60, 16, 20);
  ctx.fillRect(lhX - 8, lhY - 25, 16, 15);

  // Rotating light beam cone
  const beamAngle = state.time * 2.5;
  const beamX = lhX + Math.cos(beamAngle) * 300;
  const beamY = lhY - 70 + Math.sin(beamAngle) * 80;
  ctx.fillStyle = 'rgba(255, 255, 200, 0.22)';
  ctx.beginPath();
  ctx.moveTo(lhX, lhY - 70);
  ctx.lineTo(beamX - 40, beamY - 40);
  ctx.lineTo(beamX + 40, beamY + 40);
  ctx.closePath();
  ctx.fill();

  // River: widen with a second glint band
  ctx.fillStyle = 'rgba(70, 150, 200, 0.45)';
  ctx.beginPath();
  ctx.moveTo(width * 0.55, horizonY);
  ctx.lineTo(width * 0.65, horizonY);
  ctx.lineTo(width * 0.85, height);
  ctx.lineTo(width * 0.70, height);
  ctx.closePath();
  ctx.fill();

  // Second river glint band
  ctx.fillStyle = 'rgba(150, 220, 255, 0.35)';
  ctx.beginPath();
  ctx.moveTo(width * 0.58, horizonY);
  ctx.lineTo(width * 0.62, horizonY);
  ctx.lineTo(width * 0.78, height);
  ctx.lineTo(width * 0.72, height);
  ctx.closePath();
  ctx.fill();

  // Clouds: warm rim — draw each cloud twice, warm gold translucent behind, white in front
  if (state.clouds) {
    state.clouds.forEach(cloud => {
      const dz = cloud.z - state.player.z;
      if (dz > -200 && dz < 12000) {
        const scale = 1000 / (dz + 500);
        const cx = width / 2 + (cloud.x - state.player.x) * scale;
        const cy = height * 0.3 + (cloud.y - state.player.y) * scale;
        const cr = 85 * cloud.scale * scale;

        // Warm gold translucent behind (rim light)
        ctx.fillStyle = 'rgba(255, 180, 100, 0.35)';
        ctx.beginPath();
        ctx.arc(cx - 3, cy - 3, cr * 1.05, 0, Math.PI * 2);
        ctx.arc(cx + cr * 0.6, cy - cr * 0.2, cr * 0.85, 0, Math.PI * 2);
        ctx.arc(cx - cr * 0.6, cy - cr * 0.1, cr * 0.75, 0, Math.PI * 2);
        ctx.fill();

        // White fluffy in front
        ctx.fillStyle = 'rgba(255, 245, 235, 0.75)';
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.arc(cx + cr * 0.6, cy - cr * 0.2, cr * 0.8, 0, Math.PI * 2);
        ctx.arc(cx - cr * 0.6, cy - cr * 0.1, cr * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  // Five small "v" birds drifting (seeded positions + time)
  if (state.birds) {
    ctx.strokeStyle = '#2b1055';
    ctx.lineWidth = 2;
    state.birds.forEach((bird, i) => {
      const bdz = bird.z - state.player.z;
      if (bdz > 100 && bdz < 10000) {
        const bscale = 1000 / bdz;
        const bx = width / 2 + (bird.x + Math.sin(state.time + i) * 200 - state.player.x) * bscale;
        const by = height * 0.35 + (bird.y - state.player.y) * bscale;
        const bsz = 15 * bscale;
        ctx.beginPath();
        ctx.moveTo(bx - bsz, by - bsz * 0.6);
        ctx.lineTo(bx, by);
        ctx.lineTo(bx + bsz, by - bsz * 0.6);
        ctx.stroke();
      }
    });
  }

  // Render Runway if nearby
  const rdz = state.runway.z - state.player.z;
  if (rdz > -1000 && rdz < 8000) {
    const rscale = 1000 / Math.max(100, rdz);
    const rx = width / 2 + (state.runway.x - state.player.x) * rscale;
    const ry = horizonY + (state.runway.y - state.player.y) * rscale;
    const rw = state.runway.width * rscale;
    const rh = state.runway.length * rscale;

    ctx.fillStyle = '#2b2d42';
    ctx.fillRect(rx - rw / 2, ry, rw, rh);

    // Centre dashes
    ctx.fillStyle = '#ffffff';
    for (let dy = 20; dy < rh; dy += 60) {
      ctx.fillRect(rx - 3, ry + dy, 6, 30);
    }
    // Green edge lights
    ctx.fillStyle = '#06d6a0';
    ctx.fillRect(rx - rw / 2 - 4, ry, 6, rh);
    ctx.fillRect(rx + rw / 2 - 2, ry, 6, rh);
  }

  // Render Rings & Gold Bonus Rings (double gold ring for gold bonus)
  state.rings.forEach(ring => {
    const dz = ring.z - state.player.z;
    if (dz > 10 && dz < 6000) {
      const scale = 1000 / dz;
      const rx = width / 2 + (ring.x - state.player.x) * scale;
      const ry = horizonY + (ring.y - state.player.y) * scale;
      const rSize = ring.radius * scale;

      if (ring.isGold) {
        ctx.strokeStyle = ring.passed ? '#06d6a0' : '#ffb703';
        ctx.lineWidth = Math.max(3, 8 * scale);
        ctx.beginPath();
        ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = ring.passed ? '#06d6a0' : '#ffffff';
        ctx.lineWidth = Math.max(2, 4 * scale);
        ctx.beginPath();
        ctx.arc(rx, ry, rSize * 0.85, 0, Math.PI * 2);
        ctx.stroke();

        ctx.shadowColor = '#ffd166';
        ctx.shadowBlur = 25;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        ctx.strokeStyle = ring.passed ? '#06d6a0' : '#ffd166';
        ctx.lineWidth = Math.max(2, 6 * scale);
        ctx.beginPath();
        ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
        ctx.stroke();

        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }
  });

  // Render Score Popups (+200 / +500 GOLD!)
  if (state.popups) {
    state.popups.forEach(pop => {
      const pdz = pop.z - state.player.z;
      if (pdz > 10 && pdz < 5000) {
        const pscale = 1000 / pdz;
        const px = width / 2 + (pop.x - state.player.x) * pscale;
        const py = horizonY + (pop.y - state.player.y - (1.0 - pop.ttl) * 50) * pscale;
        ctx.fillStyle = pop.text.includes('GOLD') ? '#ffd166' : '#06d6a0';
        ctx.font = 'bold 22px monospace';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 8;
        ctx.fillText(pop.text, px - 40, py);
        ctx.shadowBlur = 0;
      }
    });
  }

  // Speed lines at screen edges when boosting (throttle above 0.95)
  if (state.player.throttle > 0.95 && state.mode === 'play') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      const sy = (i * 75 + state.time * 600) % height;
      ctx.beginPath();
      ctx.moveTo(20, sy);
      ctx.lineTo(80, sy);
      ctx.moveTo(width - 80, sy);
      ctx.lineTo(width - 20, sy);
      ctx.stroke();
    }
  }

  // Render Aircraft (scaled up ~1.15x, warm rim light)
  ctx.save();
  ctx.translate(width / 2, height / 2 + 60);
  ctx.rotate(state.player.roll);
  ctx.scale(1.15, 1.15);

  // Fuselage body
  ctx.fillStyle = '#d90429';
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 70, 0, 0, Math.PI * 2);
  ctx.fill();

  // Warm rim light on fuselage top edge
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(0, 0, 17, 68, 0, Math.PI, Math.PI * 2);
  ctx.stroke();

  // Vertical tail fin
  ctx.fillStyle = '#ef233c';
  ctx.beginPath();
  ctx.moveTo(0, 50);
  ctx.lineTo(0, 85);
  ctx.lineTo(-12, 75);
  ctx.closePath();
  ctx.fill();

  // Wings with dihedral and warm rim light
  ctx.fillStyle = '#edf2f4';
  ctx.beginPath();
  ctx.moveTo(-110, -10);
  ctx.lineTo(110, -10);
  ctx.lineTo(95, 15);
  ctx.lineTo(-95, 15);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-108, -10);
  ctx.lineTo(108, -10);
  ctx.stroke();

  // Small tailplane
  ctx.beginPath();
  ctx.moveTo(-35, 55);
  ctx.lineTo(35, 55);
  ctx.lineTo(25, 70);
  ctx.lineTo(-25, 70);
  ctx.closePath();
  ctx.fill();

  // Cockpit canopy
  ctx.fillStyle = '#2b2d42';
  ctx.beginPath();
  ctx.ellipse(0, -15, 12, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Propeller spinning disc
  if (state.player.throttle > 0.05) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, -75, 35 + Math.random() * 8, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Wingtip nav lights
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.arc(-108, -5, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(108, -5, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // HUD & Rich Instruments
  renderHUD(ctx, state);

  // Screen overlays
  if (state.mode === 'start') {
    renderOverlay(ctx, 'GOLDEN COAST FLYER', 'Fly through the glowing rings and land on the runway.\n\nControls: WASD / Arrows / Mouse to Steer\nShift / Ctrl: Throttle | Space: Boost | P: Pause\n\nPRESS ENTER OR CLICK TO START');
  } else if (state.mode === 'paused') {
    renderOverlay(ctx, 'PAUSED', 'PRESS P TO RESUME');
  } else if (state.mode === 'gameover') {
    renderOverlay(ctx, state.won ? 'MISSION ACCOMPLISHED!' : 'MISSION FAILED', `Score: ${state.score} | Time: ${state.time.toFixed(1)}s\n\nPRESS R TO RESTART`);
  }
}

function getCompassPoint(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const idx = Math.round((deg % 360) / 45) % 8;
  return dirs[idx];
}

function renderHUD(ctx, state) {
  const { width, height } = ctx.canvas;

  // 1. Text HUD panel (top-left)
  ctx.fillStyle = 'rgba(0, 20, 40, 0.75)';
  ctx.fillRect(20, 20, 260, 180);
  ctx.strokeStyle = '#06d6a0';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 260, 180);

  ctx.fillStyle = '#06d6a0';
  ctx.font = '16px monospace';
  const hdgDeg = Math.round(state.player.heading);
  const hdgStr = `HDG: ${hdgDeg} deg ${getCompassPoint(hdgDeg)}`;

  ctx.fillText(`ALT: ${Math.round(state.player.y)} m`, 35, 50);
  ctx.fillText(`SPD: ${Math.round(state.player.speed * 10)} kt`, 35, 80);
  ctx.fillText(hdgStr, 35, 110);
  ctx.fillText(`THR: ${Math.round(state.player.throttle * 100)} %`, 35, 140);
  ctx.fillText(`RINGS: ${state.ringsPassed} / ${state.totalRings}`, 35, 170);

  // Timer & Score top right
  ctx.fillStyle = 'rgba(0, 20, 40, 0.75)';
  ctx.fillRect(width - 240, 20, 220, 90);
  ctx.strokeRect(width - 240, 20, 220, 90);

  ctx.fillStyle = '#ffd166';
  ctx.fillText(`SCORE: ${state.score}`, width - 225, 50);
  ctx.fillText(`TIME: ${state.time.toFixed(1)} s`, width - 225, 85);

  // 2. Artificial Horizon Instrument (bottom-left or top-center below compass)
  const ahX = 150;
  const ahY = 260;
  const ahR = 50;
  ctx.save();
  ctx.beginPath();
  ctx.arc(ahX, ahY, ahR, 0, Math.PI * 2);
  ctx.clip();

  ctx.save();
  ctx.translate(ahX, ahY);
  ctx.rotate(-state.player.roll);
  const pitchOffset = state.player.pitch * 30;

  // Sky half
  ctx.fillStyle = '#1d3557';
  ctx.fillRect(-ahR * 2, -ahR * 2, ahR * 4, ahR + pitchOffset);
  // Ground half
  ctx.fillStyle = '#4a5759';
  ctx.fillRect(-ahR * 2, pitchOffset, ahR * 4, ahR * 4);

  // Horizon line
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-ahR * 2, pitchOffset);
  ctx.lineTo(ahR * 2, pitchOffset);
  ctx.stroke();

  ctx.restore();
  ctx.restore();

  // Instrument ring bezel
  ctx.strokeStyle = '#06d6a0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(ahX, ahY, ahR, 0, Math.PI * 2);
  ctx.stroke();

  // Fixed aircraft symbol
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ahX - 18, ahY); ctx.lineTo(ahX - 6, ahY); ctx.lineTo(ahX, ahY + 6); ctx.lineTo(ahX + 6, ahY); ctx.lineTo(ahX + 18, ahY);
  ctx.stroke();

  // 3. Compass strip along top centre
  const compW = 320;
  const compH = 35;
  const compX = width / 2 - compW / 2;
  const compY = 20;

  ctx.fillStyle = 'rgba(0, 20, 40, 0.8)';
  ctx.fillRect(compX, compY, compW, compH);
  ctx.strokeStyle = '#06d6a0';
  ctx.lineWidth = 2;
  ctx.strokeRect(compX, compY, compW, compH);

  ctx.save();
  ctx.beginPath();
  ctx.rect(compX, compY, compW, compH);
  ctx.clip();

  ctx.fillStyle = '#ffffff';
  ctx.font = '13px monospace';
  const centerHdg = state.player.heading;
  for (let deg = 0; deg < 360; deg += 15) {
    let diff = deg - centerHdg;
    while (diff < -180) diff += 360;
    while (diff > 180) diff -= 360;
    const tickX = width / 2 + diff * 4.5;
    if (tickX >= compX && tickX <= compX + compW) {
      ctx.fillRect(tickX - 1, compY + 22, 2, 10);
      const label = getCompassPoint(deg);
      ctx.fillText(label, tickX - 8, compY + 16);
    }
  }
  ctx.restore();

  // Centre indicator triangle for compass
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.moveTo(width / 2, compY + compH + 8);
  ctx.lineTo(width / 2 - 6, compY + compH);
  ctx.lineTo(width / 2 + 6, compY + compH);
  ctx.closePath();
  ctx.fill();

  // 4. Altimeter tape (right screen edge)
  const tapeW = 75;
  const tapeH = 220;
  const altX = width - 95;
  const altY = 140;

  ctx.fillStyle = 'rgba(0, 20, 40, 0.8)';
  ctx.fillRect(altX, altY, tapeW, tapeH);
  ctx.strokeStyle = '#06d6a0';
  ctx.lineWidth = 2;
  ctx.strokeRect(altX, altY, tapeW, tapeH);

  ctx.fillStyle = '#ffd166';
  ctx.font = '11px monospace';
  ctx.fillText('ALT m', altX + 18, altY + 18);

  ctx.fillStyle = '#ffffff';
  const curAlt = Math.round(state.player.y);
  for (let a = Math.round(curAlt - 100); a <= Math.round(curAlt + 100); a += 25) {
    const yOffset = altY + 110 - (a - curAlt) * 1.2;
    if (yOffset >= altY + 25 && yOffset <= altY + tapeH - 10) {
      ctx.fillText(`${a}`, altX + 12, yOffset + 4);
      ctx.fillRect(altX + 50, yOffset, 15, 1);
    }
  }

  // Current alt pointer box
  ctx.fillStyle = '#06d6a0';
  ctx.fillRect(altX - 45, altY + 95, 45, 24);
  ctx.fillStyle = '#000';
  ctx.font = 'bold 12px monospace';
  ctx.fillText(`${curAlt}`, altX - 40, altY + 112);

  // 5. Airspeed tape (left screen edge)
  const spdX = 20;
  const spdY = 240;
  const curSpd = Math.round(state.player.speed * 10);

  ctx.fillStyle = 'rgba(0, 20, 40, 0.8)';
  ctx.fillRect(spdX, spdY, tapeW, tapeH);
  ctx.strokeStyle = '#06d6a0';
  ctx.lineWidth = 2;
  ctx.strokeRect(spdX, spdY, tapeW, tapeH);

  ctx.fillStyle = '#ffd166';
  ctx.font = '11px monospace';
  ctx.fillText('SPD kt', spdX + 15, spdY + 18);

  ctx.fillStyle = '#ffffff';
  for (let s = Math.round(curSpd - 60); s <= Math.round(curSpd + 60); s += 15) {
    const yOffset = spdY + 110 - (s - curSpd) * 1.2;
    if (yOffset >= spdY + 25 && yOffset <= spdY + tapeH - 10) {
      ctx.fillText(`${s}`, spdX + 15, yOffset + 4);
      ctx.fillRect(spdX + 5, yOffset, 12, 1);
    }
  }

  // Current spd pointer box
  ctx.fillStyle = '#06d6a0';
  ctx.fillRect(spdX + tapeW, spdY + 95, 45, 24);
  ctx.fillStyle = '#000';
  ctx.font = 'bold 12px monospace';
  ctx.fillText(`${curSpd}`, spdX + tapeW + 4, spdY + 112);

  // Help line bottom
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, height - 35, width, 35);
  ctx.fillStyle = '#fff';
  ctx.font = '14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Steer: WASD/Arrows/Mouse | Throttle: Shift/Ctrl | Boost: Space | Pause: P | Restart: R', width / 2, height - 12);
  ctx.textAlign = 'left';
}

function renderOverlay(ctx, title, subtitle) {
  const { width, height } = ctx.canvas;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 36px monospace';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 12;
  ctx.fillText(title, width / 2, height / 2 - 40);

  ctx.fillStyle = '#ffffff';
  ctx.font = '18px monospace';
  const lines = subtitle.split('\n');
  lines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, height / 2 + 15 + idx * 28);
  });
  ctx.shadowBlur = 0;
  ctx.textAlign = 'left';
}
