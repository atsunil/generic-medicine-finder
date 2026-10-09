# Jan Aushadhi Generic Medicine Finder 💊
> Stop overpaying for branded medicines in India. Find exact bio-equivalent generic salts for 50% to 80% less, locate the nearest Jan Aushadhi Kendra with directions, and compute monthly & yearly savings for chronic patients.

---

## Key Features & Google SerpApi Integration

| Feature | SerpApi Google Engine | Documentation Parameters | Output Extracted |
| :--- | :--- | :--- | :--- |
| **Medicine Strip Photo ID** | `google_lens` | `engine=google_lens`<br>`image_id` (via `POST https://serpapi.com/image`) or `url`<br>`gl=in`, `hl=en` | Visual matches, detected brand/salt names, packaging text |
| **Salt & Strength Lookup** | `google` | `engine=google`<br>`q="{brand_name} salt composition strength India"`<br>`gl=in`, `hl=en`, `google_domain=google.co.in` | Knowledge graph, organic snippets, exact chemical active salts & dosage |
| **Generic Equivalent Prices** | `google_shopping` | `engine=google_shopping`<br>`q="{salt_composition} generic medicine buy India"`<br>`gl=in`, `hl=en`, `sort_by=p_asc` | Generic listings, extracted prices, merchant stores, `immersive_product_page_token` |
| **Multi-Store Price Matrix** | `google_immersive_product` | `engine=google_immersive_product`<br>`page_token={token}`<br>`more_stores=true` | In-depth seller breakdown, online stock status, shipping rates, store ratings |
| **Jan Aushadhi Kendra Locator**| `google_maps` | `engine=google_maps`<br>`type=search`<br>`q="Pradhan Mantri Bhartiya Janaushadhi Kendra"`<br>`ll=@{lat},{lng},14z` or `location={city}` | Local Kendra outlets, addresses, phone numbers, ratings, distance in km |
| **Route & Directions** | `google_maps_directions` | `engine=google_maps_directions`<br>`start_addr={origin}`<br>`end_addr={kendra}`<br>`travel_mode=3` | Distance, transit/driving duration, turn-by-turn navigation steps |

---

## Safety & Medical Compliance

1. **Exact Bio-Equivalence Matching**: Generic alternatives must match 100% of the active pharmaceutical chemical salts and the exact milligram/microgram strength (e.g. Amoxicillin 500mg + Potassium Clavulanate 125mg). Mismatched strengths or incomplete combination formulations are strictly flagged.
2. **Provenance & Timestamp Tracking**: Every price quote contains direct source links (PMBJP portal, Tata 1mg, Apollo Pharmacy, Generic Aadhaar, Zeelab) and exact fetch timestamps.
3. **Discrepancy Detection**: Identifies and flags abnormal pricing spreads (>50%) or conflicting source data.
4. **Mandatory Medical Disclaimer**: Prominently presented across the app:  
   ⚠️ **"Confirm with your doctor or pharmacist before switching."**

---

## Chronic Patient Savings Calculator

Chronic patients with recurring monthly prescriptions (e.g., Diabetes, Hypertension/BP, Hypothyroidism, Dyslipidemia/Cholesterol, Acid Reflux) can view exact monthly and annual savings:
- **Monthly Savings**: $(\text{Branded Monthly Cost} - \text{Generic Monthly Cost})$
- **Yearly Savings**: $\text{Monthly Savings} \times 12$
- **5-Year Projections**: Cumulative savings and real-world health insurance sponsorship equivalents.

---

## Quickstart

### Prerequisites
- Node.js 18+ (tested on Node.js v26.8.2)

### Installation
```bash
git clone <repo-url>
cd generic-medicine-finder
npm install
```

### Running the App
```bash
# Start server on http://localhost:3000
npm start
```

### Running Automated Tests
```bash
npm test
```
Runs 18 unit and integration tests covering salt normalization, strength parsing, bio-equivalence matching, chronic savings financial math, and all API endpoints.

---

## Execution Modes
- **Verified Hybrid Mode (Default)**: Out-of-the-box mode with verified Indian pharmaceutical market data (NPPA & PMBJP price lists) for popular chronic medicines, sample strip images, and Kendra locations across 7 major Indian cities.
- **Live SerpApi Mode**: Enter your private SerpApi key in the web UI (`⚙️ SerpApi Key` button) or set `SERPAPI_API_KEY` in `.env` to execute live Google queries across all 6 engines.
