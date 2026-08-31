/**
 * Shared validation helpers for Nexora ERP forms and API payloads.
 */
export function isEmail(value) {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export function isPhone(value) {
  if (!value) return false;
  const digits = String(value).replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export function isDateISO(value) {
  if (!value) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value));
}

export function required(value) {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

export function minLength(value, n) {
  return String(value || "").length >= n;
}

export function maxLength(value, n) {
  return String(value || "").length <= n;
}

export function inList(value, options = []) {
  return options.includes(value);
}

export function validateFields(record, rules) {
  const errors = {};
  Object.keys(rules).forEach(field => {
    const ruleList = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
    for (const rule of ruleList) {
      if (rule === "required" && !required(record[field])) {
        errors[field] = `${field} is required`;
        break;
      }
      if (rule === "email" && record[field] && !isEmail(record[field])) {
        errors[field] = `${field} must be a valid email`;
        break;
      }
      if (rule === "phone" && record[field] && !isPhone(record[field])) {
        errors[field] = `${field} must be a valid phone`;
        break;
      }
      if (rule === "date" && record[field] && !isDateISO(record[field])) {
        errors[field] = `${field} must be YYYY-MM-DD`;
        break;
      }
    }
  });
  return errors;
}
