export { MinimalCorinthian } from './MinimalCorinthian';
export { DynamicBlock } from './DynamicBlock';
export { CleanHierarchy } from './CleanHierarchy';
export { DotMatrix } from './DotMatrix';
export { CurveElegance } from './CurveElegance';
export { GlassPrism } from './GlassPrism';
export { SwissGrid } from './SwissGrid';
export { DevTerminal } from './DevTerminal';

export { TechBlack } from './TechBlack';
export { BauhausGeo } from './BauhausGeo';
export { HoloGradient } from './HoloGradient';
export { TicketPass } from './TicketPass';

import { MinimalCorinthian } from './MinimalCorinthian';
import { DynamicBlock } from './DynamicBlock';
import { CleanHierarchy } from './CleanHierarchy';
import { DotMatrix } from './DotMatrix';
import { CurveElegance } from './CurveElegance';
import { GlassPrism } from './GlassPrism';
import { SwissGrid } from './SwissGrid';
import { DevTerminal } from './DevTerminal';
import { TechBlack } from './TechBlack';
import { BauhausGeo } from './BauhausGeo';
import { HoloGradient } from './HoloGradient';
import { TicketPass } from './TicketPass';
import { TemplateId, BusinessCardData } from '@/lib/businessCard/types';

// Batch Imports
import { RetroCassette, GameCard, Win95OS, PolaroidPhoto } from './RetroBatch';
import { SnsProfile, LucidPlastic, NeonCyber } from './ModernBatch';
import { ShippingLabel, EcoKraft, LiquidMarbling } from './TextureBatch';

// Food & Beauty
import { CafeMinimal, BistroBold, OrganicFresh, BurgerPop, SoftElegance, ModernChic, NailArtPop, SpaZen } from './FoodBeautyBatch';
// Fitness & Education
import { PowerGym, PilatesFlow, CrossFitGrungy, YogaBalance, AcademicIvy, KidsSchool, MathGrid, LanguageTalk } from './FitEduBatch';
// Medical & Brand
import { ClinicClean, DentalSmile, OrientalHerbal, PediatricCare, StartupRocket, MakerIndustrial, LeatherCraft, EcoPackage } from './MedBrandBatch';
// Office
import { LawFirmClassic, FinanceChart, ArchitectLine, ConsultingTrust } from './OfficeBatch';

export const TEMPLATE_COMPONENTS = {
  'minimal-corinthian': MinimalCorinthian,
  'dynamic-block': DynamicBlock,
  'clean-hierarchy': CleanHierarchy,
  'dot-matrix': DotMatrix,
  'curve-elegance': CurveElegance,
  'glass-prism': GlassPrism,
  'swiss-grid': SwissGrid,
  'dev-terminal': DevTerminal,
  'tech-black': TechBlack,
  'bauhaus-geo': BauhausGeo,
  'holo-gradient': HoloGradient,
  'ticket-pass': TicketPass,
  'sns-profile': SnsProfile,
  'retro-cassette': RetroCassette,
  'game-card': GameCard,
  'lucid-plastic': LucidPlastic,
  'shipping-label': ShippingLabel,
  'neon-cyber': NeonCyber,
  'polaroid-photo': PolaroidPhoto,
  'win95-os': Win95OS,
  'liquid-marbling': LiquidMarbling,
  'eco-kraft': EcoKraft,

  // Food
  'cafe-minimal': CafeMinimal,
  'bistro-bold': BistroBold,
  'organic-fresh': OrganicFresh,
  'burger-pop': BurgerPop,

  // Beauty
  'soft-elegance': SoftElegance,
  'modern-chic': ModernChic,
  'nail-art-pop': NailArtPop,
  'spa-zen': SpaZen,

  // Fitness
  'power-gym': PowerGym,
  'pilates-flow': PilatesFlow,
  'crossfit-grungy': CrossFitGrungy,
  'yoga-balance': YogaBalance,

  // Education
  'academic-ivy': AcademicIvy,
  'kids-school': KidsSchool,
  'math-grid': MathGrid,
  'language-talk': LanguageTalk,

  // Medical
  'clinic-clean': ClinicClean,
  'dental-smile': DentalSmile,
  'oriental-herbal': OrientalHerbal,
  'pediatric-care': PediatricCare,

  // Brand
  'startup-rocket': StartupRocket,
  'maker-industrial': MakerIndustrial,
  'leather-craft': LeatherCraft,
  'eco-package': EcoPackage,

  // Office
  'law-firm-classic': LawFirmClassic,
  'finance-chart': FinanceChart,
  'architect-line': ArchitectLine,
  'consulting-trust': ConsultingTrust,
} as const;

export type TemplateComponent = React.ComponentType<{
  data: BusinessCardData;
  side: 'front' | 'back';
  showBleed?: boolean;
}>;

export const getTemplateComponent = (id: TemplateId): TemplateComponent => {
  return TEMPLATE_COMPONENTS[id];
};
