import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeSaltName,
  parseStrength,
  parseCompositionString,
  evaluateBioEquivalence
} from '../src/services/saltMatcher.js';

test('normalizeSaltName canonicalizes active pharmaceutical ingredients', () => {
  assert.equal(normalizeSaltName('Amoxicillin Trihydrate IP'), 'amoxicillin');
  assert.equal(normalizeSaltName('Amoxycillin'), 'amoxicillin');
  assert.equal(normalizeSaltName('Potassium Clavulanate'), 'clavulanate');
  assert.equal(normalizeSaltName('Clavulanic Acid'), 'clavulanate');
  assert.equal(normalizeSaltName('Metformin Hydrochloride Prolonged-Release'), 'metformin');
  assert.equal(normalizeSaltName('Telmisartan IP'), 'telmisartan');
  assert.equal(normalizeSaltName('Thyroxine Sodium IP'), 'thyroxine');
  assert.equal(normalizeSaltName('Pantoprazole Sodium Gastro-Resistant'), 'pantoprazole');
});

test('parseStrength extracts quantity and unit accurately', () => {
  assert.deepEqual(parseStrength('500mg'), { value: 500, unit: 'mg', raw: '500mg' });
  assert.deepEqual(parseStrength('125 mg'), { value: 125, unit: 'mg', raw: '125mg' });
  assert.deepEqual(parseStrength('50mcg'), { value: 50, unit: 'mcg', raw: '50mcg' });
  assert.deepEqual(parseStrength('0.5g'), { value: 0.5, unit: 'g', raw: '0.5g' });
  assert.equal(parseStrength('invalid'), null);
});

test('parseCompositionString parses combination salt expressions', () => {
  const comp = 'Amoxicillin (500mg) + Clavulanic Acid (125mg)';
  const ingredients = parseCompositionString(comp);
  assert.equal(ingredients.length, 2);
  assert.equal(ingredients[0].canonicalName, 'amoxicillin');
  assert.equal(ingredients[0].strength.value, 500);
  assert.equal(ingredients[1].canonicalName, 'clavulanate');
  assert.equal(ingredients[1].strength.value, 125);
});

test('evaluateBioEquivalence verifies identical composition and strength', () => {
  const branded = 'Amoxicillin (500mg) + Clavulanic Acid (125mg)';
  const generic = 'Amoxicillin (500mg) + Potassium Clavulanate (125mg)';

  const result = evaluateBioEquivalence(branded, generic);
  assert.equal(result.isExactMatch, true);
  assert.equal(result.matchScore, 100);
  assert.equal(result.safetyStatus, 'VERIFIED_EXACT_EQUIVALENT');
  assert.equal(result.mismatches.length, 0);
  assert.match(result.safetyNotice, /Confirm with your doctor/);
});

test('evaluateBioEquivalence rejects dosage / strength mismatches', () => {
  const branded = 'Metformin Hydrochloride (500mg)';
  const generic = 'Metformin Hydrochloride (1000mg)';

  const result = evaluateBioEquivalence(branded, generic);
  assert.equal(result.isExactMatch, false);
  assert.equal(result.safetyStatus, 'STRENGTH_MISMATCH');
  assert.ok(result.mismatches.some(m => m.includes('Strength mismatch')));
});

test('evaluateBioEquivalence rejects differing active ingredients', () => {
  const branded = 'Telmisartan (40mg)';
  const generic = 'Amlodipine (5mg)';

  const result = evaluateBioEquivalence(branded, generic);
  assert.equal(result.isExactMatch, false);
  assert.equal(result.safetyStatus, 'SALT_MISMATCH');
});

test('evaluateBioEquivalence rejects single salt vs combination mismatch', () => {
  const combo = 'Metformin (500mg) + Glimepiride (2mg)';
  const single = 'Metformin (500mg)';

  const result = evaluateBioEquivalence(combo, single);
  assert.equal(result.isExactMatch, false);
  assert.ok(result.mismatches.some(m => m.includes('Number of active salts differs')));
});
