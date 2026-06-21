import { getSupabaseAdmin } from "@/lib/supabase/service";
import { relativeTime } from "@/lib/utils";
import { gravatarUrl } from "@/lib/gravatar";
import { AUTHOR_NAME, AUTHOR_AVATAR } from "@/lib/constants";
import type { Database } from "@/types/supabase";

type Comment = Database["public"]["Tables"]["comments"]["Row"];

export default async function CommentList({ postSlug }: { postSlug: string }) {
  const { data: comments, error } = await getSupabaseAdmin()
    .from("comments")
    .select("*")
    .eq("slug", postSlug)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) return <p className="mt-8 text-red-600">Failed to load comments.</p>;
  if (!comments || comments.length === 0) return null;

  return (
    <div className="mt-8 space-y-6">
      {comments.map((comment: Comment) => (
        <div key={comment.id} className="flex gap-3 sm:gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gravatarUrl(comment.email, 80)}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            className="h-10 w-10 rounded-full bg-gray-100 shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-900 text-sm">
                {comment.website ? (
                  <a
                    href={comment.website}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    {comment.name}
                  </a>
                ) : (
                  comment.name
                )}
              </span>
              <span className="text-xs text-gray-400">
                {relativeTime(comment.created_at)}
              </span>
            </div>

            <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap wrap-break-word">
              {comment.comment}
            </p>

            {comment.admin_reply && (
              <div className="mt-3 flex gap-3 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={AUTHOR_AVATAR}
                  alt=""
                  width={32}
                  height={32}
                  loading="lazy"
                  className="h-8 w-8 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 text-sm">
                      {AUTHOR_NAME}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Author
                    </span>
                    <span className="text-xs text-gray-400">
                      {relativeTime(comment.admin_reply_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap wrap-break-word">
                    {comment.admin_reply}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
