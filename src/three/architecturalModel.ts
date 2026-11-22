import * as THREE from 'three';
import type { ProceduralTextureSet } from './architecturalTextures';

export type ProfileFinishId = 'obsidian' | 'silver' | 'champagne' | 'navy';

export interface ProfileFinishOption {
  id: ProfileFinishId;
  label: string;
  swatch: string;
  colorHex: number;
  metalness: number;
  roughness: number;
}

export const PROFILE_FINISHES: ProfileFinishOption[] = [
  {
    id: 'obsidian',
    label: 'Obsidian Anodized',
    swatch: '#1A2233',
    colorHex: 0x1a2233,
    metalness: 0.88,
    roughness: 0.24,
  },
  {
    id: 'silver',
    label: 'Metallic Silver',
    swatch: '#C8D0DA',
    colorHex: 0xc8d0da,
    metalness: 0.94,
    roughness: 0.18,
  },
  {
    id: 'champagne',
    label: 'Champagne Gold',
    swatch: '#D6B36A',
    colorHex: 0xd6b36a,
    metalness: 0.92,
    roughness: 0.22,
  },
  {
    id: 'navy',
    label: 'Midnight Navy',
    swatch: '#13274F',
    colorHex: 0x13274f,
    metalness: 0.82,
    roughness: 0.26,
  },
];

export interface ArchitecturalPartInfo {
  id: string;
  title: string;
  category: string;
  description: string;
  route: string;
}

export const ARCHITECTURAL_PARTS: Record<string, ArchitecturalPartInfo> = {
  aluminium_doors: {
    id: 'aluminium_doors',
    title: 'Aluminium French Sliding Doors',
    category: 'Aluminium Works',
    description:
      'Slim-profile extruded aluminium framing with smooth multi-track sliding leaves and brushed hardware.',
    route: '/services/aluminium-works',
  },
  glass_partition: {
    id: 'glass_partition',
    title: '12 mm & 45x25 Glass Partition',
    category: 'Glass Works',
    description:
      'Frameless 12 mm toughened interior glass paired with slimline 45x25 metallic perimeter channels.',
    route: '/services/glass-works',
  },
  upvc_window: {
    id: 'upvc_window',
    title: 'UPVC Casement & Sliding Bay',
    category: 'UPVC Windows & Doors',
    description:
      'Precision-sealed architectural UPVC window assembly for daylight clarity and smooth ventilation.',
    route: '/services/upvc-windows-doors',
  },
  gypsum_ceiling: {
    id: 'gypsum_ceiling',
    title: 'Gypsum Cove & 2x2 Grid Ceiling',
    category: 'Interior & Ceiling Works',
    description:
      'Recessed multi-level gypsum false ceiling with warm cove illumination and modular 2x2 grid zone.',
    route: '/services/interior-ceiling-works',
  },
  glass_railing: {
    id: 'glass_railing',
    title: 'SS, Glass & Aluminium Railing',
    category: 'Railings & Metal Works',
    description:
      'Toughened glass balcony balustrade anchored on brushed 304 stainless steel spigots with metallic handrail.',
    route: '/services/railings-metal-works',
  },
  acp_cladding: {
    id: 'acp_cladding',
    title: 'ACP Cladding & MS Louver Canopy',
    category: 'ACP & MS Fabrication',
    description:
      'Precision-grooved Aluminium Composite Panel facade paired with structural mild steel architectural louvers.',
    route: '/services/railings-metal-works',
  },
};

export interface BuiltArchitecturalModel {
  root: THREE.Group;
  interactables: THREE.Object3D[];
  setProfileFinish: (finishId: ProfileFinishId) => void;
  setExplodedFactor: (factor: number) => void;
  setDoorOpenFactor: (factor: number) => void;
  dispose: () => void;
}

function tagPart(group: THREE.Object3D, partId: string) {
  group.userData.partId = partId;
  group.traverse((child) => {
    child.userData.partId = partId;
    if ((child as THREE.Mesh).isMesh) {
      child.layers.enable(1);
    }
  });
}

