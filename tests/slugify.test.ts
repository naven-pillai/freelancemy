import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/slugify";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Freelance Data Analyst in Malaysia")).toBe(
      "freelance-data-analyst-in-malaysia"
    );
  });

  it("strips punctuation, accents and edge hyphens", () => {
    expect(slugify("  SSM: Do You *Actually* Need It?  ")).toBe(
      "ssm-do-you-actually-need-it"
    );
    expect(slugify("Café résumé")).toBe("cafe-resume");
  });

  it("returns an empty string when nothing usable remains", () => {
    expect(slugify("???")).toBe("");
  });
});
