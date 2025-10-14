import { createClient } from "@/lib/supabase/server";

export default async function CommentList({ postSlug }: { postSlug: string }) {
  const supabase = createClient();
  const { data: comments, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_slug", postSlug)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) return <p className="mt-8 text-red-600"></p>;

  if (!comments || comments.length === 0) return null;

  return (
    <div className="mt-10 space-y-6">
      <h3 className="text-lg font-semibold">Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="border rounded-md p-4">
          <p className="font-medium">{comment.name}</p>
          <p className="text-sm text-gray-700">{comment.comment}</p>
          <p className="text-xs text-gray-400 mt-2">
            {new Date(comment.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
