import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';

import { useSeason } from '../../contexts/SeasonContext';

import { EffectController } from '../../effects/EffectController';
import { getRegionAtmosphereProfile, normalizeRegionName } from '../../effects/regionAtmosphereProfiles';

import mountainLayer1 from '../../assets/generated/map-mountains-layer-1-farthest.png';
import mountainLayer2 from '../../assets/generated/map-mountains-layer-2-mid-far.png';
import mountainLayer3 from '../../assets/generated/map-mountains-layer-3-mid-near.png';
import mountainLayer4 from '../../assets/generated/map-mountains-layer-4-near-gold.png';
import riverTrackMountainsLayer from '../../assets/generated/map-river-track-mountains.png';

import MapEffectLayer from '../Effects/MapEffectLayer';

let geoCache = null;
async function loadGeo() {
  if (geoCache) return geoCache;
  const response = await fetch('/china.json');
  geoCache = await response.json();
  return geoCache;
}

let neighborsCache = null;
async function loadNeighbors() {
  if (neighborsCache) return neighborsCache;
  const response = await fetch('/neighbors.json');
  neighborsCache = await response.json();
  return neighborsCache;
}

const CHINA_BOUNDS = { minLon: 73, maxLon: 135, minLat: 18, maxLat: 54 };
const ATLAS_BOUNDS = { minLon: 55, maxLon: 150, minLat: 0, maxLat: 60 };

function scaleRgbaAlpha(color, scale = 0.6) {
  const match = color?.match(/^rgba\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)$/);
  if (!match) return color;
  const [, r, g, b, alpha] = match;
  const nextAlpha = Math.max(0, Math.min(1, Number(alpha) * scale));
  return `rgba(${r.trim()}, ${g.trim()}, ${b.trim()}, ${nextAlpha.toFixed(3)})`;
}

