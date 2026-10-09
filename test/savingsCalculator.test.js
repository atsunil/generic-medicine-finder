import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSavings, CHRONIC_PRESETS } from '../src/services/savingsCalculator.js';

test('calculateSavings computes monthly and yearly projections accurately', () => {
  // Scenario: Branded Augmentin (₹20.45/tablet) vs Generic Amoxyclav (₹5.80/tablet), 2 tablets/day for 30 days
  const result = calculateSavings({
    brandedPricePerUnit: 20.45,
    genericPricePerUnit: 5.80,
    tabletsPerDay: 2,
    daysPerMonth: 30
  });

  assert.equal(result.monthlyQuantity, 60);
  assert.equal(result.yearlyQuantity, 720);
  assert.equal(result.brandedMonthlyCost, 1227.00);
  assert.equal(result.genericMonthlyCost, 348.00);
  assert.equal(result.monthlySavings, 879.00);
  assert.equal(result.yearlySavings, 10548.00);
  assert.equal(result.fiveYearSavings, 52740.00);
  assert.equal(result.percentageSavings, 71.6);
  assert.match(result.realWorldImpact, /health insurance/);
});

test('calculateSavings handles chronic 1 tablet/day single salt (e.g. Telma 40)', () => {
  // Branded Telma 40 (₹9.50/tab) vs Generic (₹1.80/tab)
  const result = calculateSavings({
    brandedPricePerUnit: 9.50,
    genericPricePerUnit: 1.80,
    tabletsPerDay: 1,
    daysPerMonth: 30
  });

  assert.equal(result.monthlyQuantity, 30);
  assert.equal(result.brandedMonthlyCost, 285.00);
  assert.equal(result.genericMonthlyCost, 54.00);
  assert.equal(result.monthlySavings, 231.00);
  assert.equal(result.yearlySavings, 2772.00);
  assert.equal(result.percentageSavings, 81.1);
});

test('calculateSavings handles edge cases gracefully (zero or negative inputs)', () => {
  const result = calculateSavings({
    brandedPricePerUnit: 0,
    genericPricePerUnit: 0,
    tabletsPerDay: 0
  });

  assert.equal(result.monthlySavings, 0);
  assert.equal(result.yearlySavings, 0);
  assert.equal(result.percentageSavings, 0);
});

test('CHRONIC_PRESETS provides validated chronic illness templates', () => {
  assert.ok(CHRONIC_PRESETS.diabetes);
  assert.ok(CHRONIC_PRESETS.hypertension);
  assert.ok(CHRONIC_PRESETS.thyroid);
  assert.equal(CHRONIC_PRESETS.diabetes.defaultDailyDose, 2);
  assert.equal(CHRONIC_PRESETS.hypertension.defaultDailyDose, 1);
});
