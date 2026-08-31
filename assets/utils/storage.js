/**
 * Nexora ERP LocalStorage persistence layer
 * Provides typed get/set, bulk export, and schema versioning.
 */
const PREFIX = "nexora_erp_";
const SCHEMA_VERSION = 1;

export function storageKey(moduleKey) {
  return `${PREFIX}${moduleKey}_v${SCHEMA_VERSION}`;
}

export function loadModule(moduleKey, fallback = []) {
  try {
    const raw = localStorage.getItem(storageKey(moduleKey));
    if (!raw) return Array.isArray(fallback) ? [...fallback] : fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    console.warn("Nexora storage load failed", moduleKey, e);
    return Array.isArray(fallback) ? [...fallback] : fallback;
  }
}

export function saveModule(moduleKey, records) {
  try {
    localStorage.setItem(storageKey(moduleKey), JSON.stringify(records));
    return true;
  } catch (e) {
    console.error("Nexora storage save failed", moduleKey, e);
    return false;
  }
}

export function clearModule(moduleKey) {
  localStorage.removeItem(storageKey(moduleKey));
}

export function exportAll(keys) {
  const out = {};
  keys.forEach(k => {
    out[k] = loadModule(k, []);
  });
  return out;
}

export function importAll(payload) {
  if (!payload || typeof payload !== "object") return false;
  Object.keys(payload).forEach(k => {
    if (Array.isArray(payload[k])) saveModule(k, payload[k]);
  });
  return true;
}

export function listKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) keys.push(k);
  }
  return keys;
}
