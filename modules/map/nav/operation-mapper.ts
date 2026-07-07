import { ANIM_IDS, AnimId } from '../../animation/anim-id';
import { ZoomLevel } from '../core/camera-state';

export type UserInput =
  | { type: 'select'; nodeId: string }
  | { type: 'focus'; nodeId: string }
  | { type: 'zoom'; nodeId: string; zoomLevel: ZoomLevel }
  | { type: 'drillDown'; nodeId: string }
  | { type: 'drillUp'; nodeId: string | null }
  | { type: 'enterStory'; nodeId: string }
  | { type: 'exitStory' };

export interface MappedOperation {
  navAction: string;
  nodeChange: string | null;
  animTrigger: AnimId | null;
}

export function mapOperation(input: UserInput): MappedOperation {
  switch (input.type) {
    case 'select':
      return { navAction: 'selectNode', nodeChange: input.nodeId, animTrigger: ANIM_IDS.NODE_FOCUS };
    case 'focus':
      return { navAction: 'focusNode', nodeChange: input.nodeId, animTrigger: ANIM_IDS.NODE_FOCUS };
    case 'zoom':
      return {
        navAction: 'zoomToNode',
        nodeChange: input.nodeId,
        animTrigger: input.zoomLevel === 'Global' ? ANIM_IDS.ZOOM_OUT : ANIM_IDS.ZOOM_IN,
      };
    case 'drillDown':
      return { navAction: 'drillDown', nodeChange: input.nodeId, animTrigger: ANIM_IDS.DRILL_DOWN };
    case 'drillUp':
      return { navAction: 'drillUp', nodeChange: input.nodeId, animTrigger: ANIM_IDS.ZOOM_OUT };
    case 'enterStory':
      return { navAction: 'enterStory', nodeChange: input.nodeId, animTrigger: ANIM_IDS.STORY_ENTER };
    case 'exitStory':
      return { navAction: 'exitStory', nodeChange: null, animTrigger: null };
    default:
      throw new Error('Unsupported user input operation.');
  }
}
