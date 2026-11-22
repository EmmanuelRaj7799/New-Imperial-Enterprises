import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  DoorOpen,
  Layers,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import { createArchitecturalTextures } from '../three/architecturalTextures';
import {
  ARCHITECTURAL_PARTS,
  PROFILE_FINISHES,
  buildImperialPavilionModel,
  type ArchitecturalPartInfo,
  type BuiltArchitecturalModel,
  type ProfileFinishId,
} from '../three/architecturalModel';
import { IMAGES } from '../data/businessData';

type CameraPresetId = 'isometric' | 'facade' | 'interior' | 'ceiling' | 'top';

interface CameraPreset {
  id: CameraPresetId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

const SECTION_CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'isometric',
    label: '360° View',
    position: [6.4, 4.1, 6.8],
    target: [0, 1.55, 0],
  },
  {
    id: 'facade',
    label: 'Facade',
    position: [0.4, 2.2, 7.6],
    target: [-0.2, 1.55, 0.2],
  },
  {
    id: 'interior',
    label: 'Glass Bay',
    position: [5.4, 2.5, 4.2],
    target: [0.2, 1.4, -0.2],
  },
  {
    id: 'ceiling',
    label: 'Ceiling & Rail',
    position: [-5.8, 4.7, 5.4],
    target: [0, 2.2, 0.2],
  },
  {
    id: 'top',
    label: 'Plan',
    position: [0.1, 9.8, 2.2],
    target: [0, 1.2, 0],
  },
];

const HERO_CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'isometric',
    label: '360° View',
    position: [7.4, 4.4, 7.8],
    target: [0, 1.45, 0],
  },
  {
    id: 'facade',
    label: 'Facade',
    position: [0.4, 2.3, 8.6],
    target: [-0.15, 1.45, 0.15],
  },
  {
    id: 'interior',
    label: 'Glass Bay',
    position: [6.2, 2.7, 4.9],
    target: [0.2, 1.35, -0.2],
  },
  {
    id: 'ceiling',
    label: 'Ceiling & Rail',
    position: [-6.5, 5.1, 6.2],
    target: [0, 2.1, 0.2],
  },
  {
    id: 'top',
    label: 'Plan',
    position: [0.1, 11.0, 2.5],
    target: [0, 1.1, 0],
  },
];

export interface Interactive3DShowcaseProps {
  variant?: 'section' | 'hero';
}

// Reusable module-scope math helpers (zero GC inside animation loop)
const _pointerNdc = new THREE.Vector2();
const _raycaster = new THREE.Raycaster();
_raycaster.layers.set(1);

function detectSoftwareWebGL(): { supported: boolean; isSoftwareGl: boolean } {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) {
      return { supported: false, isSoftwareGl: true };
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return { supported: true, isSoftwareGl };
  } catch {
    return { supported: false, isSoftwareGl: true };
  }
}

