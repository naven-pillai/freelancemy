import { describe, it, expect } from "vitest";
import { readingTime, formatDate, relativeTime, formatDateAdmin } from "@/lib/utils";

describe("readingTime", () => {
  it("returns at least 1 minute for short/empty content", () => {
    expect(readingTime("")).toBe(1);
    expect(readingTime("a few words here")).toBe(1);
  });

  it("scales with word count at ~200 wpm", () => {
    const words = Array.from({ length: 400 }, () => "word").join(" ");
    expect(readingTime(words)).toBe(2);
  });

  it("ignores markdown/html syntax when counting", () => {
    const withSyntax = "# Heading\n\n" + Array.from({ length: 200 }, () => "word").join(" ");
    expect(readingTime(withSyntax)).toBe(1);
  });
});

describe("formatDate", () => {
  it("formats an ISO date", () => {
    expect(formatDate("2026-04-21")).toMatch(/Apr/);
  });

  it("returns empty string for invalid/empty input", () => {
    expect(formatDate(undefined)).toBe("");
    expect(formatDate("not-a-date")).toBe("");
  });
});

describe("relativeTime", () => {
  it("returns 'Just now' for the current time", () => {
    expect(relativeTime(new Date().toISOString())).toBe("Just now");
  });

  it("returns empty string for null/invalid", () => {
    expect(relativeTime(null)).toBe("");
    expect(relativeTime("nope")).toBe("");
  });
});

describe("formatDateAdmin", () => {
  it("formats as dd MMM yyyy anchored on UTC", () => {
    expect(formatDateAdmin("2026-07-20T12:00:00.000Z")).toBe("20 Jul 2026");
    // Just before midnight UTC must not roll over to the next day.
    expect(formatDateAdmin("2026-07-20T23:30:00.000Z")).toBe("20 Jul 2026");
  });

  it("returns empty string for null/invalid", () => {
    expect(formatDateAdmin(null)).toBe("");
    expect(formatDateAdmin("nope")).toBe("");
  });
});