function createExtrudedFrame(
  outerW: number,
  outerH: number,
  barThickness: number,
  depth: number
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const hw = outerW / 2;
  const hh = outerH / 2;
  shape.moveTo(-hw, -hh);
  shape.lineTo(hw, -hh);
  shape.lineTo(hw, hh);
  shape.lineTo(-hw, hh);
  shape.closePath();

  const hole = new THREE.Path();
  const ihw = hw - barThickness;
  const ihh = hh - barThickness;
  hole.moveTo(-ihw, -ihh);
  hole.lineTo(ihw, -ihh);
  hole.lineTo(ihw, ihh);
  hole.lineTo(-ihw, ihh);
  hole.closePath();
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 2,
  });
  geo.center();
  return geo;
}

export function buildImperialPavilionModel(
  textures: ProceduralTextureSet,
  isSoftwareGl: boolean,
  transparentBackground = false
): BuiltArchitecturalModel {
  const root = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  // --- Physically-Based Materials ---
  const aluminiumMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: PROFILE_FINISHES[0].colorHex,
      map: textures.brushedMetalMap,
      metalness: PROFILE_FINISHES[0].metalness,
      roughness: PROFILE_FINISHES[0].roughness,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
    })
  );

  const brushedSteelMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xdbe3ee,
      map: textures.brushedMetalMap,
      metalness: 0.96,
      roughness: 0.16,
      clearcoat: 0.4,
    })
  );

  const champagneTrimMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xd6b36a,
      metalness: 0.9,
      roughness: 0.22,
    })
  );

  const useTransmission = !isSoftwareGl && !transparentBackground;

  const glassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xd8f1ff,
      metalness: 0.08,
      roughness: 0.06,
      transmission: useTransmission ? 0.88 : 0,
      transparent: true,
      opacity: useTransmission ? 0.96 : 0.34,
      ior: 1.52,
      thickness: 0.14,
      attenuationColor: new THREE.Color(0x9bd7f5),
      attenuationDistance: 1.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: transparentBackground ? 1.8 : 1.0,
      depthWrite: false,
    })
  );

  const tintedGlassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x7cb8d9,
      metalness: 0.1,
      roughness: 0.08,
      transmission: useTransmission ? 0.78 : 0,
      transparent: true,
      opacity: useTransmission ? 0.94 : 0.44,
      ior: 1.52,
      thickness: 0.12,
      clearcoat: 1.0,
      envMapIntensity: transparentBackground ? 1.8 : 1.0,
      depthWrite: false,
    })
  );

  const upvcMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf4f6fa,
      metalness: 0.06,
      roughness: 0.32,
    })
  );

  const plinthStoneMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd9dfe8,
      map: textures.stonePlinthMap,
      metalness: 0.05,
      roughness: 0.72,
    })
  );

  const darkBaseMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.35,
      roughness: 0.52,
    })
  );

  const gypsumMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf7f8fb,
      metalness: 0.02,
      roughness: 0.84,
    })
  );

  const coveGlowMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfff3d4,
      emissive: 0xffd27d,
      emissiveIntensity: 1.55,
      roughness: 0.3,
    })
  );

  const acpSilverMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xc8d0da,
      map: textures.acpGrooveMap,
      metalness: 0.78,
      roughness: 0.28,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
    })
  );

  const acpNavyMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x101c35,
      map: textures.acpGrooveMap,
      metalness: 0.65,
      roughness: 0.32,
      clearcoat: 0.55,
    })
  );

  const msSteelMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x161d2c,
      metalness: 0.72,
      roughness: 0.42,
    })
  );

  const warmOakMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x9c744f,
      metalness: 0.04,
      roughness: 0.68,
    })
  );

  // =========================================================================
  // 0. GROUNDING PLINTH & CONTACT SHADOW (y = 0 at bottom-center)
  // =========================================================================
  const contactPlane = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(9.6, 9.6)),
    trackMat(
      new THREE.MeshBasicMaterial({
        map: textures.contactShadowMap,
        transparent: true,
        depthWrite: false,
        opacity: 0.78,
      })
    )
  );
  contactPlane.rotation.x = -Math.PI / 2;
  contactPlane.position.y = 0.004;
  root.add(contactPlane);

  const baseSubPlinth = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.6, 0.16, 4.2)),
    darkBaseMat
  );
  baseSubPlinth.position.set(0, 0.08, 0);
  baseSubPlinth.receiveShadow = true;
  root.add(baseSubPlinth);

  const deckFloor = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.32, 0.12, 3.92)),
    plinthStoneMat
  );
  deckFloor.position.set(0, 0.22, 0);
  deckFloor.receiveShadow = true;
  root.add(deckFloor);

  // Subtle champagne metallic inlay border around the plinth
  const trimInlay = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.38, 0.025, 3.98)),
    champagneTrimMat
  );
  trimInlay.position.set(0, 0.165, 0);
  root.add(trimInlay);

  // Interior architectural workstation desk (gives scale & interior depth inside glass bay)
  const interiorFurniture = new THREE.Group();
  const deskTop = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.45, 0.06, 0.72)), warmOakMat);
  deskTop.position.set(0.75, 0.98, -0.55);
  deskTop.castShadow = true;
  deskTop.receiveShadow = true;
  interiorFurniture.add(deskTop);

  const legGeo = trackGeo(new THREE.BoxGeometry(0.05, 0.68, 0.62));
  const leftLeg = new THREE.Mesh(legGeo, aluminiumMat);
  leftLeg.position.set(0.08, 0.62, -0.55);
  leftLeg.castShadow = true;
  const rightLeg = new THREE.Mesh(legGeo, aluminiumMat);
  rightLeg.position.set(1.42, 0.62, -0.55);
  rightLeg.castShadow = true;
  interiorFurniture.add(leftLeg, rightLeg);
  root.add(interiorFurniture);

  // =========================================================================
  // 1. ALUMINIUM FRENCH SLIDING DOORS ASSEMBLY (Front Facade, animated leaves)
  // =========================================================================
  const aluminiumGroup = new THREE.Group();
  const aluminiumBasePos = new THREE.Vector3(-0.35, 0.28, 1.45);
  aluminiumGroup.position.copy(aluminiumBasePos);

  // Outer multi-track aluminium perimeter frame
  const outerDoorFrame = new THREE.Mesh(
    trackGeo(createExtrudedFrame(3.15, 2.38, 0.095, 0.14)),
    aluminiumMat
  );
  outerDoorFrame.position.set(0, 1.19, 0);
  outerDoorFrame.castShadow = true;
  outerDoorFrame.receiveShadow = true;
  aluminiumGroup.add(outerDoorFrame);

  // Bottom recessed stainless steel sliding track rail
  const trackRail = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(3.02, 0.025, 0.12)),
    brushedSteelMat
  );
  trackRail.position.set(0, 0.05, 0);
  aluminiumGroup.add(trackRail);

  // Left Sliding Leaf
  const leftLeaf = new THREE.Group();
  const leftLeafHomeX = -0.74;
  leftLeaf.position.set(leftLeafHomeX, 1.19, 0.028);

  const leafFrameGeo = trackGeo(createExtrudedFrame(1.48, 2.2, 0.068, 0.055));
  const leftLeafFrame = new THREE.Mesh(leafFrameGeo, aluminiumMat);
  leftLeafFrame.castShadow = true;
  leftLeaf.add(leftLeafFrame);

  // French horizontal glazing bars
  const mullionBarGeo = trackGeo(new THREE.BoxGeometry(1.36, 0.032, 0.04));
  [-0.45, 0.45].forEach((barY) => {
    const bar = new THREE.Mesh(mullionBarGeo, aluminiumMat);
    bar.position.set(0, barY, 0);
    leftLeaf.add(bar);
  });

  const leafGlassGeo = trackGeo(new THREE.BoxGeometry(1.36, 2.08, 0.022));
  const leftGlass = new THREE.Mesh(leafGlassGeo, glassMat);
  leftGlass.renderOrder = 2;
  leftLeaf.add(leftGlass);

  // Vertical pull handle
  const handleGeo = trackGeo(new THREE.CylinderGeometry(0.014, 0.014, 0.44, 16));
  const leftHandle = new THREE.Mesh(handleGeo, brushedSteelMat);
  leftHandle.position.set(0.62, -0.05, 0.05);
  leftLeaf.add(leftHandle);
  aluminiumGroup.add(leftLeaf);

  // Right Sliding Leaf
  const rightLeaf = new THREE.Group();
  const rightLeafHomeX = 0.74;
  rightLeaf.position.set(rightLeafHomeX, 1.19, -0.028);

  const rightLeafFrame = new THREE.Mesh(leafFrameGeo, aluminiumMat);
  rightLeafFrame.castShadow = true;
  rightLeaf.add(rightLeafFrame);

  [-0.45, 0.45].forEach((barY) => {
    const bar = new THREE.Mesh(mullionBarGeo, aluminiumMat);
    bar.position.set(0, barY, 0);
    rightLeaf.add(bar);
  });

  const rightGlass = new THREE.Mesh(leafGlassGeo, glassMat);
  rightGlass.renderOrder = 2;
  rightLeaf.add(rightGlass);

  const rightHandle = new THREE.Mesh(handleGeo, brushedSteelMat);
  rightHandle.position.set(-0.62, -0.05, 0.05);
  rightLeaf.add(rightHandle);
  aluminiumGroup.add(rightLeaf);

  tagPart(aluminiumGroup, 'aluminium_doors');
  root.add(aluminiumGroup);

  // =========================================================================
  // 2. 12 mm & 45x25 GLASS PARTITION SYSTEM (Interior Divider)
  // =========================================================================
  const glassPartitionGroup = new THREE.Group();
  const glassPartBasePos = new THREE.Vector3(-0.22, 0.28, -0.15);
  glassPartitionGroup.position.copy(glassPartBasePos);

  // Top & Bottom 45x25 slimline channels
  const channelGeo = trackGeo(new THREE.BoxGeometry(0.055, 0.045, 2.55));
  const bottomChannel = new THREE.Mesh(channelGeo, aluminiumMat);
  bottomChannel.position.set(0, 0.022, 0);
  const topChannel = new THREE.Mesh(channelGeo, aluminiumMat);
  topChannel.position.set(0, 2.34, 0);
  glassPartitionGroup.add(bottomChannel, topChannel);

  // 45x25 slender vertical mullions
  const slimPostGeo = trackGeo(new THREE.BoxGeometry(0.048, 2.34, 0.036));
  [-1.26, -0.42, 0.42, 1.26].forEach((zPos) => {
    const post = new THREE.Mesh(slimPostGeo, aluminiumMat);
    post.position.set(0, 1.18, zPos);
    post.castShadow = true;
    glassPartitionGroup.add(post);
  });

  // 12 mm Toughened Glass Panels (3 architectural bays)
  const partGlassGeo = trackGeo(new THREE.BoxGeometry(0.02, 2.28, 0.8));
  [-0.84, 0, 0.84].forEach((zPos) => {
    const pane = new THREE.Mesh(partGlassGeo, tintedGlassMat);
    pane.position.set(0, 1.18, zPos);
    pane.renderOrder = 3;
    glassPartitionGroup.add(pane);
  });

  // Brushed SS patch fittings on center glass door
  const patchGeo = trackGeo(new THREE.BoxGeometry(0.04, 0.08, 0.14));
  [0.12, 2.22].forEach((yPos) => {
    const patch = new THREE.Mesh(patchGeo, brushedSteelMat);
    patch.position.set(0, yPos, 0.34);
    glassPartitionGroup.add(patch);
  });

  tagPart(glassPartitionGroup, 'glass_partition');
  root.add(glassPartitionGroup);

  // =========================================================================
  // 3. UPVC CASEMENT & SLIDING WINDOW BAY (Right Elevation)
  // =========================================================================
  const upvcGroup = new THREE.Group();
  const upvcBasePos = new THREE.Vector3(2.1, 0.28, -0.15);
  upvcGroup.position.copy(upvcBasePos);

  // Low stone sill wall beneath UPVC window
  const sillWall = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.18, 0.72, 2.75)),
    plinthStoneMat
  );
  sillWall.position.set(0, 0.36, 0);
  sillWall.castShadow = true;
  sillWall.receiveShadow = true;
  upvcGroup.add(sillWall);

  // UPVC Main Frame rotated along Z-axis
  const upvcFrame = new THREE.Mesh(
    trackGeo(createExtrudedFrame(2.7, 1.62, 0.085, 0.12)),
    upvcMat
  );
  upvcFrame.rotation.y = Math.PI / 2;
  upvcFrame.position.set(0, 1.53, 0);
  upvcFrame.castShadow = true;
  upvcGroup.add(upvcFrame);

  // Center UPVC Vertical Mullion & Transom
  const upvcMullion = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.11, 1.5, 0.075)),
    upvcMat
  );
  upvcMullion.position.set(0, 1.53, 0);
  upvcGroup.add(upvcMullion);

  const upvcTransom = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.1, 0.065, 2.55)),
    upvcMat
  );
  upvcTransom.position.set(0, 1.98, 0);
  upvcGroup.add(upvcTransom);

  // Double-glazed UPVC glass sheet
  const upvcGlass = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.025, 1.46, 2.52)),
    glassMat
  );
  upvcGlass.position.set(0, 1.53, 0);
  upvcGlass.renderOrder = 2;
  upvcGroup.add(upvcGlass);

  // UPVC Metallic Casement Handle
  const upvcHandle = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.04, 0.14, 0.025)),
    brushedSteelMat
  );
  upvcHandle.position.set(-0.07, 1.38, 0.06);
  upvcGroup.add(upvcHandle);

  tagPart(upvcGroup, 'upvc_window');
  root.add(upvcGroup);

  // =========================================================================
  // 4. SCULPTED GYPSUM FALSE CEILING + COVE LIGHTING + 2x2 GRID CEILING
  // =========================================================================
  const ceilingGroup = new THREE.Group();
  const ceilingBasePos = new THREE.Vector3(0, 2.74, 0);
  ceilingGroup.position.copy(ceilingBasePos);

  // Structural Roof Slab
  const roofSlab = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.25, 0.18, 3.8)),
    darkBaseMat
  );
  roofSlab.position.set(0, 0.14, 0);
  roofSlab.castShadow = true;
  roofSlab.receiveShadow = true;
  ceilingGroup.add(roofSlab);

  // Champagne perimeter fascia trim
  const roofTrim = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.32, 0.04, 3.86)),
    champagneTrimMat
  );
  roofTrim.position.set(0, 0.22, 0);
  ceilingGroup.add(roofTrim);

  // Dropped Gypsum False Ceiling Tray (Left/Center zone)
  const gypsumOuter = new THREE.Mesh(
    trackGeo(createExtrudedFrame(2.9, 3.1, 0.42, 0.1)),
    gypsumMat
  );
  gypsumOuter.rotation.x = Math.PI / 2;
  gypsumOuter.position.set(-0.85, -0.02, 0);
  ceilingGroup.add(gypsumOuter);

  // Recessed warm cove LED light strips inside gypsum tray
  const coveStripW = trackGeo(new THREE.BoxGeometry(2.08, 0.022, 0.03));
  const coveStripD = trackGeo(new THREE.BoxGeometry(0.03, 0.022, 2.28));
  const coveFront = new THREE.Mesh(coveStripW, coveGlowMat);
  coveFront.position.set(-0.85, 0.025, 1.12);
  const coveBack = new THREE.Mesh(coveStripW, coveGlowMat);
  coveBack.position.set(-0.85, 0.025, -1.12);
  const coveLeft = new THREE.Mesh(coveStripD, coveGlowMat);
  coveLeft.position.set(-1.88, 0.025, 0);
  const coveRight = new THREE.Mesh(coveStripD, coveGlowMat);
  coveRight.position.set(0.18, 0.025, 0);
  ceilingGroup.add(coveFront, coveBack, coveLeft, coveRight);

  // 2x2 Modular Grid Ceiling Zone (Right interior zone) using crisp T-bars
  const gridBacking = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.75, 0.04, 3.0)),
    gypsumMat
  );
  gridBacking.position.set(1.42, 0.01, 0);
  ceilingGroup.add(gridBacking);

  const tBarXGeo = trackGeo(new THREE.BoxGeometry(1.75, 0.02, 0.022));
  for (let z = -1.2; z <= 1.21; z += 0.6) {
    const bar = new THREE.Mesh(tBarXGeo, brushedSteelMat);
    bar.position.set(1.42, -0.018, z);
    ceilingGroup.add(bar);
  }
  const tBarZGeo = trackGeo(new THREE.BoxGeometry(0.022, 0.02, 3.0));
  for (let x = 0.85; x <= 2.0; x += 0.57) {
    const bar = new THREE.Mesh(tBarZGeo, brushedSteelMat);
    bar.position.set(x, -0.018, 0);
    ceilingGroup.add(bar);
  }

  tagPart(ceilingGroup, 'gypsum_ceiling');
  root.add(ceilingGroup);

  // =========================================================================
  // 5. FRAMELESS GLASS, SS SPIGOT & ALUMINIUM TERRACE RAILING (Upper Deck)
  // =========================================================================
  const railingGroup = new THREE.Group();
  const railingBasePos = new THREE.Vector3(0, 2.98, 1.72);
  railingGroup.position.copy(railingBasePos);

  // Continuous anodized aluminium top handrail
  const handrail = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.95, 0.048, 0.068)),
    aluminiumMat
  );
  handrail.position.set(0, 0.86, 0);
  handrail.castShadow = true;
  railingGroup.add(handrail);

  // 3 Toughened Glass Balustrade Panels
  const railGlassGeo = trackGeo(new THREE.BoxGeometry(1.56, 0.78, 0.022));
  [-1.62, 0, 1.62].forEach((xPos) => {
    const glassPanel = new THREE.Mesh(railGlassGeo, glassMat);
    glassPanel.position.set(xPos, 0.46, 0);
    glassPanel.renderOrder = 4;
    railingGroup.add(glassPanel);
  });

  // Brushed 304 Stainless Steel Base Spigots (6 precision spigots)
  const spigotBaseGeo = trackGeo(new THREE.CylinderGeometry(0.048, 0.055, 0.04, 16));
  const spigotBodyGeo = trackGeo(new THREE.BoxGeometry(0.046, 0.17, 0.056));
  [-2.15, -1.08, -0.54, 0.54, 1.08, 2.15].forEach((xPos) => {
    const basePlate = new THREE.Mesh(spigotBaseGeo, brushedSteelMat);
    basePlate.position.set(xPos, 0.02, 0);
    const body = new THREE.Mesh(spigotBodyGeo, brushedSteelMat);
    body.position.set(xPos, 0.11, 0);
    body.castShadow = true;
    railingGroup.add(basePlate, body);
  });

  tagPart(railingGroup, 'glass_railing');
  root.add(railingGroup);

  // =========================================================================
  // 6. ACP FACADE CLADDING & MS ARCHITECTURAL LOUVER FIN TOWER (Left Wing)
  // =========================================================================
  const acpGroup = new THREE.Group();
  const acpBasePos = new THREE.Vector3(-2.34, 0.28, -0.2);
  acpGroup.position.copy(acpBasePos);

  // Vertical Metallic Silver ACP Cladding Panel
  const silverCladding = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.32, 3.12, 1.85)),
    acpSilverMat
  );
  silverCladding.position.set(0, 1.56, 0.62);
  silverCladding.castShadow = true;
  silverCladding.receiveShadow = true;
  acpGroup.add(silverCladding);

  // Contrasting Midnight Navy ACP Cladding Panel
  const navyCladding = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.28, 3.12, 1.55)),
    acpNavyMat
  );
  navyCladding.position.set(0.02, 1.56, -1.12);
  navyCladding.castShadow = true;
  navyCladding.receiveShadow = true;
  acpGroup.add(navyCladding);

  // MS Architectural Vertical Louver Fins (6 precision dark steel fins)
  const finGeo = trackGeo(new THREE.BoxGeometry(0.22, 2.68, 0.042));
  for (let i = 0; i < 6; i++) {
    const fin = new THREE.Mesh(finGeo, msSteelMat);
    fin.position.set(-0.22, 1.44, -1.55 + i * 0.24);
    fin.castShadow = true;
    acpGroup.add(fin);
  }

  // Structural MS Rear Corner Column
  const rearColumn = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.18, 2.48, 0.18)),
    msSteelMat
  );
  rearColumn.position.set(4.42, 1.24, -1.58);
  rearColumn.castShadow = true;
  acpGroup.add(rearColumn);

  tagPart(acpGroup, 'acp_cladding');
  root.add(acpGroup);

  // Rear structural glass elevation curtain wall (completes full 360° visual richness)
  const rearWallGroup = new THREE.Group();
  const rearFrame = new THREE.Mesh(
    trackGeo(createExtrudedFrame(4.35, 2.42, 0.08, 0.1)),
    aluminiumMat
  );
  rearFrame.position.set(0.04, 1.49, -1.72);
  rearFrame.castShadow = true;
  rearWallGroup.add(rearFrame);

  [-1.0, 0.04, 1.08].forEach((xPos) => {
    const mullion = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.06, 2.34, 0.09)),
      aluminiumMat
    );
    mullion.position.set(xPos, 1.49, -1.72);
    rearWallGroup.add(mullion);
  });

  const rearGlass = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.24, 2.32, 0.022)),
    tintedGlassMat
  );
  rearGlass.position.set(0.04, 1.49, -1.72);
  rearGlass.renderOrder = 1;
  rearWallGroup.add(rearGlass);
  tagPart(rearWallGroup, 'glass_partition');
  root.add(rearWallGroup);

  // Subtle architectural center elevation offset so visual center aligns cleanly with camera target
  const interactables: THREE.Object3D[] = [
    aluminiumGroup,
    glassPartitionGroup,
    upvcGroup,
    ceilingGroup,
    railingGroup,
    acpGroup,
    rearWallGroup,
  ];

  const setProfileFinish = (finishId: ProfileFinishId) => {
    const finish = PROFILE_FINISHES.find((f) => f.id === finishId) ?? PROFILE_FINISHES[0];
    aluminiumMat.color.setHex(finish.colorHex);
    aluminiumMat.metalness = finish.metalness;
    aluminiumMat.roughness = finish.roughness;
    aluminiumMat.needsUpdate = true;
  };

  const setExplodedFactor = (factor: number) => {
    const t = THREE.MathUtils.clamp(factor, 0, 1);
    aluminiumGroup.position.set(
      aluminiumBasePos.x,
      aluminiumBasePos.y,
      aluminiumBasePos.z + t * 0.95
    );
    glassPartitionGroup.position.set(
      glassPartBasePos.x,
      glassPartBasePos.y + t * 0.18,
      glassPartBasePos.z
    );
    upvcGroup.position.set(upvcBasePos.x + t * 0.9, upvcBasePos.y, upvcBasePos.z);
    ceilingGroup.position.set(ceilingBasePos.x, ceilingBasePos.y + t * 0.85, ceilingBasePos.z);
    railingGroup.position.set(
      railingBasePos.x,
      railingBasePos.y + t * 1.45,
      railingBasePos.z + t * 0.32
    );
    acpGroup.position.set(acpBasePos.x - t * 0.95, acpBasePos.y, acpBasePos.z);
  };

  const setDoorOpenFactor = (factor: number) => {
    const t = THREE.MathUtils.clamp(factor, 0, 1);
    leftLeaf.position.x = leftLeafHomeX + t * 0.62;
    rightLeaf.position.x = rightLeafHomeX - t * 0.62;
  };

  const dispose = () => {
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
  };

  return {
    root,
    interactables,
    setProfileFinish,
    setExplodedFactor,
    setDoorOpenFactor,
    dispose,
  };
}