function MountainLayerImage({ href, atlasRect, depth = 1 }) {
  if (!atlasRect) return null;
  return (
    <image
      className="mountain-raster-image"
      data-depth={depth}
      href={href}
      x={atlasRect.x}
      y={atlasRect.y}
      width={atlasRect.width}
      height={atlasRect.height}
      preserveAspectRatio="none"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}

function makePlanarProjector(dims) {
  const frame = {
    left: dims.width * 0.045,
    top: dims.height * 0.075,
    width: dims.width * 0.86,
    height: dims.height * 0.82,
  };
  const lonSpan = CHINA_BOUNDS.maxLon - CHINA_BOUNDS.minLon;
  const latSpan = CHINA_BOUNDS.maxLat - CHINA_BOUNDS.minLat;
  const scale = Math.min(frame.width / lonSpan, frame.height / latSpan);
  const mapWidth = lonSpan * scale;
  const mapHeight = latSpan * scale;
  const left = (dims.width - mapWidth) / 2 - dims.width * 0.025;
  const top = frame.top + (frame.height - mapHeight) / 2 + dims.height * 0.005;

  return ([lon, lat]) => [
    left + (Number(lon) - CHINA_BOUNDS.minLon) * scale,
    top + (CHINA_BOUNDS.maxLat - Number(lat)) * scale,
  ];
}

function ringToPath(ring, project) {
  if (!ring?.length) return '';
  return ring.map((point, index) => {
    const [x, y] = project(point);
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ') + ' Z';
}

function geometryToPath(geometry, project) {
  if (!geometry) return '';
  if (geometry.type === 'Polygon') return geometry.coordinates.map((ring) => ringToPath(ring, project)).join(' ');
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.flatMap((polygon) => polygon.map((ring) => ringToPath(ring, project))).join(' ');
  return '';
}

const TeaMap = forwardRef(function TeaMap({ teas = [], isInteractive = true, onTeaSelect }, ref) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const zoomRef = useRef(null);
  const { season } = useSeason();
  const [geoData, setGeoData] = useState(null);
  const [neighborsData, setNeighborsData] = useState(null);
  const [dims, setDims] = useState({ width: 1200, height: 820 });
  const [transform, setTransform] = useState(d3.zoomIdentity);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const hoverTimer = useRef(null);
  const leaveTimer = useRef(null);

  useEffect(() => {
    loadGeo().then(setGeoData).catch(() => setGeoData(null));
  }, []);

  useEffect(() => {
    loadNeighbors().then(setNeighborsData).catch(() => setNeighborsData(null));
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current) return undefined;
    const resize = () => {
      const rect = containerRef.current.getBoundingClientRect();
      setDims({ width: Math.max(rect.width, 760), height: Math.max(rect.height, 560) });
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const displayGeo = useMemo(() => {
    if (!geoData) return null;
    return geoData.features.filter((feature) => feature.properties?.name);
  }, [geoData]);

  const project = useMemo(() => makePlanarProjector(dims), [dims]);

  const atlasRect = useMemo(() => {
    if (!project) return null;
    const [x1, y1] = project([ATLAS_BOUNDS.minLon, ATLAS_BOUNDS.maxLat]);
    const [x2, y2] = project([ATLAS_BOUNDS.maxLon, ATLAS_BOUNDS.minLat]);
    return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
  }, [project]);

  const paths = useMemo(() => {
    return displayGeo?.map((feature) => ({
      id: feature.properties?.adcode || feature.properties?.name,
      name: feature.properties?.name,
      d: geometryToPath(feature.geometry, project),
      atmosphereProfile: getRegionAtmosphereProfile({
        longitude: feature.properties?.centroid?.[0] ?? feature.properties?.center?.[0],
        latitude: feature.properties?.centroid?.[1] ?? feature.properties?.center?.[1],
      }),
    })) || [];
  }, [displayGeo, project]);

  const teaSignals = useMemo(() => {
    return teas.map((tea) => {
      const [x, y] = project([tea.longitude, tea.latitude]);
      const atmosphereProfile = getRegionAtmosphereProfile(tea);
      const regionFeature = paths.find((feature) => normalizeRegionName(feature.name) === normalizeRegionName(tea.province));
      return {
        ...tea,
        x,
        y,
        atmosphereProfile,
        regionFeature,
        inHoveredRegion: hoveredRegion ? normalizeRegionName(tea.province) === normalizeRegionName(hoveredRegion.name) : false,
      };
    }).filter((tea) => Number.isFinite(tea.x) && Number.isFinite(tea.y));
  }, [hoveredRegion, paths, project, teas]);

  const teaSignalState = useMemo(() => {
    if (transform.k >= 2.65) return 'close';
    if (transform.k >= 1.45) return 'mid';
    return 'far';
  }, [transform.k]);

  const neighborPaths = useMemo(() => {
    if (!neighborsData) return [];
    return neighborsData.features.map((feature) => {
      const d = geometryToPath(feature.geometry, project);
      if (!d) return null;
      return {
        id: feature.properties?.NAME || feature.properties?.name || feature.properties?.ADMIN,
        d,
      };
    }).filter(Boolean);
  }, [neighborsData, project]);

  useEffect(() => {
    EffectController.dispatch({ type: 'season:preset', payload: { season } });
  }, [season]);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      EffectController.dispatch({ type: 'region:hover:end' });
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current) return undefined;
    const svg = d3.select(svgRef.current);
    if (!isInteractive) {
      svg.on('.zoom', null);
      zoomRef.current = null;
      return undefined;
    }
    const zoom = d3.zoom().scaleExtent([0.82, 5.2]).on('zoom', (event) => setTransform(event.transform));
    svg.call(zoom);
    zoomRef.current = zoom;
    return () => svg.on('.zoom', null);
  }, [isInteractive]);

  const applyZoom = useCallback((fn) => {
    if (!isInteractive || !svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(1120).ease(d3.easeCubicInOut).call(fn);
  }, [isInteractive]);

  const handleRegionHover = useCallback((feature) => {
    if (!isInteractive) return;
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      setHoveredRegion({ id: feature.id, name: feature.name });
      EffectController.dispatch({
        type: 'region:hover',
        payload: {
          region: {
            id: feature.id,
            name: feature.name,
            path: feature.d,
            atmosphereProfile: feature.atmosphereProfile,
          },
        },
      });
      hoverTimer.current = null;
    }, 120);
  }, [isInteractive]);

  const handleRegionLeave = useCallback(() => {
    if (!isInteractive) return;
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      setHoveredRegion(null);
      EffectController.dispatch({ type: 'region:hover:end' });
      leaveTimer.current = null;
    }, 80);
  }, [isInteractive]);

  const handleTeaClick = useCallback((tea) => {
    if (!isInteractive) return;
    onTeaSelect?.(tea);
  }, [isInteractive, onTeaSelect]);

  useImperativeHandle(ref, () => ({
    zoomIn: () => applyZoom((selection) => zoomRef.current.scaleBy(selection, 1.26)),
    zoomOut: () => applyZoom((selection) => zoomRef.current.scaleBy(selection, 0.8)),
    reset: () => applyZoom((selection) => zoomRef.current.transform(selection, d3.zoomIdentity)),
  }), [applyZoom]);

  return (
    <div ref={containerRef} className="ink-map-stage relative h-full w-full overflow-hidden" data-intro-state="active">
      <svg ref={svgRef} width="100%" height="100%" className="absolute inset-0 z-[2] block map-interaction-layer" data-interactive={isInteractive ? 'true' : 'false'}>
        <defs>
          <filter id="paperRelief">
            <feDropShadow dx="0" dy="1" stdDeviation="0.3" floodColor="#fff" floodOpacity="0.9" />
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#8f7356" floodOpacity="0.08" />
          </filter>
          <filter id="mountainBlur">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id="inkWashHeavy" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6.5" />
          </filter>
          <filter id="inkWashMid" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
          <filter id="inkWashLight" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.8" />
          </filter>
          <linearGradient id="provinceWash" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,252,246,.46)" />
            <stop offset="58%" stopColor="rgba(220,196,176,.24)" />
            <stop offset="100%" stopColor="rgba(176,143,124,.18)" />
          </linearGradient>
          <radialGradient id="mapAura" cx="50%" cy="48%" r="54%">
            <stop offset="0%" stopColor="rgba(255,255,255,.28)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapAura)" />
        <g transform={transform.toString()} className="china-relief">
          <MountainLayerImage href={mountainLayer1} atlasRect={atlasRect} depth={1} />
          <g className="neighbors-layer" aria-hidden="true">
            {neighborPaths.map((neighbor) => (
              <path
                key={neighbor.id}
                d={neighbor.d}
                fill="rgba(190, 183, 175, 0.12)"
                stroke="rgba(210, 200, 185, 0.28)"
                strokeWidth={0.5 / Math.sqrt(transform.k)}
                vectorEffect="non-scaling-stroke"
                filter="url(#inkWashMid)"
              />
            ))}
          </g>
          <MountainLayerImage href={mountainLayer2} atlasRect={atlasRect} depth={2} />
          <MountainLayerImage href={mountainLayer3} atlasRect={atlasRect} depth={3} />
          <g className="province-ink-layer" filter="url(#paperRelief)">
            {paths.map((feature) => {
              const isHoveredRegion = hoveredRegion?.id === feature.id;
              const centerX = dims.width * 0.48;
              const centerY = dims.height * 0.54;
              const pathMatch = feature.d.match(/M([\d.]+)\s+([\d.]+)/);
              const px = pathMatch ? parseFloat(pathMatch[1]) : centerX;
              const py = pathMatch ? parseFloat(pathMatch[2]) : centerY;
              const dist = Math.sqrt((px - centerX) ** 2 + (py - centerY) ** 2);
              const maxDist = Math.sqrt(centerX ** 2 + centerY ** 2);
              const delay = (dist / maxDist) * 1.8;

              return (
                <path
                  key={feature.id}
                  className={`province-path${isHoveredRegion ? ' province-active' : ''}${hoveredRegion && !isHoveredRegion ? ' province-dimmed' : ''}`}
                  data-atmosphere-profile={feature.atmosphereProfile.id}
                  d={feature.d}
                  fill={scaleRgbaAlpha(feature.atmosphereProfile.wash)}
                  stroke={feature.atmosphereProfile.stroke}
                  strokeWidth={0.72 / Math.sqrt(transform.k)}
                  vectorEffect="non-scaling-stroke"
                  style={{ animationDelay: `${delay}s` }}
                  onPointerEnter={() => handleRegionHover(feature)}
                  onPointerLeave={handleRegionLeave}
                />
              );
            })}
          </g>
          <MountainLayerImage href={riverTrackMountainsLayer} atlasRect={atlasRect} depth="flow-mountains" />
          <MountainLayerImage href={mountainLayer4} atlasRect={atlasRect} depth={4} />
          <g className="tea-signal-layer" data-signal-state={teaSignalState}>
            {teaSignals.map((tea) => (
              <g
                key={tea.id}
                className={`tea-signal ${tea.inHoveredRegion ? 'region-visible' : ''}`}
                data-atmosphere-profile={tea.atmosphereProfile.id}
                data-signal-state={teaSignalState}
                transform={`translate(${tea.x.toFixed(2)} ${tea.y.toFixed(2)})`}
                style={{
                  '--tea-dot-fill': tea.atmosphereProfile.dot,
                  '--tea-bloom-fill': tea.atmosphereProfile.wash,
                  '--tea-opacity-far': (0.3 * tea.atmosphereProfile.teaDensity).toFixed(3),
                  '--tea-opacity-mid': (0.62 * tea.atmosphereProfile.teaDensity).toFixed(3),
                  '--tea-opacity-close': Math.min(0.92, 0.86 * tea.atmosphereProfile.teaDensity).toFixed(3),
                  '--tea-opacity-region': Math.min(0.93, 0.88 * tea.atmosphereProfile.teaDensity).toFixed(3),
                  '--tea-bloom-mid-opacity': (0.22 * tea.atmosphereProfile.bloomIntensity).toFixed(3),
                  '--tea-bloom-close-opacity': (0.34 * tea.atmosphereProfile.bloomIntensity).toFixed(3),
                  '--tea-bloom-region-opacity': (0.32 * tea.atmosphereProfile.bloomIntensity).toFixed(3),
                  '--tea-motion-duration': `${Math.round(1180 * tea.atmosphereProfile.motionScale)}ms`,
                  animationDelay: `${1.5 + Math.sqrt((tea.x - dims.width * 0.48) ** 2 + (tea.y - dims.height * 0.54) ** 2) / Math.sqrt((dims.width * 0.48) ** 2 + (dims.height * 0.54) ** 2) * 1.4}s`,
                }}
                onClick={() => handleTeaClick(tea)}
                onPointerEnter={() => tea.regionFeature && handleRegionHover(tea.regionFeature)}
                onPointerLeave={handleRegionLeave}
              >
                <circle className="tea-signal-hit" r={14} fill="transparent" style={{ pointerEvents: 'auto' }} />
                <circle className="tea-signal-bloom" r="12" vectorEffect="non-scaling-stroke" />
                <image
                  href={`/images/tea-icons/${tea.categoryEn}.png`}
                  x={-12}
                  y={-12}
                  width={24}
                  height={24}
                  className="tea-icon-bloom"
                />
                <circle className="tea-signal-dot" r="3.2" vectorEffect="non-scaling-stroke" />
                <g className="tea-signal-label">
                  <text className="tea-signal-name" x="8" y="-5">{tea.name}</text>
                  <text className="tea-signal-hint" x="8" y="9">{tea.province} / {tea.category}</text>
                </g>
              </g>
            ))}
          </g>
        </g>
      </svg>
      <MapEffectLayer transform={transform.toString()} introState="active" />
    </div>
  );
});

TeaMap.displayName = 'TeaMap';

export default TeaMap;
