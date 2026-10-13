'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sun, Sunset, Moon, RotateCcw, Maximize2, Sparkles, Compass } from 'lucide-react';

interface ThreePropertyViewerProps {
  propertyTitle?: string;
  className?: string;
}

export default function ThreePropertyViewer({
  propertyTitle = 'Oceanfront Villa Showcase',
  className = '',
}: ThreePropertyViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<string | null>('Infinity Terrace');
  const [timeOfDay, setTimeOfDay] = useState<'golden' | 'sunset' | 'night'>('golden');
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // References to dynamic lighting
  const lightsRef = useRef<{
    ambient?: THREE.AmbientLight;
    sun?: THREE.DirectionalLight;
    oceanMat?: THREE.MeshStandardMaterial;
  }>({});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(22, 14, 26);
    camera.lookAt(0, 4, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Group for the entire villa scene
    const villaGroup = new THREE.Group();
    scene.add(villaGroup);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xfff4e6, 0.7);
    scene.add(ambientLight);
    lightsRef.current.ambient = ambientLight;

    // Sun light (Directional)
    const sunLight = new THREE.DirectionalLight(0xffecd2, 1.8);
    sunLight.position.set(30, 40, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);
    lightsRef.current.sun = sunLight;

    // Ocean water plane
    const oceanGeo = new THREE.PlaneGeometry(160, 160, 32, 32);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.88,
    });
    lightsRef.current.oceanMat = oceanMat;
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -0.5;
    scene.add(ocean);

    // Beach / Cliff Base (Travertine/Sandstone)
    const baseGeo = new THREE.BoxGeometry(26, 2, 26);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xe2d9cb,
      roughness: 0.9,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0;
    base.receiveShadow = true;
    villaGroup.add(base);

    // Villa Ground Floor (White Stucco)
    const groundFloorGeo = new THREE.BoxGeometry(16, 4.5, 12);
    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xfaf8f5,
      roughness: 0.3,
    });
    const groundFloor = new THREE.Mesh(groundFloorGeo, whiteMat);
    groundFloor.position.set(0, 3.25, -2);
    groundFloor.castShadow = true;
    groundFloor.receiveShadow = true;
    villaGroup.add(groundFloor);

    // Parota Wood Accent Wall / Beam
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x7c4722,
      roughness: 0.6,
    });
    const woodBeamGeo = new THREE.BoxGeometry(16.4, 0.4, 12.4);
    const woodBeam = new THREE.Mesh(woodBeamGeo, woodMat);
    woodBeam.position.set(0, 5.5, -2);
    woodBeam.castShadow = true;
    villaGroup.add(woodBeam);

    // Upper Floor (Cantilevered Modern Suite)
    const upperFloorGeo = new THREE.BoxGeometry(12, 3.8, 10);
    const upperFloor = new THREE.Mesh(upperFloorGeo, whiteMat);
    upperFloor.position.set(-2, 7.5, 0);
    upperFloor.castShadow = true;
    upperFloor.receiveShadow = true;
    villaGroup.add(upperFloor);

    // Overhanging Cantilever Roof
    const roofGeo = new THREE.BoxGeometry(15, 0.5, 13);
    const roof = new THREE.Mesh(roofGeo, woodMat);
    roof.position.set(-2, 9.6, 0);
    roof.castShadow = true;
    villaGroup.add(roof);

    // Large Glass Sliding Doors (Blue-tinted transparent)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      transmission: 0.85,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.5,
    });
    const glassGeo = new THREE.BoxGeometry(10, 3.6, 0.2);
    const glassDoors = new THREE.Mesh(glassGeo, glassMat);
    glassDoors.position.set(0, 3.25, 4.1);
    villaGroup.add(glassDoors);

    // Infinity Pool Deck & Water
    const poolDeckGeo = new THREE.BoxGeometry(14, 0.6, 8);
    const poolDeckMat = new THREE.MeshStandardMaterial({ color: 0xded8ce, roughness: 0.4 });
    const poolDeck = new THREE.Mesh(poolDeckGeo, poolDeckMat);
    poolDeck.position.set(0, 1.1, 7);
    poolDeck.receiveShadow = true;
    villaGroup.add(poolDeck);

    const poolWaterGeo = new THREE.BoxGeometry(11, 0.2, 5.5);
    const poolWaterMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.05,
      metalness: 0.9,
    });
    const poolWater = new THREE.Mesh(poolWaterGeo, poolWaterMat);
    poolWater.position.set(0, 1.35, 7.2);
    villaGroup.add(poolWater);

    // Palm Trees (Stylized 3D trunk + fronds)
    const createPalmTree = (x: number, z: number, scale = 1) => {
      const treeGroup = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9 });
      const frondMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.5 });

      const trunkGeo = new THREE.CylinderGeometry(0.25 * scale, 0.4 * scale, 6 * scale, 8);
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = (3 * scale);
      trunk.rotation.z = -0.15;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      for (let i = 0; i < 6; i++) {
        const frondGeo = new THREE.ConeGeometry(1.6 * scale, 4 * scale, 4);
        const frond = new THREE.Mesh(frondGeo, frondMat);
        frond.rotation.z = 1.1;
        frond.rotation.y = (i * Math.PI) / 3;
        frond.position.set(0, 6 * scale, 0);
        frond.castShadow = true;
        treeGroup.add(frond);
      }

      treeGroup.position.set(x, 0.8, z);
      return treeGroup;
    };

    villaGroup.add(createPalmTree(10, 5, 1.2));
    villaGroup.add(createPalmTree(9, -6, 1.0));
    villaGroup.add(createPalmTree(-10, 6, 1.1));

    // Hotspot Anchor Markers (Glowing Orbs)
    const markerGeo = new THREE.SphereGeometry(0.45, 16, 16);
    const poolMarker = new THREE.Mesh(markerGeo, new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
    poolMarker.position.set(0, 2.2, 7.2);
    villaGroup.add(poolMarker);

    const terraceMarker = new THREE.Mesh(
      markerGeo,
      new THREE.MeshBasicMaterial({ color: 0xf59e0b }),
    );
    terraceMarker.position.set(-2, 10.2, 0);
    villaGroup.add(terraceMarker);

    // Mouse & Touch Interaction
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let targetRotationY = 0.4;
    let targetRotationX = 0.1;

    const onStart = (clientX: number, clientY: number) => {
      isDragging = true;
      prevX = clientX;
      prevY = clientY;
    };

    const onMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const deltaX = clientX - prevX;
      const deltaY = clientY - prevY;
      prevX = clientX;
      prevY = clientY;

      targetRotationY += deltaX * 0.007;
      targetRotationX = Math.max(-0.2, Math.min(0.5, targetRotationX + deltaY * 0.005));
    };

    const onEnd = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;

    // Mouse Events
    const handleMouseDown = (e: MouseEvent) => onStart(e.clientX, e.clientY);
    const handleMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const handleMouseUp = () => onEnd();

    // Touch Events
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) onStart(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) onMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => onEnd();

    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isRotating && !isDragging) {
        targetRotationY += 0.002;
      }

      villaGroup.rotation.y += (targetRotationY - villaGroup.rotation.y) * 0.05;
      camera.position.y += ((14 + targetRotationX * 10) - camera.position.y) * 0.05;

      // Animate pool water shimmer
      poolWater.position.y = 1.35 + Math.sin(elapsedTime * 2.5) * 0.02;

      // Pulse markers
      const pulse = 1 + Math.sin(elapsedTime * 4) * 0.15;
      poolMarker.scale.set(pulse, pulse, pulse);
      terraceMarker.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      renderer.dispose();
    };
  }, [isRotating]);

  // Handle smooth lighting change based on timeOfDay
  useEffect(() => {
    const { ambient, sun, oceanMat } = lightsRef.current;
    if (!ambient || !sun) return;

    if (timeOfDay === 'golden') {
      ambient.color.setHex(0xfff4e6);
      ambient.intensity = 0.7;
      sun.color.setHex(0xffecd2);
      sun.intensity = 1.8;
      sun.position.set(30, 40, 20);
      if (oceanMat) oceanMat.color.setHex(0x0ea5e9);
    } else if (timeOfDay === 'sunset') {
      ambient.color.setHex(0xf472b6);
      ambient.intensity = 0.8;
      sun.color.setHex(0xfb923c);
      sun.intensity = 2.2;
      sun.position.set(40, 15, 20);
      if (oceanMat) oceanMat.color.setHex(0xc084fc);
    } else if (timeOfDay === 'night') {
      ambient.color.setHex(0x312e81);
      ambient.intensity = 0.5;
      sun.color.setHex(0x60a5fa);
      sun.intensity = 0.9;
      sun.position.set(20, 30, 20);
      if (oceanMat) oceanMat.color.setHex(0x1e1b4b);
    }
  }, [timeOfDay]);

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-line bg-canvas text-ink shadow-xl ${className}`}>
      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className="h-[460px] w-full cursor-grab active:cursor-grabbing sm:h-[540px] touch-none bg-canvas"
        title="Click and drag to rotate 3D villa model"
      />

      {/* Top HUD Overlay */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 flex flex-wrap items-center justify-between p-4 sm:p-5 gap-2">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-line/80 bg-canvas/90 px-4 py-2 shadow-sm backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-ink">
            Three.js 3D Architectural Model
          </span>
        </div>

        {/* Lighting Atmosphere Controller */}
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-line/80 bg-canvas/90 p-1 shadow-sm backdrop-blur-md">
          <button
            onClick={() => setTimeOfDay('golden')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
              timeOfDay === 'golden'
                ? 'bg-clay text-ink shadow-sm'
                : 'text-muted hover:text-ink hover:bg-sand/60'
            }`}
          >
            <Sun className="size-3.5" />
            <span>Golden Hour</span>
          </button>
          <button
            onClick={() => setTimeOfDay('sunset')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
              timeOfDay === 'sunset'
                ? 'bg-clay text-ink shadow-sm'
                : 'text-muted hover:text-ink hover:bg-sand/60'
            }`}
          >
            <Sunset className="size-3.5" />
            <span>PV Sunset</span>
          </button>
          <button
            onClick={() => setTimeOfDay('night')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
              timeOfDay === 'night'
                ? 'bg-canvas text-ink border border-line shadow-sm'
                : 'text-muted hover:text-ink hover:bg-sand/60'
            }`}
          >
            <Moon className="size-3.5" />
            <span>Twilight</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating Hotspot Cards */}
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveHotspot('Infinity Terrace')}
            className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold transition backdrop-blur-md ${
              activeHotspot === 'Infinity Terrace'
                ? 'border-line bg-canvas text-ink border border-line shadow-sm'
                : 'border-line/80 bg-canvas/90 text-muted hover:border-clay hover:text-ink'
            }`}
          >
            🌊 Infinity Bay Pool
          </button>
          <button
            onClick={() => setActiveHotspot('Master Cantilever')}
            className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold transition backdrop-blur-md ${
              activeHotspot === 'Master Cantilever'
                ? 'border-clay bg-clay text-ink shadow-sm'
                : 'border-line/80 bg-canvas/90 text-muted hover:border-clay hover:text-ink'
            }`}
          >
            🌅 Master Sunset Suite
          </button>
          <button
            onClick={() => setActiveHotspot('Parota Architecture')}
            className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold transition backdrop-blur-md ${
              activeHotspot === 'Parota Architecture'
                ? 'border-line bg-canvas text-ink border border-line shadow-sm'
                : 'border-line/80 bg-canvas/90 text-muted hover:border-clay hover:text-ink'
            }`}
          >
            🌴 Sustainable Parota Wood
          </button>
        </div>

        {/* Rotate Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="flex items-center gap-1.5 rounded-full border border-line/80 bg-canvas/90 px-3.5 py-1.5 text-xs font-bold text-ink shadow-sm backdrop-blur-md hover:bg-sand/80 transition"
          >
            <RotateCcw className={`size-3.5 text-clay ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isRotating ? 'Auto Orbiting' : 'Paused (Drag to Orbit)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
