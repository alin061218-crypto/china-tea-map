export const ZOOM_LEVELS = ['Global', 'Region', 'Province', 'Detail'] as const;

export type ZoomLevel = typeof ZOOM_LEVELS[number];

export interface CameraState {
  zoomLevel: ZoomLevel;
  currentFocusNode: string | null;
}

const state: CameraState = {
  zoomLevel: 'Global',
  currentFocusNode: null,
};

export function getCameraState(): CameraState {
  return { ...state };
}

export function setZoomLevel(zoomLevel: ZoomLevel): CameraState {
  if (!ZOOM_LEVELS.includes(zoomLevel)) {
    throw new Error(`Invalid zoom level: ${zoomLevel}`);
  }

  state.zoomLevel = zoomLevel;
  return getCameraState();
}

export function focusNode(nodeId: string | null): CameraState {
  state.currentFocusNode = nodeId;
  return getCameraState();
}

export function resetCameraState(): CameraState {
  state.zoomLevel = 'Global';
  state.currentFocusNode = null;
  return getCameraState();
}
