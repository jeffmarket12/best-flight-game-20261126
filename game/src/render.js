export function renderGame(ctx, state) {
  const { width, height } = ctx.canvas;
  
  // Sky gradient (golden hour)
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#ff7e5f');
  grad.addColorStop(0.5, '#feb47b');
  grad.addColorStop(0.7, '#2b1055');
  grad.addColorStop(1, '#110322');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Sun
  ctx.fillStyle = '#fffaed';
  ctx.beginPath();
  ctx.arc(width * 0.75, height * 0.3, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = '#ffb703';
  ctx.shadowBlur = 40;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Clouds
  if (state.clouds) {
    ctx.fillStyle = 'rgba(255, 240, 220, 0.35)';
    state.clouds.forEach(cloud => {
      const dz = cloud.z - state.player.z;
      if (dz > -200 && dz < 12000) {
        const scale = 1000 / (dz + 500);
        const cx = width / 2 + (cloud.x - state.player.x) * scale;
        const cy = height * 0.3 + (cloud.y - state.player.y) * scale;
        const cr = 80 * cloud.scale * scale;
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.arc(cx + cr * 0.6, cy - cr * 0.2, cr * 0.8, 0, Math.PI * 2);
        ctx.arc(cx - cr * 0.6, cy - cr * 0.1, cr * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  // Horizon / Sea & Land
  const horizonY = height * 0.5 + state.player.pitch * 200;
  
  // Sea (left) with sun glitter path
  ctx.fillStyle = '#1d3557';
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, horizonY);
  ctx.lineTo(width * 0.5, horizonY);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Sun glitter on water
  ctx.fillStyle = 'rgba(255, 215, 0, 0.25)';
  ctx.beginPath();
  ctx.moveTo(width * 0.2, horizonY);
  ctx.lineTo(width * 0.4, horizonY);
  ctx.lineTo(width * 0.6, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Land (right) & City skyline silhouette
  ctx.fillStyle = '#4a5759';
  ctx.beginPath();
  ctx.moveTo(width, height);
  ctx.lineTo(width, horizonY);
  ctx.lineTo(width * 0.3, horizonY);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // City buildings
  ctx.fillStyle = '#2d3739';
  for (let bx = width * 0.4; bx < width; bx += 60) {
    const bh = 40 + Math.sin(bx * 0.1) * 30;
    ctx.fillRect(bx, horizonY - bh, 45, bh);
  }

  // River glint on land
  ctx.fillStyle = 'rgba(100, 180, 220, 0.4)';
  ctx.beginPath();
  ctx.moveTo(width * 0.6, horizonY);
  ctx.lineTo(width * 0.65, horizonY);
  ctx.lineTo(width * 0.8, height);
  ctx.lineTo(width * 0.72, height);
  ctx.closePath();
  ctx.fill();

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

  // Render Rings
  state.rings.forEach(ring => {
    const dz = ring.z - state.player.z;
    if (dz > 10 && dz < 6000) {
      const scale = 1000 / dz;
      const rx = width / 2 + (ring.x - state.player.x) * scale;
      const ry = horizonY + (ring.y - state.player.y) * scale;
      const rSize = ring.radius * scale;

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
  });

  // Render Aircraft (prop plane seen from behind-above, banking with roll)
  ctx.save();
  ctx.translate(width / 2, height / 2 + 60);
  ctx.rotate(state.player.roll);

  // Fuselage body
  ctx.fillStyle = '#d90429';
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 70, 0, 0, Math.PI * 2);
  ctx.fill();

  // Vertical tail fin
  ctx.fillStyle = '#ef233c';
  ctx.beginPath();
  ctx.moveTo(0, 50);
  ctx.lineTo(0, 85);
  ctx.lineTo(-12, 75);
  ctx.closePath();
  ctx.fill();

  // Wings with dihedral
  ctx.fillStyle = '#edf2f4';
  ctx.beginPath();
  ctx.moveTo(-110, -10);
  ctx.lineTo(110, -10);
  ctx.lineTo(95, 15);
  ctx.lineTo(-95, 15);
  ctx.closePath();
  ctx.fill();

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

  // Propeller spinning disc at rear/front perspective
  if (state.player.throttle > 0.05) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, -75, 35 + Math.random() * 8, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Wingtip nav lights (red left, white right)
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.arc(-108, -5, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(108, -5, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // HUD
  renderHUD(ctx, state);

  // Screen overlays (brightened alpha 0.45)
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
  ctx.fillStyle = 'rgba(0, 20, 40, 0.7)';
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
  ctx.fillStyle = 'rgba(0, 20, 40, 0.7)';
  ctx.fillRect(width - 240, 20, 220, 90);
  ctx.strokeRect(width - 240, 20, 220, 90);

  ctx.fillStyle = '#ffd166';
  ctx.fillText(`SCORE: ${state.score}`, width - 225, 50);
  ctx.fillText(`TIME: ${state.time.toFixed(1)} s`, width - 225, 85);

  // Help line bottom
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, height - 35, width, 35);
  ctx.fillStyle = '#fff';
  ctx.font = '14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Steer: WASD/Arrows/Mouse | Throttle: Shift/Ctrl | Boost: Space | Pause: P | Restart: R', width / 2, height - 12);
  ctx.textAlign = 'left';
}

function renderOverlay(ctx, title, subtitle) {
  const { width, height } = ctx.canvas;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 36px monospace';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 10;
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
