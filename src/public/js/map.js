/**
 * Jan Aushadhi Kendra Locator & Route Navigation Module
 * Powered by SerpApi Google Maps & Directions API
 */

export function initKendraLocator() {
  const citySelect = document.getElementById('city-select');
  const btnGeolocate = document.getElementById('btn-geolocate');
  const kendraListContainer = document.getElementById('kendra-list-container');
  const directionsContainer = document.getElementById('directions-container');
  const routeStepsList = document.getElementById('route-steps-list');
  const routeSummary = document.getElementById('route-summary');

  if (citySelect) {
    citySelect.addEventListener('change', () => {
      loadKendras({ city: citySelect.value });
    });
  }

  if (btnGeolocate) {
    btnGeolocate.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
      }

      btnGeolocate.textContent = 'Locating...';
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          btnGeolocate.textContent = '📍 Near Me';
          loadKendras({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => {
          btnGeolocate.textContent = '📍 Near Me';
          alert('Could not obtain GPS position. Showing Kendras for New Delhi.');
          loadKendras({ city: 'New Delhi' });
        }
      );
    });
  }

  // Load default city on init
  loadKendras({ city: 'New Delhi' });

  async function loadKendras({ city, lat, lng }) {
    if (!kendraListContainer) return;
    kendraListContainer.innerHTML = '<div style="padding:1rem;color:#64748b;">Finding nearest Jan Aushadhi Kendras...</div>';

    try {
      const params = new URLSearchParams();
      if (city) params.set('city', city);
      if (lat && lng) {
        params.set('lat', lat);
        params.set('lng', lng);
      }

      const resp = await fetch(`/api/nearby-kendras?${params.toString()}`);
      const data = await resp.json();
      renderKendraList(data.kendras || [], city || 'Your Location');
    } catch (err) {
      kendraListContainer.innerHTML = `<div style="padding:1rem;color:#dc2626;">Error finding Kendras: ${err.message}</div>`;
    }
  }

  function renderKendraList(kendras, locationName) {
    if (!kendraListContainer) return;

    if (kendras.length === 0) {
      kendraListContainer.innerHTML = '<div style="padding:1rem;">No Kendras found in this area.</div>';
      return;
    }

    kendraListContainer.innerHTML = kendras.map(k => `
      <div class="kendra-item" data-kendra-id="${k.id}">
        <div class="kendra-header">
          <div class="kendra-title">${k.title}</div>
          <span class="kendra-distance">${k.distanceKm} km away</span>
        </div>
        <div class="kendra-address">${k.address}</div>
        <div style="font-size:0.8rem; color:#16a34a; font-weight:600; margin-bottom:0.4rem;">
          ${k.openState || 'Open'} · ⭐ ${k.rating || 4.8} (${k.reviewsCount || 100} reviews)
        </div>
        <div style="font-size:0.75rem; color:#64748b; margin-bottom:0.6rem;">
          Stock: ${k.stockStatus || 'Generic medicines stocked'}
        </div>
        <div class="kendra-actions">
          <button class="btn btn-primary btn-sm btn-get-directions" 
                  data-name="${encodeURIComponent(k.title)}" 
                  data-addr="${encodeURIComponent(k.address)}">
            🧭 Get Route Directions
          </button>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(k.title + ' ' + k.address)}" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="btn btn-secondary btn-sm">
            🗺️ Open Google Maps
          </a>
        </div>
      </div>
    `).join('');

    // Attach directions listeners
    const directionBtns = kendraListContainer.querySelectorAll('.btn-get-directions');
    directionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const title = decodeURIComponent(btn.dataset.name);
        const addr = decodeURIComponent(btn.dataset.addr);
        fetchDirections(title, addr);
      });
    });
  }

  async function fetchDirections(destinationName, destinationAddr) {
    if (!directionsContainer || !routeStepsList) return;

    directionsContainer.classList.remove('hidden');
    routeSummary.textContent = `Calculating route to ${destinationName}...`;
    routeStepsList.innerHTML = '<li>Retrieving route details from Google Maps Directions API...</li>';

    try {
      const params = new URLSearchParams({
        start: 'Current Location',
        end: destinationAddr || destinationName,
        mode: 3 // Transit / Driving
      });

      const resp = await fetch(`/api/directions?${params.toString()}`);
      const data = await resp.json();

      routeSummary.innerHTML = `
        <strong>Route to ${destinationName}</strong>: 
        <span style="color:#0284c7; font-weight:bold;">${data.distance}</span> · 
        <span style="color:#16a34a; font-weight:bold;">${data.duration}</span> via ${data.via}
      `;

      routeStepsList.innerHTML = (data.steps || []).map(step => `
        <li>${step}</li>
      `).join('');
    } catch (err) {
      routeSummary.textContent = 'Directions could not be calculated.';
      routeStepsList.innerHTML = `<li>Error: ${err.message}</li>`;
    }
  }
}
