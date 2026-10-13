'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Compass,
  Sparkles,
  MapPin,
  Eye,
  Sun,
  Sunset,
  Moon,
  Info,
} from 'lucide-react';

export interface PanoramaScene {
  id: string;
  name: string;
  title: string;
  location: string;
  imageUrl: string;
  description: string;
  hotspots: Array<{
    id: string;
    xPercent: number; // 0 to 100 horizontal position
    yPercent: number; // 0 to 100 vertical position
    title: string;
    description: string;
  }>;
}

const PANORAMA_SCENES: PanoramaScene[] = [
  {
    id: 'terrace',
    name: 'Oceanfront Terrace & Pool',
    title: 'Infinity Ocean Terrace',
    location: 'Conchas Chinas, Puerto Vallarta',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=3200&q=95',
    description: 'Expansive travertine deck with vanishing-edge heated saltwater infinity pool overlooking Banderas Bay.',
    hotspots: [
      {
        id: 'pool',
        xPercent: 32,
        yPercent: 62,
        title: 'Heated Infinity Plunge Pool',
        description: 'Glass-tile pool blending directly into the Pacific horizon with integrated submerged lounge benches.',
      },
      {
        id: 'sunset-view',
        xPercent: 64,
        yPercent: 36,
        title: '365-Day Sunset Orientation',
        description: 'Unobstructed western exposure capturing golden hour sunsets over Los Arcos rock marine reserve.',
      },
      {
        id: 'pergola',
        xPercent: 82,
        yPercent: 48,
        title: 'Parota Alfresco Dining',
        description: 'Custom Mexican Parota hardwood dining table accommodating 10 guests under recessed warm lighting.',
      },
    ],
  },
  {
    id: 'living',
    name: 'Great Living Salon',
    title: 'Open Living Pavilion',
    location: 'Zona Romántica, Puerto Vallarta',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=3200&q=95',
    description: 'Double-height great room with floor-to-ceiling retractable glass walls opening directly to Pacific breezes.',
    hotspots: [
      {
        id: 'glass-wall',
        xPercent: 28,
        yPercent: 44,
        title: 'Pocket Glass Wall System',
        description: 'Multi-slide hurricane-rated glass doors retract fully into hidden wall pockets for seamless indoor/outdoor living.',
      },
      {
        id: 'furniture',
        xPercent: 52,
        yPercent: 68,
        title: 'Custom Turnkey Furnishings',
        description: 'Italian linen sectional paired with artisan stone tables hand-crafted in Guadalajara.',
      },
    ],
  },
  {
    id: 'master',
    name: 'Master Oceanfront Suite',
    title: 'Master Sunset Suite',
    location: 'Amapas Hillside, Puerto Vallarta',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=3200&q=95',
    description: 'Cantilevered private bedroom suite with wraparound sunrise-to-sunset balconies and spa bath.',
    hotspots: [
      {
        id: 'bed-balcony',
        xPercent: 40,
        yPercent: 45,
        title: 'King Suite Ocean Panorama',
        description: 'Wake up to the sounds of ocean waves and watch humpback whales during winter migration.',
      },
      {
        id: 'terrace-access',
        xPercent: 75,
        yPercent: 54,
        title: 'Private Sunset Loungers',
        description: 'Dedicated private terrace isolated from guest areas with motorized sun shades.',
      },
    ],
  },
  {
    id: 'dining',
    name: 'Chef Kitchen & Dining',
    title: 'Gourmet Kitchen Pavilion',
    location: 'Versalles / Marina Border, Puerto Vallarta',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=3200&q=95',
    description: 'Commercial-grade kitchen with monolithic quartzite waterfall island, wine room, and breakfast bar.',
    hotspots: [
      {
        id: 'kitchen-island',
        xPercent: 48,
        yPercent: 58,
        title: 'Taj Mahal Quartzite Island',
        description: 'Seamless quartzite stone with Sub-Zero refrigeration and Wolf induction cooktop.',
      },
    ],
  },
];

interface PanoramaViewerProps {
  className?: string;
}

