/**
 * Core mathematical and game logic for Genesis Odyssey: El 1 en 10 Millones
 * Pure functions decoupled from Canvas and DOM for deterministic unit testing.
 */

export interface GeneOption {
  id: string;
  stage: number;
  category: 'skin' | 'eyes' | 'hairColor' | 'hairTexture' | 'trait';
  label: string;
  allele: string;
  type: 'Dominante' | 'Recesivo' | 'Codominante';
  colorHex?: string;
  description: string;
}

export interface SelectedGenes {
  skin?: GeneOption;
  eyes?: GeneOption;
  hairColor?: GeneOption;
  hairTexture?: GeneOption;
  trait?: GeneOption;
}

export const STAGE_CONFIGS = [
  {
    stage: 1,
    name: 'El Conducto Vaginal y la Barrera de pH Ácido',
    location: 'Tracto Vaginal Inferior',
    startSperm: 10_000_000,
    endSperm: 4_500_000,
    category: 'skin',
    genePrompt: 'Gen #1: Tono de Piel del Bebé',
    lesson: 'El pH vaginal es ácido (3.8 - 4.5) como barrera inmunológica natural. Durante la ventana fértil, el moco ovulatorio eleva el pH a neutro para proteger a los espermatozoides.'
  },
  {
    stage: 2,
    name: 'El Cérvix y los Canales de Moco Fértil',
    location: 'Cuello Uterino (Cérvix)',
    startSperm: 4_500_000,
    endSperm: 1_200_000,
    category: 'eyes',
    genePrompt: 'Gen #2: Color de Ojos del Bebé',
    lesson: 'En los días 12 al 16 del ciclo menstrual de 28 días, los estrógenos crean moco filante tipo "clara de huevo" con microcanales de glucoproteínas que guían y nutren a los espermatozoides.'
  },
  {
    stage: 3,
    name: 'La Cavidad Uterina y la Respuesta Inmunológica',
    location: 'Endometrio Uterino',
    startSperm: 1_200_000,
    endSperm: 150_000,
    category: 'hairColor',
    genePrompt: 'Gen #3: Color de Cabello del Bebé',
    lesson: 'El endometrio se hipertrofia preparando el nido para la implantación. El sistema inmunológico femenino envía leucocitos para eliminar espermatozoides con anomalías morfológicas.'
  },
  {
    stage: 4,
    name: 'La Unión Útero-Tubárica y Entrada a la Trompa',
    location: 'Unión Útero-Tubárica (Trompa de Falopio)',
    startSperm: 150_000,
    endSperm: 5_000,
    category: 'hairTexture',
    genePrompt: 'Gen #4: Textura Capilar del Bebé',
    lesson: 'Solo un ovario ovula por mes. El cúmulo oóforo libera progesterona creando un gradiente quimiotáctico que guía a los espermatozoides hacia la trompa correcta contra corriente.'
  },
  {
    stage: 5,
    name: 'El Istmo y la Ampolla (Selección Natural Final)',
    location: 'Ampolla Tubárica',
    startSperm: 5_000,
    endSperm: 1,
    category: 'trait',
    genePrompt: 'Gen #5: Rasgo Especial Dominante',
    lesson: 'Durante la "Capacitación Espermática", la albúmina retira colesterol de la membrana del espermatozoide, hiperactivando su flagelo y preparando las enzimas del acrosoma.'
  },
  {
    stage: 6,
    name: 'El Asedio al Óvulo y Ruptura de la Zona Pelúcida',
    location: 'Complejo Oocito-Cúmulo (Fecundación)',
    startSperm: 1,
    endSperm: 1,
    category: 'boss',
    genePrompt: '¡JEFE FINAL: Desbloquea la Corona Radiada y la Zona Pelúcida!',
    lesson: 'La Reacción Acrosómica libera hialuronidasa y acrosina para digerir la Zona Pelúcida. Al fusionarse, se dispara la Reacción Cortical con una "Chispa de Zinc" que impide la poliespermia.'
  }
];

