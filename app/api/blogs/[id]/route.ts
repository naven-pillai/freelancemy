import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/require-admin-user";
import { supabaseAdmin } from "@/lib/supabase/service";
import { validateBlogUpdate } from "@/lib/validate-blog";

// GET /api/blogs/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdminUser();
  if (error) return error;

  const { id } = await params;

  const { data, error: dbError } = await supabaseAdmin
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (dbError || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PUT /api/blogs/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdminUser();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const result = validateBlogUpdate(body);

  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Auto-set last_updated
  result.data.last_updated = new Date().toISOString();

  const { data, error: dbError } = await supabaseAdmin
    .from("blogs")
    .update(result.data)
    .eq("id", id)
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE /api/blogs/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdminUser();
  if (error) return error;

  const { id } = await params;

  const { error: dbError } = await supabaseAdmin
    .from("blogs")
    .delete()
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
