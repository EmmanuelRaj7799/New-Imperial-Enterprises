import * as THREE from 'three';

export interface ProceduralTextureSet {
  brushedMetalMap: THREE.CanvasTexture;
  stonePlinthMap: THREE.CanvasTexture;
  acpGrooveMap: THREE.CanvasTexture;
  contactShadowMap: THREE.CanvasTexture;
  dispose: () => void;
}

export function createArchitecturalTextures(maxAnisotropy: number): ProceduralTextureSet {
  // 1. Brushed anodized metal subtle linear grain
  const metalCanvas = document.createElement('canvas');
  metalCanvas.width = 512;
  metalCanvas.height = 512;
  const mCtx = metalCanvas.getContext('2d');
  if (mCtx) {
    mCtx.fillStyle = '#e5e9f0';
    mCtx.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y += 2) {
      const shade = 216 + Math.floor(((Math.sin(y * 0.7) + Math.cos(y * 1.9)) * 0.5 + 0.5) * 28);
      mCtx.fillStyle = `rgb(${shade}, ${shade + 2}, ${shade + 6})`;
      mCtx.fillRect(0, y, 512, 1);
    }
    for (let i = 0; i < 400; i++) {
      const x = (i * 73) % 512;
      const y = (i * 197) % 512;
      const w = 40 + ((i * 29) % 140);
      mCtx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)';
      mCtx.fillRect(x, y, w, 1);
    }
  }
  const brushedMetalMap = new THREE.CanvasTexture(metalCanvas);
  brushedMetalMap.colorSpace = THREE.SRGBColorSpace;
  brushedMetalMap.wrapS = THREE.RepeatWrapping;
  brushedMetalMap.wrapT = THREE.RepeatWrapping;
  brushedMetalMap.repeat.set(2, 2);
  brushedMetalMap.anisotropy = maxAnisotropy;

  // 2. Architectural stone / concrete plinth tile grid
  const stoneCanvas = document.createElement('canvas');
  stoneCanvas.width = 512;
  stoneCanvas.height = 512;
  const sCtx = stoneCanvas.getContext('2d');
  if (sCtx) {
    sCtx.fillStyle = '#d4dae3';
    sCtx.fillRect(0, 0, 512, 512);
    // Subtle mineral speckles
    for (let i = 0; i < 1800; i++) {
      const x = (i * 97) % 512;
      const y = (i * 233) % 512;
      const alpha = 0.03 + ((i % 5) * 0.012);
      sCtx.fillStyle = i % 2 === 0 ? `rgba(16,28,53,${alpha})` : `rgba(255,255,255,${alpha})`;
      sCtx.fillRect(x, y, 3, 3);
    }
    // Crisp architectural tile joints
    sCtx.strokeStyle = 'rgba(16, 28, 53, 0.22)';
    sCtx.lineWidth = 2;
    for (let step = 0; step <= 512; step += 128) {
      sCtx.beginPath();
      sCtx.moveTo(step, 0);
      sCtx.lineTo(step, 512);
      sCtx.stroke();
      sCtx.beginPath();
      sCtx.moveTo(0, step);
      sCtx.lineTo(512, step);
      sCtx.stroke();
    }
  }
  const stonePlinthMap = new THREE.CanvasTexture(stoneCanvas);
  stonePlinthMap.colorSpace = THREE.SRGBColorSpace;
  stonePlinthMap.wrapS = THREE.RepeatWrapping;
  stonePlinthMap.wrapT = THREE.RepeatWrapping;
  stonePlinthMap.repeat.set(2, 2);
  stonePlinthMap.anisotropy = maxAnisotropy;

  // 3. Precision-grooved ACP cladding panel joints
  const acpCanvas = document.createElement('canvas');
  acpCanvas.width = 512;
  acpCanvas.height = 512;
  const aCtx = acpCanvas.getContext('2d');
  if (aCtx) {
    const grad = aCtx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#c8d0da');
    grad.addColorStop(0.5, '#dde3ec');
    grad.addColorStop(1, '#aeb9c8');
    aCtx.fillStyle = grad;
    aCtx.fillRect(0, 0, 512, 512);

    aCtx.strokeStyle = '#101C35';
    aCtx.lineWidth = 6;
    for (let y = 128; y < 512; y += 128) {
      aCtx.beginPath();
      aCtx.moveTo(0, y);
      aCtx.lineTo(512, y);
      aCtx.stroke();
    }
    aCtx.lineWidth = 4;
    aCtx.beginPath();
    aCtx.moveTo(256, 0);
    aCtx.lineTo(256, 512);
    aCtx.stroke();
  }
  const acpGrooveMap = new THREE.CanvasTexture(acpCanvas);
  acpGrooveMap.colorSpace = THREE.SRGBColorSpace;
  acpGrooveMap.wrapS = THREE.RepeatWrapping;
  acpGrooveMap.wrapT = THREE.RepeatWrapping;
  acpGrooveMap.anisotropy = maxAnisotropy;

  // 4. Soft radial contact shadow map for floor grounding
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 512;
  shadowCanvas.height = 512;
  const shCtx = shadowCanvas.getContext('2d');
  if (shCtx) {
    const rad = shCtx.createRadialGradient(256, 256, 40, 256, 256, 250);
    rad.addColorStop(0, 'rgba(3, 6, 14, 0.72)');
    rad.addColorStop(0.55, 'rgba(3, 6, 14, 0.34)');
    rad.addColorStop(1, 'rgba(3, 6, 14, 0)');
    shCtx.fillStyle = rad;
    shCtx.fillRect(0, 0, 512, 512);
  }
  const contactShadowMap = new THREE.CanvasTexture(shadowCanvas);

  return {
    brushedMetalMap,
    stonePlinthMap,
    acpGrooveMap,
    contactShadowMap,
    dispose: () => {
      brushedMetalMap.dispose();
      stonePlinthMap.dispose();
      acpGrooveMap.dispose();
      contactShadowMap.dispose();
    },
  };
}
