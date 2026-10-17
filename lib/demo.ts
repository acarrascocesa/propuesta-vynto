import {
  categories,
  cities,
  providers as seedProviders,
  type Provider,
  type ProviderStatus,
} from "./data";

export type { Provider, ProviderStatus, SubscriptionStatus, Category } from "./data";

export interface SearchFilters {
  query: string;
  category: string;
  city: string;
}

export interface SearchRequest {
  id: string;
  filters: SearchFilters;
  providerIds: string[];
  unlocked: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  kind: "unlock" | "enrollment" | "renewal";
  providerId?: string;
  requestId?: string;
  amount: number;
  status: "approved";
  createdAt: string;
}

export interface DemoState {
  providers: Provider[];
  transactions: Transaction[];
  requests: SearchRequest[];
  currentRequestId: string | null;
}

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");
}

function cleanFilters(filters: SearchFilters): SearchFilters {
  return {
    query: filters.query.trim().replace(/\s+/g, " "),
    category: filters.category.trim(),
    city: filters.city.trim(),
  };
}

export function filtersEqual(left: SearchFilters, right: SearchFilters): boolean {
  return normalize(left.query) === normalize(right.query)
    && normalize(left.category) === normalize(right.category)
    && normalize(left.city) === normalize(right.city);
}

function createId(prefix: string): string {
  return `${prefix}-${globalThis.crypto.randomUUID()}`;
}

function now(): string {
  return new Date().toISOString();
}

/** Fresh objects prevent edits in one demo session from changing the source fixtures. */
export function initialState(): DemoState {
  const historicalRequest: SearchRequest = {
    id: "request-seed-01",
    filters: { query: "", category: "salud", city: "" },
    providerIds: ["p07", "p08", "p09"],
    unlocked: true,
    createdAt: "2026-10-15T14:30:00.000Z",
  };
  return {
    providers: seedProviders.map((provider) => ({ ...provider, services: [...provider.services] })),
    requests: [historicalRequest],
    currentRequestId: null,
    transactions: [
      { id: "txn-seed-01", kind: "enrollment", providerId: "p01", amount: 4, status: "approved", createdAt: "2026-10-01T13:00:00.000Z" },
      { id: "txn-seed-02", kind: "enrollment", providerId: "p02", amount: 4, status: "approved", createdAt: "2026-10-02T14:00:00.000Z" },
      { id: "txn-seed-03", kind: "enrollment", providerId: "p15", amount: 4, status: "approved", createdAt: "2026-10-03T15:00:00.000Z" },
      { id: "txn-seed-04", kind: "enrollment", providerId: "p19", amount: 4, status: "approved", createdAt: "2026-10-04T16:00:00.000Z" },
      { id: "txn-seed-05", kind: "renewal", providerId: "p01", amount: 2, status: "approved", createdAt: "2026-10-12T13:00:00.000Z" },
      { id: "txn-seed-06", kind: "renewal", providerId: "p02", amount: 2, status: "approved", createdAt: "2026-10-13T14:00:00.000Z" },
      { id: "txn-seed-07", kind: "renewal", providerId: "p15", amount: 2, status: "approved", createdAt: "2026-10-14T15:00:00.000Z" },
      { id: "txn-seed-08", kind: "unlock", requestId: historicalRequest.id, amount: 2, status: "approved", createdAt: historicalRequest.createdAt },
    ],
  };
}

/** Public results never include pending, suspended or unpaid profiles. */
export function filterProviders(providers: Provider[], filters: SearchFilters): Provider[] {
  const query = normalize(filters.query);
  const words = query.split(/[^a-z0-9]+/).filter(Boolean);
  const category = normalize(filters.category);
  const city = normalize(filters.city);

  return providers
    .filter((provider) => {
      if (provider.status !== "approved" || provider.subscription === "inactive") return false;
      if (category && normalize(provider.category) !== category) return false;
      if (city && normalize(provider.city) !== city) return false;
      const categoryName = categories.find((item) => item.id === provider.category)?.name ?? "";
      const searchable = normalize([provider.name, provider.tagline, provider.description, categoryName, ...provider.services].join(" "));
      return words.every((word) => searchable.includes(word));
    })
    .sort((left, right) => {
      const leftNameMatch = query && normalize(left.name).includes(query) ? 1 : 0;
      const rightNameMatch = query && normalize(right.name).includes(query) ? 1 : 0;
      return rightNameMatch - leftNameMatch
        || Number(right.verified) - Number(left.verified)
        || right.rating - left.rating
        || right.reviewCount - left.reviewCount
        || left.id.localeCompare(right.id);
    });
}

const categoryRules: [string, RegExp][] = [
  ["hogar", /\b(plomer\w*|electric\w*|pintur\w*|remodel\w*|hogar|construccion|interiores|decoracion)\b/],
  ["educacion", /\b(tutori\w*|matematic\w*|ingles|frances|clases|educacion|profesor\w*|musica|robotica)\b/],
  ["salud", /\b(salud|bienestar|nutric\w*|entrenamiento|ejercicio|relajacion|movilidad)\b/],
  ["negocios", /\b(contab\w*|contable|finanzas|financier\w*|marketing|marca|negocios|administrativ\w*)\b/],
  ["transporte", /\b(transporte|mensajeria|entregas?|paquetes?|traslados?|logistica)\b/],
  ["tecnologia", /\b(tecnologia|web|computador\w*|aplicacion\w*|soporte|redes|software)\b/],
  ["inmuebles", /\b(inmuebles?|apartamentos?|propiedades|inmobiliari\w*|alquiler|locales)\b/],
  ["gastronomia", /\b(catering|reposteria|panaderia|comida|gastronomia|cocina|postres?|restaurante)\b/],
  ["agro", /\b(agro|agricol\w*|cultivos?|huertos?|jardineria|riego|produccion)\b/],
  ["otros", /\b(fotograf\w*|retratos?|papeleria|invitaciones)\b/],
];

