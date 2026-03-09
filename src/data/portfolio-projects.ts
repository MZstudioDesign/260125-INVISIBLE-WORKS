// Portfolio project data — 23 projects × 3 design variants = 69 total

export type CategoryKey =
  | 'education' | 'beauty' | 'brand' | 'fitness' | 'medical'
  | 'business' | 'architecture' | 'design' | 'legal'
  | 'production' | 'tech' | 'veterinary' | 'restaurant' | 'cafe';

export interface DesignVariant {
  id: string;
  htmlPath: string;
  thumbnail: string;
  colorMood: string;
  tone: string;
}

export interface PortfolioProject {
  id: string;
  name: string;
  category: CategoryKey;
  industry: string;
  thumbnail: string;
  designs: DesignVariant[];
}

export const CATEGORIES: CategoryKey[] = [
  'education', 'beauty', 'brand', 'fitness', 'medical',
  'business', 'architecture', 'design', 'legal',
  'production', 'tech', 'veterinary', 'restaurant', 'cafe',
];

export const REPRESENTATIVE_CATEGORIES: CategoryKey[] = [
  'education', 'beauty', 'medical', 'business', 'restaurant', 'cafe', 'tech',
];

export const REPRESENTATIVE_PROJECTS: Record<string, string> = {
  education: 'flow-english-studio',
  beauty: 'maison-de-cher',
  medical: 'prime-motion-orthopedics',
  business: 'bridge-tax-accounting',
  restaurant: 'morning-kitchen',
  cafe: 'nyang-ground',
  tech: 'spectra-ai',
};

function makeVariant(projectId: string, variant: string, colorMood: string, tone: string): DesignVariant {
  return {
    id: variant,
    htmlPath: `/portfolio-sites/${projectId}/${variant}/index.html`,
    thumbnail: `/portfolio-thumbnails/${projectId}-${variant}.webp`,
    colorMood,
    tone,
  };
}

function makeProject(
  id: string,
  name: string,
  category: CategoryKey,
  industry: string,
  variants: [string, string][], // [colorMood, tone] for each variant
): PortfolioProject {
  const designs = variants.map((v, i) =>
    makeVariant(id, String(i + 1).padStart(3, '0'), v[0], v[1])
  );
  return {
    id,
    name,
    category,
    industry,
    thumbnail: designs[0].thumbnail,
    designs,
  };
}

