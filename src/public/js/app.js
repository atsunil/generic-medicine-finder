import { initCamera } from './camera.js';
import { initKendraLocator } from './map.js';

// Global state
const state = {
  currentBrand: 'Augmentin 625 Duo',
  saltComposition: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
  brandedPricePerUnit: 20.45,
  genericPricePerUnit: 5.80,
  tabletsPerDay: 1,
  activeCondition: null
};

document.addEventListener('DOMContentLoaded', () => {
  initUI();
  initCamera((medicineName) => {
    document.getElementById('search-input').value = medicineName;
    performSearch(medicineName);
  });
  initKendraLocator();

  // Initial search for default medicine
  performSearch('Augmentin 625 Duo');
});

function initUI() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const quickMedPills = document.querySelectorAll('.quick-med-pill');
  const dosageSlider = document.getElementById('dosage-slider');
  const dosageVal = document.getElementById('dosage-val');
  const presetTabs = document.querySelectorAll('.chronic-tab');
  const btnSettings = document.getElementById('btn-settings');
  const settingsModal = document.getElementById('settings-modal');
  const btnSaveKey = document.getElementById('btn-save-key');
  const btnCloseSettings = document.getElementById('btn-close-settings');
  const apiKeyInput = document.getElementById('api-key-input');

  // Search submission
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) performSearch(query);
    });
  }

  // Quick pills
  quickMedPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const med = pill.dataset.med;
      searchInput.value = med;
      performSearch(med);
    });
  });

  // Dosage slider
  if (dosageSlider && dosageVal) {
    dosageSlider.addEventListener('input', (e) => {
      state.tabletsPerDay = parseFloat(e.target.value);
      dosageVal.textContent = state.tabletsPerDay + (state.tabletsPerDay === 1 ? ' tablet/day' : ' tablets/day');
      updateSavingsCalculations();
    });
  }

  // Chronic Presets
  presetTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      presetTabs.forEach(t => t.classList.remove('btn-primary'));
      presetTabs.forEach(t => t.classList.add('btn-secondary'));
      tab.classList.remove('btn-secondary');
      tab.classList.add('btn-primary');

      const med = tab.dataset.med;
      const defaultDose = parseFloat(tab.dataset.dose) || 1;
      state.tabletsPerDay = defaultDose;
      if (dosageSlider) dosageSlider.value = defaultDose;
      if (dosageVal) dosageVal.textContent = defaultDose + (defaultDose === 1 ? ' tablet/day' : ' tablets/day');

      searchInput.value = med;
      performSearch(med);
    });
  });

  // Settings & SerpApi Key Modal
  checkConfig();
  if (btnSettings && settingsModal) {
    btnSettings.addEventListener('click', () => {
      settingsModal.classList.remove('hidden');
    });

    btnCloseSettings.addEventListener('click', () => {
      settingsModal.classList.add('hidden');
    });

    btnSaveKey.addEventListener('click', async () => {
      const key = apiKeyInput.value.trim();
      const resp = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key })
      });
      const data = await resp.json();
      settingsModal.classList.add('hidden');
      checkConfig();
      alert(data.hasApiKey ? 'Live SerpApi Key activated!' : 'Switched to Verified Mock Mode.');
    });
  }
}

async function checkConfig() {
  try {
    const resp = await fetch('/api/config');
    const data = await resp.json();
    const statusText = document.getElementById('engine-mode-status');
    const modeBadge = document.getElementById('mode-badge');

    if (data.hasApiKey) {
      if (statusText) statusText.textContent = 'Live SerpApi Mode';
      if (modeBadge) modeBadge.style.backgroundColor = '#16a34a';
    } else {
      if (statusText) statusText.textContent = 'Verified Hybrid Mode';
      if (modeBadge) modeBadge.style.backgroundColor = '#0284c7';
    }
  } catch (e) {
    console.warn('Could not read config:', e);
  }
}