/** Local, deterministic rules only: this function does not call an AI service. */
export function interpretQuery(query: string): Partial<SearchFilters> {
  let remaining = normalize(query).replace(/[¿?¡!,.]/g, " ");
  const result: Partial<SearchFilters> = {};
  const detectedCity = cities.find((city) => remaining.includes(normalize(city)));
  if (detectedCity) {
    result.city = detectedCity;
    remaining = remaining.replace(normalize(detectedCity), " ");
  }
  const categoryRule = categoryRules.find(([, rule]) => rule.test(remaining));
  if (categoryRule) result.category = categoryRule[0];
  remaining = remaining
    .replace(/\b(necesito|necesitamos|busco|buscamos|quiero|quisiera|encontrar|encuentra|alguien|servicios?|profesional(?:es)?|ayuda|para|con|que|me|mi|mis|el|la|los|las|un|una|unos|unas|de|del|en|por|cerca)\b/g, " ")
    .replace(/\s+/g, " ").trim();
  result.query = remaining;
  return result;
}

export function findRequest(state: DemoState, filters: SearchFilters, requestId?: string | null): SearchRequest | undefined {
  const request = state.requests.find(item => item.id === (requestId || state.currentRequestId));
  return request && filtersEqual(request.filters, filters) ? request : undefined;
}

export function requestUrl(request: SearchRequest): string {
  const params = new URLSearchParams({ solicitud: request.id });
  if (request.filters.query) params.set('q', request.filters.query);
  if (request.filters.category) params.set('categoria', request.filters.category);
  if (request.filters.city) params.set('ciudad', request.filters.city);
  return `/explorar?${params.toString()}`;
}

/** Unpaid searches stay current; a purchased request retains its original contacts. */
export function ensureRequest(state: DemoState, filters: SearchFilters, requestId?: string | null): DemoState {
  const clean = cleanFilters(filters);
  const current = findRequest(state, clean, requestId);
  if (current) {
    const ids = current.unlocked ? current.providerIds : filterProviders(state.providers, clean).map(p => p.id);
    const sameResults = ids.length === current.providerIds.length && ids.every((id, i) => id === current.providerIds[i]);
    if (sameResults && state.currentRequestId === current.id) return state;
    return { ...state, currentRequestId: current.id, requests: sameResults ? state.requests : state.requests.map(r => r.id === current.id ? { ...r, providerIds: ids } : r) };
  }

  const request: SearchRequest = {
    id: createId("request"), filters: clean,
    providerIds: filterProviders(state.providers, clean).map((provider) => provider.id),
    unlocked: false, createdAt: now(),
  };
  return { ...state, requests: [...state.requests, request], currentRequestId: request.id };
}

/** Paying is simulated; repeated approval cannot create duplicate transactions. */
export function unlockRequest(state: DemoState, requestId: string): DemoState {
  const request = state.requests.find((item) => item.id === requestId);
  if (!request || request.unlocked) return state;
  const visibleIds = filterProviders(state.providers, request.filters).map(p => p.id);
  if (visibleIds.length === 0) return state;

  const transaction: Transaction = {
    id: createId("txn"), kind: "unlock", requestId,
    amount: 2, status: "approved", createdAt: now(),
  };
  return {
    ...state,
    requests: state.requests.map((item) => item.id === requestId ? { ...item, providerIds: visibleIds, unlocked: true } : item),
    transactions: [...state.transactions, transaction],
  };
}

export function validateProfile(patch: Pick<Provider, 'name' | 'tagline' | 'description' | 'services'>): string | null {
  if (!patch.name.trim() || !patch.tagline.trim() || !patch.description.trim()) return 'Completa el nombre, la presentación y la descripción con texto válido.';
  if (!patch.services.some(service => service.trim())) return 'Añade al menos un servicio.';
  return null;
}

export function updateProvider(state: DemoState, id: string, patch: Partial<Provider>): DemoState {
  if (!state.providers.some((provider) => provider.id === id)) return state;
  return {
    ...state,
    providers: state.providers.map((provider) => provider.id === id
      ? { ...provider, ...patch, id: provider.id, color: `var(--color-category-${patch.category || provider.category})`, services: patch.services ? [...patch.services] : provider.services }
      : provider),
  };
}

export function setProviderStatus(state: DemoState, id: string, status: ProviderStatus): DemoState {
  return updateProvider(state, id, { status });
}

export function changeSubscription(state: DemoState, id: string, action: "enroll" | "renew" | "cancel"): DemoState {
  const provider = state.providers.find((item) => item.id === id);
  if (!provider) return state;
  if (action === "cancel") {
    return provider.subscription === "active"
      ? updateProvider(state, id, { subscription: "cancelled" })
      : state;
  }
  if (action === "enroll" && provider.subscription === "active") return state;
  if (action === "renew" && provider.subscription === "inactive") return state;

  // Reactivating a cancelled paid profile is a renewal; enrollment is charged once.
  const isRenewal = action === "renew" || provider.subscription === "cancelled"
    || state.transactions.some((transaction) => transaction.providerId === id && transaction.kind === "enrollment");
  const transaction: Transaction = {
    id: createId("txn"), kind: isRenewal ? "renewal" : "enrollment", providerId: id,
    amount: isRenewal ? 2 : 4, status: "approved", createdAt: now(),
  };
  const next = updateProvider(state, id, { subscription: "active" });
  return { ...next, transactions: [...next.transactions, transaction] };
}
