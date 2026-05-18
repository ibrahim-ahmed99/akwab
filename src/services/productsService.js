import { isStatic } from './config.js';
import * as staticSrc from './static/productsStatic.js';
import * as apiSrc from './api/productsApi.js';

/**
 * productsService — the only thing components/hooks should import.
 *
 * Each function picks its adapter based on CONFIG.DATA_MODE. When you flip
 * VITE_DATA_MODE=api in .env, every call transparently switches to REST.
 *
 * All functions return Promises and are shaped to be swappable 1:1.
 */

export async function getProducts(category) {
  return isStatic() ? staticSrc.getProducts(category) : apiSrc.getProducts(category);
}

export async function getProductById(id) {
  return isStatic() ? staticSrc.getProductById(id) : apiSrc.getProductById(id);
}

export async function getCategories() {
  return isStatic() ? staticSrc.getCategories() : apiSrc.getCategories();
}

export async function getFeatured() {
  return isStatic() ? staticSrc.getFeatured() : apiSrc.getFeatured();
}
