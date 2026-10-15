import * as THREE from 'three';

/**
 * Procedural Canvas Texture Generators for Three.js
 * High-definition, zero-dependency, 100% code-driven.
 */

// Helper to create a canvas of given dimension
function getCanvas(width = 1024, height = 512): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

// 1. Sun Texture: Plasma swirls, solar granulations, fiery corona spots
export function createSunTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = getCanvas(1024, 512);

  // Base fiery gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#f97316');
  grad.addColorStop(0.5, '#fbbf24');
  grad.addColorStop(1, '#ea580c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Solar granulation noise
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = Math.random() * 5 + 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = Math.random() > 0.4 ? 'rgba(254, 240, 138, 0.45)' : 'rgba(180, 83, 9, 0.35)';
    ctx.fill();
  }

  // Plasma filament arches
  for (let j = 0; j < 30; j++) {
    const startX = Math.random() * 1024;
    const startY = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(
      startX + (Math.random() - 0.5) * 200,
      startY + (Math.random() - 0.5) * 80,
      startX + (Math.random() - 0.5) * 200,
      startY + (Math.random() - 0.5) * 80,
      startX + (Math.random() - 0.5) * 300,
      startY + (Math.random() - 0.5) * 100
    );
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = Math.random() * 6 + 2;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 2. Mercury: Rocky, grey, heavily cratered
export function createMercuryTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = getCanvas(1024, 512);

  ctx.fillStyle = '#6b7280';
  ctx.fillRect(0, 0, 1024, 512);

  // Highland variations
  for (let i = 0; i < 60; i++) {
    const cx = Math.random() * 1024;
    const cy = Math.random() * 512;
    const rad = Math.random() * 80 + 30;
    const g = ctx.createRadialGradient(cx, cy, 5, cx, cy, rad);
    g.addColorStop(0, 'rgba(156, 163, 175, 0.3)');
    g.addColorStop(1, 'rgba(55, 65, 81, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
  }

  // Impact craters
  for (let i = 0; i < 350; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = Math.random() * 8 + 2;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#374151';
    ctx.fill();

    // Crater rim
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 3. Venus: Dense sulfuric acid clouds, swirling warm yellows
export function createVenusTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = getCanvas(1024, 512);

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#ca8a04');
  grad.addColorStop(0.3, '#eab308');
  grad.addColorStop(0.5, '#fef08a');
  grad.addColorStop(0.7, '#eab308');
  grad.addColorStop(1, '#a16207');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Atmospheric cloud swirls
  for (let i = 0; i < 45; i++) {
    const y = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(300, y + Math.sin(i) * 50, 700, y - Math.cos(i) * 50, 1024, y);
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(254, 240, 138, 0.35)' : 'rgba(161, 98, 7, 0.25)';
    ctx.lineWidth = Math.random() * 25 + 8;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 4. Earth: Deep blue oceans, green/brown continents, polar caps, cloud wisps
export function createEarthTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = getCanvas(1024, 512);

  // Oceans
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(0, 0, 1024, 512);

  // Continents (procedural stylized landmasses)
  ctx.fillStyle = '#15803d'; // Green land
  const landBlobs = [
    // Africa / Europe
    { x: 500, y: 230, r: 90 }, { x: 520, y: 150, r: 60 }, { x: 480, y: 320, r: 70 },
    // Asia
    { x: 680, y: 180, r: 110 }, { x: 740, y: 220, r: 85 }, { x: 800, y: 250, r: 70 },
    // Americas
    { x: 260, y: 170, r: 90 }, { x: 280, y: 230, r: 60 }, { x: 330, y: 340, r: 85 },
    // Australia
    { x: 820, y: 360, r: 50 }
  ];

  landBlobs.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
    // Inner desert/mountain tint
    ctx.beginPath();
    ctx.arc(b.x + 10, b.y + 10, b.r * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#b45309';
    ctx.fill();
    ctx.fillStyle = '#15803d';
  });

  // Polar ice caps
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 1024, 45); // North pole
  ctx.fillRect(0, 467, 1024, 45); // South pole

  // Swirling white clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  for (let c = 0; c < 35; c++) {
    const cx = Math.random() * 1024;
    const cy = Math.random() * 512;
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.random() * 70 + 20, Math.random() * 20 + 8, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 5. Mars: Rust red, darker basaltic patches, white ice caps
export function createMarsTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = getCanvas(1024, 512);

  // Red regolith base
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(0, 0, 1024, 512);

  // Darker basaltic maria
  ctx.fillStyle = '#7c2d12';
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = Math.random() * 80 + 30;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.6, Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Olympus Mons & canyon hints
  ctx.beginPath();
  ctx.arc(380, 220, 24, 0, Math.PI * 2);
  ctx.fillStyle = '#9a3412';
  ctx.fill();
  ctx.strokeStyle = '#fdba74';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Valles Marineris canyon rift
  ctx.beginPath();
  ctx.moveTo(350, 260);
  ctx.lineTo(520, 275);
  ctx.strokeStyle = '#431407';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Polar ice caps
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 1024, 25);
  ctx.fillRect(0, 487, 1024, 25);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 6. Jupiter: Parallel banded clouds (zones and belts), Great Red Spot
export function createJupiterTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = getCanvas(1024, 512);

  // Alternating ammonia and ammonium hydrosulfide bands
  const bands = [
    '#7c2d12', '#fed7aa', '#9a3412', '#ffedd5', '#c2410c', 
    '#fef3c7', '#7c2d12', '#fed7aa', '#9a3412', '#fff7ed', 
    '#c2410c', '#ffedd5', '#7c2d12', '#fde68a'
  ];

  const bandHeight = 512 / bands.length;
  bands.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * bandHeight, 1024, bandHeight);
  });

  // Band turbulence ripples
  for (let i = 0; i < 60; i++) {
    const y = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(250, y + 15, 750, y - 15, 1024, y);
    ctx.strokeStyle = Math.random() > 0.5 ? 'rgba(255, 237, 213, 0.4)' : 'rgba(124, 45, 18, 0.4)';
    ctx.lineWidth = Math.random() * 8 + 3;
    ctx.stroke();
  }

  // The Great Red Spot (Anticyclonic storm)
  const grsX = 620;
  const grsY = 320;
  ctx.beginPath();
  ctx.ellipse(grsX, grsY, 55, 30, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#b91c1c';
  ctx.fill();
  ctx.strokeStyle = '#f87171';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Spiral swirl inside GRS
  ctx.beginPath();
  ctx.ellipse(grsX, grsY, 30, 15, 0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444';
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 7. Saturn: Delicate cream and butterscotch bands
export function createSaturnTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = getCanvas(1024, 512);

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.2, '#fde047');
  grad.addColorStop(0.4, '#eab308');
  grad.addColorStop(0.6, '#fef9c3');
  grad.addColorStop(0.8, '#facc15');
  grad.addColorStop(1, '#ca8a04');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  for (let y = 0; y < 512; y += 8) {
    ctx.fillStyle = y % 16 === 0 ? 'rgba(161, 98, 7, 0.12)' : 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(0, y, 1024, 4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 8. Saturn Rings: Concentric rings with Cassini division
export function createSaturnRingTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = getCanvas(1024, 64);

  const grad = ctx.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.08, 'rgba(217, 180, 130, 0.5)'); // C Ring
  grad.addColorStop(0.28, 'rgba(235, 205, 150, 0.85)'); // B Ring (Bright)
  grad.addColorStop(0.58, 'rgba(235, 205, 150, 0.9)');
  grad.addColorStop(0.60, 'rgba(10, 10, 20, 0.05)'); // Cassini Division!
  grad.addColorStop(0.65, 'rgba(10, 10, 20, 0.05)');
  grad.addColorStop(0.67, 'rgba(210, 175, 120, 0.75)'); // A Ring
  grad.addColorStop(0.92, 'rgba(190, 160, 110, 0.6)');
  grad.addColorStop(0.93, 'rgba(0,0,0,0)'); // Encke Gap
  grad.addColorStop(0.95, 'rgba(180, 150, 100, 0.4)');
  grad.addColorStop(1.0, 'rgba(0,0,0,0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 64);

  // Micro ringlets
  for (let x = 80; x < 980; x += 4) {
    if (x >= 610 && x <= 660) continue; // Skip Cassini
    ctx.fillStyle = x % 8 === 0 ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(x, 0, 2, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 9. Uranus: Pale aquamarine with faint banded haze
export function createUranusTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = getCanvas(1024, 512);

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#a5f3fc');
  grad.addColorStop(0.5, '#67e8f9');
  grad.addColorStop(1, '#06b6d4');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  for (let y = 0; y < 512; y += 12) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(0, y, 1024, 4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 10. Neptune: Deep vivid azure with white cirrus cloud bands
export function createNeptuneTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = getCanvas(1024, 512);

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#1d4ed8');
  grad.addColorStop(0.5, '#2563eb');
  grad.addColorStop(1, '#1e40af');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // High-speed storm streaks (Scooter & Great Dark Spot)
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(450, 200, 45, 22, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // White cirrus streaks
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 800;
    const y = Math.random() * 512;
    ctx.fillRect(x, y, Math.random() * 120 + 30, Math.random() * 4 + 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 11. Pluto: Mottled ice with bright heart-shaped Tombaugh Regio
export function createPlutoTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = getCanvas(1024, 512);

  // Base mottled brown-grey
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, 0, 1024, 512);

  // Tholins (dark reddish organic compounds)
  ctx.fillStyle = '#78350f';
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = Math.random() * 60 + 20;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tombaugh Regio (The Bright Nitrogen Ice Heart)
  ctx.fillStyle = '#f8fafc';
  const hx = 520;
  const hy = 260;
  ctx.beginPath();
  ctx.moveTo(hx, hy);
  ctx.bezierCurveTo(hx - 40, hy - 50, hx - 80, hy + 20, hx, hy + 70);
  ctx.bezierCurveTo(hx + 80, hy + 20, hx + 40, hy - 50, hx, hy);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 12. Asteroid texture: cratered rough rock
export function createAsteroidTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = getCanvas(256, 256);

  ctx.fillStyle = '#475569';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = Math.random() * 10 + 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = Math.random() > 0.5 ? '#1e293b' : '#64748b';
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