export const GENE_CATALOG: Record<string, GeneOption[]> = {
  skin: [
    {
      id: 'skin_morena',
      stage: 1,
      category: 'skin',
      label: 'Piel Morena Canela',
      allele: 'P^M P^M',
      type: 'Codominante',
      colorHex: '#8D5524',
      description: 'Pigmentación rica en eumelanina fotoprotectora de herencia poligénica.'
    },
    {
      id: 'skin_triguena',
      stage: 1,
      category: 'skin',
      label: 'Piel Trigueña Clara',
      allele: 'P^T P^T',
      type: 'Codominante',
      colorHex: '#C68642',
      description: 'Tono dorado cálido intermedio con excelente síntesis de Vitamina D.'
    },
    {
      id: 'skin_blanca',
      stage: 1,
      category: 'skin',
      label: 'Piel Blanca Rosada',
      allele: 'P^B P^B',
      type: 'Codominante',
      colorHex: '#F1C27D',
      description: 'Pigmentación clara sensible con alta absorción solar en latitudes templadas.'
    }
  ],
  eyes: [
    {
      id: 'eyes_verde',
      stage: 2,
      category: 'eyes',
      label: 'Ojos Claros Verdes Esmeralda',
      allele: 'g b',
      type: 'Recesivo',
      colorHex: '#10B981',
      description: 'Gen OCA2/HERC2 con dispersión de Rayleigh baja en el estroma del iris.'
    },
    {
      id: 'eyes_azul',
      stage: 2,
      category: 'eyes',
      label: 'Ojos Claros Azul Cielo',
      allele: 'b b',
      type: 'Recesivo',
      colorHex: '#38BDF8',
      description: 'Alelo recesivo de mutación HERC2 ancestral con estroma acelular translúcido.'
    },
    {
      id: 'eyes_miel',
      stage: 2,
      category: 'eyes',
      label: 'Ojos Miel / Café Profundo',
      allele: 'B B',
      type: 'Dominante',
      colorHex: '#854D0E',
      description: 'Alelo dominante clásico con abundante melanina protectora contra rayos UV.'
    }
  ],
  hairColor: [
    {
      id: 'hair_rubio',
      stage: 3,
      category: 'hairColor',
      label: 'Cabello Rubio Dorado (Mono)',
      allele: 'r r',
      type: 'Recesivo',
      colorHex: '#FACC15',
      description: 'Baja concentración de eumelanina con feomelanina dorada brillante.'
    },
    {
      id: 'hair_castano',
      stage: 3,
      category: 'hairColor',
      label: 'Cabello Castaño Luminoso',
      allele: 'C c',
      type: 'Dominante',
      colorHex: '#78350F',
      description: 'Alelo dominante de eumelanina moderada con brillo cobrizo natural.'
    },
    {
      id: 'hair_negro',
      stage: 3,
      category: 'hairColor',
      label: 'Cabello Negro Azabache',
      allele: 'N N',
      type: 'Dominante',
      colorHex: '#18181B',
      description: 'Alelo completamente dominante con máxima saturación de eumelanina.'
    }
  ],
  hairTexture: [
    {
      id: 'texture_rizado',
      stage: 4,
      category: 'hairTexture',
      label: 'Cabello Rizado / Crespo',
      allele: 'R R',
      type: 'Dominante',
      colorHex: '#F59E0B',
      description: 'Folículo elíptico asimétrico con puentes disulfuro densos (Gen TCHH).'
    },
    {
      id: 'texture_ondulado',
      stage: 4,
      category: 'hairTexture',
      label: 'Cabello Ondulado',
      allele: 'R l',
      type: 'Codominante',
      colorHex: '#EC4899',
      description: 'Fenotipo de dominancia incompleta con ondas suaves y volumen equilibrado.'
    },
    {
      id: 'texture_liso',
      stage: 4,
      category: 'hairTexture',
      label: 'Cabello Liso',
      allele: 'l l',
      type: 'Recesivo',
      colorHex: '#06B6D4',
      description: 'Folículo piloso circular simétrico con alineación recta de queratina.'
    }
  ],
  trait: [
    {
      id: 'trait_hoyuelos',
      stage: 5,
      category: 'trait',
      label: 'Sonrisa con Hoyuelos',
      allele: 'D d',
      type: 'Dominante',
      colorHex: '#F43F5E',
      description: 'Rasgo genético autosómico dominante originado por el músculo cigomático mayor bífido.'
    },
    {
      id: 'trait_pecas',
      stage: 5,
      category: 'trait',
      label: 'Pecas Naturales (Efélides)',
      allele: 'MC1R',
      type: 'Dominante',
      colorHex: '#F97316',
      description: 'Variante del gen MC1R que produce focos de concentración melánica dérmica.'
    },
    {
      id: 'trait_cejas',
      stage: 5,
      category: 'trait',
      label: 'Cejas Pobladas y Pestañas Largas',
      allele: 'P B',
      type: 'Dominante',
      colorHex: '#8B5CF6',
      description: 'Dominancia génica en ciclo anágeno folicular prolongado en párpados y arcos superciliares.'
    }
  ]
};

