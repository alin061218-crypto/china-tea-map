function BottomControlBar({ onZoomIn, onZoomOut, onReset, onCatalogOpen }) {
  return (
    <div className="ink-ui-enter pointer-events-none absolute bottom-5 left-0 right-0 z-40 flex justify-center px-3">
      <div className="control-shell pointer-events-auto flex max-w-[96vw] items-center gap-3">
        <div className="flex items-center gap-1 rounded-full bg-white/28 p-1">
          <button type="button" className="icon-button" onClick={onZoomOut} title="缩小地图">-</button>
          <button type="button" className="icon-button" onClick={onZoomIn} title="放大地图">+</button>
          <button type="button" className="icon-button text-xs" onClick={onReset} title="还原视图">收</button>
        </div>
        <button type="button" className="ui-pill" onClick={onCatalogOpen}>茶信录</button>
      </div>
    </div>
  );
}

BottomControlBar.displayName = 'BottomControlBar';

export default BottomControlBar;
