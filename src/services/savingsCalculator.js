/**
 * Financial modeling for monthly and yearly prescription savings
 * for chronic and regular patients.
 */

export const CHRONIC_PRESETS = {
  diabetes: {
    condition: "Type 2 Diabetes",
    medicineName: "Glycomet 500",
    defaultDailyDose: 2, // 2 tablets daily
    description: "Metformin 500mg twice daily with meals"
  },
  hypertension: {
    condition: "High Blood Pressure",
    medicineName: "Telma 40",
    defaultDailyDose: 1, // 1 tablet daily
    description: "Telmisartan 40mg once daily in the morning"
  },
  thyroid: {
    condition: "Hypothyroidism",
    medicineName: "Thyronorm 50 mcg",
    defaultDailyDose: 1, // 1 tablet daily
    description: "Thyroxine Sodium 50mcg empty stomach"
  },
  cholesterol: {
    condition: "High Cholesterol & Cardiac Health",
    medicineName: "Rosuvas 10",
    defaultDailyDose: 1, // 1 tablet daily
    description: "Rosuvastatin 10mg once daily at bedtime"
  },
  gerd: {
    condition: "Acid Reflux / Gastric Ulcers",
    medicineName: "Pan 40",
    defaultDailyDose: 1, // 1 tablet daily
    description: "Pantoprazole 40mg before breakfast"
  }
};

/**
 * Calculates monthly and yearly financial savings
 */
export function calculateSavings({
  brandedPricePerUnit,
  genericPricePerUnit,
  tabletsPerDay = 1,
  daysPerMonth = 30
}) {
  const safeBrandedUnit = Math.max(0, parseFloat(brandedPricePerUnit) || 0);
  const safeGenericUnit = Math.max(0, parseFloat(genericPricePerUnit) || 0);
  const safeTabletsPerDay = Math.max(0.5, parseFloat(tabletsPerDay) || 1);
  const safeDays = parseInt(daysPerMonth, 10) || 30;

  const monthlyQuantity = Math.round(safeTabletsPerDay * safeDays);
  const yearlyQuantity = Math.round(monthlyQuantity * 12);

  const brandedMonthlyCost = parseFloat((safeBrandedUnit * monthlyQuantity).toFixed(2));
  const genericMonthlyCost = parseFloat((safeGenericUnit * monthlyQuantity).toFixed(2));
  const monthlySavings = parseFloat(Math.max(0, brandedMonthlyCost - genericMonthlyCost).toFixed(2));

  const brandedYearlyCost = parseFloat((brandedMonthlyCost * 12).toFixed(2));
  const genericYearlyCost = parseFloat((genericMonthlyCost * 12).toFixed(2));
  const yearlySavings = parseFloat(Math.max(0, brandedYearlyCost - genericYearlyCost).toFixed(2));

  const fiveYearSavings = parseFloat((yearlySavings * 5).toFixed(2));

  const percentageSavings = safeBrandedUnit > 0
    ? parseFloat((((safeBrandedUnit - safeGenericUnit) / safeBrandedUnit) * 100).toFixed(1))
    : 0;

  // Real world Indian family equivalency
  let realWorldImpact = "Substantial household savings on monthly medical bills.";
  if (yearlySavings >= 6000) {
    realWorldImpact = "Saves enough to fully sponsor an annual family health insurance (Arogya Sanjeevani) premium.";
  } else if (yearlySavings >= 3000) {
    realWorldImpact = "Saves enough for 4 comprehensive HbA1c & lipid profile lab checkups every quarter.";
  } else if (yearlySavings >= 1200) {
    realWorldImpact = "Covers the full annual cost of regular blood glucose monitoring strips.";
  }

  return {
    tabletsPerDay: safeTabletsPerDay,
    monthlyQuantity,
    yearlyQuantity,
    brandedUnitPrice: safeBrandedUnit,
    genericUnitPrice: safeGenericUnit,
    brandedMonthlyCost,
    genericMonthlyCost,
    monthlySavings,
    brandedYearlyCost,
    genericYearlyCost,
    yearlySavings,
    fiveYearSavings,
    percentageSavings,
    realWorldImpact
  };
}
