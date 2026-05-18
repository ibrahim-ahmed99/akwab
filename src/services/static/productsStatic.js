import productsData from './products.json';
import categoriesData from './categories.json';

/**
 * Static adapter — used when VITE_DATA_MODE=static.
 * Returns Promises so the surface matches the REST adapter exactly.
 * Fake latency keeps UI skeletons meaningful during development.
 */

const FAKE_LATENCY_MS = 120;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function flatten() {
  return Object.entries(productsData).flatMap(([cat, list]) =>
    list.map((p, i) => ({ ...p, id: p.id || `${cat}-${i + 1}`, category: cat }))
  );
}

export async function getProducts(category) {
  await wait(FAKE_LATENCY_MS);
  const all = flatten();
  if (!category || category === 'all') return all;
  return all.filter((p) => p.category === category);
}

export async function getProductById(id) {
  await wait(FAKE_LATENCY_MS);
  return flatten().find((p) => p.id === id) || null;
}

export async function getCategories() {
  await wait(FAKE_LATENCY_MS);
  return categoriesData;
}

export async function getFeatured() {
  await wait(FAKE_LATENCY_MS);
  const all = flatten();
  return all.filter((p) => p.badge?.kind === 'hot').slice(0, 8);
}
