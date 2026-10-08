import { describe, expect, it } from "vitest";
import { isHoneypotSubmission, parseContactSubmission } from "../lib/contact";

const validSubmission = {
  name: " Test Analyst ",
  email: "analyst@example.com",
  organisation: " Example Institution ",
  role: "MLRO",
  institutionType: "Bank",
  useCase: "Case continuity",
  timeframe: "Exploring",
  message: "We are evaluating investigation continuity workflows.",
};

describe("parseContactSubmission", () => {
  it("normalises a valid institutional enquiry", () => {
    expect(parseContactSubmission(validSubmission)).toMatchObject({
      name: "Test Analyst",
      organisation: "Example Institution",
      email: "analyst@example.com",
    });
  });

  it("rejects invalid contact details", () => {
    expect(
      parseContactSubmission({ ...validSubmission, email: "invalid" }),
    ).toBeNull();
    expect(
      parseContactSubmission({ ...validSubmission, message: "short" }),
    ).toBeNull();
  });

  it("rejects oversized or pathological email input without regex backtracking", () => {
    const longEmail = "a".repeat(100_000) + "@example.com";
    expect(
      parseContactSubmission({ ...validSubmission, email: longEmail }),
    ).toBeNull();
    expect(
      parseContactSubmission({
        ...validSubmission,
        email: "analyst@" + "x".repeat(100_000) + ".",
      }),
    ).toBeNull();
  });

  it("rejects malformed email syntax while preserving valid addresses", () => {
    for (const email of [
      "analyst@@example.com",
      "analyst@example.",
      "@example.com",
      "analyst@.com",
      "analyst@exam ple.com",
    ]) {
      expect(parseContactSubmission({ ...validSubmission, email })).toBeNull();
    }
    expect(
      parseContactSubmission({
        ...validSubmission,
        email: "team+aml@example.co.uk",
      }),
    ).not.toBeNull();
  });

  it("normalises missing optional fields to empty strings", () => {
    const result = parseContactSubmission({
      name: "Test Analyst",
      email: "analyst@example.com",
      organisation: "Example Institution",
      message: "A sufficiently detailed institutional enquiry.",
    });

    expect(result?.role).toBe("");
    expect(result?.institutionType).toBe("");
  });
});

describe("isHoneypotSubmission", () => {
  it("detects a populated anti-spam field", () => {
    expect(
      isHoneypotSubmission({
        ...validSubmission,
        website: "https://spam.example",
      }),
    ).toBe(true);
    expect(isHoneypotSubmission({ ...validSubmission, website: "" })).toBe(
      false,
    );
  });
});
