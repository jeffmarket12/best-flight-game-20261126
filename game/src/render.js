export function renderGame(ctx, state) {
  const { width, height } = ctx.canvas;
  
  // 1. Rich golden-hour sunset sky: deep blue-violet top through warm magenta/orange to gold horizon
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#150826');
  grad.addColorStop(0.25, '#3a1532');
  grad.addColorStop(0.5, '#a52a4e');
  grad.addColorStop(0.75, '#f56542');
  grad.addColorStop(1, '#ffb703');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. SUN: Stronger radial halo, warm gold-white disc, visible lens-flare dots
  const sunX = width * 0.72;
  const sunY = height * 0.26;

  const sunGlow = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 280);
  sunGlow.addColorStop(0, 'rgba(255, 255, 240, 1.0)');
  sunGlow.addColorStop(0.2, 'rgba(255, 215, 100, 0.85)');
  sunGlow.addColorStop(0.5, 'rgba(255, 120, 50, 0.5)');
  sunGlow.addColorStop(1, 'rgba(200, 50, 80, 0)');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 280, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fffdf0';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 65, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = '#ffb703';
  ctx.shadowBlur = 100;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Lens-flare dots
  const flareColors = ['rgba(255, 230, 160, 0.7)', 'rgba(140, 245, 255, 0.6)', 'rgba(255, 160, 230, 0.65)', 'rgba(210, 255, 210, 0.5)'];
  const flareRadii = [16, 9, 26, 12];
  for (let f = 0; f < 4; f++) {
    const fx = sunX - (f + 1) * 135;
    const fy = sunY + (f + 1) * 90;
    ctx.fillStyle = flareColors[f];
    ctx.beginPath();
    ctx.arc(fx, fy, flareRadii[f], 0, Math.PI * 2);
    ctx.fill();
  }

  // Horizon line calculation with pitch & roll influence
  const horizonY = height * 0.48 + state.player.pitch * 220;

  // 3. Shimmering Ocean on the left
  ctx.fillStyle = '#0a192f';
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, horizonY);
  ctx.lineTo(width * 0.45, horizonY);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  const glintGrad = ctx.createLinearGradient(0, horizonY, width * 0.5, height);
  glintGrad.addColorStop(0, 'rgba(255, 230, 120, 0.75)');
  glintGrad.addColorStop(0.5, 'rgba(255, 180, 60, 0.45)');
  glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
  ctx.fillStyle = glintGrad;
  ctx.beginPath();
  ctx.moveTo(width * 0.1, horizonY);
  ctx.lineTo(width * 0.3, horizonY);
  ctx.lineTo(width * 0.6, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Layered mountain ridges with atmospheric perspective and snowcaps
  ctx.fillStyle = '#422f52';
  ctx.beginPath();
  ctx.moveTo(width, height);
  ctx.lineTo(width, horizonY - 60);
  for (let mx = width; mx >= width * 0.25; mx -= 45) {
    const mh = 40 + Math.sin(mx * 0.007 + 1.2) * 65;
    ctx.lineTo(mx, horizonY - mh);
  }
  ctx.lineTo(width * 0.25, height);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  for (let mx = width - 80; mx >= width * 0.3; mx -= 90) {
    const mh = 40 + Math.sin(mx * 0.007 + 1.2) * 65;
    if (mh > 75) {
      ctx.beginPath();
      ctx.moveTo(mx, horizonY - mh);
      ctx.lineTo(mx - 14, horizonY - mh + 22);
      ctx.lineTo(mx + 14, horizonY - mh + 22);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.fillStyle = '#261935';
  ctx.beginPath();
  ctx.moveTo(width, height);
  ctx.lineTo(width, horizonY - 25);
  for (let mx = width; mx >= width * 0.2; mx -= 35) {
    const mh = 25 + Math.cos(mx * 0.012) * 45;
    ctx.lineTo(mx, horizonY - mh);
  }
  ctx.lineTo(width * 0.2, height);
  ctx.closePath();
  ctx.fill();

  // Coastal land base (right)
  ctx.fillStyle = '#1e282a';
  ctx.beginPath();
  ctx.moveTo(width, height);
  ctx.lineTo(width, horizonY);
  ctx.lineTo(width * 0.28, horizonY);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // 3. CITY: Buildings with larger, brighter, denser warm lit windows and window glow
  for (let bx = width * 0.35; bx < width; bx += 26) {
    const bh = 65 + Math.sin(bx * 0.12) * 60 + ((bx % 6) * 12);
    ctx.fillStyle = '#12181a';
    ctx.fillRect(bx, horizonY - bh, 22, bh);

    // Denser, brighter warm lit windows
    ctx.fillStyle = '#ffea79';
    ctx.shadowColor = '#ffd166';
    ctx.shadowBlur = 6;
    for (let wy = horizonY - bh + 8; wy < horizonY - 6; wy += 9) {
      ctx.fillRect(bx + 3, wy, 5, 6);
      ctx.fillRect(bx + 12, wy, 5, 6);
    }
    ctx.shadowBlur = 0;
  }

  // Landmark coastal lighthouse with rotating light beam
  const lhX = width * 0.31;
  const lhY = horizonY;
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(lhX - 7, lhY - 100, 14, 100);
  ctx.fillStyle = '#d90429';
  ctx.fillRect(lhX - 7, lhY - 65, 14, 20);
  ctx.fillRect(lhX - 7, lhY - 25, 14, 15);

  const beamAngle = state.time * 2.2;
  const beamX = lhX + Math.cos(beamAngle) * 350;
  const beamY = lhY - 80 + Math.sin(beamAngle) * 90;
  ctx.fillStyle = 'rgba(255, 255, 200, 0.25)';
  ctx.beginPath();
  ctx.moveTo(lhX, lhY - 80);
  ctx.lineTo(beamX - 45, beamY - 45);
  ctx.lineTo(beamX + 45, beamY + 45);
  ctx.closePath();
  ctx.fill();

  // 4. CLOUDS: Soft radial-gradient puffs with translucent edges and warm-lit undersides only (NO hard outlines)
  if (state.clouds) {
    state.clouds.forEach(cloud => {
      const dz = cloud.z - state.player.z;
      if (dz > -200 && dz < 12000) {
        const scale = 1000 / (dz + 400);
        const cx = width / 2 + (cloud.x - state.player.x) * scale;
        const cy = height * 0.28 + (cloud.y - state.player.y) * scale;
        const cr = 95 * cloud.scale * scale;

        ctx.save();
        // Warm-lit underside glow
        const puffGrad1 = ctx.createRadialGradient(cx, cy + cr * 0.3, cr * 0.2, cx, cy, cr * 1.2);
        puffGrad1.addColorStop(0, 'rgba(255, 180, 100, 0.55)');
        puffGrad1.addColorStop(0.5, 'rgba(255, 220, 180, 0.3)');
        puffGrad1.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = puffGrad1;
        ctx.beginPath();
        ctx.arc(cx, cy, cr * 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Soft translucent puffs
        const puffGrad2 = ctx.createRadialGradient(cx - cr * 0.3, cy - cr * 0.2, cr * 0.1, cx, cy, cr);
        puffGrad2.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        puffGrad2.addColorStop(0.7, 'rgba(255, 245, 235, 0.45)');
        puffGrad2.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = puffGrad2;
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.arc(cx + cr * 0.5, cy - cr * 0.1, cr * 0.75, 0, Math.PI * 2);
        ctx.arc(cx - cr * 0.5, cy, cr * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
  }

  // Drifting birds
  if (state.birds) {
    ctx.strokeStyle = '#261935';
    ctx.lineWidth = 2;
    state.birds.forEach((bird, i) => {
      const bdz = bird.z - state.player.z;
      if (bdz > 100 && bdz < 10000) {
        const bscale = 1000 / bdz;
        const bx = width / 2 + (bird.x + Math.sin(state.time + i) * 180 - state.player.x) * bscale;
        const by = height * 0.32 + (bird.y - state.player.y) * bscale;
        const bsz = 16 * bscale;
        ctx.beginPath();
        ctx.moveTo(bx - bsz, by - bsz * 0.6);
        ctx.lineTo(bx, by);
        ctx.lineTo(bx + bsz, by - bsz * 0.6);
        ctx.stroke();
      }
    });
  }

  // Realistic perspective Runway with centerline dashes and edge lights
  const rdz = state.runway.z - state.player.z;
  if (rdz > -1200 && rdz < 9000) {
    const rscale = 1000 / Math.max(100, rdz);
    const rx = width / 2 + (state.runway.x - state.player.x) * rscale;
    const ry = horizonY + (state.runway.y - state.player.y) * rscale;
    const rw = state.runway.width * rscale;
    const rh = state.runway.length * rscale;

    ctx.fillStyle = '#1b1f23';
    ctx.fillRect(rx - rw / 2, ry, rw, rh);

    ctx.fillStyle = '#ffffff';
    for (let tx = -rw / 2 + 10; tx < rw / 2 - 10; tx += 20) {
      ctx.fillRect(rx + tx, ry, 12, 35);
    }

    for (let dy = 50; dy < rh - 50; dy += 70) {
      ctx.fillRect(rx - 3, ry + dy, 6, 35);
    }

    ctx.fillStyle = '#ffd166';
    for (let dy = 10; dy < rh; dy += 50) {
      ctx.fillRect(rx - rw / 2 - 5, ry + dy, 6, 6);
      ctx.fillRect(rx + rw / 2 - 1, ry + dy, 6, 6);
    }
  }

  // Glowing Rings with depth cueing & gold bonus highlight
  state.rings.forEach(ring => {
    const dz = ring.z - state.player.z;
    if (dz > 10 && dz < 7000) {
      const scale = 1000 / dz;
      const rx = width / 2 + (ring.x - state.player.x) * scale;
      const ry = horizonY + (ring.y - state.player.y) * scale;
      const rSize = ring.radius * scale;

      if (ring.isGold) {
        ctx.strokeStyle = ring.passed ? '#06d6a0' : '#ffb703';
        ctx.lineWidth = Math.max(4, 9 * scale);
        ctx.beginPath();
        ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = ring.passed ? '#06d6a0' : '#ffffff';
        ctx.lineWidth = Math.max(2, 5 * scale);
        ctx.beginPath();
        ctx.arc(rx, ry, rSize * 0.85, 0, Math.PI * 2);
        ctx.stroke();

        ctx.shadowColor = '#ffd166';
        ctx.shadowBlur = 35;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        ctx.strokeStyle = ring.passed ? '#06d6a0' : '#ffd166';
        ctx.lineWidth = Math.max(3, 7 * scale);
        ctx.beginPath();
        ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
        ctx.stroke();

        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }
  });

  // Score popups
  if (state.popups) {
    state.popups.forEach(pop => {
      const pdz = pop.z - state.player.z;
      if (pdz > 10 && pdz < 5000) {
        const pscale = 1000 / pdz;
        const px = width / 2 + (pop.x - state.player.x) * pscale;
        const py = horizonY + (pop.y - state.player.y - (1.0 - pop.ttl) * 60) * pscale;
        ctx.fillStyle = pop.text.includes('GOLD') ? '#ffd166' : '#06d6a0';
        ctx.font = 'bold 24px monospace';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 10;
        ctx.fillText(pop.text, px - 45, py);
        ctx.shadowBlur = 0;
      }
    });
  }

  // Speed lines when boosting
  if (state.player.throttle > 0.95 && state.mode === 'play') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 14; i++) {
      const sy = (i * 70 + state.time * 700) % height;
      ctx.beginPath();
      ctx.moveTo(25, sy);
      ctx.lineTo(85, sy);
      ctx.moveTo(width - 85, sy);
      ctx.lineTo(width - 25, sy);
      ctx.stroke();
    }
  }

  // HERO AIRCRAFT (Chase View)
  ctx.save();
  ctx.translate(width / 2, height / 2 + 75);
  ctx.rotate(state.player.roll);
  ctx.scale(1.35, 1.35);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 20;

  const fuseGrad = ctx.createLinearGradient(-18, 0, 18, 0);
  fuseGrad.addColorStop(0, '#900020');
  fuseGrad.addColorStop(0.3, '#d90429');
  fuseGrad.addColorStop(0.7, '#ff3344');
  fuseGrad.addColorStop(1, '#900020');
  ctx.fillStyle = fuseGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 78, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, 19, 76, 0, Math.PI, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#b7094c';
  ctx.beginPath();
  ctx.moveTo(0, 55);
  ctx.lineTo(0, 95);
  ctx.lineTo(-14, 82);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(-2, 70);
  ctx.lineTo(-2, 90);
  ctx.lineTo(-10, 82);
  ctx.closePath();
  ctx.fill();

  const wingGrad = ctx.createLinearGradient(-120, 0, 120, 0);
  wingGrad.addColorStop(0, '#d1d5db');
  wingGrad.addColorStop(0.5, '#f8f9fa');
  wingGrad.addColorStop(1, '#d1d5db');
  ctx.fillStyle = wingGrad;
  ctx.beginPath();
  ctx.moveTo(-125, -12);
  ctx.lineTo(125, -12);
  ctx.lineTo(105, 18);
  ctx.lineTo(-105, 18);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-123, -12);
  ctx.lineTo(123, -12);
  ctx.stroke();

  ctx.fillStyle = '#e5e7eb';
  ctx.beginPath();
  ctx.moveTo(-40, 60);
  ctx.lineTo(40, 60);
  ctx.lineTo(28, 76);
  ctx.lineTo(-28, 76);
  ctx.closePath();
  ctx.fill();

  const canopyGrad = ctx.createLinearGradient(0, -30, 0, 0);
  canopyGrad.addColorStop(0, '#ffd166');
  canopyGrad.addColorStop(0.5, '#1d3557');
  canopyGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = canopyGrad;
  ctx.beginPath();
  ctx.ellipse(0, -18, 13, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  if (state.player.throttle > 0.05) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.beginPath();
    ctx.ellipse(0, -82, 40 + Math.random() * 10, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-35, -82); ctx.lineTo(35, -82);
    ctx.moveTo(0, -115); ctx.lineTo(0, -50);
    ctx.stroke();
  }

  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.arc(-123, -5, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = '#ff0000';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#06d6a0';
  ctx.beginPath();
  ctx.arc(123, -5, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = '#06d6a0';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();

  // 5. HUD: Genuinely glassy panels (lighter translucent fill, thin bright border with top highlight, clean typography)
  renderHUD(ctx, state);

  // 1 & 6. Overlays (Start & End screens with non-overlapping title / restart positions)
  if (state.mode === 'start') {
    renderStartOverlay(ctx, 'GOLDEN COAST FLYER', 'Fly through glowing golden rings and land on the runway.\n\nControls: WASD/Arrows/Mouse to Steer\nShift/Ctrl: Throttle | Space: Boost | P: Pause\n\nPRESS ENTER OR CLICK TO START');
  } else if (state.mode === 'paused') {
    renderOverlay(ctx, 'PAUSED', 'PRESS P TO RESUME');
  } else if (state.mode === 'gameover') {
    renderEndOverlay(ctx, state.won ? 'MISSION ACCOMPLISHED!' : 'MISSION FAILED', `Score: ${state.score} | Time: ${state.time.toFixed(1)}s`, 'PRESS R TO RESTART');
  }
}

function getCompassPoint(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const idx = Math.round((deg % 360) / 45) % 8;
  return dirs[idx];
}

function renderHUD(ctx, state) {
  const { width, height } = ctx.canvas;

  // 5. Glassy Panel Top-Left
  renderGlassPanel(ctx, 25, 25, 270, 185);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 15px monospace';
  const hdgDeg = Math.round(state.player.heading);
  const hdgStr = `HDG: ${hdgDeg}° ${getCompassPoint(hdgDeg)}`;

  ctx.fillText(`ALT: ${Math.round(state.player.y)} m`, 40, 55);
  ctx.fillText(`SPD: ${Math.round(state.player.speed * 10)} kt`, 40, 85);
  ctx.fillText(hdgStr, 40, 115);
  ctx.fillText(`THR: ${Math.round(state.player.throttle * 100)} %`, 40, 145);
  ctx.fillText(`RINGS: ${state.ringsPassed} / ${state.totalRings}`, 40, 175);

  // Glassy Panel Top-Right (Score & Timer)
  renderGlassPanel(ctx, width - 250, 25, 225, 95);
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 16px monospace';
  ctx.fillText(`SCORE: ${state.score}`, width - 235, 58);
  ctx.fillText(`TIME: ${state.time.toFixed(1)} s`, width - 235, 92);

  // Working Compass Strip (top-center)
  const compW = 340;
  const compH = 38;
  const compX = width / 2 - compW / 2;
  const compY = 25;

  renderGlassPanel(ctx, compX, compY, compW, compH);

  ctx.save();
  ctx.beginPath();
  ctx.rect(compX, compY, compW, compH);
  ctx.clip();

  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 12px monospace';
  const centerHdg = state.player.heading;
  for (let deg = 0; deg < 360; deg += 15) {
    let diff = deg - centerHdg;
    while (diff < -180) diff += 360;
    while (diff > 180) diff -= 360;
    const tickX = width / 2 + diff * 4.5;
    if (tickX >= compX && tickX <= compX + compW) {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(tickX - 1, compY + 24, 2, 10);
      ctx.fillStyle = '#f1f5f9';
      const label = (deg % 90 === 0) ? getCompassPoint(deg) : `${deg}`;
      ctx.fillText(label, tickX - 10, compY + 16);
    }
  }
  ctx.restore();

  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.moveTo(width / 2, compY + compH + 8);
  ctx.lineTo(width / 2 - 6, compY + compH);
  ctx.lineTo(width / 2 + 6, compY + compH);
  ctx.closePath();
  ctx.fill();

  // Artificial Horizon Instrument (bottom-left)
  const ahX = 160;
  const ahY = 280;
  const ahR = 55;
  ctx.save();
  ctx.beginPath();
  ctx.arc(ahX, ahY, ahR, 0, Math.PI * 2);
  ctx.clip();

  ctx.save();
  ctx.translate(ahX, ahY);
  ctx.rotate(-state.player.roll);
  const pitchOffset = state.player.pitch * 35;

  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(-ahR * 2, -ahR * 2, ahR * 4, ahR + pitchOffset);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(-ahR * 2, pitchOffset, ahR * 4, ahR * 4);

  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-ahR * 2, pitchOffset);
  ctx.lineTo(ahR * 2, pitchOffset);
  ctx.stroke();

  ctx.restore();
  ctx.restore();

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(ahX, ahY, ahR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ahX - 20, ahY); ctx.lineTo(ahX - 7, ahY); ctx.lineTo(ahX, ahY + 7); ctx.lineTo(ahX + 7, ahY); ctx.lineTo(ahX + 20, ahY);
  ctx.stroke();

  // Bottom help bar
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(0, height - 38, width, 38);
  ctx.fillStyle = '#f8fafc';
  ctx.font = '13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Steer: WASD/Arrows/Mouse | Throttle: Shift/Ctrl | Boost: Space | Pause: P | Restart: R', width / 2, height - 14);
  ctx.textAlign = 'left';
}

function renderGlassPanel(ctx, x, y, w, h) {
  // Glassy fill with subtle translucent gradient
  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, 'rgba(30, 41, 59, 0.65)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0.85)');
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  // Thin bright cyan/blue border
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);

  // Subtle top highlight line for glass depth
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 2, y + 1);
  ctx.lineTo(x + w - 2, y + 1);
  ctx.stroke();
}

function renderStartOverlay(ctx, title, subtitle) {
  const { width, height } = ctx.canvas;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = 'center';
  // 1. Title shifted higher up (y = 110) so the plane below is fully visible
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 38px monospace';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 15;
  ctx.fillText(title, width / 2, 110);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '16px monospace';
  const lines = subtitle.split('\n');
  lines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, 160 + idx * 26);
  });
  ctx.shadowBlur = 0;
  ctx.textAlign = 'left';
}

function renderEndOverlay(ctx, title, subtitle, restartText) {
  const { width, height } = ctx.canvas;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 38px monospace';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 15;
  ctx.fillText(title, width / 2, height / 2 - 70);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '18px monospace';
  ctx.fillText(subtitle, width / 2, height / 2 - 20);

  // 6. Restart prompt placed safely below the aircraft/center so it does not cover the plane
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(restartText, width / 2, height / 2 + 50);

  ctx.shadowBlur = 0;
  ctx.textAlign = 'left';
}

function renderOverlay(ctx, title, subtitle) {
  const { width, height } = ctx.canvas;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 38px monospace';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 15;
  ctx.fillText(title, width / 2, height / 2 - 40);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '17px monospace';
  const lines = subtitle.split('\n');
  lines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, height / 2 + 15 + idx * 28);
  });
  ctx.shadowBlur = 0;
  ctx.textAlign = 'left';
}
