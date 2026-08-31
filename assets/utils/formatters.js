/**
 * Display formatters for currency, dates, status badges, IDs.
 */
export function formatCurrency(amount, currency = "USD", locale = "en-US") {
  const n = Number(amount);
  if (Number.isNaN(n)) return String(amount);
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(n);
}

export function formatDate(iso, locale = "en-US") {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return String(iso);
  }
}

export function formatStatus(status) {
  const map = {
    Active: "success",
    Approved: "success",
    Completed: "success",
    Pending: "warning",
    "In Progress": "warning",
    Rejected: "danger",
    Cancelled: "danger",
    Closed: "danger"
  };
  return map[status] || "default";
}

export function truncate(str, max = 40) {
  const s = String(str || "");
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

export function padId(prefix, num, width = 4) {
  return `${prefix}-${String(num).padStart(width, "0")}`;
}
