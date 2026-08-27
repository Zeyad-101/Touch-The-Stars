'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { PLANETS, SUN_DATA } from '@/js/planets';

export default function SceneCanvas({ selectedPlanet, onSelectPlanet, backTriggerRef, onLoaded }) {
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const sunMeshRef = useRef(null);
  const planetMeshesRef = useRef([]);
  const planetAnglesRef = useRef([]);
  const isPausedRef = useRef(false);
  const isTransitioningRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(true);

  const onSelectRef = useRef(null);
  onSelectRef.current = onSelectPlanet;

  const onAllTexturesLoadedRef = useRef(null);
  onAllTexturesLoadedRef.current = onLoaded;

  const selectedPlanetRef = useRef(null);
  selectedPlanetRef.current = selectedPlanet;

  const togglePlay = () => {
    isPausedRef.current = !isPausedRef.current;
    setIsPlaying(!isPausedRef.current);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Helper for responsive default camera positioning
    const getDefaultCameraPos = () => {
      const isPortrait = window.innerWidth < window.innerHeight;
      return isPortrait ? { x: 0, y: 90, z: 220 } : { x: 0, y: 60, z: 160 };
    };

    // 1. Create Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // 2. Create Camera with dynamic FOV and initial framing
    const initialAspect = window.innerWidth / window.innerHeight;
    const initialFov = initialAspect < 1 ? 75 : 60;
    const initialPos = getDefaultCameraPos();

    const camera = new THREE.PerspectiveCamera(
      initialFov,
      initialAspect,
      0.1,
      16000
    );
    camera.position.set(initialPos.x, initialPos.y, initialPos.z);
    camera.lookAt(0, 0, 0);

    // 3. Create Renderer with ACES Filmic tone mapping & sRGB color space
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Append to container
    containerRef.current.appendChild(renderer.domElement);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    // 4. Realistic Lighting: Strong direct Sunlight with clean planetary day/night terminator
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 7, 0, 0);
    pointLight.position.set(0, 0, 0);
    pointLight.decay = 0;
    scene.add(pointLight);

    // 5. Majestic Procedural Spiral Galaxy (Unveils on Zoom Out)
    const galaxyGroup = new THREE.Group();
    galaxyGroup.rotation.x = 0.28;
    galaxyGroup.rotation.z = -0.12;
    scene.add(galaxyGroup);

    // High-quality circular soft star point texture
    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0.0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)');
      grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.2)');
      grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(canvas);
    };
    const starTex = createStarTexture();

    // A. Spiral Arms Stars (45,000 particles)
    const galaxyCount = 45000;
    const galaxyRadius = 2600;
    const branches = 4;
    const spin = 1.15;
    
    const galaxyGeo = new THREE.BufferGeometry();
    const gPositions = new Float32Array(galaxyCount * 3);
    const gColors = new Float32Array(galaxyCount * 3);

    const colorCore = new THREE.Color('#fff7e6');
    const colorInner = new THREE.Color('#fde047');
    const colorMid = new THREE.Color('#38bdf8');
    const colorOuter = new THREE.Color('#818cf8');
    const colorRim = new THREE.Color('#c084fc');

    for (let i = 0; i < galaxyCount; i++) {
      const r = Math.pow(Math.random(), 2.6) * galaxyRadius;
      const branchAngle = ((i % branches) * 2 * Math.PI) / branches;
      const spinAngle = (r / galaxyRadius) * spin * 2 * Math.PI;

      const spread = Math.pow(Math.random(), 1.5) * (r * 0.22 + 25);
      const spreadAngle = Math.random() * Math.PI * 2;
      const randomX = Math.cos(spreadAngle) * spread;
      const randomZ = Math.sin(spreadAngle) * spread;
      
      const heightSpread = (1.0 - Math.min(1.0, r / (galaxyRadius * 0.85))) * 140 + 25;
      const randomY = (Math.random() - 0.5) * heightSpread * Math.pow(Math.random(), 1.2);

      gPositions[i * 3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      gPositions[i * 3 + 1] = randomY;
      gPositions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      const normDist = r / galaxyRadius;
      let starColor = new THREE.Color();
      if (normDist < 0.15) {
        starColor.lerpColors(colorCore, colorInner, normDist / 0.15);
      } else if (normDist < 0.5) {
        starColor.lerpColors(colorInner, colorMid, (normDist - 0.15) / 0.35);
      } else if (normDist < 0.8) {
        starColor.lerpColors(colorMid, colorOuter, (normDist - 0.5) / 0.3);
      } else {
        starColor.lerpColors(colorOuter, colorRim, (normDist - 0.8) / 0.2);
      }

      gColors[i * 3] = starColor.r;
      gColors[i * 3 + 1] = starColor.g;
      gColors[i * 3 + 2] = starColor.b;
    }

    galaxyGeo.setAttribute('position', new THREE.Float32BufferAttribute(gPositions, 3));
    galaxyGeo.setAttribute('color', new THREE.Float32BufferAttribute(gColors, 3));

    const galaxyMaterial = new THREE.PointsMaterial({
      size: 2.4,
      sizeAttenuation: true,
      map: starTex,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.15,
    });
    const galaxyPoints = new THREE.Points(galaxyGeo, galaxyMaterial);
    galaxyGroup.add(galaxyPoints);

    // B. Supermassive Luminous Galactic Core Glow
    const coreGlowCanvas = document.createElement('canvas');
    coreGlowCanvas.width = 256;
    coreGlowCanvas.height = 256;
    const cgCtx = coreGlowCanvas.getContext('2d');
    const cgGrad = cgCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
    cgGrad.addColorStop(0.0, 'rgba(255, 250, 235, 0.95)');
    cgGrad.addColorStop(0.2, 'rgba(255, 210, 130, 0.45)');
    cgGrad.addColorStop(0.5, 'rgba(120, 180, 255, 0.15)');
    cgGrad.addColorStop(0.8, 'rgba(60, 100, 255, 0.03)');
    cgGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    cgCtx.fillStyle = cgGrad;
    cgCtx.fillRect(0, 0, 256, 256);
    const coreGlowTexture = new THREE.CanvasTexture(coreGlowCanvas);
    const coreGlowMat = new THREE.SpriteMaterial({
      map: coreGlowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.15,
    });
    const galaxyCoreSprite = new THREE.Sprite(coreGlowMat);
    galaxyCoreSprite.scale.set(720, 720, 1);
    galaxyGroup.add(galaxyCoreSprite);

    // C. Cosmic Dust & H II Emission Clouds (Nebula lanes in spiral arms)
    const nebulaCount = 1200;
    const nebulaGeo = new THREE.BufferGeometry();
    const nPositions = new Float32Array(nebulaCount * 3);
    const nColors = new Float32Array(nebulaCount * 3);
    const nebulaColors = [
      new THREE.Color('#38bdf8'),
      new THREE.Color('#818cf8'),
      new THREE.Color('#ec4899'),
      new THREE.Color('#a855f7'),
    ];

    for (let i = 0; i < nebulaCount; i++) {
      const r = Math.pow(Math.random(), 2.2) * (galaxyRadius * 0.9) + 120;
      const branchAngle = ((i % branches) * 2 * Math.PI) / branches;
      const spinAngle = (r / galaxyRadius) * spin * 2 * Math.PI;

      const spread = (Math.random() - 0.5) * (r * 0.18 + 20);
      const height = (Math.random() - 0.5) * 35;

      nPositions[i * 3] = Math.cos(branchAngle + spinAngle) * r + spread;
      nPositions[i * 3 + 1] = height;
      nPositions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r + spread;

      const c = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      nColors[i * 3] = c.r;
      nColors[i * 3 + 1] = c.g;
      nColors[i * 3 + 2] = c.b;
    }
    nebulaGeo.setAttribute('position', new THREE.Float32BufferAttribute(nPositions, 3));
    nebulaGeo.setAttribute('color', new THREE.Float32BufferAttribute(nColors, 3));

    const nebulaMaterial = new THREE.PointsMaterial({
      size: 48,
      sizeAttenuation: true,
      map: starTex,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.08,
    });
    const nebulaPoints = new THREE.Points(nebulaGeo, nebulaMaterial);
    galaxyGroup.add(nebulaPoints);

    // D. Outer Deep Space Starfield (Preserved exactly as it was when zoomed in)
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3500;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      positions[i] = Math.random() * 1600 - 800;
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, sizeAttenuation: true });
    const starfield = new THREE.Points(starGeometry, starMaterial);
    scene.add(starfield);

    // E. Floating HUD Marker for Solar System (Appears on Galactic Scale)
    const beaconCanvas = document.createElement('canvas');
    beaconCanvas.width = 384;
    beaconCanvas.height = 80;
    const bCtx = beaconCanvas.getContext('2d');
    bCtx.font = 'bold 24px "JetBrains Mono", monospace';
    bCtx.fillStyle = '#fde047';
    bCtx.textAlign = 'center';
    bCtx.fillText('⊙ SOLAR SYSTEM', 192, 45);
    bCtx.font = '16px "JetBrains Mono", monospace';
    bCtx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    bCtx.fillText('ORION-CYGNUS ARM', 192, 70);
    const beaconTex = new THREE.CanvasTexture(beaconCanvas);
    const beaconMat = new THREE.SpriteMaterial({
      map: beaconTex,
      transparent: true,
      opacity: 0,
      depthTest: false,
    });
    const beaconSprite = new THREE.Sprite(beaconMat);
    beaconSprite.scale.set(110, 24, 1);
    beaconSprite.position.set(0, 18, 0);
    scene.add(beaconSprite);

    // 6. Texture Loader & Tracking (8 planets + 1 Sun + 1 Saturn rings = 10 textures)
    const textureLoader = new THREE.TextureLoader();
    let loadedCount = 0;
    const totalTextures = PLANETS.length + 2;

    const handleTextureLoad = (tex) => {
      if (tex) {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = maxAnisotropy;
      }
      loadedCount++;
      if (loadedCount >= totalTextures) {
        if (onAllTexturesLoadedRef.current) {
          onAllTexturesLoadedRef.current(true);
        }
      }
    };

    // 7. Add Realistic Dynamic Sun (Blazing solar plasma with organic limb glow)
    const sunRadius = 6;
    const sunGeometry = new THREE.SphereGeometry(sunRadius, 64, 64);
    const sunTexture = textureLoader.load('/textures/2k_sun.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      handleTextureLoad(tex);
    });

    const sunShaderUniforms = {
      sunTexture: { value: sunTexture },
      time: { value: 0 },
    };

    const sunMaterial = new THREE.ShaderMaterial({
      uniforms: sunShaderUniforms,
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPos.xyz;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D sunTexture;
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          // Slow dynamic solar convection turbulence
          vec2 uv1 = vUv + vec2(time * 0.0008, time * 0.0003);
          vec2 uv2 = vUv - vec2(time * 0.0006, -time * 0.0005);
          
          vec4 t1 = texture2D(sunTexture, uv1);
          vec4 t2 = texture2D(sunTexture, uv2);
          vec3 plasma = mix(t1.rgb, t2.rgb, 0.45);

          // Solar limb Fresnel glow on the star surface itself (no detached ring)
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          float limb = 1.0 - max(0.0, dot(normal, viewDir));

          // Incandescent solar profile: blazing white-hot core, deep fiery rim
          vec3 core = plasma * 1.65 + vec3(0.12, 0.08, 0.02);
          vec3 rim = vec3(1.0, 0.65, 0.2) * pow(limb, 2.5) * 1.6;

          gl_FragColor = vec4(core + rim, 1.0);
        }
      `,
    });

    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.userData.name = 'Sun';
    scene.add(sunMesh);
    sunMeshRef.current = sunMesh;

    // Subtle, soft camera lens flare (very faint natural star bloom - NO hard rings)
    const flareCanvas = document.createElement('canvas');
    flareCanvas.width = 256;
    flareCanvas.height = 256;
    const fCtx = flareCanvas.getContext('2d');
    const flareGrad = fCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
    flareGrad.addColorStop(0.0, 'rgba(255, 245, 210, 0.35)');
    flareGrad.addColorStop(0.15, 'rgba(255, 190, 70, 0.12)');
    flareGrad.addColorStop(0.4, 'rgba(255, 120, 20, 0.03)');
    flareGrad.addColorStop(0.7, 'rgba(180, 50, 0, 0.005)');
    flareGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    fCtx.fillStyle = flareGrad;
    fCtx.fillRect(0, 0, 256, 256);
    const flareTexture = new THREE.CanvasTexture(flareCanvas);
    const flareMat = new THREE.SpriteMaterial({
      map: flareTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.5,
    });
    const flareSprite = new THREE.Sprite(flareMat);
    flareSprite.scale.set(sunRadius * 3.2, sunRadius * 3.2, 1);
    flareSprite.position.set(0, 0, 0);
    scene.add(flareSprite);

    // 8. Add High-Detail Planets & Ultra-Realistic Saturn Rings
    planetMeshesRef.current = [];
    planetAnglesRef.current = [];

    PLANETS.forEach((planet) => {
      // Orbit Ring Line
      const ringGeometry = new THREE.RingGeometry(planet.distance - 0.05, planet.distance + 0.05, 128);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x555555,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25
      });
      const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      ringMesh.rotation.x = -Math.PI / 2;
      scene.add(ringMesh);

      // High-polygon 64x64 sphere geometry for smooth silhouettes
      const geometry = new THREE.SphereGeometry(planet.radius, 64, 64);
      const planetTexture = textureLoader.load(planet.texture, handleTextureLoad);

      // Realistic surface physics per planet
      let roughness = 0.85;
      let metalness = 0.05;
      if (planet.name === 'Earth') { roughness = 0.55; metalness = 0.1; }
      else if (planet.name === 'Venus') { roughness = 0.45; metalness = 0.0; }
      else if (planet.name === 'Jupiter' || planet.name === 'Saturn') { roughness = 0.65; metalness = 0.0; }
      else if (planet.name === 'Uranus' || planet.name === 'Neptune') { roughness = 0.5; metalness = 0.0; }
      else if (planet.name === 'Mars') { roughness = 0.92; metalness = 0.02; }
      else if (planet.name === 'Mercury') { roughness = 0.95; metalness = 0.0; }

      const material = new THREE.MeshStandardMaterial({
        map: planetTexture,
        roughness: roughness,
        metalness: metalness,
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.rotation.z = planet.tilt;
      mesh.userData.name = planet.name;

      // Generous invisible hit proxy sphere to make selecting smaller planets like Earth and Mars easy
      const hitRadius = Math.max(planet.radius * 1.6, 3.4);
      const hitGeo = new THREE.SphereGeometry(hitRadius, 16, 16);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData.name = planet.name;
      mesh.add(hitMesh);
      
      // Random starting angle
      const initialAngle = Math.random() * Math.PI * 2;
      planetAnglesRef.current.push(initialAngle);
      
      mesh.position.x = Math.cos(initialAngle) * planet.distance;
      mesh.position.z = Math.sin(initialAngle) * planet.distance;

      // Realistic Atmospheric Blue Haze for Earth
      if (planet.name === 'Earth') {
        const earthAtmoGeo = new THREE.SphereGeometry(planet.radius * 1.018, 64, 64);
        const earthAtmoMat = new THREE.ShaderMaterial({
          vertexShader: `
            varying vec3 vNormal;
            varying vec3 vViewDir;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
              vViewDir = normalize(-mvPos.xyz);
              gl_Position = projectionMatrix * mvPos;
            }
          `,
          fragmentShader: `
            varying vec3 vNormal;
            varying vec3 vViewDir;
            void main() {
              float fresnel = 1.0 - max(0.0, dot(vNormal, vViewDir));
              float intensity = pow(fresnel, 3.0) * 1.5;
              vec3 atmoColor = vec3(0.3, 0.65, 1.0);
              gl_FragColor = vec4(atmoColor, intensity * 0.7);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.FrontSide,
        });
        const earthAtmoMesh = new THREE.Mesh(earthAtmoGeo, earthAtmoMat);
        earthAtmoMesh.userData.name = 'Earth';
        mesh.add(earthAtmoMesh);
      }

      // Ultra-Realistic Saturn Rings (Concentric Math Shader — Zero Jagged Facets)
      if (planet.hasRings) {
        const innerRadius = planet.radius * 1.3;
        const outerRadius = planet.radius * 2.35;
        const saturnRingGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);

        const saturnRingTexture = textureLoader.load('/textures/2k_saturn_ring_alpha.png', (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = maxAnisotropy;
          handleTextureLoad(tex);
        });

        const saturnRingMaterial = new THREE.ShaderMaterial({
          uniforms: {
            ringTexture: { value: saturnRingTexture },
            innerRadius: { value: innerRadius },
            outerRadius: { value: outerRadius },
          },
          vertexShader: `
            varying vec3 vPos;
            void main() {
              vPos = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D ringTexture;
            uniform float innerRadius;
            uniform float outerRadius;
            varying vec3 vPos;

            void main() {
              float dist = length(vPos.xy);
              float u = (dist - innerRadius) / (outerRadius - innerRadius);
              if (u < 0.0 || u > 1.0) discard;
              
              vec4 tex = texture2D(ringTexture, vec2(u, 0.5));
              if (tex.a < 0.015) discard;
              
              // Rich natural golden tan tone matching Cassini imagery
              vec3 ringColor = tex.rgb * 1.3;
              gl_FragColor = vec4(ringColor, tex.a * 0.95);
            }
          `,
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false,
        });

        const saturnRingMesh = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
        saturnRingMesh.rotation.x = -Math.PI / 2;
        mesh.add(saturnRingMesh);
      }

      scene.add(mesh);
      planetMeshesRef.current.push(mesh);
    });

    // 9. Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 15;
    controls.maxDistance = 4500;
    controls.enablePan = false;
    controlsRef.current = controls;

    // LookAt target object for smooth camera focus transitions
    const lookAtTarget = { x: 0, y: 0, z: 0 };

    // 10. Reverse Transition Trigger
    const performBackTransition = () => {
      if (!selectedPlanetRef.current && !isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      // Clear selection state immediately so InfoPanel disappears right away
      selectedPlanetRef.current = null;
      if (onSelectRef.current) {
        onSelectRef.current(null);
      }

      const defaultPos = getDefaultCameraPos();

      gsap.to(camera.position, {
        x: defaultPos.x,
        y: defaultPos.y,
        z: defaultPos.z,
        duration: 2.2,
        ease: 'power2.inOut',
      });

      gsap.to(lookAtTarget, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2.2,
        ease: 'power2.inOut',
        onComplete: () => {
          controls.target.set(0, 0, 0);
          controls.enabled = true;
          isPausedRef.current = false;
          setIsPlaying(true);
          isTransitioningRef.current = false;
        },
      });
    };

    if (backTriggerRef) {
      backTriggerRef.current = performBackTransition;
    }

    // 11. Animation loop
    renderer.setAnimationLoop(() => {
      if (!isPausedRef.current) {
        sunMesh.rotation.y += 0.001;
        sunShaderUniforms.time.value += 1;

        planetMeshesRef.current.forEach((mesh, index) => {
          const planet = PLANETS[index];
          
          // Increment angle
          planetAnglesRef.current[index] += planet.orbitSpeed * 0.002;
          const angle = planetAnglesRef.current[index];
          
          // Update position
          mesh.position.x = Math.cos(angle) * planet.distance;
          mesh.position.z = Math.sin(angle) * planet.distance;
          
          // Update rotation
          mesh.rotation.y += planet.rotationSpeed;
        });
      }

      // Dynamic Cosmic Scale Transition (Completely hidden when zoomed in, reveals only when zooming out)
      const camDist = camera.position.length();
      if (camDist <= 230) {
        galaxyGroup.visible = false;
        beaconSprite.visible = false;
      } else {
        galaxyGroup.visible = true;
        beaconSprite.visible = true;

        // Butter-smooth S-curve fade between distance 230 and 700
        const progress = THREE.MathUtils.clamp((camDist - 230) / 470, 0, 1);
        const smoothAlpha = progress * progress * (3 - 2 * progress);

        galaxyMaterial.opacity = smoothAlpha;
        coreGlowMat.opacity = smoothAlpha * 0.9;
        nebulaMaterial.opacity = smoothAlpha * 0.35;

        // HUD beacon appears only at macro galactic distances (> 480)
        if (camDist > 480) {
          const bProgress = THREE.MathUtils.clamp((camDist - 480) / 220, 0, 1);
          beaconMat.opacity = bProgress * 0.95;
        } else {
          beaconMat.opacity = 0;
        }

        // Majestic gentle galactic rotation
        galaxyGroup.rotation.y += 0.00015;
      }

      controls.update(); // required for damping
      camera.lookAt(lookAtTarget.x, lookAtTarget.y, lookAtTarget.z);
      renderer.render(scene, camera);
    });

    // 12. Handle Interactions (Click / Hover for Sun & Planets)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getInteractableObjects = () => {
      const objects = [];
      if (sunMeshRef.current) objects.push(sunMeshRef.current);
      if (planetMeshesRef.current) objects.push(...planetMeshesRef.current);
      return objects;
    };

    const getIntersectedObject = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(getInteractableObjects(), true);
      for (let i = 0; i < intersects.length; i++) {
        let obj = intersects[i].object;
        while (obj && !obj.userData?.name && obj.parent && obj.parent !== scene) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.name) {
          return obj;
        }
      }
      return null;
    };

    const handleClick = (event) => {
      if (selectedPlanetRef.current || isTransitioningRef.current) return;

      const clickedMesh = getIntersectedObject(event);
      if (clickedMesh) {
        const name = clickedMesh.userData.name;
        const screenScale = window.innerWidth < 500 ? 1.6 : 1;

        if (name === 'Sun') {
          selectedPlanetRef.current = SUN_DATA;
          isTransitioningRef.current = true;
          controls.enabled = false;

          // Sun offset: (radius * 3, radius * 1.5, radius * 3) * screenScale
          const targetX = 18 * screenScale;
          const targetY = 9 * screenScale;
          const targetZ = 18 * screenScale;

          gsap.to(camera.position, {
            x: targetX,
            y: targetY,
            z: targetZ,
            duration: 2.2,
            ease: 'power2.inOut',
          });

          gsap.to(lookAtTarget, {
            x: 0,
            y: 0,
            z: 0,
            duration: 2.2,
            ease: 'power2.inOut',
            onComplete: () => {
              isTransitioningRef.current = false;
              if (onSelectRef.current) {
                onSelectRef.current(SUN_DATA);
              }
            },
          });
        } else {
          const planet = PLANETS.find((p) => p.name === name);
          const planetMesh = planetMeshesRef.current.find((m) => m.userData.name === name);
          if (!planet || !planetMesh) return;

          selectedPlanetRef.current = planet;
          isTransitioningRef.current = true;
          isPausedRef.current = true;
          setIsPlaying(false);
          controls.enabled = false;

          const targetX = planetMesh.position.x + planet.radius * 4 * screenScale;
          const targetY = planetMesh.position.y + planet.radius * 2 * screenScale;
          const targetZ = planetMesh.position.z + planet.radius * 4 * screenScale;

          gsap.to(camera.position, {
            x: targetX,
            y: targetY,
            z: targetZ,
            duration: 2.2,
            ease: 'power2.inOut',
          });

          gsap.to(lookAtTarget, {
            x: planetMesh.position.x,
            y: planetMesh.position.y,
            z: planetMesh.position.z,
            duration: 2.2,
            ease: 'power2.inOut',
            onComplete: () => {
              isTransitioningRef.current = false;
              if (onSelectRef.current) {
                onSelectRef.current(planet);
              }
            },
          });
        }
      }
    };

    const handleMouseMove = (event) => {
      if (selectedPlanetRef.current || isTransitioningRef.current) {
        document.body.style.cursor = 'default';
        return;
      }

      const hoveredObject = getIntersectedObject(event);
      if (hoveredObject) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    };

    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);

    // 13. Handle Resize (Aspect ratio, FOV, and smooth orientation repositioning)
    let lastIsPortrait = window.innerWidth < window.innerHeight;

    const handleResize = () => {
      const isPortrait = window.innerWidth < window.innerHeight;
      const aspect = window.innerWidth / window.innerHeight;

      camera.aspect = aspect;
      camera.fov = aspect < 1 ? 75 : 60;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      if (isPortrait !== lastIsPortrait) {
        lastIsPortrait = isPortrait;
        if (!selectedPlanetRef.current && !isTransitioningRef.current) {
          const newDefault = getDefaultCameraPos();
          gsap.to(camera.position, {
            x: newDefault.x,
            y: newDefault.y,
            z: newDefault.z,
            duration: 0.8,
            ease: 'power2.inOut',
          });
        }
      }
    };
    window.addEventListener('resize', handleResize);

    // 14. Cleanup
    const container = containerRef.current;
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'default';
      renderer.setAnimationLoop(null);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [backTriggerRef]);

  return (
    <>
      <div
        id="canvas-container"
        ref={containerRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
        }}
      />
      <button
        onClick={togglePlay}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '8px 16px',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 10,
          fontFamily: 'inherit',
        }}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </>
  );
}
