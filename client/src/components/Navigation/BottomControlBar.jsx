import UserButton from '../Auth/UserButton';

function BottomControlBar({ viewMode = 'traditional', onViewModeChange, onZoomIn, onZoomOut, onReset, onCatalogOpen, onCampaignOpen, onKnowledgeOpen, onMessageOpen, onAuthOpen }) {
  return (
    <div className="ink-ui-enter pointer-events-none absolute bottom-5 left-0 right-0 z-40 flex justify-center px-3">
      <div className="control-shell pointer-events-auto flex max-w-[96vw] items-center gap-3">
        <div className="flex items-center gap-1 rounded-full bg-white/28 p-1">
          <button
            type="button"
            className={`ui-pill text-sm ${viewMode === 'traditional' ? 'active' : ''}`}
            onClick={() => onViewModeChange?.('traditional')}
          >
            产地茶
          </button>
          <button
            type="button"
            className={`ui-pill text-sm ${viewMode === 'modern' ? 'active' : ''}`}
            onClick={() => onViewModeChange?.('modern')}
          >
            现代茶饮
          </button>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white/28 p-1">
          <button type="button" className="icon-button" onClick={onZoomOut} title="缩小地图">-</button>
          <button type="button" className="icon-button" onClick={onZoomIn} title="放大地图">+</button>
          <button type="button" className="icon-button text-xs" onClick={onReset} title="还原视图">复</button>
        </div>
        <button type="button" className="ui-pill" onClick={onCatalogOpen}>茶信录</button>
        <button type="button" className="ui-pill" onClick={onCampaignOpen}>品牌故事</button>
        <button type="button" className="ui-pill" onClick={onKnowledgeOpen}>茶事百科</button>
        <button type="button" className="ui-pill" onClick={onMessageOpen}>茶友留墨</button>
        <UserButton onAuthOpen={onAuthOpen} />
      </div>
    </div>
  );
}

BottomControlBar.displayName = 'BottomControlBar';

export default BottomControlBar;
