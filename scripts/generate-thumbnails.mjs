import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, basename } from 'path';

const SCREENSHOTS_DIR = 'D:/OneDrive - 대건중학교/260216 포트폴리오/Created/portfolio/screenshots';
const OUTPUT_DIR = 'D:/OneDrive - 대건중학교/260125 INVISIBLE WORKS/public/portfolio-thumbnails';

const ID_MAP = {
  '코드랩아카데미': 'codelab-academy',
  '플로우잉글리시': 'flow-english-studio',
  '메종드쉐르': 'maison-de-cher',
  '아뜰리에네일': 'atelier-nail',
  '넥서스프리시전': 'nexus-precision',
  '루미노우드': 'lumino-wood',
  '에코라브스킨': 'ecolove-skin',
  '브레스앤플로우': 'breath-and-flow',
  '오블리크필라테스': 'oblique-pilates',
  '루메르클리닉': 'lumere-clinic',
  '프라임모션정형외과': 'prime-motion-orthopedics',
  '런치패드스페이스': 'launchpad-space',
  '브릿지세무회계': 'bridge-tax-accounting',
  '스트래티움컨설팅': 'stratium-consulting',
  '스튜디오아키브': 'studio-archiv',
  '모노스페이스스튜디오': 'monospace-studio',
  '오브제디자인랩': 'objet-design-lab',
  '레가토법률사무소': 'legato-law-office',
  '프레임워크스튜디오': 'framework-studio',
  '스펙트라AI': 'spectra-ai',
  '벳시그니처동물의료센터': 'vet-signature',
  '모어닝키친': 'morning-kitchen',
  '소무다이닝': 'somu-dining',
};

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = (await readdir(SCREENSHOTS_DIR)).filter(f => f.endsWith('.png'));
  console.log(`Found ${files.length} screenshots`);

  let processed = 0;
  let skipped = 0;

  for (const file of files) {
    // Parse filename: Category__ProjectName__Variant.png
    const match = file.match(/^(.+?)__(.+?)__(\d{3})\.png$/);
    if (!match) {
      console.log(`Skip (no match): ${file}`);
      skipped++;
      continue;
    }

    const [, , koreanName, variant] = match;
    const engId = ID_MAP[koreanName];
    if (!engId) {
      console.log(`Skip (no ID mapping): ${koreanName}`);
      skipped++;
      continue;
    }

    const inputPath = join(SCREENSHOTS_DIR, file);
    const outputPath = join(OUTPUT_DIR, `${engId}-${variant}.webp`);

    try {
      await sharp(inputPath)
        .resize(800, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
      processed++;
    } catch (err) {
      console.error(`Error processing ${file}: ${err.message}`);
    }
  }

  console.log(`Done: ${processed} processed, ${skipped} skipped`);
}

main().catch(console.error);