export default function PanoramaViewer({ className = '' }: PanoramaViewerProps) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [panX, setPanX] = useState(50); // percentage 0 to 100
  const [panY, setPanY] = useState(50); // percentage 20 to 80
  const [zoom, setZoom] = useState(1); // 1 to 2.2
  const [isAutoPanning, setIsAutoPanning] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [atmosphere, setAtmosphere] = useState<'day' | 'sunset' | 'night'>('sunset');
  const [selectedHotspot, setSelectedHotspot] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 50, panY: 50 });

  const activeScene = PANORAMA_SCENES[activeSceneIndex];

  // Auto-pan animation when enabled and not dragging
  useEffect(() => {
    if (!isAutoPanning) return;
    const interval = setInterval(() => {
      setPanX((prev) => {
        const next = prev + 0.08;
        return next > 100 ? 0 : next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoPanning]);

  // Pointer interaction (Mouse + Touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX,
      panY,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStartRef.current.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStartRef.current.y) / rect.height) * 100;

    let newPanX = dragStartRef.current.panX - deltaX * 1.2;
    if (newPanX < 0) newPanX = 100 + newPanX;
    if (newPanX > 100) newPanX = newPanX - 100;

    const newPanY = Math.max(20, Math.min(80, dragStartRef.current.panY - deltaY * 0.8));

    setPanX(newPanX);
    setPanY(newPanY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Zoom controls
  const handleZoom = (direction: 'in' | 'out') => {
    setZoom((prev) => {
      if (direction === 'in') return Math.min(2.0, prev + 0.25);
      return Math.max(1.0, prev - 0.25);
    });
  };

  // Calculate compass direction based on panX
  const getCompassHeading = (x: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.floor(((x % 100) / 100) * directions.length);
    return directions[index];
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Filter effect based on atmosphere
  const getAtmosphereFilter = () => {
    if (atmosphere === 'sunset') {
      return 'sepia(0.18) saturate(1.25) contrast(1.05) hue-rotate(-8deg)';
    }
    if (atmosphere === 'night') {
      return 'brightness(0.72) contrast(1.15) hue-rotate(185deg) saturate(1.1)';
    }
    return 'brightness(1.02) contrast(1.04) saturate(1.1)';
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-3xl border border-line bg-canvas select-none shadow-2xl ${className} ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Panorama Viewport */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative h-[500px] sm:h-[620px] w-full cursor-grab active:cursor-grabbing overflow-hidden touch-none"
      >
        {/* Real High-Resolution Panorama Image */}
        <div
          className="absolute inset-0 size-full pointer-events-none transition-transform duration-75 ease-out"
          style={{
            backgroundImage: `url(${activeScene.imageUrl})`,
            backgroundPosition: `${panX}% ${panY}%`,
            backgroundSize: `${Math.round(240 * zoom)}% auto`,
            backgroundRepeat: 'repeat-x',
            filter: getAtmosphereFilter(),
          }}
        />

        {/* Ambient Vignette Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ocean/60 via-transparent to-ocean/30" />

        {/* Interactive Hotspots */}
        {activeScene.hotspots.map((spot) => {
          // Adjust hotspot horizontal position relative to panX
          const screenX = ((spot.xPercent - panX + 150) % 100);
          const screenY = spot.yPercent;

          return (
            <div
              key={spot.id}
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
              style={{
                left: `${screenX}%`,
                top: `${screenY}%`,
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedHotspot(spot);
                }}
                className="group relative flex items-center justify-center size-9 rounded-full bg-clay/90 text-ink shadow-lg ring-4 ring-canvas/50 hover:scale-110 hover:bg-canvas transition"
                title={spot.title}
              >
                <Eye className="size-4 text-ink" />
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-canvas/90 border border-line px-2 py-0.5 text-[10px] font-bold text-ink opacity-0 group-hover:opacity-100 transition shadow-sm">
                  {spot.title}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Top HUD Bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6">
        {/* Location & Scene Title */}
        <div className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-canvas/20 bg-canvas/85 border border-line px-4 py-2 backdrop-blur-md text-ink shadow-lg">
          <MapPin className="size-4 text-clay shrink-0" />
          <div className="leading-tight">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-ink">
              {activeScene.title}
            </span>
            <span className="block text-[9px] text-ink/70">{activeScene.location}</span>
          </div>
        </div>

        {/* Compass & Atmosphere Filters */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Compass Badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-canvas/20 bg-canvas/85 border border-line px-3 py-1.5 backdrop-blur-md text-ink text-xs font-mono font-bold shadow-lg">
            <Compass className="size-3.5 text-clay animate-spin" style={{ animationDuration: '12s' }} />
            <span>{getCompassHeading(panX)}</span>
          </div>

          {/* Atmosphere Lighting Shifter */}
          <div className="flex items-center rounded-full border border-canvas/20 bg-canvas/85 border border-line p-1 backdrop-blur-md shadow-lg">
            <button
              type="button"
              onClick={() => setAtmosphere('day')}
              className={`rounded-full px-2.5 py-1 text-xs font-bold transition flex items-center gap-1 ${
                atmosphere === 'day' ? 'bg-amber-400 text-ink' : 'text-ink/80 hover:text-ink'
              }`}
              title="Daylight Panorama"
            >
              <Sun className="size-3.5" />
              <span className="hidden sm:inline">Day</span>
            </button>
            <button
              type="button"
              onClick={() => setAtmosphere('sunset')}
              className={`rounded-full px-2.5 py-1 text-xs font-bold transition flex items-center gap-1 ${
                atmosphere === 'sunset' ? 'bg-clay text-ink' : 'text-ink/80 hover:text-ink'
              }`}
              title="PV Sunset Panorama"
            >
              <Sunset className="size-3.5" />
              <span className="hidden sm:inline">Sunset</span>
            </button>
            <button
              type="button"
              onClick={() => setAtmosphere('night')}
              className={`rounded-full px-2.5 py-1 text-xs font-bold transition flex items-center gap-1 ${
                atmosphere === 'night' ? 'bg-indigo-600 text-ink' : 'text-ink/80 hover:text-ink'
              }`}
              title="Twilight Panorama"
            >
              <Moon className="size-3.5" />
              <span className="hidden sm:inline">Twilight</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Hotspot Detail Modal / Popover */}
      {selectedHotspot && (
        <div className="absolute top-20 right-4 sm:right-6 z-20 max-w-xs animate-scaleIn rounded-2xl border border-line bg-canvas p-4 text-ink shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <span className="eyebrow text-clay">Architectural Feature</span>
            <button
              type="button"
              onClick={() => setSelectedHotspot(null)}
              className="text-xs font-bold text-muted hover:text-ink px-1.5 py-0.5 rounded"
            >
              ✕
            </button>
          </div>
          <h4 className="font-display text-lg font-bold text-ink mt-2">
            {selectedHotspot.title}
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {selectedHotspot.description}
          </p>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 sm:p-6">
        {/* Room / Scene Switcher */}
        <div className="pointer-events-auto flex items-center justify-center gap-2 overflow-x-auto pb-1">
          {PANORAMA_SCENES.map((scene, idx) => {
            const isSelected = activeSceneIndex === idx;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => {
                  setActiveSceneIndex(idx);
                  setSelectedHotspot(null);
                  setPanX(50);
                }}
                className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-bold transition shadow-lg shrink-0 ${
                  isSelected
                    ? 'border border-clay bg-canvas text-ink ring-2 ring-clay/40'
                    : 'border border-canvas/20 bg-canvas/85 border border-line text-ink/80 hover:bg-canvas hover:text-ink'
                }`}
              >
                <div
                  className="size-6 rounded-lg bg-cover bg-center shrink-0 border border-line"
                  style={{ backgroundImage: `url(${scene.imageUrl})` }}
                />
                <span>{scene.name}</span>
              </button>
            );
          })}
        </div>

        {/* Viewport Control Tools (Zoom, Auto-Pan, Fullscreen) */}
        <div className="pointer-events-auto flex items-center justify-between text-ink">
          <div className="flex items-center gap-1.5 rounded-full border border-canvas/20 bg-canvas/85 border border-line px-3 py-1.5 text-xs backdrop-blur-md shadow-lg">
            <span className="text-[10px] uppercase font-bold tracking-wider text-ink/70">
              Drag to pan 360°
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-canvas/20 bg-canvas/85 border border-line p-1 backdrop-blur-md shadow-lg">
            {/* Auto-Pan Toggle */}
            <button
              type="button"
              onClick={() => setIsAutoPanning(!isAutoPanning)}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition ${
                isAutoPanning ? 'bg-clay text-ink' : 'text-ink/80 hover:text-ink'
              }`}
              title="Toggle Auto Panning"
            >
              <RotateCcw className={`size-3.5 ${isAutoPanning ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
              <span className="hidden sm:inline">{isAutoPanning ? 'Auto' : 'Paused'}</span>
            </button>

            {/* Zoom In */}
            <button
              type="button"
              onClick={() => handleZoom('in')}
              className="p-1.5 rounded-full text-ink/80 hover:text-ink hover:bg-canvas/10 transition"
              title="Zoom In"
            >
              <ZoomIn className="size-4" />
            </button>

            {/* Zoom Out */}
            <button
              type="button"
              onClick={() => handleZoom('out')}
              className="p-1.5 rounded-full text-ink/80 hover:text-ink hover:bg-canvas/10 transition"
              title="Zoom Out"
            >
              <ZoomOut className="size-4" />
            </button>

            {/* Fullscreen */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-full text-ink/80 hover:text-ink hover:bg-canvas/10 transition"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
