import { describe, it, expect } from "vitest";
import { sanitize, looksLikeHtml, normalizeLinkAttribs } from "@/lib/sanitize";

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

describe("sanitize — link hygiene", () => {
  it("prefixes https:// on scheme-less external domains", () => {
    expect(sanitize(`<a href="ezbiz.ssm.gov.my">x</a>`)).toContain(
      'href="https://ezbiz.ssm.gov.my"'
    );
    expect(sanitize(`<a href="mytax.hasil.gov.my/?lang=en">x</a>`)).toContain(
      'href="https://mytax.hasil.gov.my/?lang=en"'
    );
    expect(sanitize(`<a href="www.ssm-einfo.my/path">x</a>`)).toContain(
      'href="https://www.ssm-einfo.my/path"'
    );
  });

  it("leaves relative file paths, anchors, mailto and tel alone", () => {
    expect(sanitize(`<a href="guide.pdf">x</a>`)).toContain('href="guide.pdf"');
    expect(sanitize(`<a href="#section">x</a>`)).toContain('href="#section"');
    expect(sanitize(`<a href="mailto:a@b.com">x</a>`)).toContain('href="mailto:a@b.com"');
    expect(sanitize(`<a href="tel:+60123456789">x</a>`)).toContain('href="tel:+60123456789"');
  });

  it("removes nofollow and the trailing slash from internal links", () => {
    const clean = sanitize(
      `<a href="https://freelancemy.com/freelancing-malaysia/" rel="nofollow" target="_blank">x</a>`
    );
    expect(clean).toContain('href="https://freelancemy.com/freelancing-malaysia"');
    expect(clean).not.toContain("nofollow");
    expect(clean).toContain("noopener");

    const relative = sanitize(`<a href="/freelance-writer-malaysia/" rel="nofollow">x</a>`);
    expect(relative).toContain('href="/freelance-writer-malaysia"');
    expect(relative).not.toContain("rel=");
  });

  it("keeps the query/hash when stripping the trailing slash", () => {
    expect(sanitize(`<a href="/about/?ref=1#top">x</a>`)).toContain('href="/about?ref=1#top"');
  });

  it("does not strip the slash from the site root", () => {
    expect(sanitize(`<a href="/">x</a>`)).toContain('href="/"');
    expect(sanitize(`<a href="https://freelancemy.com/">x</a>`)).toContain(
      'href="https://freelancemy.com/"'
    );
  });

  it("upgrades http:// and www. on internal links", () => {
    expect(sanitize(`<a href="http://www.freelancemy.com/contact/">x</a>`)).toContain(
      'href="https://freelancemy.com/contact"'
    );
  });

  it("keeps nofollow on external links", () => {
    const clean = sanitize(`<a href="https://example.com/" rel="nofollow">x</a>`);
    expect(clean).toContain('rel="nofollow"');
    expect(clean).toContain('href="https://example.com/"');
  });
});

describe("normalizeLinkAttribs", () => {
  it("strips sponsored/ugc from internal links but keeps other rel values", () => {
    const out = normalizeLinkAttribs({
      href: "/x/",
      rel: "sponsored ugc nofollow me",
    });
    expect(out.href).toBe("/x");
    expect(out.rel).toBe("me");
  });

  it("leaves anchors without href untouched", () => {
    const out = normalizeLinkAttribs({ name: "top" });
    expect(out).toEqual({ name: "top" });
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
