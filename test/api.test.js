import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/server.js';

let testServer;
let BASE_URL;

test.before(async () => {
  testServer = app.listen(0);
  await new Promise(resolve => testServer.once('listening', resolve));
  const PORT = testServer.address().port;
  BASE_URL = `http://localhost:${PORT}`;
});

test.after(async () => {
  if (testServer) {
    await new Promise(resolve => testServer.close(resolve));
  }
});

test('GET /api/config returns app configuration and status', async () => {
  const resp = await fetch(`${BASE_URL}/api/config`);
  assert.equal(resp.status, 200);
  const data = await resp.json();
  assert.equal(data.status, 'ok');
  assert.equal(typeof data.hasApiKey, 'boolean');
});

test('GET /api/salt-composition resolves brand name to salt & strength', async () => {
  const resp = await fetch(`${BASE_URL}/api/salt-composition?brand=Augmentin+625+Duo`);
  assert.equal(resp.status, 200);
  const data = await resp.json();
  assert.equal(data.brandName, 'Augmentin 625 Duo');
  assert.match(data.saltComposition, /Amoxicillin/);
  assert.match(data.saltComposition, /Clavulanic/);
  assert.match(data.safetyNotice, /Confirm with your doctor/);
});

test('GET /api/generic-alternatives returns bio-equivalent options with prices', async () => {
  const resp = await fetch(`${BASE_URL}/api/generic-alternatives?brand=Augmentin+625+Duo`);
  assert.equal(resp.status, 200);
  const data = await resp.json();
  assert.ok(data.genericEquivalent);
  assert.ok(data.stores.length > 0);
  assert.equal(data.safetyCheck.isExactMatch, true);
  assert.equal(data.safetyCheck.safetyStatus, 'VERIFIED_EXACT_EQUIVALENT');
  // Check price provenance
  assert.ok(data.stores[0].sourceUrl);
  assert.ok(data.stores[0].timestamp);
  assert.match(data.safetyNotice, /Confirm with your doctor/);
});

test('GET /api/nearby-kendras returns Jan Aushadhi Kendras with distance', async () => {
  const resp = await fetch(`${BASE_URL}/api/nearby-kendras?city=New+Delhi`);
  assert.equal(resp.status, 200);
  const data = await resp.json();
  assert.equal(data.city, 'New Delhi');
  assert.ok(data.kendras.length > 0);
  const title = (data.kendras[0].title || '').toLowerCase();
  assert.ok(title.includes('pmbjp') || title.includes('jan') || title.includes('aushadhi') || title.includes('kendra'));
  assert.ok(data.kendras[0].address);
});

test('GET /api/directions returns route navigation steps', async () => {
  const resp = await fetch(`${BASE_URL}/api/directions?start=Connaught+Place&end=AIIMS`);
  assert.equal(resp.status, 200);
  const data = await resp.json();
  assert.ok(data.distance);
  assert.ok(data.duration);
  assert.ok(data.steps.length > 0);
});

test('POST /api/calculate-savings computes monthly and annual savings', async () => {
  const resp = await fetch(`${BASE_URL}/api/calculate-savings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      brandedPricePerUnit: 20.45,
      genericPricePerUnit: 5.80,
      tabletsPerDay: 2,
      daysPerMonth: 30
    })
  });
  assert.equal(resp.status, 200);
  const data = await resp.json();
  assert.equal(data.monthlySavings, 879);
  assert.equal(data.yearlySavings, 10548);
  assert.match(data.safetyNotice, /Confirm with your doctor/);
});

test('POST /api/identify-strip handles sample strip identification', async () => {
  const resp = await fetch(`${BASE_URL}/api/identify-strip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sampleId: 'sample-augmentin' })
  });
  assert.equal(resp.status, 200);
  const data = await resp.json();
  assert.equal(data.identifiedMedicine, 'Augmentin 625 Duo');
  assert.match(data.detectedSalt, /Amoxicillin/);
});
