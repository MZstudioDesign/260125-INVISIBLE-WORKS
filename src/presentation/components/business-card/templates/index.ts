export { MinimalCorinthian } from './MinimalCorinthian';
export { DynamicBlock } from './DynamicBlock';
export { CleanHierarchy } from './CleanHierarchy';
export { DotMatrix } from './DotMatrix';
export { CurveElegance } from './CurveElegance';

import { MinimalCorinthian } from './MinimalCorinthian';
import { DynamicBlock } from './DynamicBlock';
import { CleanHierarchy } from './CleanHierarchy';
import { DotMatrix } from './DotMatrix';
import { CurveElegance } from './CurveElegance';
import { TemplateId, BusinessCardData } from '@/lib/businessCard/types';

export const TEMPLATE_COMPONENTS = {
  'minimal-corinthian': MinimalCorinthian,
  'dynamic-block': DynamicBlock,
  'clean-hierarchy': CleanHierarchy,
  'dot-matrix': DotMatrix,
  'curve-elegance': CurveElegance,
} as const;

export type TemplateComponent = React.ComponentType<{
  data: BusinessCardData;
  side: 'front' | 'back';
  showBleed?: boolean;
}>;

export const getTemplateComponent = (id: TemplateId): TemplateComponent => {
  return TEMPLATE_COMPONENTS[id];
};
