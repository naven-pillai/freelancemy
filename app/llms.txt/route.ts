import { getSupabaseAdmin } from "@/lib/supabase/service";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export async function GET() {
  const { data: posts } = await getSupabaseAdmin()
    .from("blogs")
    .select("slug, title, description, date")
    .eq("status", "published")
    .order("date", { ascending: false });

  const postLines =
    posts
      ?.map(
        (p) =>
          `- [${p.title}](${SITE_URL}/${p.slug})${p.description ? `: ${p.description}` : ""}`
      )
      .join("\n") ?? "";

  const body = `# FreelanceMY

> The #1 resource hub for freelancers in Malaysia. Expert guides, tips, and tools covering rates, registration (SSM), taxes, contracts, and growing an independent career across web development, writing, data, and digital marketing.

FreelanceMY publishes practical, Malaysia-specific guidance for independent professionals. Content is written and reviewed by Naven Pillai and focuses on actionable advice grounded in local regulations and market realities.

## Pages

- [Home](${SITE_URL}): Latest freelancing guides and featured articles
- [About](${SITE_URL}/about): Mission, values, and background of FreelanceMY
- [Contact](${SITE_URL}/contact): Get in touch with the team

## Blog Posts

${postLines}

## Legal

- [Privacy Policy](${SITE_URL}/privacy-policy)
- [Terms & Conditions](${SITE_URL}/terms-conditions)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