async function performSearch(brandName) {
  showLoading(`Searching composition and prices for "${brandName}"...`);
  try {
    const compResp = await fetch(`/api/salt-composition?brand=${encodeURIComponent(brandName)}`);
    const compData = await compResp.json();

    const altResp = await fetch(`/api/generic-alternatives?brand=${encodeURIComponent(brandName)}&salt=${encodeURIComponent(compData.saltComposition)}`);
    const altData = await altResp.json();

    renderResults(compData, altData);
  } catch (err) {
    alert('Error fetching medicine details: ' + err.message);
  } finally {
    hideLoading();
  }
}

function renderResults(compData, altData) {
  const resultContainer = document.getElementById('result-section');
  if (resultContainer) resultContainer.classList.remove('hidden');

  // Update State
  state.currentBrand = compData.brandName;
  state.saltComposition = compData.saltComposition;
  state.brandedPricePerUnit = compData.brandedDetails?.pricePerUnit || 15;
  state.genericPricePerUnit = altData.genericEquivalent?.pricePerUnit || 3;

  // Active Salt Banner
  const brandTitleElem = document.getElementById('display-brand-name');
  const saltCompElem = document.getElementById('display-salt-comp');
  const mfgElem = document.getElementById('display-mfg');
  if (brandTitleElem) brandTitleElem.textContent = compData.brandName;
  if (saltCompElem) saltCompElem.textContent = compData.saltComposition;
  if (mfgElem) mfgElem.textContent = `Manufacturer: ${compData.manufacturer || 'Indian Pharma'}`;

  // Safety Status Badge
  const safetyStatusElem = document.getElementById('safety-status-badge');
  const safetyDescElem = document.getElementById('safety-status-desc');
  if (altData.safetyCheck?.isExactMatch) {
    if (safetyStatusElem) {
      safetyStatusElem.className = 'safety-seal';
      safetyStatusElem.innerHTML = `
        <div class="safety-seal-icon">✓</div>
        <div>
          <strong style="color:#166534;">100% Bio-Equivalent Chemical Match</strong>
          <div style="font-size:0.8rem; color:#15803d;">Active salt and dosage strength match verified against Indian Pharmacopoeia.</div>
        </div>
      `;
    }
  } else {
    if (safetyStatusElem) {
      safetyStatusElem.className = 'safety-seal';
      safetyStatusElem.style.borderColor = '#f59e0b';
      safetyStatusElem.style.backgroundColor = '#fffbeb';
      safetyStatusElem.innerHTML = `
        <div class="safety-seal-icon" style="background:#d97706;">!</div>
        <div>
          <strong style="color:#b45309;">Formulation Verification Alert</strong>
          <div style="font-size:0.8rem; color:#92400e;">${(altData.safetyCheck?.mismatches || []).join(', ')}</div>
        </div>
      `;
    }
  }

  // Branded Card
  const brandedMrp = document.getElementById('branded-mrp');
  const brandedUnit = document.getElementById('branded-unit');
  const brandedSource = document.getElementById('branded-source');
  if (brandedMrp) brandedMrp.textContent = `₹${compData.brandedDetails.mrp.toFixed(2)}`;
  if (brandedUnit) brandedUnit.textContent = `(₹${compData.brandedDetails.pricePerUnit.toFixed(2)} / tablet)`;
  if (brandedSource) {
    brandedSource.innerHTML = `Source: <a href="${compData.brandedDetails.sourceUrl}" target="_blank" rel="noopener noreferrer">${compData.brandedDetails.source}</a> · Fetched ${new Date(compData.brandedDetails.lastFetched).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  }

  // Generic Card
  const genericPrice = document.getElementById('generic-price');
  const genericUnit = document.getElementById('generic-unit');
  const genericDiscount = document.getElementById('generic-discount');
  const genericName = document.getElementById('generic-product-name');
  if (genericPrice) genericPrice.textContent = `₹${altData.genericEquivalent.primaryPrice.toFixed(2)}`;
  if (genericUnit) genericUnit.textContent = `(₹${altData.genericEquivalent.pricePerUnit.toFixed(2)} / tablet)`;
  if (genericDiscount) genericDiscount.textContent = `${altData.genericEquivalent.savingsPercentage}% LESS`;
  if (genericName) genericName.textContent = altData.genericEquivalent.productName;

  // Stores Table (Shopping & Immersive Product API results)
  const storesTableBody = document.getElementById('stores-table-body');
  if (storesTableBody) {
    storesTableBody.innerHTML = (altData.stores || []).map(s => `
      <tr>
        <td>
          <div style="font-weight:700;">${s.storeName}</div>
          <div style="font-size:0.75rem; color:#64748b;">${s.productTitle}</div>
        </td>
        <td>
          <span class="store-tag ${s.isGovtJanAushadhi ? 'tag-govt' : 'tag-online'}">
            ${s.isGovtJanAushadhi ? 'Govt PMBJP Kendra' : 'Online Pharmacy'}
          </span>
        </td>
        <td>
          <div style="font-weight:800; color:#16a34a; font-size:1.1rem;">₹${s.price.toFixed(2)}</div>
          <div style="font-size:0.75rem; color:#64748b;">₹${s.pricePerUnit.toFixed(2)}/tablet (${s.packSize} pack)</div>
        </td>
        <td>
          <div style="font-size:0.8rem; color:#0f172a;">${s.deliveryDays}</div>
          <div style="font-size:0.75rem; color:#16a34a;">${s.inStock ? 'In Stock' : 'Call to verify'}</div>
        </td>
        <td>
          <a href="${s.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary btn-sm">
            Verify & Buy ↗
          </a>
          <div style="font-size:0.7rem; color:#94a3b8; margin-top:0.2rem;">
            Fetched: ${new Date(s.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Discrepancy Alerts
  const discrepancyContainer = document.getElementById('discrepancy-alerts');
  if (discrepancyContainer) {
    if (altData.discrepancyReport?.hasDiscrepancy) {
      discrepancyContainer.classList.remove('hidden');
      discrepancyContainer.innerHTML = altData.discrepancyReport.flags.map(f => `
        <div class="alert-box alert-warning">
          <div>⚠️</div>
          <div>
            <strong>Source Discrepancy Flag:</strong> ${f.message}
          </div>
        </div>
      `).join('');
    } else {
      discrepancyContainer.classList.add('hidden');
    }
  }

  // Update Savings Calculator
  updateSavingsCalculations();
}

async function updateSavingsCalculations() {
  try {
    const resp = await fetch('/api/calculate-savings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brandedPricePerUnit: state.brandedPricePerUnit,
        genericPricePerUnit: state.genericPricePerUnit,
        tabletsPerDay: state.tabletsPerDay,
        daysPerMonth: 30
      })
    });
    const data = await resp.json();

    const monthlyCostBranded = document.getElementById('calc-branded-monthly');
    const monthlyCostGeneric = document.getElementById('calc-generic-monthly');
    const monthlySavings = document.getElementById('calc-monthly-savings');
    const yearlySavings = document.getElementById('calc-yearly-savings');
    const fiveYearSavings = document.getElementById('calc-five-year-savings');
    const impactText = document.getElementById('calc-impact-text');

    if (monthlyCostBranded) monthlyCostBranded.textContent = `₹${data.brandedMonthlyCost.toLocaleString('en-IN')}`;
    if (monthlyCostGeneric) monthlyCostGeneric.textContent = `₹${data.genericMonthlyCost.toLocaleString('en-IN')}`;
    if (monthlySavings) monthlySavings.textContent = `₹${data.monthlySavings.toLocaleString('en-IN')}`;
    if (yearlySavings) yearlySavings.textContent = `₹${data.yearlySavings.toLocaleString('en-IN')}`;
    if (fiveYearSavings) fiveYearSavings.textContent = `₹${data.fiveYearSavings.toLocaleString('en-IN')}`;
    if (impactText) impactText.textContent = data.realWorldImpact;
  } catch (err) {
    console.warn('Savings calculation error:', err);
  }
}

function showLoading(msg) {
  const loadingElem = document.getElementById('loading-indicator');
  const loadingText = document.getElementById('loading-text');
  if (loadingText) loadingText.textContent = msg || 'Processing...';
  if (loadingElem) loadingElem.classList.remove('hidden');
}

function hideLoading() {
  const loadingElem = document.getElementById('loading-indicator');
  if (loadingElem) loadingElem.classList.add('hidden');
}
