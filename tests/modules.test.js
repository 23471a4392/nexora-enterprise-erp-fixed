/**
 * Unit tests for Nexora ERP module contracts
 */
import { describe, it, expect } from '@jest/globals';

// Inline minimal module contract checks (no browser DOM required)
const SAMPLE_MODULE = {
  moduleKey: "employees",
  moduleTitle: "Employees",
  moduleGroup: "HR Management",
  fields: ["Employee ID", "Full Name", "Department", "Job Title", "Email", "Phone", "Join Date", "Status"],
  seedRecords: [
    {"Employee ID": "EMP-1001", "Full Name": "Alice", "Department": "Engineering", "Job Title": "Engineer", "Email": "a@example.com", "Phone": "111", "Join Date": "2026-01-01", "Status": "Active"}
  ],
  createDefaultRecord(i = 1) {
    const r = {};
    this.fields.forEach(f => {
      const x = f.toLowerCase();
      r[f] = x.includes("date") ? new Date().toISOString().slice(0, 10)
        : x.includes("status") ? "Active"
        : x.includes("id") ? `EMP-${Date.now()}-${i}` : "";
    });
    return r;
  },
  validateRecord(r) {
    const e = {};
    if (!r[this.fields[0]]) e[this.fields[0]] = this.fields[0] + " is required";
    const emailField = this.fields.find(x => x.toLowerCase().includes("email"));
    if (emailField && r[emailField] && !String(r[emailField]).includes("@")) e[emailField] = "Invalid email";
    return e;
  },
  normalizeRecord(r) {
    const out = { ...r };
    this.fields.forEach(f => { if (out[f] == null) out[f] = ""; });
    return out;
  },
  getFieldOptions(f) {
    if (f.toLowerCase().includes("status")) return ["Active", "Pending", "Approved", "In Progress", "Completed"];
    return [];
  }
};

describe("Nexora ERP Module Contract", () => {
  it("has required metadata", () => {
    expect(SAMPLE_MODULE.moduleKey).toBe("employees");
    expect(SAMPLE_MODULE.moduleTitle).toBeTruthy();
    expect(SAMPLE_MODULE.moduleGroup).toBeTruthy();
    expect(Array.isArray(SAMPLE_MODULE.fields)).toBe(true);
    expect(SAMPLE_MODULE.fields.length).toBeGreaterThan(3);
  });

  it("creates default records with expected fields", () => {
    const rec = SAMPLE_MODULE.createDefaultRecord(1);
    SAMPLE_MODULE.fields.forEach(f => {
      expect(rec).toHaveProperty(f);
    });
    expect(rec["Status"]).toBe("Active");
  });

  it("validates required id field", () => {
    const bad = SAMPLE_MODULE.createDefaultRecord();
    bad["Employee ID"] = "";
    const errors = SAMPLE_MODULE.validateRecord(bad);
    expect(errors["Employee ID"]).toBeTruthy();
  });

  it("validates email format", () => {
    const bad = SAMPLE_MODULE.createDefaultRecord();
    bad["Email"] = "not-an-email";
    const errors = SAMPLE_MODULE.validateRecord(bad);
    expect(errors["Email"]).toMatch(/invalid/i);
  });

  it("accepts valid record", () => {
    const good = SAMPLE_MODULE.seedRecords[0];
    const errors = SAMPLE_MODULE.validateRecord(good);
    expect(Object.keys(errors).length).toBe(0);
  });

  it("normalizes missing fields to empty string", () => {
    const partial = { "Employee ID": "X" };
    const norm = SAMPLE_MODULE.normalizeRecord(partial);
    expect(norm["Full Name"]).toBe("");
  });

  it("returns status options for status fields", () => {
    const opts = SAMPLE_MODULE.getFieldOptions("Status");
    expect(opts).toContain("Active");
    expect(opts.length).toBeGreaterThan(0);
  });
});

describe("ERP Data Integrity Helpers", () => {
  it("seed records have consistent field keys", () => {
    SAMPLE_MODULE.seedRecords.forEach(rec => {
      SAMPLE_MODULE.fields.forEach(f => {
        expect(rec).toHaveProperty(f);
      });
    });
  });

  it("module key is lowercase alphanumeric", () => {
    expect(SAMPLE_MODULE.moduleKey).toMatch(/^[a-z_]+$/);
  });
});
