import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import { config } from './config.js';
import {
  identifyStripPhoto,
  searchSaltComposition,
  getGenericEquivalents,
  getNearbyJanAushadhiKendras,
  getKendraDirections
} from './services/serpapi.js';
import { calculateSavings, CHRONIC_PRESETS } from './services/savingsCalculator.js';
import { SAMPLE_STRIP_PHOTOS, MOCK_MEDICINES } from './services/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Config & Status
app.get('/api/config', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: config.hasSerpApiKey(),
    port: config.port,
    mode: config.hasSerpApiKey() ? 'live_serpapi' : 'verified_mock'
  });
});

app.post('/api/config', (req, res) => {
  const { apiKey } = req.body;
  config.setSerpApiKey(apiKey);
  res.json({
    success: true,
    hasApiKey: config.hasSerpApiKey(),
    mode: config.hasSerpApiKey() ? 'live_serpapi' : 'verified_mock'
  });
});

// 2. Identify Strip Photo (Google Lens API)
app.post('/api/identify-strip', upload.single('stripImage'), async (req, res) => {
  try {
    const imageBuffer = req.file ? req.file.buffer : null;
    const { imageUrl, sampleId } = req.body;

    const result = await identifyStripPhoto({
      imageBuffer,
      imageUrl,
      sampleId
    });

    res.json(result);
  } catch (err) {
    console.error('Error in /api/identify-strip:', err);
    res.status(500).json({ error: err.message, safetyNotice: "Confirm with your doctor or pharmacist before switching." });
  }
});

// 3. Search Salt Composition & Strength (Google Search API)
app.get('/api/salt-composition', async (req, res) => {
  try {
    const brandName = req.query.brand || req.query.q;
    if (!brandName) {
      return res.status(400).json({ error: 'Medicine brand name is required' });
    }

    const result = await searchSaltComposition(brandName);
    res.json(result);
  } catch (err) {
    console.error('Error in /api/salt-composition:', err);
    res.status(500).json({ error: err.message, safetyNotice: "Confirm with your doctor or pharmacist before switching." });
  }
});

// 4. Generic Equivalents & Multi-Store Pricing (Google Shopping & Immersive Product API)
app.get('/api/generic-alternatives', async (req, res) => {
  try {
    const brand = req.query.brand || '';
    const salt = req.query.salt || '';

    // First ensure we have base medicine info
    const medInfo = await searchSaltComposition(brand);
    if (salt) {
      medInfo.saltComposition = salt;
    }

    const result = await getGenericEquivalents(medInfo);
    res.json(result);
  } catch (err) {
    console.error('Error in /api/generic-alternatives:', err);
    res.status(500).json({ error: err.message, safetyNotice: "Confirm with your doctor or pharmacist before switching." });
  }
});

// 5. Nearby Jan Aushadhi Kendras (Google Maps API)
app.get('/api/nearby-kendras', async (req, res) => {
  try {
    const city = req.query.city;
    const lat = req.query.lat ? parseFloat(req.query.lat) : undefined;
    const lng = req.query.lng ? parseFloat(req.query.lng) : undefined;
    const locationQuery = req.query.q;

    const result = await getNearbyJanAushadhiKendras({ city, lat, lng, locationQuery });
    res.json(result);
  } catch (err) {
    console.error('Error in /api/nearby-kendras:', err);
    res.status(500).json({ error: err.message, safetyNotice: "Confirm with your doctor or pharmacist before switching." });
  }
});

// 6. Navigation Directions (Google Maps Directions API)
app.get('/api/directions', async (req, res) => {
  try {
    const startAddr = req.query.start;
    const endAddr = req.query.end;
    const travelMode = req.query.mode || 3;

    const result = await getKendraDirections({ startAddr, endAddr, travelMode });
    res.json(result);
  } catch (err) {
    console.error('Error in /api/directions:', err);
    res.status(500).json({ error: err.message, safetyNotice: "Confirm with your doctor or pharmacist before switching." });
  }
});

// 7. Calculate Monthly & Yearly Savings
app.post('/api/calculate-savings', (req, res) => {
  try {
    const { brandedPricePerUnit, genericPricePerUnit, tabletsPerDay, daysPerMonth } = req.body;
    const result = calculateSavings({
      brandedPricePerUnit,
      genericPricePerUnit,
      tabletsPerDay,
      daysPerMonth
    });
    res.json({
      ...result,
      safetyNotice: "Confirm with your doctor or pharmacist before switching."
    });
  } catch (err) {
    console.error('Error in /api/calculate-savings:', err);
    res.status(500).json({ error: err.message });
  }
});

// 8. Static helpers: Presets & Samples
app.get('/api/chronic-presets', (req, res) => {
  res.json(CHRONIC_PRESETS);
});

app.get('/api/sample-strips', (req, res) => {
  res.json(SAMPLE_STRIP_PHOTOS);
});

app.get('/api/popular-medicines', (req, res) => {
  res.json(MOCK_MEDICINES.map(m => ({
    brandName: m.brandName,
    saltComposition: m.saltComposition,
    isChronic: m.isChronic,
    conditionTag: m.conditionTag || null,
    mrp: m.brandedDetails.mrp,
    genericPrice: m.genericEquivalent.primaryPrice,
    savingsPercentage: m.genericEquivalent.savingsPercentage
  })));
});

// Start Server if directly executed
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
let server = null;

if (isMain) {
  const port = config.port;
  server = app.listen(port, () => {
    console.log(`Generic Medicine Finder server running at http://localhost:${port}`);
  });
}

export { app, server };
