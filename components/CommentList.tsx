import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Database } from "@/types/supabase";

type Comment = Database["public"]["Tables"]["comments"]["Row"];

export default async function CommentList({ postSlug }: { postSlug: string }) {
  const supabase = await createClient();

  const { data: comments, error } = await supabase
    .from("comments")
    .select("*")
    .eq("slug", postSlug)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) return <p className="mt-8 text-red-600">Failed to load comments.</p>;
  if (!comments || comments.length === 0) return null;

  return (
    <div className="mt-10 space-y-4 sm:space-y-6">
      {comments.map((comment: Comment) => (
        <div key={comment.id} className="border rounded-md p-3 sm:p-4">
          <p className="font-medium">{comment.name}</p>
          <p className="text-sm text-gray-700">{comment.comment}</p>
          <p className="text-xs text-gray-600 mt-2">
            {formatDate(comment.created_at ?? undefined)}
          </p>
        </div>
      ))}
    </div>
  );
}
