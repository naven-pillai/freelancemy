// app/robots.txt/route.ts
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
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
