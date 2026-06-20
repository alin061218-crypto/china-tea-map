import { useEffect, useRef, useState, useCallback } from 'react';
import * as echarts from 'echarts';
import { useSeason } from '../../contexts/SeasonContext';

// 加载 GeoJSON
let chinaGeoJSON = null;
async function loadGeoJSON() {
  if (chinaGeoJSON) return chinaGeoJSON;
  const resp = await fetch('/china.json');
  chinaGeoJSON = await resp.json();
  return chinaGeoJSON;
}

// 生成茶叶散点数据
function buildTeaScatterData(teas, season) {
  return teas
    .filter(t => !t.is_mountain)
    .map(t => ({
      name: t.name,
      value: [t.longitude, t.latitude, t],
      symbolSize: t.seasons?.includes(season) ? 18 : 10,
      itemStyle: {
        color: t.seasons?.includes(season) ? '#c41e3a' : '#b8956a',
        shadowBlur: t.seasons?.includes(season) ? 12 : 4,
        shadowColor: t.seasons?.includes(season) ? 'rgba(196,30,58,0.4)' : 'rgba(184,149,106,0.2)',
      },
    }));
}

// 生成山脉散点数据
function buildMountainScatterData(teas) {
  return teas
    .filter(t => t.is_mountain)
    .map(t => ({
      name: t.name,
      value: [t.longitude, t.latitude, t],
      symbolSize: 14,
      itemStyle: {
        color: '#8ba3a0',
        shadowBlur: 6,
        shadowColor: 'rgba(107,125,141,0.3)',
      },
    }));
}

export default function ChinaMap({ teas, season, onTeaSelect }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);
  const [geoLoaded, setGeoLoaded] = useState(false);

  // 初始化地图
  useEffect(() => {
    let mounted = true;
    loadGeoJSON().then(geo => {
      if (!mounted || !chartRef.current) return;
      echarts.registerMap('china', geo);
      setGeoLoaded(true);
    });
    return () => { mounted = false; };
  }, []);

  // 更新图表
  useEffect(() => {
    if (!geoLoaded || !chartRef.current || teas.length === 0) return;

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current, null, { renderer: 'canvas' });
    }

    const chart = instanceRef.current;
    const teaData = buildTeaScatterData(teas, season);
    const mountainData = buildMountainScatterData(teas);

    const option = {
      backgroundColor: 'transparent',
      tooltip: { show: false },
      geo: {
        map: 'china',
        roam: true,
        zoom: 1.2,
        center: [104.5, 36],
        scaleLimit: { min: 0.8, max: 5 },
        itemStyle: {
          areaColor: '#f0ebe0',
          borderColor: '#c8c0b4',
          borderWidth: 0.8,
          shadowBlur: 0,
        },
        emphasis: {
          disabled: true, // 禁用省份高亮
          itemStyle: { areaColor: '#f0ebe0' },
        },
        label: { show: false },
      },
      series: [
      // 茶叶散点 - 基础层
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        data: teaData,
        symbol: 'circle',
        symbolSize: (val) => val[2]?.symbolSize || 10,
        itemStyle: {
          color: (params) => params.data?.itemStyle?.color || '#b8956a',
          shadowBlur: 6,
          shadowColor: 'rgba(184,149,106,0.3)',
          borderColor: 'rgba(255,255,255,0.6)',
          borderWidth: 1,
        },
        emphasis: {
          scale: 1.8,
          itemStyle: { shadowBlur: 20, shadowColor: 'rgba(196,30,58,0.5)' },
        },
        zlevel: 2,
      },
      // 当季茶叶绽放层
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: teaData.filter(d => d.itemStyle.color === '#c41e3a'),
        symbol: 'circle',
        symbolSize: 6,
        rippleEffect: {
          brushType: 'stroke',
          scale: 4,
          period: 4,
          color: 'rgba(196,30,58,0.3)',
        },
        itemStyle: { color: 'rgba(196,30,58,0.01)' },
        zlevel: 3,
      },
      // 山脉散点
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        data: mountainData,
        symbol: 'triangle',
        symbolSize: 14,
        itemStyle: {
          color: '#8ba3a0',
          shadowBlur: 6,
          shadowColor: 'rgba(107,125,141,0.3)',
          borderColor: 'rgba(255,255,255,0.5)',
          borderWidth: 1,
        },
        emphasis: {
          scale: 1.5,
          itemStyle: { shadowBlur: 16, shadowColor: 'rgba(107,125,141,0.5)' },
        },
        zlevel: 1,
      },
      ], // series end
    };

    chart.setOption(option, true);

    // 点击事件
    const handleClick = (params) => {
      if (params.data && params.data.value && params.data.value[2]) {
        onTeaSelect(params.data.value[2]);
      }
    };
    chart.on('click', handleClick);

    // 响应式
    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      chart.off('click', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [geoLoaded, teas, season, onTeaSelect]);

  // 切换季节时更新标记
  useEffect(() => {
    if (!instanceRef.current || !geoLoaded || teas.length === 0) return;
    const chart = instanceRef.current;
    const teaData = buildTeaScatterData(teas, season);
    const mountainData = buildMountainScatterData(teas);

    chart.setOption({
      series: [
        { data: teaData },
        { data: teaData.filter(d => d.itemStyle.color === '#c41e3a') },
        { data: mountainData },
      ],
    });
  }, [season, teas, geoLoaded]);

  return (
    <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
  );
}
