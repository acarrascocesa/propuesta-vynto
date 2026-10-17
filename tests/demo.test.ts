import assert from "node:assert/strict";
import test from "node:test";
import { categories, cities, providers } from "../lib/data";
import {
  changeSubscription,
  ensureRequest,
  filterProviders,
  findRequest,
  requestUrl,
  initialState,
  interpretQuery,
  setProviderStatus,
  unlockRequest,
  updateProvider,
  validateProfile,
  type SearchFilters,
} from "../lib/demo";

const all: SearchFilters = { query: "", category: "", city: "" };

test("fixtures have 24 fictional providers, 10 categories and four evenly represented cities", () => {
  assert.equal(providers.length, 24);
  assert.equal(categories.length, 10);
  assert.equal(new Set(providers.map((provider) => provider.category)).size, 10);
  assert.equal(new Set(providers.map((provider) => provider.id)).size, 24);
  for (const city of cities) assert.equal(providers.filter((provider) => provider.city === city).length, 6);
  for (const provider of providers) {
    assert.match(provider.email, /@example\.test$/);
    assert.match(provider.phone, /^CONTACTO-DEMO-\d{2}$/);
  }
});

test("filtering combines category, city and accent-insensitive text and is deterministic", () => {
  const filters = { query: "  ELECTRICISTA  ", category: "hogar", city: "Santiago" };
  assert.deepEqual(filterProviders(providers, filters).map((provider) => provider.id), ["p02"]);
  assert.deepEqual(filterProviders(providers, { ...all, query: "plomeria" }).map((provider) => provider.id), ["p01"]);
  assert.deepEqual(filterProviders(providers, all), filterProviders(providers, all));
  assert.equal(filterProviders(providers, { ...all, query: "servicio inexistente" }).length, 0);
});

test("public results hide pending, suspended and inactive profiles while cancelled paid profiles stay visible", () => {
  const ids = filterProviders(providers, all).map((provider) => provider.id);
  assert.ok(ids.includes("p12"));
  assert.ok(!ids.includes("p22"));
  assert.ok(!ids.includes("p24"));
  const state = updateProvider(initialState(), "p01", { subscription: "inactive" });
  assert.ok(!filterProviders(state.providers, all).some((provider) => provider.id === "p01"));
});

test("local interpretation extracts a category, canonical city and usable search text", () => {
  assert.deepEqual(interpretQuery("Necesito un electricista en Santiago"), {
    category: "hogar", city: "Santiago", query: "electricista",
  });
  const interpreted = { ...all, ...interpretQuery("Busco diseño web en Santo Domingo") };
  assert.deepEqual(filterProviders(providers, interpreted).map((provider) => provider.id), ["p15"]);
  assert.equal(interpretQuery("Catering para eventos en Punta Cana").city, "Punta Cana");
});

test("requests reuse equivalent current criteria but changing filters creates a new locked request", () => {
  const state = ensureRequest(initialState(), { query: "plomería", category: "hogar", city: "" });
  assert.equal(ensureRequest(state, { query: "  PLOMERIA  ", category: "hogar", city: "" }), state);
  const next = ensureRequest(state, { query: "plomería", category: "hogar", city: "Santo Domingo" });
  assert.notEqual(next.currentRequestId, state.currentRequestId);
  assert.equal(next.requests.length, state.requests.length + 1);
  assert.equal(next.requests.at(-1)?.unlocked, false);
});

test("unlock pays US$2 once, survives navigation and preserves the original result snapshot", () => {
  const original = initialState();
  const withRequest = ensureRequest(original, { ...all, category: "hogar", city: "Santiago" });
  const id = withRequest.currentRequestId!;
  const unlocked = unlockRequest(withRequest, id);
  assert.equal(unlocked.transactions.length, original.transactions.length + 1);
  assert.equal(unlocked.transactions.at(-1)?.amount, 2);
  assert.equal(unlockRequest(unlocked, id), unlocked);
  assert.deepEqual(unlocked.requests.at(-1)?.providerIds, ["p02"]);
  const changed = updateProvider(unlocked, "p01", { city: "Santiago" });
  assert.deepEqual(changed.requests.at(-1)?.providerIds, ["p02"]);
  assert.equal(ensureRequest(changed, { ...all, category: "hogar", city: "Santiago" }), changed);
  const navigating = ensureRequest(changed, { ...all, category: "tecnologia" });
  assert.equal(navigating.requests.find((request) => request.id === id)?.unlocked, true);
  assert.equal(withRequest.requests.at(-1)?.unlocked, false);
});

test("empty or missing requests cannot be charged", () => {
  const state = ensureRequest(initialState(), { ...all, query: "no-existe-este-servicio" });
  assert.equal(unlockRequest(state, state.currentRequestId!), state);
  assert.equal(unlockRequest(state, "missing"), state);
});

