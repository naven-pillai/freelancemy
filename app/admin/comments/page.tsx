import { protectRoute } from "@/lib/protectRoute";
import { supabaseAdmin } from "@/lib/supabase/service";
import CommentsClient from "./CommentsClient";

export default async function CommentsPage() {
  await protectRoute();

  const { data: comments } = await supabaseAdmin
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  return <CommentsClient comments={comments ?? []} />;
}
