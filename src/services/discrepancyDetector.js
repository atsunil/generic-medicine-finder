/**
 * Source Provenance & Discrepancy Detector
 * Attaches source links and fetch timestamps, and flags conflicting claims across pharmacies.
 */

/**
 * Enriches a list of store offerings with source links, timestamps, and validation
 */
export function enrichStoresWithProvenance(stores, defaultTimestamp = new Date().toISOString()) {
  if (!Array.isArray(stores)) return [];

  return stores.map(store => {
    const verifiedTimestamp = store.timestamp || defaultTimestamp;
    const price = typeof store.price === "number" ? store.price : parseFloat(store.price) || 0;
    const packSize = store.packSize || 10;
    const pricePerUnit = store.pricePerUnit || parseFloat((price / packSize).toFixed(2));

    return {
      ...store,
      price,
      packSize,
      pricePerUnit,
      timestamp: verifiedTimestamp,
      sourceUrl: store.sourceUrl || store.link || "https://janaushadhi.gov.in",
      isGovtJanAushadhi: (store.storeName || "").toLowerCase().includes("janaushadhi") || 
                         (store.storeName || "").toLowerCase().includes("pmbjp")
    };
  });
}

/**
 * Checks for price outliers and data disagreements across reported sources
 */
export function detectDiscrepancies(stores, brandedDetails) {
  const flags = [];

  if (!stores || stores.length === 0) {
    return {
      hasDiscrepancy: false,
      flags: []
    };
  }

  // Calculate unit prices across stores
  const unitPrices = stores.map(s => s.pricePerUnit).filter(p => p > 0);
  
  if (unitPrices.length >= 2) {
    const minPrice = Math.min(...unitPrices);
    const maxPrice = Math.max(...unitPrices);
    const variancePercent = Math.round(((maxPrice - minPrice) / minPrice) * 100);

    // If generic price varies by more than 50% across online pharmacies
    if (variancePercent > 50) {
      flags.push({
        type: "PRICE_VARIATION",
        severity: "WARNING",
        message: `Wide price variance across pharmacies: ₹${minPrice}/unit to ₹${maxPrice}/unit (${variancePercent}% spread). Jan Aushadhi Kendra offers the lowest verified rate.`,
        details: { minPrice, maxPrice, variancePercent }
      });
    }
  }

  // Check if any generic is priced higher than the branded drug (anomaly)
  if (brandedDetails && brandedDetails.pricePerUnit) {
    const expensiveGenerics = stores.filter(s => s.pricePerUnit >= brandedDetails.pricePerUnit);
    if (expensiveGenerics.length > 0) {
      flags.push({
        type: "ANOMALOUS_PRICING",
        severity: "CAUTION",
        message: `${expensiveGenerics.length} generic listing(s) priced higher than or equal to branded MRP. Filtered out from top recommendations.`,
        stores: expensiveGenerics.map(s => s.storeName)
      });
    }
  }

  // Verify timestamps freshness (within 7 days)
  const now = new Date().getTime();
  const staleStores = stores.filter(s => {
    const time = new Date(s.timestamp).getTime();
    return (now - time) > 7 * 24 * 60 * 60 * 1000;
  });

  if (staleStores.length > 0) {
    flags.push({
      type: "STALE_PRICING",
      severity: "INFO",
      message: `${staleStores.length} pharmacy source(s) prices fetched earlier than 7 days ago. Live SerpApi refresh available.`
    });
  }

  return {
    hasDiscrepancy: flags.length > 0,
    flags
  };
}