export const portfolioProjects: PortfolioProject[] = [
  // === Education ===
  makeProject('codelab-academy', 'CodeLab Academy', 'education',
    'Coding Education',
    [['Dark', 'Modern / Technical'], ['Light', 'Clean / Academic'], ['Warm', 'Friendly / Approachable']]),

  makeProject('flow-english-studio', 'Flow English Studio', 'education',
    'English Academy',
    [['Warm', 'Warm / Friendly'], ['Cool', 'Modern / Professional'], ['Bright', 'Energetic / Fun']]),

  // === Beauty ===
  makeProject('maison-de-cher', 'Maison de Cher', 'beauty',
    'Premium Hair Salon',
    [['Neutral', 'Luxury / Sophisticated'], ['Dark', 'Elegant / Bold'], ['Warm', 'Soft / Feminine']]),

  makeProject('atelier-nail', 'Atelier Nail', 'beauty',
    'Nail Studio',
    [['Warm', 'Modern / Artistic'], ['Pink', 'Cute / Trendy'], ['Minimal', 'Clean / Chic']]),

  // === Brand / Manufacturing ===
  makeProject('nexus-precision', 'Nexus Precision', 'brand',
    'Industrial Manufacturing',
    [['Dark Navy', 'Trustworthy / Strong'], ['Gray', 'Industrial / Modern'], ['Blue', 'Corporate / Reliable']]),

  makeProject('lumino-wood', 'Lumino Wood', 'brand',
    'Handcrafted Furniture',
    [['Wood Brown', 'Premium / Natural'], ['Cream', 'Warm / Minimal'], ['Dark', 'Modern / Luxury']]),

  makeProject('ecolove-skin', 'EcoLove Skin', 'brand',
    'Eco-friendly Cosmetics',
    [['Sage Green', 'Natural / Premium'], ['Cream', 'Organic / Soft'], ['White', 'Clean / Clinical']]),

  // === Fitness ===
  makeProject('breath-and-flow', 'Breath & Flow', 'fitness',
    'Yoga Studio',
    [['Light Beige', 'Natural / Calm'], ['Green', 'Fresh / Organic'], ['White', 'Minimal / Serene']]),

  makeProject('oblique-pilates', 'Oblique Pilates', 'fitness',
    'Pilates Studio',
    [['Monotone', 'Modern / Sleek'], ['Warm', 'Welcoming / Active'], ['Dark', 'Bold / Premium']]),

  // === Medical ===
  makeProject('lumere-clinic', 'Lumere Clinic', 'medical',
    'Dermatology Clinic',
    [['White', 'Luxury / Minimal'], ['Soft Blue', 'Clean / Trustworthy'], ['Cream', 'Warm / Approachable']]),

  makeProject('prime-motion-orthopedics', 'Prime Motion Orthopedics', 'medical',
    'Orthopedic Hospital',
    [['Blue', 'Professional / Medical'], ['White', 'Clean / Modern'], ['Navy', 'Authoritative / Trusted']]),

  // === Business / B2B ===
  makeProject('launchpad-space', 'Launchpad Space', 'business',
    'Co-working Space',
    [['White + Blue', 'Modern / Energetic'], ['Dark', 'Premium / Startup'], ['Warm', 'Community / Friendly']]),

  makeProject('bridge-tax-accounting', 'Bridge Tax & Accounting', 'business',
    'Tax Accounting Firm',
    [['Navy', 'Professional / Trustworthy'], ['Gray', 'Corporate / Stable'], ['Blue', 'Modern / Reliable']]),

  makeProject('stratium-consulting', 'Stratium Consulting', 'business',
    'Management Consulting',
    [['Navy + White', 'Professional / Premium'], ['Dark', 'Executive / Bold'], ['Gray', 'Corporate / Elegant']]),

  // === Architecture ===
  makeProject('studio-archiv', 'Studio Archiv', 'architecture',
    'Architecture Studio',
    [['Monochrome', 'Minimal / Artistic'], ['White', 'Clean / Structural'], ['Dark', 'Bold / Dramatic']]),

  // === Design ===
  makeProject('monospace-studio', 'Monospace Studio', 'design',
    'Design Studio',
    [['Monotone', 'Minimal / Creative'], ['Dark', 'Bold / Edgy'], ['White', 'Clean / Portfolio']]),

  makeProject('objet-design-lab', 'Objet Design Lab', 'design',
    'Interior Design Studio',
    [['Greige', 'Neutral / Elegant'], ['White', 'Minimal / Spatial'], ['Warm', 'Cozy / Natural']]),

  // === Legal ===
  makeProject('legato-law-office', 'Legato Law Office', 'legal',
    'Law Firm',
    [['Dark Navy', 'Authoritative / Professional'], ['Gray', 'Serious / Corporate'], ['Navy + Gold', 'Premium / Traditional']]),

  // === Production ===
  makeProject('framework-studio', 'Framework Studio', 'production',
    'Video Production',
    [['Dark', 'Cinematic / Bold'], ['Black + Red', 'Dynamic / Creative'], ['Gray', 'Professional / Sleek']]),

  // === Tech ===
  makeProject('spectra-ai', 'Spectra AI', 'tech',
    'AI SaaS Startup',
    [['Blue Gradient', 'Modern / Tech-forward'], ['Dark', 'Premium / Futuristic'], ['Purple', 'Creative / Innovative']]),

  // === Veterinary ===
  makeProject('vet-signature', 'Vet Signature Medical Center', 'veterinary',
    'Premium Veterinary Hospital',
    [['Soft Blue', 'Warm / Professional'], ['Green', 'Natural / Caring'], ['White', 'Clean / Medical']]),

  // === Restaurant ===
  makeProject('morning-kitchen', 'Morning Kitchen', 'restaurant',
    'Brunch Cafe',
    [['Warm Cream', 'Natural / Emotional'], ['White', 'Clean / Bright'], ['Brown', 'Cozy / Rustic']]),

  makeProject('somu-dining', 'Somu Dining', 'restaurant',
    'Omakase Fine Dining',
    [['Dark + Gold', 'Luxury / Sophisticated'], ['Black', 'Premium / Dramatic'], ['Charcoal', 'Elegant / Intimate']]),

  // === Cafe ===
  makeProject('ondo-coffee', 'Ondo Coffee', 'cafe',
    'Specialty Coffee',
    [['Warm Copper', 'Warm / Minimal'], ['Sage Green', 'Natural / Organic'], ['Dark Moody', 'Premium / Intimate']]),

  makeProject('nyang-ground', 'Nyang Ground', 'cafe',
    'Cat Cafe',
    [['Soft Playful', 'Warm / Cute'], ['Warm Natural', 'Cozy / Natural'], ['Cool Modern', 'Clean / Trendy']]),
];

export function getProjectById(id: string): PortfolioProject | undefined {
  return portfolioProjects.find(p => p.id === id);
}

export function getProjectsByCategory(category: CategoryKey): PortfolioProject[] {
  return portfolioProjects.filter(p => p.category === category);
}

export function getRandomProjects(count: number): PortfolioProject[] {
  const shuffled = [...portfolioProjects].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
