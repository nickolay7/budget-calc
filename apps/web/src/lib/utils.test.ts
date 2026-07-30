import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate } from "./utils";

// ---------------------------------------------------------------------------
// formatCurrency
// ---------------------------------------------------------------------------
describe("formatCurrency", () => {
  it("formats a positive amount in USD by default", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats a negative amount", () => {
    expect(formatCurrency(-50.1)).toBe("-$50.10");
  });

  it("formats large numbers with thousand separators", () => {
    expect(formatCurrency(1_000_000)).toBe("$1,000,000.00");
  });

  it("formats with a different currency", () => {
    expect(formatCurrency(99.99, "EUR")).toBe("€99.99");
  });

  it("formats with JPY (no decimal places)", () => {
    expect(formatCurrency(500, "JPY")).toBe("¥500");
  });

  it("handles NaN gracefully", () => {
    const result = formatCurrency(NaN);
    expect(result).toBe("$NaN");
  });

  it("handles fractional cents (rounding)", () => {
    expect(formatCurrency(0.005)).toBe("$0.01");
  });
});

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------
describe("formatDate", () => {
  it("formats a Date object", () => {
    const date = new Date(2024, 0, 15);
    expect(formatDate(date)).toBe("Jan 15, 2024");
  });

  it("formats a date string", () => {
    expect(formatDate(new Date(2024, 5, 1).toISOString())).toBe("Jun 1, 2024");
  });

  it("formats a date with single-digit day", () => {
    expect(formatDate(new Date(2024, 2, 5))).toBe("Mar 5, 2024");
  });

  it("handles end-of-year date", () => {
    expect(formatDate(new Date(2024, 11, 31))).toBe("Dec 31, 2024");
  });

  it("throws on invalid date string", () => {
    expect(() => formatDate("not-a-date")).toThrow("Invalid time value");
  });

  it("throws on an invalid Date object", () => {
    const d = new Date("invalid");
    expect(() => formatDate(d)).toThrow("Invalid time value");
  });

  it("throws on empty string", () => {
    expect(() => formatDate("")).toThrow("Invalid time value");
  });
});
