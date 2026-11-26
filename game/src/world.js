export function createWorld(seed = 1) {
  let s = seed;
  function rnd() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  }

  // Generate rings along a winding path over land/sea border
  const rings = [];
  const pathPoints = [];
  let px = 0, py = 350, pz = 1000;
  
  for (let i = 0; i < 15; i++) {
    pathPoints.push({ x: px, y: py, z: pz });
    px += (rnd() - 0.5) * 600;
    py += (rnd() - 0.5) * 150;
    py = Math.max(180, Math.min(600, py));
    pz += 1400;
  }

  for (let i = 1; i <= 12; i++) {
    const pt = pathPoints[i];
    rings.push({
      x: pt.x,
      y: pt.y,
      z: pt.z,
      radius: 130,
      passed: false
    });
  }

  // Runway at the end
  const runway = {
    x: pathPoints[12].x,
    y: 20, // ground level
    z: pathPoints[12].z + 600,
    length: 1500,
    width: 140,
    heading: 0
  };

  // Clouds
  const clouds = [];
  for (let i = 0; i < 6; i++) {
    clouds.push({
      x: (rnd() - 0.5) * 8000,
      y: 800 + rnd() * 400,
      z: rnd() * 20000,
      scale: 1 + rnd() * 2
    });
  }

  return { rings, runway, clouds, rnd };
}
