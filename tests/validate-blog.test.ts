import { describe, it, expect } from "vitest";
import { validateBlogCreate, validateBlogUpdate } from "@/lib/validate-blog";

describe("validateBlogCreate", () => {
  it("accepts a valid minimal post", () => {
    const r = validateBlogCreate({ title: "Hello", slug: "hello-world" });
    expect(r.valid).toBe(true);
  });

  it("requires a title", () => {
    const r = validateBlogCreate({ slug: "hello" });
    expect(r.valid).toBe(false);
  });

  it("rejects a bad slug", () => {
    const r = validateBlogCreate({ title: "x", slug: "Not A Slug" });
    expect(r.valid).toBe(false);
  });

  it("sanitizes content HTML on save", () => {
    const r = validateBlogCreate({
      title: "x",
      slug: "x",
      content: `<p>ok</p><script>alert(1)</script>`,
    });
    expect(r.valid).toBe(true);
    if (r.valid) {
      expect(String(r.data.content)).not.toContain("<script");
      expect(String(r.data.content)).toContain("<p>ok</p>");
    }
  });

  it("drops fields that aren't allowed", () => {
    const r = validateBlogCreate({ title: "x", slug: "x", hacker: "yes" } as Record<string, unknown>);
    expect(r.valid).toBe(true);
    if (r.valid) expect("hacker" in r.data).toBe(false);
  });
});

describe("validateBlogUpdate", () => {
  it("rejects an empty title when provided", () => {
    const r = validateBlogUpdate({ title: "" });
    expect(r.valid).toBe(false);
  });

  it("sanitizes summary HTML", () => {
    const r = validateBlogUpdate({ summary: `<p>hi</p><img src=x onerror=alert(1)>` });
    expect(r.valid).toBe(true);
    if (r.valid) expect(String(r.data.summary)).not.toContain("onerror");
  });
});
