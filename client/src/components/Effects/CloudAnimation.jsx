import { useSeason } from '../../contexts/SeasonContext';

// 预定义云朵配置
const CLOUDS = [
  { top: '8%', left: '5%', width: 220, height: 60, duration: 28, delay: 0, opacity: 0.15 },
  { top: '18%', left: '55%', width: 260, height: 70, duration: 35, delay: 5, opacity: 0.12 },
  { top: '35%', left: '15%', width: 180, height: 50, duration: 24, delay: 8, opacity: 0.1 },
  { top: '60%', left: '65%', width: 300, height: 80, duration: 32, delay: 3, opacity: 0.13 },
  { top: '78%', left: '8%', width: 240, height: 65, duration: 30, delay: 10, opacity: 0.11 },
];

export default function CloudAnimation() {
  const { season } = useSeason();

  // 冬季云更淡
  const isWinter = season === 'winter';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {CLOUDS.map((cloud, i) => (
        <div key={i}
          className="absolute"
          style={{
            top: cloud.top,
            left: cloud.left,
            width: cloud.width,
            height: cloud.height,
            opacity: isWinter ? cloud.opacity * 0.5 : cloud.opacity,
            animation: `cloudDrift ${cloud.duration}s ease-in-out ${cloud.delay}s infinite alternate`,
            background: `radial-gradient(ellipse at center,
              rgba(220,215,210,${isWinter ? 0.2 : 0.4}) 0%,
              rgba(220,215,210,0.1) 40%,
              transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(35px)',
            transition: 'opacity 1.5s',
          }}
        />
      ))}
    </div>
  );
}