test("moderation changes public visibility and updates do not mutate previous state", () => {
  const state = initialState();
  const suspended = setProviderStatus(state, "p01", "suspended");
  assert.ok(!filterProviders(suspended.providers, all).some((provider) => provider.id === "p01"));
  assert.equal(state.providers[0].status, "approved");
  const approved = setProviderStatus(suspended, "p01", "approved");
  assert.ok(filterProviders(approved.providers, all).some((provider) => provider.id === "p01"));
  const edited = updateProvider(approved, "p01", { name: "Nombre de ejemplo", id: "forged" });
  assert.equal(edited.providers[0].id, "p01");
  assert.equal(edited.providers[0].name, "Nombre de ejemplo");
});

test("enrollment, renewal and cancellation update subscription and metrics consistently", () => {
  const state = initialState();
  assert.equal(changeSubscription(state, "p01", "enroll"), state);
  const enrolled = changeSubscription(state, "p22", "enroll");
  assert.equal(enrolled.providers.find((provider) => provider.id === "p22")?.subscription, "active");
  assert.equal(enrolled.transactions.at(-1)?.kind, "enrollment");
  assert.equal(enrolled.transactions.at(-1)?.amount, 4);
  const cancelled = changeSubscription(enrolled, "p01", "cancel");
  assert.equal(cancelled.providers[0].subscription, "cancelled");
  assert.equal(cancelled.transactions.length, enrolled.transactions.length);
  assert.equal(changeSubscription(cancelled, "p01", "cancel"), cancelled);
  const renewed = changeSubscription(cancelled, "p01", "renew");
  assert.equal(renewed.providers[0].subscription, "active");
  assert.equal(renewed.transactions.at(-1)?.amount, 2);
  assert.equal(renewed.transactions.at(-1)?.kind, "renewal");
  assert.equal(changeSubscription(state, "p22", "renew"), state);
  assert.equal(changeSubscription(state, "p22", "cancel"), state);
});

test("reset builds pristine independent data and all approved payments sum correctly", () => {
  const first = initialState();
  first.providers[0].name = "Edited";
  first.providers[0].services.push("New service");
  const reset = initialState();
  assert.equal(reset.providers[0].name, "Nido Hogar");
  assert.equal(reset.providers[0].services.length, 3);
  assert.equal(reset.transactions.reduce((sum, transaction) => sum + transaction.amount, 0), 24);
});

test('a paid request is restored by its URL after another search without charging again', () => {
  let state = ensureRequest(initialState(), { ...all, query: 'plomería' });
  const paidId = state.currentRequestId!;
  state = unlockRequest(state, paidId);
  const paidRequest = state.requests.find(r => r.id === paidId)!;
  const url = new URL(requestUrl(paidRequest), 'http://localhost');
  state = ensureRequest(state, { ...all, category: 'tecnologia' });
  assert.notEqual(state.currentRequestId, paidId);
  const count = state.transactions.length;
  state = ensureRequest(state, paidRequest.filters, url.searchParams.get('solicitud'));
  assert.equal(state.currentRequestId, paidId);
  assert.equal(findRequest(state, paidRequest.filters, paidId)?.unlocked, true);
  assert.equal(unlockRequest(state, paidId).transactions.length, count);
});

test('query case, whitespace and accents do not leave a usable request unresolved', () => {
  const state = ensureRequest(initialState(), { ...all, query: 'plomería' });
  assert.equal(findRequest(state, { ...all, query: '  PLOMERIA  ' })?.id, state.currentRequestId);
  assert.equal(findRequest(state, { ...all, query: 'electricista' }), undefined);
});

test('unpaid results refresh after moderation and the payment buys exactly the updated set', () => {
  let state = ensureRequest(initialState(), all);
  const id = state.currentRequestId!;
  state = setProviderStatus(state, 'p01', 'suspended');
  state = ensureRequest(state, all, id);
  assert.ok(!findRequest(state, all, id)?.providerIds.includes('p01'));
  const visibleIds = filterProviders(state.providers, all).map(p => p.id);
  state = unlockRequest(state, id);
  assert.deepEqual(findRequest(state, all, id)?.providerIds, visibleIds);
  const suspended = setProviderStatus(state, 'p01', 'approved');
  const refreshed = ensureRequest(suspended, all, id);
  assert.deepEqual(findRequest(refreshed, all, id)?.providerIds, visibleIds);
});

test('a provider suspended before checkout cannot trigger an empty purchase', () => {
  let state = ensureRequest(initialState(), { ...all, query: 'electricista' });
  const id = state.currentRequestId!;
  state = setProviderStatus(state, 'p02', 'suspended');
  assert.equal(unlockRequest(state, id), state);
});

test('profile validation rejects whitespace fields and comma-only services', () => {
  const profile = initialState().providers[0];
  assert.equal(validateProfile(profile), null);
  assert.ok(validateProfile({ ...profile, name: '   ' }));
  assert.ok(validateProfile({ ...profile, tagline: '\t' }));
  assert.ok(validateProfile({ ...profile, description: '  ' }));
  assert.ok(validateProfile({ ...profile, services: [' ', ''] }));
});
