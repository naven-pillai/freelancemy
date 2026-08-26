import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/require-admin-user";
import { getSupabaseAdmin } from "@/lib/supabase/service";
import { validateBlogUpdate } from "@/lib/validate-blog";
import { reportError } from "@/lib/report-error";

const REVISION_DEBOUNCE_MS = 2 * 60 * 1000;

/**
 * Save the current content/summary into blog_revisions before it's overwritten,
 * but only when it actually changed and not within REVISION_DEBOUNCE_MS of the
 * last snapshot. Best-effort — never blocks the save.
 */
async function snapshotRevision(id: string, incoming: Record<string, unknown>) {
  try {
    const supabase = getSupabaseAdmin();
    const { data: current } = await supabase
      .from("blogs")
      .select("content, summary")
      .eq("id", id)
      .single();
    if (!current) return;

    const contentChanged =
      typeof incoming.content === "string" && incoming.content !== current.content;
    const summaryChanged =
      typeof incoming.summary === "string" && incoming.summary !== current.summary;
    if (!contentChanged && !summaryChanged) return;

    const { data: last } = await supabase
      .from("blog_revisions")
      .select("created_at")
      .eq("blog_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (
      last?.created_at &&
      Date.now() - new Date(last.created_at).getTime() < REVISION_DEBOUNCE_MS
    ) {
      return;
    }

    await supabase.from("blog_revisions").insert({
      blog_id: id,
      content: current.content,
      summary: current.summary,
    });
  } catch (err) {
    reportError(err, { where: "blog-revision-snapshot", blogId: id });
  }
}

// GET /api/blogs/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdminUser();
  if (error) return error;

  const { id } = await params;

  const { data, error: dbError } = await getSupabaseAdmin()
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

  // Snapshot the previous content/summary before overwriting, so an accidental
  // change can be restored. Debounced to at most one revision per 2 minutes per
  // post so the 3s autosave doesn't flood the history.
  await snapshotRevision(id, result.data);

  const { data, error: dbError } = await getSupabaseAdmin()
    .from("blogs")
    .update(result.data)
    .eq("id", id)
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  revalidatePath("/");
  if (data.slug) revalidatePath(`/${data.slug}`);

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

  // Fetch slug before deleting so we can revalidate the post page
  const { data: post } = await getSupabaseAdmin()
    .from("blogs")
    .select("slug")
    .eq("id", id)
    .single();

  const { error: dbError } = await getSupabaseAdmin()
    .from("blogs")
    .delete()
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  revalidatePath("/");
  if (post?.slug) revalidatePath(`/${post.slug}`);

  return NextResponse.json({ success: true });
}
