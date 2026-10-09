/**
 * Strict Chemical Salt & Strength Normalizer & Safety Matcher
 * Enforces exact composition and dosage equivalence.
 */

// Normalized salt alias dictionary
const SALT_ALIASES = {
  "amoxicillin": "amoxicillin",
  "amoxycillin": "amoxicillin",
  "clavulanic acid": "clavulanate",
  "potassium clavulanate": "clavulanate",
  "clavulanate potassium": "clavulanate",
  "clavulanate": "clavulanate",
  "metformin hydrochloride": "metformin",
  "metformin hcl": "metformin",
  "metformin": "metformin",
  "telmisartan": "telmisartan",
  "thyroxine sodium": "thyroxine",
  "levothyroxine sodium": "thyroxine",
  "thyroxine": "thyroxine",
  "pantoprazole sodium": "pantoprazole",
  "pantoprazole": "pantoprazole",
  "rosuvastatin calcium": "rosuvastatin",
  "rosuvastatin": "rosuvastatin",
  "atorvastatin calcium": "atorvastatin",
  "atorvastatin": "atorvastatin",
  "paracetamol": "paracetamol",
  "acetaminophen": "paracetamol"
};

/**
 * Normalizes a salt name to its base chemical entity
 */
export function normalizeSaltName(name) {
  if (!name) return "";
  const cleaned = name
    .toLowerCase()
    .replace(/\b(ip|bp|usp|tablets?|capsules?|syrup|oral|prolonged-release|sustained-release|gastro-resistant)\b/gi, "")
    .trim();

  for (const [alias, canonical] of Object.entries(SALT_ALIASES)) {
    if (cleaned.includes(alias)) {
      return canonical;
    }
  }

  return cleaned.replace(/[^a-z0-9 ]/g, "").trim();
}

/**
 * Parses strength string into numeric value and unit
 * e.g., "500mg" -> { value: 500, unit: "mg" }
 * "50mcg" -> { value: 50, unit: "mcg" }
 */
export function parseStrength(strengthStr) {
  if (!strengthStr) return null;
  const match = strengthStr.toString().match(/(\d+(?:\.\d+)?)\s*(mg|mcg|g|ml|iu)/i);
  if (!match) return null;
  return {
    value: parseFloat(match[1]),
    unit: match[2].toLowerCase(),
    raw: match[0].toLowerCase().replace(/\s+/, "")
  };
}

/**
 * Parses a composition string into individual active ingredients
 * e.g., "Amoxicillin (500mg) + Clavulanic Acid (125mg)"
 * or "Metformin Hydrochloride IP 500mg"
 */
export function parseCompositionString(compString) {
  if (!compString) return [];
  
  // Split by '+' or '&' or 'and'
  const parts = compString.split(/\s*(?:\+|\band\b|&)\s*/i);
  const ingredients = [];

  for (const part of parts) {
    const strengthMatch = part.match(/(\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|iu))/i);
    const strength = strengthMatch ? parseStrength(strengthMatch[1]) : null;
    
    // Extract salt name by stripping strength
    let saltPart = part.replace(/\(.*?\)/g, "").replace(/\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|iu)/gi, "").trim();
    const normalizedName = normalizeSaltName(saltPart);

    if (normalizedName) {
      ingredients.push({
        rawName: saltPart,
        canonicalName: normalizedName,
        strength: strength
      });
    }
  }

  return ingredients;
}

/**
 * Strict safety evaluation between a branded medicine and a generic candidate
 */
export function evaluateBioEquivalence(brandedComp, genericComp) {
  const brandedIngredients = Array.isArray(brandedComp)
    ? brandedComp.map(i => ({
        canonicalName: normalizeSaltName(i.name || i.canonicalName),
        strength: parseStrength(i.strength)
      }))
    : parseCompositionString(brandedComp);

  const genericIngredients = Array.isArray(genericComp)
    ? genericComp.map(i => ({
        canonicalName: normalizeSaltName(i.name || i.canonicalName),
        strength: parseStrength(i.strength)
      }))
    : parseCompositionString(genericComp);

  const mismatches = [];
  const matched = [];

  if (brandedIngredients.length === 0 || genericIngredients.length === 0) {
    return {
      isExactMatch: false,
      matchScore: 0,
      safetyStatus: "UNVERIFIED",
      mismatches: ["Could not parse active ingredients from one or both compositions"],
      safetyNotice: "Confirm with your doctor or pharmacist before switching."
    };
  }

  // Count check
  if (brandedIngredients.length !== genericIngredients.length) {
    mismatches.push(
      `Number of active salts differs (Branded has ${brandedIngredients.length}, Generic has ${genericIngredients.length})`
    );
  }

  // Check each branded ingredient
  for (const bIng of brandedIngredients) {
    const gIng = genericIngredients.find(g => g.canonicalName === bIng.canonicalName);
    if (!gIng) {
      mismatches.push(`Missing active salt in generic: ${bIng.canonicalName}`);
      continue;
    }

    if (bIng.strength && gIng.strength) {
      if (bIng.strength.unit !== gIng.strength.unit || bIng.strength.value !== gIng.strength.value) {
        mismatches.push(
          `Strength mismatch for ${bIng.canonicalName}: Branded has ${bIng.strength.raw}, Generic has ${gIng.strength.raw}`
        );
        continue;
      }
    } else if (bIng.strength || gIng.strength) {
      mismatches.push(`Incomplete dosage specification for ${bIng.canonicalName}`);
      continue;
    }

    matched.push({
      salt: bIng.canonicalName,
      strength: bIng.strength ? bIng.strength.raw : "Standard"
    });
  }

  const isExactMatch = mismatches.length === 0 && matched.length === brandedIngredients.length;
  const matchScore = isExactMatch ? 100 : Math.max(0, Math.round((matched.length / brandedIngredients.length) * 100));

  let safetyStatus = "VERIFIED_EXACT_EQUIVALENT";
  if (!isExactMatch) {
    const hasStrengthIssue = mismatches.some(m => m.toLowerCase().includes("strength"));
    safetyStatus = hasStrengthIssue ? "STRENGTH_MISMATCH" : "SALT_MISMATCH";
  }

  return {
    isExactMatch,
    matchScore,
    matchedIngredients: matched,
    mismatches,
    safetyStatus,
    safetyNotice: "Confirm with your doctor or pharmacist before switching."
  };
}
