import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/require-admin-user";
import { getSupabaseAdmin } from "@/lib/supabase/service";

// PUT /api/comments — approve/reject a comment
export async function PUT(req: NextRequest) {
  const { user, error } = await requireAdminUser();
  if (error) return error;

  const { id, is_approved } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { error: dbError } = await getSupabaseAdmin()
    .from("comments")
    .update({ is_approved })
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/comments — delete a comment
export async function DELETE(req: NextRequest) {
  const { user, error } = await requireAdminUser();
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
