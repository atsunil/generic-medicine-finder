import { config } from '../config.js';
import { MOCK_MEDICINES, MOCK_KENDRA_LOCATIONS, SAMPLE_STRIP_PHOTOS } from './mockData.js';
import { evaluateBioEquivalence, parseCompositionString } from './saltMatcher.js';
import { enrichStoresWithProvenance, detectDiscrepancies } from './discrepancyDetector.js';

const SERPAPI_BASE_URL = "https://serpapi.com/search";
const SERPAPI_IMAGE_URL = "https://serpapi.com/image";

/**
 * Uploads an image buffer to SerpApi Image API to obtain an image_id for Google Lens
 */
export async function uploadImageToSerpApi(imageBuffer, filename = "strip.jpg", apiKey = config.serpApiKey) {
  if (!apiKey) return null;

  try {
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: "image/jpeg" });
    formData.append("image", blob, filename);
    formData.append("api_key", apiKey);

    const response = await fetch(SERPAPI_IMAGE_URL, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      console.warn(`[SerpApi Image Upload] HTTP error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.image_id || null;
  } catch (err) {
    console.error("[SerpApi Image Upload] Exception:", err.message);
    return null;
  }
}

/**
 * 1. Google Lens API (engine=google_lens)
 * Identifies medicine blister strip from photo
 */
export async function identifyStripPhoto({ imageBuffer, imageUrl, sampleId }, apiKey = config.serpApiKey) {
  // If sample ID provided or no API key, use verified sample data
  if (sampleId || !apiKey) {
    const sample = SAMPLE_STRIP_PHOTOS.find(s => s.id === sampleId) || SAMPLE_STRIP_PHOTOS[0];
    const matchedMed = MOCK_MEDICINES.find(m => m.brandName.toLowerCase() === sample.detectedMedicine.toLowerCase());

    return {
      source: "mock",
      engine: "google_lens",
      identifiedMedicine: sample.detectedMedicine,
      detectedSalt: sample.detectedSalt,
      confidence: sample.confidence,
      visualMatches: [
        {
          title: `${sample.detectedMedicine} - Strip Packaging`,
          source: "1mg / PharmEasy Catalog",
          link: "https://www.1mg.com",
          thumbnail: sample.imageUrl
        },
        {
          title: `${sample.detectedSalt} Generic Equivalent`,
          source: "Jan Aushadhi Portal",
          link: "http://janaushadhi.gov.in"
        }
      ],
      associatedMedicine: matchedMed || null,
      safetyNotice: "Confirm with your doctor or pharmacist before switching."
    };
  }

  try {
    let queryParams = new URLSearchParams({
      engine: "google_lens",
      api_key: apiKey,
      hl: "en",
      gl: "in"
    });

    if (imageBuffer) {
      const imageId = await uploadImageToSerpApi(imageBuffer, "strip.jpg", apiKey);
      if (imageId) {
        queryParams.set("image_id", imageId);
      } else if (imageUrl) {
        queryParams.set("url", imageUrl);
      } else {
        throw new Error("Could not obtain image_id from SerpApi Image API");
      }
    } else if (imageUrl) {
      queryParams.set("url", imageUrl);
    }

    const resp = await fetch(`${SERPAPI_BASE_URL}?${queryParams.toString()}`);
    if (!resp.ok) {
      throw new Error(`Google Lens API failed with status ${resp.status}`);
    }

    const data = await resp.json();
    const visualMatches = data.visual_matches || [];
    const kg = data.knowledge_graph || {};

    let identifiedMedicine = kg.title || (visualMatches[0] ? visualMatches[0].title : "Unknown Medicine Strip");
    // Clean medicine title
    identifiedMedicine = identifiedMedicine.replace(/\b(strip|tablets?|capsules?|box|online|price)\b/gi, "").trim();

    return {
      source: "live_serpapi",
      engine: "google_lens",
      identifiedMedicine,
      visualMatches: visualMatches.slice(0, 5).map(v => ({
        title: v.title,
        source: v.source,
        link: v.link,
        thumbnail: v.thumbnail
      })),
      safetyNotice: "Confirm with your doctor or pharmacist before switching."
    };
  } catch (err) {
    console.warn(`[Google Lens API Error]: ${err.message}. Falling back to default match.`);
    const sample = SAMPLE_STRIP_PHOTOS[0];
    return {
      source: "mock_fallback",
      engine: "google_lens",
      identifiedMedicine: sample.detectedMedicine,
      detectedSalt: sample.detectedSalt,
      visualMatches: [],
      error: err.message,
      safetyNotice: "Confirm with your doctor or pharmacist before switching."
    };
  }
}

/**
 * 2. Google Search API (engine=google)
 * Extracts active salt composition and strength for a brand name
 */
export async function searchSaltComposition(brandName, apiKey = config.serpApiKey) {
  const queryTerm = (brandName || "").trim().toLowerCase();

  // Check mock database first
  const mockMatch = MOCK_MEDICINES.find(m =>
    m.brandName.toLowerCase() === queryTerm ||
    m.aliases.some(a => a.toLowerCase().includes(queryTerm) || queryTerm.includes(a.toLowerCase()))
  );

  if (!apiKey) {
    if (mockMatch) {
      return {
        source: "mock",
        engine: "google",
        brandName: mockMatch.brandName,
        saltComposition: mockMatch.saltComposition,
        activeIngredients: mockMatch.activeIngredients,
        totalStrength: mockMatch.totalStrength,
        manufacturer: mockMatch.manufacturer,
        dosageForm: mockMatch.dosageForm,
        therapeuticClass: mockMatch.therapeuticClass,
        isChronic: mockMatch.isChronic,
        conditionTag: mockMatch.conditionTag || null,
        brandedDetails: mockMatch.brandedDetails,
        safetyNotice: "Confirm with your doctor or pharmacist before switching."
      };
    }

    // Generic parse from query string
    const parsedIngredients = parseCompositionString(brandName);
    return {
      source: "mock",
      engine: "google",
      brandName: brandName,
      saltComposition: parsedIngredients.map(i => `${i.rawName} (${i.strength ? i.strength.raw : "Standard"})`).join(" + ") || brandName,
      activeIngredients: parsedIngredients,
      totalStrength: parsedIngredients[0]?.strength?.raw || "Standard",
      manufacturer: "Verified Indian Manufacturer",
      dosageForm: "Tablet",
      isChronic: false,
      brandedDetails: {
        packSize: 10,
        mrp: 120.00,
        pricePerUnit: 12.00,
        source: "Standard Indian Pharma Average",
        sourceUrl: "https://www.1mg.com",
        lastFetched: new Date().toISOString()
      },
      safetyNotice: "Confirm with your doctor or pharmacist before switching."
    };
  }

  // Live SerpApi Google Search query
  try {
    const params = new URLSearchParams({
      engine: "google",
      q: `${brandName} salt composition strength India`,
      gl: "in",
      hl: "en",
      google_domain: "google.co.in",
      api_key: apiKey
    });

    const resp = await fetch(`${SERPAPI_BASE_URL}?${params.toString()}`);
    if (!resp.ok) {
      throw new Error(`Google Search API responded with status ${resp.status}`);
    }

    const data = await resp.json();
    const kg = data.knowledge_graph || {};
    const answerBox = data.answer_box || {};
    const organicResults = data.organic_results || [];

    // Parse snippet for salt composition
    let compositionSnippet = kg.description || answerBox.snippet || (organicResults[0]?.snippet || "");
    let saltComp = mockMatch ? mockMatch.saltComposition : compositionSnippet.slice(0, 80);

    return {
      source: "live_serpapi",
      engine: "google",
      brandName: kg.title || brandName,
      saltComposition: saltComp,
      activeIngredients: mockMatch ? mockMatch.activeIngredients : parseCompositionString(saltComp),
      snippet: compositionSnippet,
      manufacturer: kg.attributes?.manufacturer || mockMatch?.manufacturer || "Generic Pharma",
      brandedDetails: mockMatch?.brandedDetails || {
        packSize: 10,
        mrp: 150.00,
        pricePerUnit: 15.00,
        source: organicResults[0]?.source || "Google Search Result",
        sourceUrl: organicResults[0]?.link || "https://google.co.in",
        lastFetched: new Date().toISOString()
      },
      safetyNotice: "Confirm with your doctor or pharmacist before switching."
    };
  } catch (err) {
    console.warn(`[Google Search API] ${err.message}. Using fallback match.`);
    if (mockMatch) {
      return {
        source: "mock_fallback",
        engine: "google",
        ...mockMatch,
        safetyNotice: "Confirm with your doctor or pharmacist before switching."
      };
    }
    throw err;
  }
}

/**
 * 3. Google Shopping API & Immersive Product API
 * (engine=google_shopping & engine=google_immersive_product)
 */
export async function getGenericEquivalents(medicineInfo, apiKey = config.serpApiKey) {
  const brandName = medicineInfo.brandName || "";
  const queryTerm = brandName.toLowerCase();

  const mockMatch = MOCK_MEDICINES.find(m =>
    m.brandName.toLowerCase() === queryTerm ||
    m.aliases.some(a => a.toLowerCase().includes(queryTerm) || queryTerm.includes(a.toLowerCase()))
  );

  let stores = [];
  let genericEquivalent = null;
  let immersiveDetails = null;

  if (!apiKey || mockMatch) {
    const target = mockMatch || MOCK_MEDICINES[0];
    stores = enrichStoresWithProvenance(target.stores);
    genericEquivalent = target.genericEquivalent;

    // Safety bio-equivalence check
    const safetyCheck = evaluateBioEquivalence(
      target.saltComposition,
      genericEquivalent.saltComposition
    );

    // Discrepancy detection
    const discrepancyReport = detectDiscrepancies(stores, target.brandedDetails);

    return {
      source: apiKey ? "hybrid" : "mock",
      engine: "google_shopping + google_immersive_product",
      brandedMedicine: target.brandName,
      saltComposition: target.saltComposition,
      activeIngredients: target.activeIngredients,
      brandedDetails: target.brandedDetails,
      genericEquivalent,
      stores,
      safetyCheck,
      discrepancyReport,
      safetyNotice: "Confirm with your doctor or pharmacist before switching."
    };
  }

  // Live SerpApi Google Shopping Query
  try {
    const shoppingParams = new URLSearchParams({
      engine: "google_shopping",
      q: `${medicineInfo.saltComposition || brandName} generic medicine India`,
      gl: "in",
      hl: "en",
      google_domain: "google.co.in",
      sort_by: "p_asc",
      api_key: apiKey
    });

    const shopResp = await fetch(`${SERPAPI_BASE_URL}?${shoppingParams.toString()}`);
    if (!shopResp.ok) {
      throw new Error(`Google Shopping API responded with status ${shopResp.status}`);
    }

    const shopData = await shopResp.json();
    const shoppingResults = shopData.shopping_results || [];

    // Parse shopping results into store listings
    stores = shoppingResults.slice(0, 6).map(item => ({
      storeName: item.source || "Online Pharmacy",
      productTitle: item.title,
      price: item.extracted_price || parseFloat(item.price?.replace(/[^\d.]/g, "") || 50),
      packSize: 10,
      pricePerUnit: parseFloat(((item.extracted_price || 50) / 10).toFixed(2)),
      inStock: true,
      deliveryDays: item.delivery || "Standard delivery",
      rating: item.rating || 4.5,
      sourceUrl: item.link,
      timestamp: new Date().toISOString()
    }));

    // If first item has immersive_product_page_token, call Immersive Product API
    const pageToken = shoppingResults[0]?.immersive_product_page_token;
    if (pageToken) {
      try {
        const immParams = new URLSearchParams({
          engine: "google_immersive_product",
          page_token: pageToken,
          more_stores: "true",
          api_key: apiKey
        });

        const immResp = await fetch(`${SERPAPI_BASE_URL}?${immParams.toString()}`);
        if (immResp.ok) {
          const immData = await immResp.json();
          immersiveDetails = immData;
          if (Array.isArray(immData.stores)) {
            const extraStores = immData.stores.map(s => ({
              storeName: s.name,
              productTitle: immData.product_results?.title || "Generic Equivalent",
              price: s.extracted_price || parseFloat(s.price?.replace(/[^\d.]/g, "") || 40),
              packSize: 10,
              pricePerUnit: parseFloat(((s.extracted_price || 40) / 10).toFixed(2)),
              inStock: true,
              deliveryDays: s.shipping || "2-3 days",
              rating: s.rating || 4.6,
              sourceUrl: s.link,
              timestamp: new Date().toISOString()
            }));
            stores = [...extraStores, ...stores];
          }
        }
      } catch (immErr) {
        console.warn(`[Google Immersive Product API] ${immErr.message}`);
      }
    }

    // Jan Aushadhi base pricing fallback if not in shopping results
    const lowestGenericPrice = stores[0]?.price || 45;
    genericEquivalent = {
      productName: `${medicineInfo.saltComposition} Generic Tablets IP`,
      saltComposition: medicineInfo.saltComposition,
      packSize: 10,
      primaryPrice: lowestGenericPrice,
      pricePerUnit: parseFloat((lowestGenericPrice / 10).toFixed(2)),
      savingsPercentage: Math.round(((medicineInfo.brandedDetails.mrp - lowestGenericPrice) / medicineInfo.brandedDetails.mrp) * 100)
    };

    const safetyCheck = evaluateBioEquivalence(
      medicineInfo.saltComposition,
      genericEquivalent.saltComposition
    );

    const enrichedStores = enrichStoresWithProvenance(stores);
    const discrepancyReport = detectDiscrepancies(enrichedStores, medicineInfo.brandedDetails);

    return {
      source: "live_serpapi",
      engine: "google_shopping + google_immersive_product",
      brandedMedicine: brandName,
      saltComposition: medicineInfo.saltComposition,
      brandedDetails: medicineInfo.brandedDetails,
      genericEquivalent,
      stores: enrichedStores,
      safetyCheck,
      discrepancyReport,
      safetyNotice: "Confirm with your doctor or pharmacist before switching."
    };
  } catch (err) {
    console.warn(`[Google Shopping API Error] ${err.message}. Using mock.`);
    const fallback = MOCK_MEDICINES[0];
    return {
      source: "mock_fallback",
      engine: "google_shopping",
      ...fallback,
      safetyNotice: "Confirm with your doctor or pharmacist before switching."
    };
  }
}

/**
 * 4. Google Maps Search API (engine=google_maps)
 * Locates nearest Jan Aushadhi Kendras & pharmacies
 */
export async function getNearbyJanAushadhiKendras({ city, lat, lng, locationQuery }, apiKey = config.serpApiKey) {
  // If no API key or city matches mock, serve structured location data
  const targetCity = (city || locationQuery || "New Delhi").toLowerCase();
  const cityMock = MOCK_KENDRA_LOCATIONS.find(c => targetCity.includes(c.city.toLowerCase())) || MOCK_KENDRA_LOCATIONS[0];

  if (!apiKey) {
    return {
      source: "mock",
      engine: "google_maps",
      city: cityMock.city,
      centerCoordinates: { lat: cityMock.lat, lng: cityMock.lng },
      kendras: cityMock.kendras,
      totalFound: cityMock.kendras.length,
      safetyNotice: "Confirm with your doctor or pharmacist before switching."
    };
  }

  // Live SerpApi Google Maps search
  try {
    const mapsParams = new URLSearchParams({
      engine: "google_maps",
      type: "search",
      q: `Pradhan Mantri Bhartiya Janaushadhi Kendra ${locationQuery || city || ""}`.trim(),
      api_key: apiKey
    });

    if (lat && lng) {
      mapsParams.set("ll", `@${lat},${lng},14z`);
    } else {
      mapsParams.set("location", locationQuery || city || "New Delhi, India");
      mapsParams.set("z", "14");
    }

    const resp = await fetch(`${SERPAPI_BASE_URL}?${mapsParams.toString()}`);
    if (!resp.ok) {
      throw new Error(`Google Maps API failed with status ${resp.status}`);
    }

    const data = await resp.json();
    const localResults = data.local_results || [];

    const mappedKendras = localResults.map((item, idx) => ({
      id: item.data_id || `pmbjp-live-${idx}`,
      title: item.title,
      address: item.address || "Address available on map",
      phone: item.phone || "Helpline: 1800 180 8080",
      rating: item.rating || 4.7,
      reviewsCount: item.reviews || 100,
      openState: item.open_state || "Open",
      distanceKm: item.distance ? parseFloat(item.distance.replace(/[^\d.]/g, "")) : 1.5 + (idx * 0.8),
      coordinates: item.gps_coordinates || { lat: 28.6139, lng: 77.2090 },
      isJanAushadhi: (item.title || "").toLowerCase().includes("janaushadhi") || (item.title || "").toLowerCase().includes("aushadhi"),
      stockStatus: "Generic medicines stocked"
    }));

    return {
      source: "live_serpapi",
      engine: "google_maps",
      city: city || locationQuery || "India",
      centerCoordinates: { lat: lat || 28.6139, lng: lng || 77.2090 },
      kendras: mappedKendras.length > 0 ? mappedKendras : cityMock.kendras,
      totalFound: mappedKendras.length,
      safetyNotice: "Confirm with your doctor or pharmacist before switching."
    };
  } catch (err) {
    console.warn(`[Google Maps API Error] ${err.message}. Using city mock.`);
    return {
      source: "mock_fallback",
      engine: "google_maps",
      city: cityMock.city,
      centerCoordinates: { lat: cityMock.lat, lng: cityMock.lng },
      kendras: cityMock.kendras,
      totalFound: cityMock.kendras.length,
      safetyNotice: "Confirm with your doctor or pharmacist before switching."
    };
  }
}

/**
 * 5. Google Maps Directions API (engine=google_maps_directions)
 * Gets turn-by-turn routing to nearest Jan Aushadhi Kendra
 */
export async function getKendraDirections({ startAddr, endAddr, travelMode = 3 }, apiKey = config.serpApiKey) {
  if (!apiKey) {
    return {
      source: "mock",
      engine: "google_maps_directions",
      travelMode: "Transit / Driving",
      via: "Main City Arterial Road",
      distance: "2.1 km",
      duration: "7 mins",
      steps: [
        "Head toward nearest main road / Metro station",
        "Turn left towards Jan Aushadhi Kendra commercial market",
        "Arrive at Pradhan Mantri Bhartiya Janaushadhi Kendra on the ground floor"
      ],
      safetyNotice: "Confirm with your doctor or pharmacist before switching."
    };
  }

  try {
    const dirParams = new URLSearchParams({
      engine: "google_maps_directions",
      start_addr: startAddr || "Current Location",
      end_addr: endAddr || "Pradhan Mantri Bhartiya Janaushadhi Kendra",
      travel_mode: travelMode.toString(),
      api_key: apiKey
    });

    const resp = await fetch(`${SERPAPI_BASE_URL}?${dirParams.toString()}`);
    if (!resp.ok) {
      throw new Error(`Google Maps Directions API returned ${resp.status}`);
    }

    const data = await resp.json();
    const directionsList = data.directions || [];
    const firstRoute = directionsList[0] || {};

    let formattedDuration = "10 mins";
    if (typeof firstRoute.duration === "number") {
      const mins = Math.round(firstRoute.duration / 60);
      formattedDuration = mins >= 60 ? `${Math.floor(mins / 60)} hr ${mins % 60} mins` : `${mins} mins`;
    } else if (firstRoute.duration) {
      formattedDuration = firstRoute.duration;
    }

    let formattedDistance = "2.5 km";
    if (typeof firstRoute.distance === "number") {
      formattedDistance = `${(firstRoute.distance / 1000).toFixed(1)} km`;
    } else if (firstRoute.distance) {
      formattedDistance = firstRoute.distance;
    }

    let parsedSteps = [
      "Follow GPS route instructions towards Jan Aushadhi Kendra"
    ];
    if (Array.isArray(firstRoute.steps) && firstRoute.steps.length > 0) {
      parsedSteps = firstRoute.steps.map(s => {
        if (typeof s === "string") return s;
        return s.instructions || s.snippet || s.text || "Follow navigation route";
      });
    }

    return {
      source: "live_serpapi",
      engine: "google_maps_directions",
      travelMode: firstRoute.travel_mode || "Transit",
      via: firstRoute.via || "Optimized Route",
      distance: formattedDistance,
      duration: formattedDuration,
      steps: parsedSteps,
      safetyNotice: "Confirm with your doctor or pharmacist before switching."
    };
  } catch (err) {
    console.warn(`[Google Maps Directions Error] ${err.message}. Using fallback.`);
    return {
      source: "mock_fallback",
      engine: "google_maps_directions",
      travelMode: "Driving",
      via: "Direct route",
      distance: "2.0 km",
      duration: "8 mins",
      steps: ["Proceed along direct route to Jan Aushadhi Kendra."],
      safetyNotice: "Confirm with your doctor or pharmacist before switching."
    };
  }
}
