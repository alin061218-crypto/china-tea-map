import { useState } from 'react';
import SeasonSlider from './SeasonSlider';

export default function BottomControlBar({ onZoomIn, onZoomOut, onReset, onCatalogOpen }) {
  const [activeBtn, setActiveBtn] = useState('冬茶集');

  const buttons = ['冬茶集', '四季茶历', '茶信录'];

  return (
    <div className="flex items-center gap-3 px-4 py-2.5"
      style={{
        background: 'rgba(255,253,250,0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(200,190,175,0.2)',
        borderRadius: '20px 20px 0 0',
      }}>

      {/* 缩放按钮 */}
      <div className="flex items-center gap-1">
        <button onClick={onZoomIn} className="btn-icon text-sm" title="放大">+</button>
        <button onClick={onZoomOut} className="btn-icon text-sm" title="缩小">−</button>
        <button onClick={onReset} className="btn-icon text-xs" title="重置">⟳</button>
      </div>

      {/* 分隔 */}
      <div className="w-px h-5" style={{ background: 'rgba(200,190,175,0.3)' }} />

      {/* 功能切换按钮 */}
      {buttons.map(b => (
        <button key={b}
          onClick={() => {
            setActiveBtn(b);
            if (b === '茶信录') onCatalogOpen?.();
          }}
          className={`btn-ghost text-xs ${activeBtn === b ? 'active font-medium' : ''}`}>
          {b}
        </button>
      ))}

      {/* 分隔 */}
      <div className="w-px h-5" style={{ background: 'rgba(200,190,175,0.3)' }} />

      {/* 四季切换滑块 */}
      <SeasonSlider />

      {/* 分隔 */}
      <div className="w-px h-5" style={{ background: 'rgba(200,190,175,0.3)' }} />

      {/* 分类触发按钮 */}
      <button onClick={onCatalogOpen} className="btn-ghost text-xs flex items-center gap-1">
        <span>🗂️</span> 茶类
      </button>
    </div>
  );
}