/**
 * Strict Central Deadzone calculation as demanded in Section 2.
 * If player's head is within DEADZONE_X, vx MUST BE EXACTLY ZERO.
 */
export function calculateHorizontalSpeed(
  currentFaceX: number,
  anchorX: number,
  deadzoneX: number = 16,
  maxSpeedX: number = 8.5,
  isInverted: boolean = false
): number {
  const deltaX = currentFaceX - anchorX;
  if (Math.abs(deltaX) <= deadzoneX) {
    // REGLA SAGRADA: exactamente 0, cero deriva
    return 0;
  } else if (deltaX > deadzoneX) {
    const excess = deltaX - deadzoneX;
    const normalized = Math.min(1, excess / 22);
    const speed = normalized * maxSpeedX;
    return isInverted ? -speed : speed;
  } else {
    const excess = deltaX + deadzoneX;
    const normalized = Math.max(-1, excess / 22);
    const speed = normalized * maxSpeedX;
    return isInverted ? -speed : speed;
  }
}

/**
 * Head Up / Tilt detection for Turbo mode
 */
export function isTurboActive(
  currentFaceY: number,
  anchorY: number,
  turboOffset: number = 28,
  atpLevel: number = 100
): boolean {
  if (atpLevel <= 0) return false;
  const turboThresholdY = anchorY - turboOffset;
  return currentFaceY < turboThresholdY;
}

/**
 * Hand raise gesture detection inside the upper attack box
 */
export function isHandStrikeActive(
  motionEnergy: number,
  threshold: number = 0.28
): boolean {
  return motionEnergy >= threshold;
}

/**
 * Smooth sperm counter calculation for each stage
 */
export function calculateStageSpermCount(
  stageIndex: number, // 0 to 5
  stageProgress: number // 0.0 to 1.0
): number {
  const clampedProgress = Math.max(0, Math.min(1, stageProgress));
  const cfg = STAGE_CONFIGS[stageIndex] || STAGE_CONFIGS[0];
  if (stageIndex === 5) {
    return 1;
  }
  const current = cfg.startSperm - clampedProgress * (cfg.startSperm - cfg.endSperm);
  return Math.round(current);
}

/**
 * Process Ovum shield damage
 */
export function calculateFertilizationShield(
  currentHp: number,
  damage: number = 15
): { newHp: number; isBroken: boolean; cracksCount: number } {
  const newHp = Math.max(0, currentHp - damage);
  const isBroken = newHp <= 0;
  // Calculate cracks visual level (0 to 5)
  const cracksCount = Math.min(5, Math.floor((100 - newHp) / 20));
  return { newHp, isBroken, cracksCount };
}

/**
 * Build baby description and genetic profile summary
 */
