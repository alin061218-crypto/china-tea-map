import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeason } from '../../contexts/SeasonContext';

// 四季花瓣配置
const PETAL_CONFIG = {
  spring: {
    emojis: ['🌸', '💮', '🌷', '🌿', '🍃'],
    colors: ['#f8c8d8', '#f0a0b8', '#e8d0d8', '#c8e0c0', '#e0d8c8'],
    count: 30,
    size: [14, 28],
    duration: [8, 18],
  },
  summer: {
    emojis: ['🪷', '🌺', '🌻', '🍀', '☘️'],
    colors: ['#e8a0b0', '#f0c8a0', '#c8d8a0', '#a0c8b0', '#e0c898'],
    count: 25,
    size: [16, 32],
    duration: [10, 20],
  },
  autumn: {
    emojis: ['🌼', '🍂', '🍁', '🌾', '🥀'],
    colors: ['#e8c898', '#d8a868', '#c89048', '#f0c870', '#e0b870'],
    count: 35,
    size: [12, 24],
    duration: [6, 14],
  },
  winter: {
    emojis: ['❄️', '🌨️', '🌸', '💠', '🔹'],
    colors: ['#d0d8e8', '#c8d0e0', '#e0e4f0', '#b8c8e0', '#d8dce8'],
    count: 28,
    size: [10, 22],
    duration: [12, 22],
  },
};

function createPetal(season, id) {
  const cfg = PETAL_CONFIG[season] || PETAL_CONFIG.spring;
  const emoji = cfg.emojis[Math.floor(Math.random() * cfg.emojis.length)];
  const size = cfg.size[0] + Math.random() * (cfg.size[1] - cfg.size[0]);

  return {
    id,
    emoji,
    size,
    x: Math.random() * 100,        // 水平起始位置 (%)
    xDrift: (Math.random() - 0.5) * 120, // 水平漂移量
    duration: cfg.duration[0] + Math.random() * (cfg.duration[1] - cfg.duration[0]),
    delay: Math.random() * 8,
    rotation: Math.random() * 360,
    rotateAmount: 180 + Math.random() * 540,
    opacity: 0.4 + Math.random() * 0.4,
  };
}

export default function FallingPetals() {
  const { season, month } = useSeason();
  const [petals, setPetals] = useState([]);
  const [key, setKey] = useState(0);

  const cfg = PETAL_CONFIG[season] || PETAL_CONFIG.spring;

  // 季节切换时重建花瓣
  useEffect(() => {
    const newPetals = Array.from({ length: cfg.count * 2 }, (_, i) =>
      createPetal(season, `${season}-${key}-${i}`)
    );
    setPetals(newPetals);
    setKey(k => k + 1);
  }, [season, month]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-30" style={{ perspective: '800px' }}>
      <AnimatePresence>
        {petals.map((petal) => (
          <motion.div
            key={petal.id}
            initial={{
              x: `${petal.x}vw`,
              y: '-8vh',
              rotate: petal.rotation,
              opacity: 0,
              scale: 0.6,
            }}
            animate={{
              x: `${petal.x + petal.xDrift}vw`,
              y: '108vh',
              rotate: petal.rotation + petal.rotateAmount,
              opacity: [0, petal.opacity, petal.opacity, 0],
              scale: [0.6, 1, 0.8, 0.5],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              ease: 'easeInOut',
              opacity: { times: [0, 0.1, 0.8, 1] },
              scale: { times: [0, 0.3, 0.7, 1] },
            }}
            style={{
              position: 'absolute',
              fontSize: `${petal.size}px`,
              filter: `blur(${petal.size > 20 ? '1px' : '0px'})`,
            }}
          >
            {petal.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
