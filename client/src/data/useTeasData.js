/**
 * 茶数据源 Hook：优先从后端 API 拉取，失败/慢时回退静态 demoTeas
 * - 后端行已由 /api/teas 映射为前端字段（camelCase + JSON 解析）
 * - 过滤 is_mountain 山脉条目（前端地图只渲染茶点）
 */
import { useEffect, useState } from 'react';
import { teaAPI } from '../services/api';
import { demoTeas } from './demoTeas';

export function useTeasData() {
  const [teas, setTeas] = useState(demoTeas);
  const [source, setSource] = useState('demo');

  useEffect(() => {
    let mounted = true;
    teaAPI
      .getAll()
      .then((data) => {
        if (!mounted) return;
        // axios 响应拦截器已把 res.data 改写为后端 data 字段，这里取 data.data.teas
        const all = Array.isArray(data?.data?.teas) ? data.data.teas : [];
        // 排除山脉条目 + 旧种子残条（无 categoryEn 的重复条目，如福州茉莉24/午子仙毫25）
        const live = all.filter((t) => !t.is_mountain && t.categoryEn);
        if (live.length > 0) {
          setTeas(live);
          setSource('api');
        }
      })
      .catch(() => {
        // 后端不可用时保持 demoTeas 兜底，页面不白屏
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { teas, source };
}
