// app/robots.txt/route.ts
export async function GET() {
  return new Response(
    `User-agent: *
Allow: /

Sitemap: https://freelancemy.com/sitemap.xml
`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
}
