import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/require-admin-user";
import { getSupabaseAdmin } from "@/lib/supabase/service";

// PUT /api/comments — approve/reject a comment, or save an admin reply
export async function PUT(req: NextRequest) {
  const { error } = await requireAdminUser();
  if (error) return error;

  const { id, is_approved, admin_reply } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};

  if (typeof is_approved === "boolean") {
    update.is_approved = is_approved;
  }

  if (typeof admin_reply === "string") {
    const trimmed = admin_reply.trim();
    if (trimmed.length > 2000) {
      return NextResponse.json(
        { error: "Reply must be 2000 characters or fewer" },
        { status: 400 }
      );
    }
    update.admin_reply = trimmed || null;
    update.admin_reply_at = trimmed ? new Date().toISOString() : null;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { error: dbError } = await getSupabaseAdmin()
    .from("comments")
    .update(update)
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/comments — delete a comment
export async function DELETE(req: NextRequest) {
  const { error } = await requireAdminUser();
  if (error) return error;

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { error: dbError } = await getSupabaseAdmin()
    .from("comments")
    .delete()
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