export function Interactive3DShowcase({ variant = 'section' }: Interactive3DShowcaseProps) {
  const isHero = variant === 'hero';
  const cameraPresets = isHero ? HERO_CAMERA_PRESETS : SECTION_CAMERA_PRESETS;
  const canvasMountRef = useRef<HTMLDivElement>(null);

  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [activePreset, setActivePreset] = useState<CameraPresetId>('isometric');
  const [finishId, setFinishId] = useState<ProfileFinishId>('obsidian');
  const [explodedPct, setExplodedPct] = useState(0);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [dockExpanded, setDockExpanded] = useState(!isHero);
  const [selectedPart, setSelectedPart] = useState<ArchitecturalPartInfo>(
    ARCHITECTURAL_PARTS.aluminium_doors
  );

  // Mutable animation targets read inside the single WebGL lifecycle without re-mounting
  const controlTargetsRef = useRef({
    explodedTarget: 0,
    explodedCurrent: 0,
    doorTarget: 0,
    doorCurrent: 0,
    autoRotate: true,
    cameraTransition: null as {
      pos: THREE.Vector3;
      target: THREE.Vector3;
    } | null,
    model: null as BuiltArchitecturalModel | null,
    requestRender: () => {},
  });

  const applyCameraPreset = useCallback(
    (presetId: CameraPresetId) => {
      const preset = cameraPresets.find((p) => p.id === presetId) ?? cameraPresets[0];
      setActivePreset(preset.id);
      controlTargetsRef.current.cameraTransition = {
        pos: new THREE.Vector3(...preset.position),
        target: new THREE.Vector3(...preset.target),
      };
      controlTargetsRef.current.requestRender();
    },
    [cameraPresets]
  );

  const handleFinishChange = useCallback((nextFinish: ProfileFinishId) => {
    setFinishId(nextFinish);
    controlTargetsRef.current.model?.setProfileFinish(nextFinish);
    controlTargetsRef.current.requestRender();
  }, []);

  const handleExplodedChange = useCallback((pct: number) => {
    setExplodedPct(pct);
    controlTargetsRef.current.explodedTarget = pct / 100;
    controlTargetsRef.current.requestRender();
  }, []);

  const handleToggleDoors = useCallback(() => {
    setDoorsOpen((prev) => {
      const next = !prev;
      controlTargetsRef.current.doorTarget = next ? 1 : 0;
      controlTargetsRef.current.requestRender();
      return next;
    });
  }, []);

  const handleToggleAutoRotate = useCallback(() => {
    setAutoRotate((prev) => {
      const next = !prev;
      controlTargetsRef.current.autoRotate = next;
      controlTargetsRef.current.requestRender();
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setFinishId('obsidian');
    setExplodedPct(0);
    setDoorsOpen(false);
    controlTargetsRef.current.model?.setProfileFinish('obsidian');
    controlTargetsRef.current.explodedTarget = 0;
    controlTargetsRef.current.doorTarget = 0;
    applyCameraPreset('isometric');
  }, [applyCameraPreset]);

  // Keyboard shortcut 'H' to toggle HUD visibility cleanly
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'h' || e.key === 'H') {
        setDockExpanded((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Initialize Three.js scene ONCE inside isolated ref container
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const { supported, isSoftwareGl } = detectSoftwareWebGL();
    if (!supported) {
      setWebglUnavailable(true);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isSoftwareGl || prefersReducedMotion) {
      setAutoRotate(false);
      controlTargetsRef.current.autoRotate = false;
    }

    const initialW = Math.max(mount.clientWidth, 320);
    const initialH = Math.max(mount.clientHeight, 360);

    const scene = new THREE.Scene();
    if (!isHero) {
      scene.background = new THREE.Color(0x080b12);
      scene.fog = new THREE.FogExp2(0x080b12, 0.032);
    }

    const defaultPreset = (isHero ? HERO_CAMERA_PRESETS : SECTION_CAMERA_PRESETS)[0];
    const camera = new THREE.PerspectiveCamera(isHero ? 42 : 40, initialW / initialH, 0.1, 100);
    camera.position.set(...defaultPreset.position);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: isHero,
      powerPreference: 'high-performance',
    });
    if (isHero) {
      renderer.setClearColor(0x000000, 0);
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isHero ? 1.18 : 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(initialW, initialH);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';
    mount.appendChild(renderer.domElement);

    // Mandatory studio RoomEnvironment reflections for metals and glass
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    // 3-Point Warm/Cool Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xcbe2ff, 0x101c35, isHero ? 1.05 : 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, isHero ? 2.4 : 2.2);
    keyLight.position.set(7.5, 11, 7.5);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 2;
      keyLight.shadow.camera.far = 26;
      keyLight.shadow.camera.left = -6;
      keyLight.shadow.camera.right = 6;
      keyLight.shadow.camera.top = 6;
      keyLight.shadow.camera.bottom = -6;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00cfff, isHero ? 1.35 : 1.1);
    rimLight.position.set(-8, 5, -7);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x88b4ff, 0.65);
    fillLight.position.set(-5, 3, 6);
    scene.add(fillLight);

    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const softbox = new THREE.RectAreaLight(0xeef6ff, 2.4, 5.5, 2.5);
      softbox.position.set(0, 6.2, 4.5);
      softbox.lookAt(0, 1.5, 0);
      scene.add(softbox);
    }

    // Subtle Architectural Studio Floor (section mode only) & Turntable Polar Grid
    let studioFloor: THREE.Mesh | null = null;
    if (!isHero) {
      studioFloor = new THREE.Mesh(
        new THREE.CircleGeometry(14, 64),
        new THREE.MeshStandardMaterial({
          color: 0x0b1220,
          metalness: 0.2,
          roughness: 0.85,
        })
      );
      studioFloor.rotation.x = -Math.PI / 2;
      studioFloor.position.y = -0.02;
      studioFloor.receiveShadow = !isSoftwareGl;
      scene.add(studioFloor);
    }

    const gridHelper = new THREE.PolarGridHelper(
      isHero ? 5.2 : 7.5,
      16,
      5,
      64,
      isHero ? 0x2a4f7d : 0x1e3358,
      isHero ? 0x172b4d : 0x13223d
    );
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Build Procedural Architectural Pavilion Model
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const textures = createArchitecturalTextures(maxAniso);
    const model = buildImperialPavilionModel(textures, isSoftwareGl, isHero);
    scene.add(model.root);
    controlTargetsRef.current.model = model;

    // 360-degree OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...defaultPreset.target);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.minDistance = isHero ? 5.4 : 4.6;
    controls.maxDistance = isHero ? 14.5 : 13.5;
    controls.minPolarAngle = 0.22;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.autoRotate = !isSoftwareGl && !prefersReducedMotion;
    controls.autoRotateSpeed = isHero ? 0.95 : 0.85;
    controls.update();

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Render scheduling (on-demand + smooth transition settling + safe software WebGL pacing)
    let disposed = false;
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        if (disposed) return;
        renderDirty = false;
        const delta = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        const targets = controlTargetsRef.current;
        let stillAnimating = false;

        // Smoothly damp exploded view separation
        if (Math.abs(targets.explodedCurrent - targets.explodedTarget) > 0.001) {
          targets.explodedCurrent = THREE.MathUtils.damp(
            targets.explodedCurrent,
            targets.explodedTarget,
            7,
            delta
          );
          model.setExplodedFactor(targets.explodedCurrent);
          stillAnimating = true;
        } else if (targets.explodedCurrent !== targets.explodedTarget) {
          targets.explodedCurrent = targets.explodedTarget;
          model.setExplodedFactor(targets.explodedCurrent);
        }

        // Smoothly damp sliding French doors
        if (Math.abs(targets.doorCurrent - targets.doorTarget) > 0.001) {
          targets.doorCurrent = THREE.MathUtils.damp(
            targets.doorCurrent,
            targets.doorTarget,
            6.5,
            delta
          );
          model.setDoorOpenFactor(targets.doorCurrent);
          stillAnimating = true;
        } else if (targets.doorCurrent !== targets.doorTarget) {
          targets.doorCurrent = targets.doorTarget;
          model.setDoorOpenFactor(targets.doorCurrent);
        }

        // Smoothly damp scripted camera preset transitions
        if (targets.cameraTransition) {
          camera.position.x = THREE.MathUtils.damp(
            camera.position.x,
            targets.cameraTransition.pos.x,
            6,
            delta
          );
          camera.position.y = THREE.MathUtils.damp(
            camera.position.y,
            targets.cameraTransition.pos.y,
            6,
            delta
          );
          camera.position.z = THREE.MathUtils.damp(
            camera.position.z,
            targets.cameraTransition.pos.z,
            6,
            delta
          );
          controls.target.x = THREE.MathUtils.damp(
            controls.target.x,
            targets.cameraTransition.target.x,
            6,
            delta
          );
          controls.target.y = THREE.MathUtils.damp(
            controls.target.y,
            targets.cameraTransition.target.y,
            6,
            delta
          );
          controls.target.z = THREE.MathUtils.damp(
            controls.target.z,
            targets.cameraTransition.target.z,
            6,
            delta
          );

          if (
            camera.position.distanceTo(targets.cameraTransition.pos) < 0.04 &&
            controls.target.distanceTo(targets.cameraTransition.target) < 0.04
          ) {
            camera.position.copy(targets.cameraTransition.pos);
            controls.target.copy(targets.cameraTransition.target);
            targets.cameraTransition = null;
          } else {
            stillAnimating = true;
          }
        }

        const shouldSpin = !isSoftwareGl && targets.autoRotate;
        controls.autoRotate = shouldSpin;
        controls.update();

        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (!disposed && (renderDirty || stillAnimating || shouldSpin)) {
            requestRender();
          }
        };

        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    }

    controlTargetsRef.current.requestRender = requestRender;

    // Cancel camera preset transitions whenever user starts manually orbiting
    const onControlStart = () => {
      controlTargetsRef.current.cameraTransition = null;
      requestRender();
    };
    const onControlChange = () => {
      requestRender();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    // Interactive click-to-inspect raycasting (distinguishing click vs orbit drag)
    let pointerDownX = 0;
    let pointerDownY = 0;
    let lastHoverCheck = 0;

    const onPointerDown = (e: PointerEvent) => {
      pointerDownX = e.clientX;
      pointerDownY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 65) return;
      lastHoverCheck = now;
      const rect = renderer.domElement.getBoundingClientRect();
      _pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      _raycaster.setFromCamera(_pointerNdc, camera);
      const hits = _raycaster.intersectObjects(model.interactables, true);
      renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
    };

    const onPointerUp = (e: PointerEvent) => {
      const moveDist = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
      if (moveDist > 6) return; // User orbited rather than clicking a part
      const rect = renderer.domElement.getBoundingClientRect();
      _pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      _raycaster.setFromCamera(_pointerNdc, camera);
      const hits = _raycaster.intersectObjects(model.interactables, true);
      if (hits.length > 0) {
        const partId = hits[0].object.userData.partId as string | undefined;
        if (partId && ARCHITECTURAL_PARTS[partId]) {
          setSelectedPart(ARCHITECTURAL_PARTS[partId]);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // WebGL Context Loss Safety
    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
      requestRender();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    // Responsive ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(Math.floor(entry.contentRect.width), 280);
        const h = Math.max(Math.floor(entry.contentRect.height), 320);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        requestRender();
      }
    });
    resizeObserver.observe(mount);

    // Initial render
    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      controls.dispose();

      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      model.dispose();
      textures.dispose();
      envRT.dispose();
      if (studioFloor) {
        studioFloor.geometry.dispose();
        (studioFloor.material as THREE.Material).dispose();
      }
      gridHelper.geometry.dispose();
      (gridHelper.material as THREE.Material).dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      controlTargetsRef.current.model = null;
    };
  }, [isHero]);

  const handleSelectPart = useCallback(
    (part: ArchitecturalPartInfo) => {
      setSelectedPart(part);
      if (part.id === 'aluminium_doors') applyCameraPreset('facade');
      else if (part.id === 'glass_partition' || part.id === 'upvc_window')
        applyCameraPreset('interior');
      else if (part.id === 'gypsum_ceiling' || part.id === 'glass_railing')
        applyCameraPreset('ceiling');
      else applyCameraPreset('isometric');
    },
    [applyCameraPreset]
  );

  if (isHero) {
    return (
      <div
        aria-label="Interactive 360-degree 3D Architectural Pavilion Model"
        className="relative w-full h-[430px] sm:h-[480px] lg:h-[520px] xl:h-[550px] rounded-2xl overflow-hidden border border-white/14 bg-[radial-gradient(ellipse_at_center,rgba(12,21,40,0.78)_0%,rgba(8,11,18,0.52)_62%,rgba(8,11,18,0.28)_100%)] shadow-[0_24px_70px_rgba(0,0,0,0.52)]"
      >
        {/* Subtle Architectural Blueprint Corner Registration Ticks */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2.5 left-2.5 z-10 w-3.5 h-3.5 border-t border-l border-[#D6B36A]/70"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2.5 right-2.5 z-10 w-3.5 h-3.5 border-t border-r border-[#00CFFF]/60"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2.5 left-2.5 z-10 w-3.5 h-3.5 border-b border-l border-[#00CFFF]/60"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2.5 right-2.5 z-10 w-3.5 h-3.5 border-b border-r border-[#D6B36A]/70"
        />

        {/* Isolated WebGL Canvas Mount */}
        {!webglUnavailable ? (
          <div ref={canvasMountRef} className="w-full h-full" />
        ) : (
          <div className="relative w-full h-full">
            <img
              src={IMAGES.heroFacade}
              alt="Architectural aluminium and glass elevation preview"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-[#080B12]/70 flex flex-col items-center justify-center p-6 text-center">
              <p className="font-display text-base font-bold text-white">
                360° Interactive Model Requires WebGL
              </p>
              <p className="mt-1 text-xs text-[#C8D0DA] max-w-xs">
                Explore our aluminium, glass, UPVC, ceiling, and metalwork divisions below.
              </p>
            </div>
          </div>
        )}

        {contextLost && (
          <div className="absolute inset-0 z-30 bg-[#080B12]/90 flex items-center justify-center p-6 text-center">
            <div>
              <p className="font-display text-sm font-bold text-white">Restoring 3D View</p>
              <p className="mt-1 text-xs text-[#C8D0DA]">Reloading architectural model...</p>
            </div>
          </div>
        )}

        {/* Compact Top-Left Selected Component Badge (No backdrop-filter over WebGL) */}
        {!webglUnavailable && (
          <div className="pointer-events-none absolute top-3.5 left-3.5 right-3.5 z-10 flex items-start justify-between gap-2">
            <div className="pointer-events-auto max-w-[265px] rounded-lg bg-[#080B12]/88 border border-white/14 px-3 py-2">
              <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.08em] text-[#D6B36A]">
                <span>{selectedPart.category}</span>
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <p className="font-display text-xs font-bold text-white truncate">
                  {selectedPart.title}
                </p>
                <Link
                  to={selectedPart.route}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00CFFF] hover:text-white transition-colors whitespace-nowrap shrink-0"
                >
                  <span>View</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-[#080B12]/82 border border-white/12 px-2.5 py-1.5 text-[10px] font-medium text-[#C8D0DA]">
              <span>360° Drag</span>
              <span aria-hidden="true" className="text-[#D6B36A]">
                ·
              </span>
              <span>Click Parts</span>
            </div>
          </div>
        )}

        {/* Sleek Bottom Control Dock (Zero Side-Panel Occlusion, No backdrop-filter) */}
        {!webglUnavailable && (
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex flex-col gap-2">
            {/* Optional Expanded Camera Views & Architectural Parts Drawer */}
            {dockExpanded && (
              <div className="pointer-events-auto rounded-xl bg-[#080B12]/94 border border-white/14 p-2.5 shadow-xl space-y-2">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {cameraPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyCameraPreset(preset.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activePreset === preset.id
                          ? 'bg-[#1769FF] text-white'
                          : 'bg-white/6 text-[#C8D0DA] hover:bg-white/12 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-white/10">
                  {Object.values(ARCHITECTURAL_PARTS).map((part) => {
                    const active = selectedPart.id === part.id;
                    return (
                      <button
                        key={part.id}
                        type="button"
                        onClick={() => handleSelectPart(part)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                          active
                            ? 'bg-[#101C35] border-[#00CFFF]/60 text-white'
                            : 'bg-white/[0.04] border-white/10 text-[#C8D0DA] hover:bg-white/[0.1] hover:text-white'
                        }`}
                      >
                        {part.category}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Primary Single-Row Compact Control Bar */}
            <div className="pointer-events-auto rounded-xl bg-[#080B12]/92 border border-white/14 px-3 py-2 shadow-[0_14px_35px_rgba(0,0,0,0.55)] flex flex-wrap items-center justify-between gap-2">
              {/* Finish Swatches */}
              <div className="flex items-center gap-1.5 shrink-0">
                {PROFILE_FINISHES.map((finish) => {
                  const active = finishId === finish.id;
                  return (
                    <button
                      key={finish.id}
                      type="button"
                      onClick={() => handleFinishChange(finish.id)}
                      title={finish.label}
                      aria-label={`Select ${finish.label} finish`}
                      aria-pressed={active}
                      className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                        active
                          ? 'border-[#00CFFF] scale-110'
                          : 'border-white/25 hover:border-white/60'
                      }`}
                      style={{ backgroundColor: finish.swatch }}
                    />
                  );
                })}
              </div>

              {/* Exploded Slider */}
              <label className="flex items-center gap-1.5 text-[11px] font-medium text-[#C8D0DA] whitespace-nowrap">
                <Layers className="w-3.5 h-3.5 text-[#D6B36A] shrink-0" aria-hidden="true" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={explodedPct}
                  onChange={(e) => handleExplodedChange(Number(e.target.value))}
                  aria-label="Exploded architectural view separation"
                  className="w-16 sm:w-20 accent-[#00CFFF] cursor-pointer"
                />
                <span className="font-mono text-[10px] text-white w-7 text-right tabular-nums">
                  {explodedPct}%
                </span>
              </label>

              {/* Quick Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleDoors}
                  aria-pressed={doorsOpen}
                  title={doorsOpen ? 'Close French sliding doors' : 'Slide French doors open'}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    doorsOpen
                      ? 'bg-[#00CFFF] text-[#080B12]'
                      : 'bg-white/8 text-[#C8D0DA] hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <DoorOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">{doorsOpen ? 'Close' : 'Doors'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDockExpanded((prev) => !prev)}
                  aria-expanded={dockExpanded}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    dockExpanded
                      ? 'bg-[#1769FF] text-white'
                      : 'bg-white/8 text-[#C8D0DA] hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <span>Views</span>
                  {dockExpanded ? (
                    <ChevronDown className="w-3 h-3" aria-hidden="true" />
                  ) : (
                    <ChevronUp className="w-3 h-3" aria-hidden="true" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleToggleAutoRotate}
                  aria-label={autoRotate ? 'Pause 360 rotation' : 'Play 360 rotation'}
                  title={autoRotate ? 'Pause 360° orbit' : 'Auto-orbit 360°'}
                  className="w-7 h-7 rounded-md bg-white/8 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  {autoRotate ? (
                    <Pause className="w-3 h-3 text-[#00CFFF]" />
                  ) : (
                    <Play className="w-3 h-3 text-[#C8D0DA]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset 3D view"
                  title="Reset 3D view"
                  className="w-7 h-7 rounded-md bg-white/8 hover:bg-white/15 text-[#C8D0DA] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <section
      aria-label="Interactive 360-degree 3D Architectural Product Model"
      className="bg-[#080B12] text-white py-20 lg:py-24 border-y border-white/10"
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10">
        {/* Section Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#D6B36A] mb-3">
              Interactive 360° Architectural Studio
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Inspect every fabrication layer in real-time 3D.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#C8D0DA] leading-relaxed">
              Drag to orbit 360°, scroll to zoom, switch anodized aluminium finishes, slide the
              French doors open, or separate the architectural layers to explore our aluminium,
              glass, UPVC, ceiling, railing, and ACP work.
            </p>
          </div>

          <div className="text-xs text-[#C8D0DA]/75 flex flex-wrap items-center gap-x-3 gap-y-1 shrink-0">
            <span>Drag: Rotate 360°</span>
            <span aria-hidden="true">·</span>
            <span>Scroll: Zoom</span>
            <span aria-hidden="true">·</span>
            <span>Click Component: Inspect</span>
          </div>
        </div>

        {/* Full-Width Unobstructed 3D Viewport Container */}
        <div className="relative w-full h-[540px] sm:h-[600px] lg:h-[660px] rounded-2xl overflow-hidden border border-white/12 bg-[#080B12] shadow-[0_28px_80px_rgba(0,0,0,0.55)]">
          {/* Isolated WebGL Canvas Mount (Never re-mounted by React HUD updates) */}
          {!webglUnavailable ? (
            <div ref={canvasMountRef} className="w-full h-full" />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={IMAGES.heroFacade}
                alt="Architectural aluminium and glass elevation preview"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-[#080B12]/65 flex flex-col items-center justify-center p-8 text-center">
                <p className="font-display text-xl font-bold text-white">
                  Interactive 3D Viewport Requires WebGL
                </p>
                <p className="mt-2 text-sm text-[#C8D0DA] max-w-md">
                  Your current browser environment has WebGL disabled. Explore our full service
                  divisions and architectural gallery below.
                </p>
              </div>
            </div>
          )}

          {contextLost && (
            <div className="absolute inset-0 z-30 bg-[#080B12]/90 flex items-center justify-center p-6 text-center">
              <div>
                <p className="font-display text-lg font-bold text-white">
                  Restoring 3D Graphics Context
                </p>
                <p className="mt-1 text-xs text-[#C8D0DA]">
                  Please wait a moment while the architectural model reloads.
                </p>
              </div>
            </div>
          )}

          {/* Minimal Top-Left Active Part Spec Overlay (No backdrop-filter over WebGL) */}
          {!webglUnavailable && (
            <div className="pointer-events-auto absolute top-4 left-4 z-10 max-w-[300px] sm:max-w-[330px] rounded-xl bg-[#0B1221]/92 border border-white/14 px-4 py-3.5 shadow-lg">
              <div className="flex items-center justify-between gap-3 text-[11px] font-medium text-[#D6B36A]">
                <span>{selectedPart.category}</span>
                <span className="text-[#C8D0DA]/70">Selected Part</span>
              </div>
              <h3 className="mt-1 font-display text-sm sm:text-base font-bold text-white leading-snug">
                {selectedPart.title}
              </h3>
              <p className="mt-1 text-xs text-[#C8D0DA]/85 leading-relaxed">
                {selectedPart.description}
              </p>
              <Link
                to={selectedPart.route}
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#00CFFF] hover:text-white transition-colors"
              >
                <span>Explore {selectedPart.category}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}

          {/* Unified Collapsible Bottom Control Dock (Zero Side-Panel Occlusion, No backdrop-filter) */}
          {!webglUnavailable && (
            <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex flex-col items-center px-3 sm:px-5">
              {/* Collapse / Expand Handle */}
              <button
                type="button"
                onClick={() => setDockExpanded((prev) => !prev)}
                aria-expanded={dockExpanded}
                className="pointer-events-auto mb-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0B1221]/94 hover:bg-[#101C35] border border-white/15 text-[11px] font-semibold text-[#C8D0DA] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {dockExpanded ? (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 text-[#00CFFF]" aria-hidden="true" />
                    <span>Hide Controls</span>
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 text-[#00CFFF]" aria-hidden="true" />
                    <span>Show 3D Controls</span>
                  </>
                )}
              </button>

              {dockExpanded && (
                <div className="pointer-events-auto w-full max-w-[920px] rounded-xl bg-[#0B1221]/95 border border-white/15 px-4 py-3.5 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
                    {/* Camera View Presets */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-0.5 lg:pb-0">
                      {cameraPresets.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => applyCameraPreset(preset.id)}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            activePreset === preset.id
                              ? 'bg-[#1769FF] text-white'
                              : 'bg-white/6 text-[#C8D0DA] hover:bg-white/12 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Profile Finish Swatches */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-medium text-[#C8D0DA]/75 whitespace-nowrap">
                        Finish
                      </span>
                      <div className="flex items-center gap-1.5">
                        {PROFILE_FINISHES.map((finish) => {
                          const active = finishId === finish.id;
                          return (
                            <button
                              key={finish.id}
                              type="button"
                              onClick={() => handleFinishChange(finish.id)}
                              title={finish.label}
                              aria-label={`Select ${finish.label} aluminium finish`}
                              aria-pressed={active}
                              className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                                active
                                  ? 'border-[#00CFFF] scale-110'
                                  : 'border-white/25 hover:border-white/60'
                              }`}
                              style={{ backgroundColor: finish.swatch }}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Exploded Assembly Slider + Action Buttons */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                      <label className="flex items-center gap-2 text-[11px] font-medium text-[#C8D0DA] whitespace-nowrap">
                        <Layers className="w-3.5 h-3.5 text-[#D6B36A]" aria-hidden="true" />
                        <span>Explode</span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={explodedPct}
                          onChange={(e) => handleExplodedChange(Number(e.target.value))}
                          aria-label="Exploded architectural view separation"
                          className="w-20 sm:w-24 accent-[#00CFFF] cursor-pointer"
                        />
                        <span className="font-mono text-[11px] text-white w-8 text-right tabular-nums">
                          {explodedPct}%
                        </span>
                      </label>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleToggleDoors}
                          aria-pressed={doorsOpen}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            doorsOpen
                              ? 'bg-[#00CFFF] text-[#080B12]'
                              : 'bg-white/8 text-[#C8D0DA] hover:bg-white/15 hover:text-white'
                          }`}
                        >
                          <DoorOpen className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{doorsOpen ? 'Close Doors' : 'Slide Doors'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleToggleAutoRotate}
                          aria-label={autoRotate ? 'Pause 360 rotation' : 'Play 360 rotation'}
                          title={autoRotate ? 'Pause 360° orbit' : 'Auto-orbit 360°'}
                          className="w-8 h-8 rounded-md bg-white/8 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        >
                          {autoRotate ? (
                            <Pause className="w-3.5 h-3.5 text-[#00CFFF]" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-[#C8D0DA]" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleReset}
                          aria-label="Reset 3D view"
                          title="Reset 3D model view"
                          className="w-8 h-8 rounded-md bg-white/8 hover:bg-white/15 text-[#C8D0DA] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Interactive Architectural Component Selector Strip (Clean Single-Line Buttons) */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {Object.values(ARCHITECTURAL_PARTS).map((part) => {
              const active = selectedPart.id === part.id;
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => handleSelectPart(part)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                    active
                      ? 'bg-[#101C35] border-[#00CFFF]/60 text-white'
                      : 'bg-white/[0.03] border-white/10 text-[#C8D0DA] hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {part.category}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
