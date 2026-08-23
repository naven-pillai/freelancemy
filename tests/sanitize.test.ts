import { describe, it, expect } from "vitest";
import { sanitize, looksLikeHtml } from "@/lib/sanitize";

describe("sanitize", () => {
  it("strips script tags and event handlers", () => {
    const dirty = `<p onclick="steal()">hi</p><script>alert(1)</script>`;
    const clean = sanitize(dirty);
    expect(clean).not.toContain("<script");
    expect(clean).not.toContain("onclick");
    expect(clean).toContain("<p>hi</p>");
  });

  it("keeps allowed tags and safe links", () => {
    const clean = sanitize(`<h2>Title</h2><a href="https://a.com">x</a><strong>b</strong>`);
    expect(clean).toContain("<h2>Title</h2>");
    expect(clean).toContain('href="https://a.com"');
    expect(clean).toContain("<strong>b</strong>");
  });

  it("drops javascript: URLs", () => {
    const clean = sanitize(`<a href="javascript:alert(1)">x</a>`);
    expect(clean).not.toContain("javascript:");
  });

  it("adds noopener/noreferrer on target=_blank links", () => {
    const clean = sanitize(`<a href="https://a.com" target="_blank">x</a>`);
    expect(clean).toContain("noopener");
    expect(clean).toContain("noreferrer");
  });

  it("only allows safe inline style properties", () => {
    const clean = sanitize(
      `<p style="text-align:center;position:fixed;top:0">x</p>`
    );
    expect(clean).toContain("text-align:center");
    expect(clean).not.toContain("position");
  });

  it("keeps iframes only from trusted hosts", () => {
    const yt = sanitize(`<iframe src="https://www.youtube.com/embed/x"></iframe>`);
    expect(yt).toContain("youtube.com");
    const evil = sanitize(`<iframe src="https://evil.com/x"></iframe>`);
    expect(evil).not.toContain("evil.com");
  });
});

describe("looksLikeHtml", () => {
  it("is true for content starting with a block tag", () => {
    expect(looksLikeHtml("<p>hello</p>")).toBe(true);
    expect(looksLikeHtml("  <h2>Title</h2>")).toBe(true);
  });

  it("is false for markdown", () => {
    expect(looksLikeHtml("**bold** and a [link](/x)")).toBe(false);
    expect(looksLikeHtml("## Heading")).toBe(false);
  });
});
