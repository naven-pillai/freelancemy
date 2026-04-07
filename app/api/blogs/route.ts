import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/require-admin-user";
import { getSupabaseAdmin } from "@/lib/supabase/service";
import { validateBlogCreate } from "@/lib/validate-blog";

// GET /api/blogs — list all blogs (admin)
export async function GET() {
  const { error } = await requireAdminUser();
  if (error) return error;

  const { data, error: dbError } = await getSupabaseAdmin()
    .from("blogs")
    .select("id, title, slug, status, date, categories, author, created_at")
    .order("created_at", { ascending: false });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/blogs — create a new blog
export async function POST(req: NextRequest) {
  const { error } = await requireAdminUser();
  if (error) return error;

  const body = await req.json();
  const result = validateBlogCreate(body);

  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { data, error: dbError } = await getSupabaseAdmin()
    .from("blogs")
    .insert(result.data)
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  revalidatePath("/");
  if (data.slug) revalidatePath(`/${data.slug}`);

  return NextResponse.json(data, { status: 201 });
}
