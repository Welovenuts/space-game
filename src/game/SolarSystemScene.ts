import * as THREE from 'three';
import { PLANETS_DATA, SPACE_SAMPLES } from '../data/solarData';
import { PlanetData, SpaceSample } from '../types/solar';
import {
  createSunTexture,
  createMercuryTexture,
  createVenusTexture,
  createEarthTexture,
  createMarsTexture,
  createJupiterTexture,
  createSaturnTexture,
  createSaturnRingTexture,
  createUranusTexture,
  createNeptuneTexture,
  createPlutoTexture,
  createAsteroidTexture
} from '../utils/textures';
import { sound } from '../utils/audio';

export type CameraViewMode = 'ship' | 'orbit' | 'planet_focus';

export interface SceneCallbacks {
  onPlanetSelect: (planet: PlanetData) => void;
  onSampleCollect: (sample: SpaceSample) => void;
  onShipTelemetry: (speed: number, distanceToTarget: number, targetName: string) => void;
}

export class SolarSystemScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animFrameId: number | null = null;
  private clock: THREE.Clock;

  // Visual collections
  private planetMeshes: Map<string, { mesh: THREE.Mesh; pivot: THREE.Group; data: PlanetData; ringMesh?: THREE.Mesh }> = new Map();
  private orbitLines: THREE.Line[] = [];
  private sunMesh: THREE.Mesh | null = null;
  private sunGlow: THREE.Mesh | null = null;
  private earthMoonMesh: THREE.Mesh | null = null;
  private asteroidBelt: THREE.InstancedMesh | null = null;
  private sampleObjects: Map<string, { group: THREE.Group; sample: SpaceSample }> = new Map();

  // Spaceship
  private shipGroup: THREE.Group = new THREE.Group();
  private shipThrusterGlow: THREE.Mesh | null = null;
  private shipVelocity: THREE.Vector3 = new THREE.Vector3();
  private shipSpeed: number = 0;
  private shipYaw: number = 0;
  private shipPitch: number = 0;
  private shipRoll: number = 0;
  private targetSpeed: number = 0;
  private isBoosting: boolean = false;
  private autopilotActive: boolean = false;
  private autopilotTarget: THREE.Vector3 | null = null;

  // Camera & Interaction
  private viewMode: CameraViewMode = 'ship';
  private focusedPlanetId: string | null = null;
  private cameraOffset: THREE.Vector3 = new THREE.Vector3(0, 5, 14);
  private orbitControls = {
    theta: 0,
    phi: Math.PI / 3,
    radius: 90,
    target: new THREE.Vector3(0, 0, 0),
    isDragging: false,
    lastX: 0,
    lastY: 0
  };

  // Raycasting
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mousePos: THREE.Vector2 = new THREE.Vector2();

  // Controls input state
  public inputState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
    boost: false
  };

  // Game loop configs
  public timeSpeedMultiplier: number = 1.0;
  public showOrbitPaths: boolean = true;
  private callbacks: SceneCallbacks;

  // Pre-allocated vectors for GC discipline
  private _v1 = new THREE.Vector3();
  private _v2 = new THREE.Vector3();
  private _targetCamPos = new THREE.Vector3();
  private _targetCamLookAt = new THREE.Vector3();

  constructor(container: HTMLElement, callbacks: SceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x020617, 0.0018);

    // Camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 2000);
    this.camera.position.set(0, 40, 100);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    // Build World
    this.setupLighting();
    this.setupStarfield();
    this.setupSun();
    this.setupPlanets();
    this.setupAsteroidBelt();
    this.setupSpaceship();
    this.setupSampleCollectibles();
    this.bindEvents();

    // Start loop
    this.animate();
  }

  private setupLighting() {
    // Center Sun Light (Point Light)
    const sunLight = new THREE.PointLight(0xfffbeb, 3.5, 400, 0.8);
    sunLight.position.set(0, 0, 0);
    this.scene.add(sunLight);

    // Warm key fill
    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.45);
    this.scene.add(ambientLight);

    // Cool rim hemisphere light
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.6);
    this.scene.add(hemiLight);
  }

  private setupStarfield() {
    // 1. Distant Starfield (Instanced Points)
    const starCount = 3500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Sphere distribution around perimeter
      const radius = 800 + Math.random() * 400;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const sinPhi = Math.sin(phi);

      starPositions[i * 3] = radius * sinPhi * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * sinPhi * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      // Star color tints (blue-white, gold, cyan)
      const colorType = Math.random();
      if (colorType > 0.8) {
        starColors[i * 3] = 0.6; starColors[i * 3 + 1] = 0.8; starColors[i * 3 + 2] = 1.0;
      } else if (colorType > 0.6) {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.9; starColors[i * 3 + 2] = 0.7;
      } else {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 1.0; starColors[i * 3 + 2] = 1.0;
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(starField);

    // 2. Cosmic Nebula Clouds (Procedural glowing sprite planes in distant space)
    const nebulaColors = [0x1e3a8a, 0x4c1d95, 0x047857];
    nebulaColors.forEach((col, idx) => {
      const nebulaGeo = new THREE.PlaneGeometry(350, 350);
      const nebulaMat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const nebulaMesh = new THREE.Mesh(nebulaGeo, nebulaMat);
      nebulaMesh.position.set(
        Math.cos(idx * 2) * 500,
        (idx - 1) * 120,
        Math.sin(idx * 2) * 500
      );
      nebulaMesh.lookAt(0, 0, 0);
      this.scene.add(nebulaMesh);
    });
  }

  private setupSun() {
    const sunData = PLANETS_DATA.find(p => p.id === 'sun')!;
    const sunGeo = new THREE.SphereGeometry(sunData.displayRadius, 48, 48);
    const sunTex = createSunTexture();
    sunTex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

    const sunMat = new THREE.MeshBasicMaterial({
      map: sunTex,
      color: 0xfff7ed
    });

    this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
    this.sunMesh.userData = { planetData: sunData };
    this.scene.add(this.sunMesh);

    // Outer corona glow
    const glowGeo = new THREE.SphereGeometry(sunData.displayRadius * 1.25, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.28,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.sunGlow = new THREE.Mesh(glowGeo, glowMat);
    this.sunMesh.add(this.sunGlow);
  }

  private setupPlanets() {
    const textureMap: Record<string, () => THREE.CanvasTexture> = {
      mercury: createMercuryTexture,
      venus: createVenusTexture,
      earth: createEarthTexture,
      mars: createMarsTexture,
      jupiter: createJupiterTexture,
      saturn: createSaturnTexture,
      uranus: createUranusTexture,
      neptune: createNeptuneTexture,
      pluto: createPlutoTexture
    };

    PLANETS_DATA.forEach(data => {
      if (data.id === 'sun') return;

      // Orbit Pivot container (rotates around (0,0,0) Sun)
      const orbitPivot = new THREE.Group();
      this.scene.add(orbitPivot);

      // Random starting orbital angle for realism
      const startAngle = (data.distanceAU * 3.7) % (Math.PI * 2);
      orbitPivot.rotation.y = startAngle;

      // Planet Mesh
      const geo = new THREE.SphereGeometry(data.displayRadius, 36, 36);
      const texGen = textureMap[data.id];
      const tex = texGen ? texGen() : null;
      if (tex) tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        color: 0xffffff,
        roughness: data.type === 'gas_giant' ? 0.7 : 0.85,
        metalness: 0.05
      });

      const planetMesh = new THREE.Mesh(geo, mat);
      planetMesh.position.set(data.displayDistance, 0, 0);
      planetMesh.rotation.z = THREE.MathUtils.degToRad(data.axialTiltDeg);
      planetMesh.userData = { planetData: data };
      orbitPivot.add(planetMesh);

      // Rings (Saturn & Uranus)
      let ringMesh: THREE.Mesh | undefined;
      if (data.hasRings && data.ringInnerRadius && data.ringOuterRadius) {
        const ringGeo = new THREE.RingGeometry(data.ringInnerRadius, data.ringOuterRadius, 64);
        // Align ring to planet equator
        ringGeo.rotateX(Math.PI / 2);

        let ringTex: THREE.CanvasTexture | null = null;
        if (data.id === 'saturn') {
          ringTex = createSaturnRingTexture();
        }

        const ringMat = new THREE.MeshStandardMaterial({
          map: ringTex,
          color: data.id === 'uranus' ? 0xa5f3fc : 0xffffff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: data.id === 'uranus' ? 0.45 : 0.9,
          roughness: 0.6
        });

        ringMesh = new THREE.Mesh(ringGeo, ringMat);
        planetMesh.add(ringMesh);
      }

      // Moon for Earth
      if (data.id === 'earth') {
        const moonGeo = new THREE.SphereGeometry(0.5, 24, 24);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 });
        this.earthMoonMesh = new THREE.Mesh(moonGeo, moonMat);
        this.earthMoonMesh.position.set(3.5, 0.5, 0);
        planetMesh.add(this.earthMoonMesh);
      }

      // Orbit Path Line
      const orbitCurve = new THREE.EllipseCurve(0, 0, data.displayDistance, data.displayDistance, 0, Math.PI * 2, false, 0);
      const points = orbitCurve.getPoints(120);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, 0, p.y))
      );
      const orbitMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(data.color),
        transparent: true,
        opacity: 0.22
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      this.scene.add(orbitLine);
      this.orbitLines.push(orbitLine);

      this.planetMeshes.set(data.id, {
        mesh: planetMesh,
        pivot: orbitPivot,
        data,
        ringMesh
      });
    });
  }

  private setupAsteroidBelt() {
    // 700 Instanced Asteroids between Mars (45) and Jupiter (64)
    const count = 650;
    const asteroidGeo = new THREE.DodecahedronGeometry(0.35, 1);
    const asteroidTex = createAsteroidTexture();
    const asteroidMat = new THREE.MeshStandardMaterial({
      map: asteroidTex,
      roughness: 0.9,
      metalness: 0.1
    });

    this.asteroidBelt = new THREE.InstancedMesh(asteroidGeo, asteroidMat, count);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.1;
      const radius = 52 + (Math.random() - 0.5) * 7.5;
      const height = (Math.random() - 0.5) * 4.0;
      const scale = 0.6 + Math.random() * 1.2;

      dummy.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      this.asteroidBelt.setMatrixAt(i, dummy.matrix);
    }

    this.asteroidBelt.instanceMatrix.needsUpdate = true;
    this.asteroidBelt.computeBoundingSphere();
    this.scene.add(this.asteroidBelt);
  }

  private setupSpaceship() {
    // 6-Part Composite Procedural Sci-Fi Spaceship
    // 1. Primary Fuselage
    const hullGeo = new THREE.ConeGeometry(0.7, 3.2, 5);
    hullGeo.rotateX(Math.PI / 2);
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Sky blue alloy
      metalness: 0.85,
      roughness: 0.25
    });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    this.shipGroup.add(hull);

    // 2. Cockpit Canopy Visor (Glass)
    const canopyGeo = new THREE.CapsuleGeometry(0.35, 0.8, 4, 12);
    canopyGeo.rotateX(Math.PI / 2);
    const canopyMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.8,
      thickness: 0.6,
      clearcoat: 1.0
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 0.3, 0.3);
    this.shipGroup.add(canopy);

    // 3. Swept Delta Wings (Left & Right)
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(2.2, -1.2);
    wingShape.lineTo(2.0, -1.6);
    wingShape.lineTo(0, -0.8);
    wingShape.closePath();

    const wingExtrude = new THREE.ExtrudeGeometry(wingShape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 });
    wingExtrude.rotateX(Math.PI / 2);

    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.7,
      roughness: 0.35
    });

    const leftWing = new THREE.Mesh(wingExtrude, wingMat);
    leftWing.position.set(0.3, 0, 0.2);
    this.shipGroup.add(leftWing);

    const rightWing = leftWing.clone();
    rightWing.scale.set(-1, 1, 1);
    rightWing.position.set(-0.3, 0, 0.2);
    this.shipGroup.add(rightWing);

    // 4. Dual Ion Thruster Nacelles
    const nacelleGeo = new THREE.CylinderGeometry(0.2, 0.25, 1.2, 12);
    nacelleGeo.rotateX(Math.PI / 2);
    const nacelleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });

    const leftNacelle = new THREE.Mesh(nacelleGeo, nacelleMat);
    leftNacelle.position.set(0.8, 0, -1.2);
    this.shipGroup.add(leftNacelle);

    const rightNacelle = leftNacelle.clone();
    rightNacelle.position.set(-0.8, 0, -1.2);
    this.shipGroup.add(rightNacelle);

    // 5. Plasma Exhaust Thruster Glow
    const glowGeo = new THREE.ConeGeometry(0.35, 1.4, 12);
    glowGeo.rotateX(-Math.PI / 2);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    this.shipThrusterGlow = new THREE.Mesh(glowGeo, glowMat);
    this.shipThrusterGlow.position.set(0, 0, -2.1);
    this.shipGroup.add(this.shipThrusterGlow);

    // Initial position near Earth
    this.shipGroup.position.set(38, 2, 8);
    this.shipGroup.lookAt(0, 0, 0);
    this.scene.add(this.shipGroup);
  }

  private setupSampleCollectibles() {
    SPACE_SAMPLES.forEach(sample => {
      const sampleGroup = new THREE.Group();
      sampleGroup.position.set(...sample.position);

      // Floating crystal octahedron
      const crystalGeo = new THREE.OctahedronGeometry(1.2, 0);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(sample.color),
        emissive: new THREE.Color(sample.color),
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.7
      });
      const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
      sampleGroup.add(crystalMesh);

      // Rotating beacon rings
      const ringGeo = new THREE.TorusGeometry(2.0, 0.08, 12, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(sample.color),
        transparent: true,
        opacity: 0.6
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      sampleGroup.add(ring);

      sampleGroup.userData = { sample };
      this.scene.add(sampleGroup);
      this.sampleObjects.set(sample.id, { group: sampleGroup, sample });
    });
  }

  public removeSampleFromScene(sampleId: string) {
    const item = this.sampleObjects.get(sampleId);
    if (item) {
      this.scene.remove(item.group);
      this.sampleObjects.delete(sampleId);
    }
  }

  // --- Interaction & Controls ---
  private bindEvents() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

    const canvas = this.renderer.domElement;
    canvas.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    canvas.addEventListener('wheel', this.onWheel, { passive: true });

    // Mobile touch support
    canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
    window.addEventListener('touchend', this.onTouchEnd);
  }

  private onResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (['ArrowUp', 'KeyW'].includes(e.code)) this.inputState.forward = true;
    if (['ArrowDown', 'KeyS'].includes(e.code)) this.inputState.backward = true;
    if (['ArrowLeft', 'KeyA'].includes(e.code)) this.inputState.left = true;
    if (['ArrowRight', 'KeyD'].includes(e.code)) this.inputState.right = true;
    if (['KeyE', 'KeyR'].includes(e.code)) this.inputState.up = true;
    if (['KeyQ', 'KeyF'].includes(e.code)) this.inputState.down = true;
    if (e.code === 'Space') {
      this.inputState.boost = true;
      e.preventDefault();
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    if (['ArrowUp', 'KeyW'].includes(e.code)) this.inputState.forward = false;
    if (['ArrowDown', 'KeyS'].includes(e.code)) this.inputState.backward = false;
    if (['ArrowLeft', 'KeyA'].includes(e.code)) this.inputState.left = false;
    if (['ArrowRight', 'KeyD'].includes(e.code)) this.inputState.right = false;
    if (['KeyE', 'KeyR'].includes(e.code)) this.inputState.up = false;
    if (['KeyQ', 'KeyF'].includes(e.code)) this.inputState.down = false;
    if (e.code === 'Space') this.inputState.boost = false;
  };

  private onMouseDown = (e: MouseEvent) => {
    if (e.button === 0) {
      this.orbitControls.isDragging = true;
      this.orbitControls.lastX = e.clientX;
      this.orbitControls.lastY = e.clientY;

      // Check click raycast on planets
      this.checkPlanetClick(e.clientX, e.clientY);
    }
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.orbitControls.isDragging && (this.viewMode === 'orbit' || this.viewMode === 'planet_focus')) {
      const deltaX = e.clientX - this.orbitControls.lastX;
      const deltaY = e.clientY - this.orbitControls.lastY;
      this.orbitControls.lastX = e.clientX;
      this.orbitControls.lastY = e.clientY;

      this.orbitControls.theta -= deltaX * 0.006;
      this.orbitControls.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.orbitControls.phi - deltaY * 0.006));
    }
  };

  private onMouseUp = () => {
    this.orbitControls.isDragging = false;
  };

  private onWheel = (e: WheelEvent) => {
    if (this.viewMode === 'orbit' || this.viewMode === 'planet_focus') {
      this.orbitControls.radius = Math.max(12, Math.min(450, this.orbitControls.radius + e.deltaY * 0.1));
    }
  };

  private onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      this.orbitControls.isDragging = true;
      this.orbitControls.lastX = e.touches[0].clientX;
      this.orbitControls.lastY = e.touches[0].clientY;
      this.checkPlanetClick(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    if (this.orbitControls.isDragging && e.touches.length === 1 && (this.viewMode === 'orbit' || this.viewMode === 'planet_focus')) {
      const deltaX = e.touches[0].clientX - this.orbitControls.lastX;
      const deltaY = e.touches[0].clientY - this.orbitControls.lastY;
      this.orbitControls.lastX = e.touches[0].clientX;
      this.orbitControls.lastY = e.touches[0].clientY;

      this.orbitControls.theta -= deltaX * 0.008;
      this.orbitControls.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.orbitControls.phi - deltaY * 0.008));
    }
  };

  private onTouchEnd = () => {
    this.orbitControls.isDragging = false;
  };

  private checkPlanetClick(clientX: number, clientY: number) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mousePos.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.mousePos.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mousePos, this.camera);
    const meshesToCheck: THREE.Object3D[] = [];
    if (this.sunMesh) meshesToCheck.push(this.sunMesh);
    this.planetMeshes.forEach(p => meshesToCheck.push(p.mesh));

    const intersects = this.raycaster.intersectObjects(meshesToCheck, false);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const data = hit.userData.planetData as PlanetData;
      if (data) {
        sound.playSelect();
        this.focusPlanet(data.id);
        this.callbacks.onPlanetSelect(data);
      }
    }
  }

  // --- Public View Control Methods ---
  public setViewMode(mode: CameraViewMode) {
    this.viewMode = mode;
    if (mode === 'ship') {
      this.focusedPlanetId = null;
    }
  }

  public focusPlanet(planetId: string) {
    this.focusedPlanetId = planetId;
    this.viewMode = 'planet_focus';
    const planet = PLANETS_DATA.find(p => p.id === planetId);
    if (planet) {
      this.orbitControls.radius = Math.max(planet.displayRadius * 3.8, 14);
    }
  }

  public flyShipToPlanet(planetId: string) {
    const pEntry = this.planetMeshes.get(planetId);
    if (pEntry) {
      pEntry.mesh.getWorldPosition(this._v1);
      this.autopilotTarget = this._v1.clone();
      this.autopilotActive = true;
      this.viewMode = 'ship';
      sound.playSelect();
    } else if (planetId === 'sun') {
      this.autopilotTarget = new THREE.Vector3(0, 0, 15);
      this.autopilotActive = true;
      this.viewMode = 'ship';
      sound.playSelect();
    }
  }

  public setOrbitVisibility(visible: boolean) {
    this.showOrbitPaths = visible;
    this.orbitLines.forEach(l => {
      l.visible = visible;
    });
  }

  public getShipPosition(): THREE.Vector3 {
    return this.shipGroup.position;
  }

  // --- Main Animation Loop ---
  private animate = () => {
    this.animFrameId = requestAnimationFrame(this.animate);

    const rawDelta = this.clock.getDelta();
    const dt = Math.min(rawDelta, 0.05); // Clamped frame time

    const simDelta = dt * this.timeSpeedMultiplier;

    // 1. Rotate Sun
    if (this.sunMesh) {
      this.sunMesh.rotation.y += simDelta * 0.15;
    }

    // 2. Animate Planetary Orbits & Self-rotations
    this.planetMeshes.forEach(p => {
      // Orbit around Sun (Kepler speed ~ 1 / sqrt(r))
      const orbitSpeed = (20 / Math.max(1, p.data.orbitPeriodDays)) * simDelta * 0.6;
      p.pivot.rotation.y += orbitSpeed;

      // Self-rotation
      const selfSpeed = (24 / Math.abs(p.data.rotationHours)) * simDelta * 0.4;
      p.mesh.rotation.y += p.data.rotationHours > 0 ? selfSpeed : -selfSpeed;
    });

    // 3. Earth Moon Orbit
    if (this.earthMoonMesh) {
      this.earthMoonMesh.position.x = Math.cos(this.clock.getElapsedTime() * 1.5) * 3.5;
      this.earthMoonMesh.position.z = Math.sin(this.clock.getElapsedTime() * 1.5) * 3.5;
    }

    // 4. Animate Sample Collectibles
    this.sampleObjects.forEach(s => {
      s.group.rotation.y += dt * 1.2;
      s.group.rotation.x = Math.sin(this.clock.getElapsedTime() * 2) * 0.2;

      // Collision check with spaceship
      const dist = this.shipGroup.position.distanceTo(s.group.position);
      if (dist < 6.5) {
        sound.playCollectSample();
        this.callbacks.onSampleCollect(s.sample);
        this.removeSampleFromScene(s.sample.id);
      }
    });

    // 5. Update Spaceship Flight Simulation
    this.updateSpaceshipFlight(dt);

    // 6. Update Camera positioning with smooth damping
    this.updateCamera(dt);

    // 7. Update Telemetry
    this.updateTelemetry();

    // Render frame
    this.renderer.render(this.scene, this.camera);
  };

  private updateSpaceshipFlight(dt: number) {
    const isAccelerating = this.inputState.forward || this.inputState.backward;
    const isBoost = this.inputState.boost;

    // Autopilot flight towards target
    if (this.autopilotActive && this.autopilotTarget) {
      const toTarget = this._v1.subVectors(this.autopilotTarget, this.shipGroup.position);
      const dist = toTarget.length();

      if (dist > 8) {
        toTarget.normalize();
        const targetQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), toTarget);
        this.shipGroup.quaternion.slerp(targetQuat, 4.0 * dt);

        this.targetSpeed = isBoost ? 45 : 30;
        this.shipGroup.translateZ(this.targetSpeed * dt);
        this.shipSpeed = THREE.MathUtils.damp(this.shipSpeed, this.targetSpeed, 6, dt);
        sound.setThruster(true, isBoost);
      } else {
        this.autopilotActive = false;
        this.autopilotTarget = null;
        sound.setThruster(false);
      }
    } else {
      // Manual Player Flight
      const maxNormalSpeed = 22;
      const maxBoostSpeed = 48;
      const maxSpeed = isBoost ? maxBoostSpeed : maxNormalSpeed;

      if (this.inputState.forward) {
        this.targetSpeed = maxSpeed;
      } else if (this.inputState.backward) {
        this.targetSpeed = -maxNormalSpeed * 0.5;
      } else {
        this.targetSpeed = 0;
      }

      this.shipSpeed = THREE.MathUtils.damp(this.shipSpeed, this.targetSpeed, 4.0, dt);

      // Pitch / Yaw / Roll
      const turnRate = 2.4 * dt;
      if (this.inputState.left) {
        this.shipGroup.rotateY(turnRate);
        this.shipRoll = THREE.MathUtils.damp(this.shipRoll, 0.45, 8, dt);
      } else if (this.inputState.right) {
        this.shipGroup.rotateY(-turnRate);
        this.shipRoll = THREE.MathUtils.damp(this.shipRoll, -0.45, 8, dt);
      } else {
        this.shipRoll = THREE.MathUtils.damp(this.shipRoll, 0, 8, dt);
      }

      if (this.inputState.up) {
        this.shipGroup.rotateX(turnRate);
      } else if (this.inputState.down) {
        this.shipGroup.rotateX(-turnRate);
      }

      // Roll bank effect on child hull
      this.shipGroup.children[0].rotation.z = this.shipRoll;

      // Forward motion along local forward (+Z in Three.js when oriented)
      this.shipGroup.translateZ(this.shipSpeed * dt);

      // Sound update
      sound.setThruster(Math.abs(this.shipSpeed) > 1, isBoost);
    }

    // Dynamic Engine Exhaust Glow size
    if (this.shipThrusterGlow) {
      const glowScale = Math.abs(this.shipSpeed) / 15 + (isBoost ? 0.8 : 0.2);
      this.shipThrusterGlow.scale.set(1 + glowScale * 0.5, 1 + glowScale, 1 + glowScale * 0.5);
      this.shipThrusterGlow.visible = Math.abs(this.shipSpeed) > 0.5;
    }
  }

  private updateCamera(dt: number) {
    if (this.viewMode === 'ship') {
      // Smooth Follow Ship Camera
      this.shipGroup.localToWorld(this._targetCamPos.set(0, 4.5, -12));
      this.shipGroup.localToWorld(this._targetCamLookAt.set(0, 1.0, 18));

      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, this._targetCamPos.x, 8, dt);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, this._targetCamPos.y, 8, dt);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, this._targetCamPos.z, 8, dt);

      this.camera.lookAt(this._targetCamLookAt);
    } else if (this.viewMode === 'planet_focus' && this.focusedPlanetId) {
      // Focus on specific planet
      const pEntry = this.planetMeshes.get(this.focusedPlanetId);
      if (pEntry) {
        pEntry.mesh.getWorldPosition(this.orbitControls.target);
      } else if (this.focusedPlanetId === 'sun') {
        this.orbitControls.target.set(0, 0, 0);
      }

      const camX = this.orbitControls.target.x + this.orbitControls.radius * Math.sin(this.orbitControls.phi) * Math.sin(this.orbitControls.theta);
      const camY = this.orbitControls.target.y + this.orbitControls.radius * Math.cos(this.orbitControls.phi);
      const camZ = this.orbitControls.target.z + this.orbitControls.radius * Math.sin(this.orbitControls.phi) * Math.cos(this.orbitControls.theta);

      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, camX, 6, dt);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, camY, 6, dt);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, camZ, 6, dt);

      this.camera.lookAt(this.orbitControls.target);
    } else if (this.viewMode === 'orbit') {
      // Orbit around Solar System Origin (0,0,0)
      this.orbitControls.target.set(0, 0, 0);

      const camX = this.orbitControls.radius * Math.sin(this.orbitControls.phi) * Math.sin(this.orbitControls.theta);
      const camY = this.orbitControls.radius * Math.cos(this.orbitControls.phi);
      const camZ = this.orbitControls.radius * Math.sin(this.orbitControls.phi) * Math.cos(this.orbitControls.theta);

      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, camX, 6, dt);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, camY, 6, dt);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, camZ, 6, dt);

      this.camera.lookAt(this.orbitControls.target);
    }
  }

  private updateTelemetry() {
    let nearestPlanetName = 'อวกาศเปิด (Deep Space)';
    let minDistance = Infinity;

    this.planetMeshes.forEach(p => {
      p.mesh.getWorldPosition(this._v1);
      const d = this.shipGroup.position.distanceTo(this._v1);
      if (d < minDistance) {
        minDistance = d;
        nearestPlanetName = p.data.thaiName;
      }
    });

    // Check sun distance
    const sunDist = this.shipGroup.position.length();
    if (sunDist < minDistance) {
      minDistance = sunDist;
      nearestPlanetName = 'ดวงอาทิตย์';
    }

    this.callbacks.onShipTelemetry(
      Math.round(this.shipSpeed * 100),
      Math.round(minDistance * 10),
      nearestPlanetName
    );
  }

  public dispose() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);

    sound.setThruster(false);

    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
