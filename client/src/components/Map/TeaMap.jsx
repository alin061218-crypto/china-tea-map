import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { useSeason } from '../../contexts/SeasonContext';

// ── 加载 GeoJSON ──
let _geoJSON = null;
async function loadGeo() {
  if (_geoJSON) return _geoJSON;
  const r = await fetch('/china.json');
  _geoJSON = await r.json();
  return _geoJSON;
}

// ── SVG 茶叶图标路径 ──
const TEA_ICON = `
  M0,-8 C2,-8 4,-6 4,-3 L3,2 L2,4 L0,7 L-2,4 L-3,2 L-4,-3
  C-4,-6 -2,-8 0,-8 Z
  M0,-6 L0,1 M-2,-3 L2,-3
`;

// ── 山脉三角形图标 ──
const MOUNTAIN_ICON = 'M0,-7 L-6,3 L0,0 L6,3 Z';

// ── 生成茶叶点位数据 ──
function buildMarkers(teas, season, projection) {
  return teas.map(t => {
    const [x, y] = projection([t.longitude, t.latitude]);
    if (!x || !y || isNaN(x) || isNaN(y)) return null;
    const inSeason = t.seasons?.includes(season);
    return {
      ...t,
      x, y,
      inSeason,
      isMountain: !!t.is_mountain,
      size: inSeason ? 18 : 11,
      color: inSeason ? '#c75b5b' : '#8ba888',
      opacity: inSeason ? 0.95 : 0.6,
    };
  }).filter(Boolean);
}

export default function TeaMap({ teas, onTeaSelect }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const { season } = useSeason();
  const [tooltip, setTooltip] = useState(null);
  const [dims, setDims] = useState({ w: 800, h: 600 });
  const zoomRef = useRef(null);
  const gRef = useRef(null);

  // 响应式尺寸
  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: width, h: height });
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // 主渲染
  useEffect(() => {
    if (!svgRef.current || teas.length === 0) return;
    loadGeo().then(geoData => {
      renderMap(geoData);
    });
  }, [teas, dims, season]);

  function renderMap(geoData) {
    const { w, h } = dims;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // 投影
    const projection = d3.geoMercator()
      .center([104.5, 36])
      .scale(Math.max(w, h) * 0.65)
      .translate([w / 2, h / 2]);

    const pathGen = d3.geoPath(projection);

    // 主容器
    const g = svg.append('g');
    gRef.current = g;

    // 缩放行为
    const zoom = d3.zoom()
      .scaleExtent([0.7, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);
    zoomRef.current = zoom;

    // ── SVG背景 ──
    svg.append('rect')
      .attr('width', '100%').attr('height', '100%')
      .attr('fill', '#f0ebe0');

    // ── 调试：如果地图不渲染，至少能看到这个圆圈 ──
    g.append('circle')
      .attr('cx', w/2).attr('cy', h/2)
      .attr('r', 30)
      .attr('fill', '#c75b5b')
      .attr('opacity', 0.5);

    // ── 省份层 ──
    g.append('g').attr('class', 'provinces')
      .selectAll('path')
      .data(geoData.features)
      .join('path')
      .attr('d', pathGen)
      .attr('fill', '#faf7f2')
      .attr('stroke', 'rgba(170,150,120,0.45)')
      .attr('stroke-width', 0.8)
      .attr('vector-effect', 'non-scaling-stroke');

    // ── 茶叶点位 ──
    const markers = buildMarkers(teas, season, projection);
    const markerG = g.append('g').attr('class', 'markers');

    markers.forEach(m => {
      const group = markerG.append('g')
        .attr('transform', `translate(${m.x},${m.y})`)
        .attr('class', 'tea-marker')
        .style('cursor', 'pointer')
        .style('transition', 'opacity 0.6s');

      if (m.isMountain) {
        // 山脉标记
        group.append('path')
          .attr('d', MOUNTAIN_ICON)
          .attr('fill', 'rgba(140,155,170,0.5)')
          .attr('stroke', 'rgba(140,155,170,0.6)')
          .attr('stroke-width', 0.5);
      } else {
        // 茶叶标记 — 外晕
        group.append('circle')
          .attr('r', m.inSeason ? 16 : 10)
          .attr('fill', m.inSeason ? 'rgba(199,91,91,0.15)' : 'rgba(139,168,136,0.12)')
          .attr('class', 'glow');
        // 主体
        group.append('circle')
          .attr('r', m.size)
          .attr('fill', m.color)
          .attr('opacity', m.opacity)
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5)
          .style('transition', 'all 0.6s');
      }

      // 交互事件
      group
        .on('mouseenter', (event) => {
          setTooltip({ x: m.x, y: m.y - 18, name: m.name, city: m.city, province: m.province });
          d3.select(event.currentTarget).select('circle').transition().duration(150).attr('r', m.size * 1.5);
        })
        .on('mouseleave', (event) => {
          setTooltip(null);
          d3.select(event.currentTarget).select('circle').transition().duration(150).attr('r', m.size);
        })
        .on('click', () => {
          if (!m.isMountain) onTeaSelect(m);
        });
    });

    // 初始居中
    svg.call(zoom.transform, d3.zoomIdentity);
  }

  // 季节切换时更新标记样式
  useEffect(() => {
    if (!gRef.current || teas.length === 0) return;
    const g = gRef.current;
    g.selectAll('.tea-marker').each(function () {
      const el = d3.select(this);
      const isSeason = el.attr('data-inseason') === 'true';
      // 颜色渐变过渡
    });
  }, [season]);

  // 缩放控制
  const zoomIn = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(300)
      .call(zoomRef.current.scaleBy, 1.3);
  }, []);

  const zoomOut = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(300)
      .call(zoomRef.current.scaleBy, 0.7);
  }, []);

  const zoomReset = useCallback(() => {
    if (!svgRef.current || !zoomRef.current || !dims.w) return;
    d3.select(svgRef.current).transition().duration(500)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(dims.w * 0.12, dims.h * 0.05).scale(0.95));
  }, [dims]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden" style={{ background: 'transparent' }}>
      <svg ref={svgRef} width="100%" height="100%" className="block" />

      {/* 悬浮气泡 */}
      {tooltip && (
        <div className="absolute pointer-events-none card-glass rounded-xl px-3 py-1.5 text-xs z-20 fade-in"
          style={{
            left: tooltip.x + 14, top: tooltip.y - 8,
            color: 'var(--ink-dark)',
            borderRadius: '10px',
            fontSize: '12px',
            padding: '4px 12px',
          }}>
          <span className="font-medium">{tooltip.name}</span>
          <span className="text-ink-light ml-1">{tooltip.province}·{tooltip.city}</span>
        </div>
      )}

      {/* 四个角的缩放按钮（通过props暴露给父组件） */}
      <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={zoomReset} />
    </div>
  );
}

// ── 地图角落缩放按钮 ──
function ZoomControls({ onZoomIn, onZoomOut, onReset }) {
  return (
    <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 z-20">
      <button onClick={onZoomIn} className="btn-icon text-lg" title="放大">+</button>
      <button onClick={onZoomOut} className="btn-icon text-lg" title="缩小">−</button>
      <button onClick={onReset} className="btn-icon text-sm" title="重置">⟳</button>
    </div>
  );
}