export function summarizeBabyProfile(genes: SelectedGenes): {
  title: string;
  phenotype: string;
  genotype: string;
  isComplete: boolean;
  scoreBonus: number;
} {
  const skin = genes.skin || GENE_CATALOG.skin[1];
  const eyes = genes.eyes || GENE_CATALOG.eyes[0];
  const hairColor = genes.hairColor || GENE_CATALOG.hairColor[1];
  const hairTexture = genes.hairTexture || GENE_CATALOG.hairTexture[0];
  const trait = genes.trait || GENE_CATALOG.trait[0];

  const phenotype = `${skin.label}, ${eyes.label}, ${hairColor.label}, ${hairTexture.label}, ${trait.label}`;
  const genotype = `XY | ${skin.allele} · ${eyes.allele} · ${hairColor.allele} · ${hairTexture.allele} · ${trait.allele}`;
  const title = `Bebé Olarte-Soto (${hairColor.label.split(' ')[1] || 'Castaño'}, ${eyes.label.split(' ')[2] || 'Verdes'})`;

  const count = [genes.skin, genes.eyes, genes.hairColor, genes.hairTexture, genes.trait].filter(Boolean).length;
  const isComplete = count === 5;
  const scoreBonus = count * 2500;

  return { title, phenotype, genotype, isComplete, scoreBonus };
}

/**
 * Clamps the reference anchor X so it never drifts or locks onto the far edges of the camera frame.
 */
export function clampAnchorX(rawAnchorX: number, minAnchor: number = 66, maxAnchor: number = 94): number {
  if (!Number.isFinite(rawAnchorX)) return 80;
  return Math.max(minAnchor, Math.min(maxAnchor, rawAnchorX));
}

/**
 * Calculate horizontal steering with strict central deadzone compliance and continuous tilt response.
 * Guarantees zero velocity (zero drift) when the head is inside the central deadzone, and
 * continuous proportional movement for as long as the head is tilted right or left outside the deadzone.
 */
export function calculateMotionInput(
  currentFaceX: number,
  anchorX: number,
  deadzoneX: number = 12,
  isInverted: boolean = false
): { input: number; isZeroDrift: boolean; direction: 'center' | 'right' | 'left' } {
  const safeAnchorX = clampAnchorX(anchorX);
  const deltaX = currentFaceX - safeAnchorX;
  if (Math.abs(deltaX) <= deadzoneX) {
    return { input: 0, isZeroDrift: true, direction: 'center' };
  }
  const excess = Math.abs(deltaX) - deadzoneX;
  const linear = Math.min(1.0, excess / 18.0);
  // Smooth progressive curve: responsive right outside deadzone, full speed at larger tilt
  const curved = 0.3 * linear + 0.7 * linear * linear;
  const rawSpeed = Math.sign(deltaX) * Math.min(1.0, curved);
  const input = isInverted ? -rawSpeed : rawSpeed;
  return {
    input,
    isZeroDrift: false,
    direction: input > 0 ? 'right' : 'left'
  };
}

/**
 * Robust column peak detection algorithm with temporal continuity and corridor bounds.
 * Pinpoints the head peak and eliminates lateral background wall/door bias.
 */
export function findColumnPeakCentroid(
  colScores: Float32Array | number[],
  prevFaceX: number = 80
): { peakX: number; centroidX: number } {
  let bestPeakX = 80;
  let maxPeakScore = 0;
  const smoothedCols = new Float32Array(160);

  // Restrict search strictly to ergonomic central head corridor [32..128]
  for (let x = 32; x <= 128; x++) {
    let s = 0;
    for (let k = -3; k <= 3; k++) {
      s += (colScores[x + k] || 0);
    }
    // Temporal continuity weight prevents jumping across the frame to background walls
    const distPrev = Math.abs(x - prevFaceX);
    const temporalWeight = Math.exp(-(distPrev * distPrev) / (2 * 28 * 28));
    const weightedScore = s * (0.45 + 0.55 * temporalWeight);

    smoothedCols[x] = weightedScore;
    if (weightedScore > maxPeakScore) {
      maxPeakScore = weightedScore;
      bestPeakX = x;
    }
  }

  let localSumX = 0;
  let localWeight = 0;
  const win = 14;
  const minX = Math.max(30, bestPeakX - win);
  const maxX = Math.min(130, bestPeakX + win);

  for (let x = minX; x <= maxX; x++) {
    const w = smoothedCols[x];
    localSumX += x * w;
    localWeight += w;
  }

  const centroidX = localWeight > 0 ? (localSumX / localWeight) : bestPeakX;
  return { peakX: bestPeakX, centroidX };
}
