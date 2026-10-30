import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateHorizontalSpeed,
  isTurboActive,
  isHandStrikeActive,
  calculateStageSpermCount,
  calculateFertilizationShield,
  summarizeBabyProfile,
  GENE_CATALOG,
  calculateMotionInput,
  findColumnPeakCentroid,
  clampAnchorX
} from './rules.ts';

test('Deadzone calculation returns EXACTLY 0 when head is centered', () => {
  const anchorX = 160;
  const deadzone = 26;

  // Exact center
  assert.equal(calculateHorizontalSpeed(160, anchorX, deadzone), 0);
  // Within deadzone left
  assert.equal(calculateHorizontalSpeed(150, anchorX, deadzone), 0);
  assert.equal(calculateHorizontalSpeed(135, anchorX, deadzone), 0);
  // Within deadzone right
  assert.equal(calculateHorizontalSpeed(170, anchorX, deadzone), 0);
  assert.equal(calculateHorizontalSpeed(185, anchorX, deadzone), 0);
  // Boundary
  assert.equal(calculateHorizontalSpeed(186, anchorX, deadzone), 0);
  assert.equal(calculateHorizontalSpeed(134, anchorX, deadzone), 0);
});

test('Speed increases smoothly beyond deadzone to right and left', () => {
  const anchorX = 160;
  const deadzone = 26;
  const maxSpeed = 10;

  // Right movement
  const speedRight = calculateHorizontalSpeed(215, anchorX, deadzone, maxSpeed);
  assert.ok(speedRight > 0, 'Speed to right must be positive');
  assert.ok(speedRight <= maxSpeed, 'Speed must not exceed maxSpeed');

  // Left movement
  const speedLeft = calculateHorizontalSpeed(105, anchorX, deadzone, maxSpeed);
  assert.ok(speedLeft < 0, 'Speed to left must be negative');
  assert.ok(Math.abs(speedLeft) <= maxSpeed, 'Absolute speed must not exceed maxSpeed');
});

test('Turbo is active only when head rises above upper threshold and ATP > 0', () => {
  const anchorY = 130;
  const offset = 28; // Threshold is 102

  // Normal position
  assert.equal(isTurboActive(130, anchorY, offset, 100), false);
  // Tilted up (Y < 102)
  assert.equal(isTurboActive(95, anchorY, offset, 80), true);
  // Tilted up but 0 ATP
  assert.equal(isTurboActive(95, anchorY, offset, 0), false);
});

test('Hand strike triggers when motion exceeds threshold', () => {
  assert.equal(isHandStrikeActive(0.15, 0.28), false);
  assert.equal(isHandStrikeActive(0.35, 0.28), true);
});

test('Stage sperm count decreases smoothly across the 6 stages', () => {
  // Stage 1 (0 to 1 progress)
  assert.equal(calculateStageSpermCount(0, 0), 10_000_000);
  assert.equal(calculateStageSpermCount(0, 0.5), 7_250_000);
  assert.equal(calculateStageSpermCount(0, 1), 4_500_000);

  // Stage 5 reaches 1 survivor
  assert.equal(calculateStageSpermCount(4, 1), 1);

  // Stage 6 is exactly 1 (final boss)
  assert.equal(calculateStageSpermCount(5, 0), 1);
  assert.equal(calculateStageSpermCount(5, 0.5), 1);
});

test('Fertilization shield absorbs hits and tracks cracks count', () => {
  const hit1 = calculateFertilizationShield(100, 20);
  assert.equal(hit1.newHp, 80);
  assert.equal(hit1.isBroken, false);
  assert.equal(hit1.cracksCount, 1);

  const finalHit = calculateFertilizationShield(15, 20);
  assert.equal(finalHit.newHp, 0);
  assert.equal(finalHit.isBroken, true);
  assert.equal(finalHit.cracksCount, 5);
});

test('Baby profile summary correctly generates genotype and phenotype', () => {
  const profile = summarizeBabyProfile({
    skin: GENE_CATALOG.skin[0],
    eyes: GENE_CATALOG.eyes[0],
    hairColor: GENE_CATALOG.hairColor[1],
    hairTexture: GENE_CATALOG.hairTexture[0],
    trait: GENE_CATALOG.trait[0]
  });

  assert.equal(profile.isComplete, true);
  assert.ok(profile.genotype.includes('XY'));
  assert.ok(profile.phenotype.includes('Piel Morena Canela'));
  assert.ok(profile.phenotype.includes('Verdes Esmeralda'));
});

test('calculateMotionInput guarantees zero drift in deadzone and clamps anchorX to center corridor', () => {
  const anchorX = 80;
  const deadzone = 12;

  // Exact center -> 0 drift
  const center = calculateMotionInput(80, anchorX, deadzone);
  assert.equal(center.input, 0);
  assert.equal(center.isZeroDrift, true);
  assert.equal(center.direction, 'center');

  // Slight offset within deadzone (+10px) -> 0 drift
  const nearCenter = calculateMotionInput(90, anchorX, deadzone);
  assert.equal(nearCenter.input, 0);
  assert.equal(nearCenter.isZeroDrift, true);
  assert.equal(nearCenter.direction, 'center');

  // Slight offset within deadzone (-10px) -> 0 drift
  const nearLeft = calculateMotionInput(70, anchorX, deadzone);
  assert.equal(nearLeft.input, 0);
  assert.equal(nearLeft.isZeroDrift, true);
  assert.equal(nearLeft.direction, 'center');

  // Anchor clamping prevents anchor box from ever getting stuck on extreme edges
  assert.equal(clampAnchorX(20), 66);
  assert.equal(clampAnchorX(145), 94);
  assert.equal(clampAnchorX(80), 80);
});

test('calculateMotionInput commands continuous rightward/leftward speed when head is tilted right or left', () => {
  const anchorX = 80;
  const deadzone = 12;

  // Move right (+24px, exceeding 12px deadzone)
  const right = calculateMotionInput(104, anchorX, deadzone, false);
  assert.ok(right.input > 0, 'Movement to right must be positive and continuous');
  assert.equal(right.direction, 'right');

  // Move left (-24px, exceeding 12px deadzone)
  const left = calculateMotionInput(56, anchorX, deadzone, false);
  assert.ok(left.input < 0, 'Movement to left must be negative and continuous');
  assert.equal(left.direction, 'left');
});

test('findColumnPeakCentroid isolates head center peak and resists strong lateral background objects', () => {
  const colScores = new Float32Array(160);

  // Strong background wall/door on the far left (columns 15-28) and far right (columns 132-148)
  for (let x = 15; x <= 28; x++) {
    colScores[x] = 250;
  }
  for (let x = 132; x <= 148; x++) {
    colScores[x] = 250;
  }

  // True head cluster centered at x = 84 (columns 72 to 96)
  for (let x = 72; x <= 96; x++) {
    const dist = Math.abs(x - 84);
    colScores[x] = Math.max(0, 100 - dist * 7);
  }

  const result = findColumnPeakCentroid(colScores, 80);
  assert.ok(Math.abs(result.peakX - 84) <= 2, `Peak must be near 84, got ${result.peakX}`);
  assert.ok(Math.abs(result.centroidX - 84) <= 2, `Centroid must be near 84, got ${result.centroidX}`);
});

