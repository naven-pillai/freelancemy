"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const COMMENT_COOLDOWN_MS = 60_000; // 1 minute between submissions

export default function CommentForm({ postSlug }: { postSlug: string }) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedComment = comment.trim();

    if (!trimmedName || !trimmedComment) {
      toast.error("Name and comment are required.");
      return;
    }
    if (trimmedName.length > 100) {
      toast.error("Name must be 100 characters or fewer.");
      return;
    }
    if (trimmedComment.length > 2000) {
      toast.error("Comment must be 2000 characters or fewer.");
      return;
    }

    // Client-side rate limiting — prevents casual spam
    const lastSubmit = localStorage.getItem("comment_last_submit");
    if (lastSubmit && Date.now() - parseInt(lastSubmit) < COMMENT_COOLDOWN_MS) {
      const remaining = Math.ceil(
        (COMMENT_COOLDOWN_MS - (Date.now() - parseInt(lastSubmit))) / 1000
      );
      toast.error(`Please wait ${remaining}s before submitting another comment.`);
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("comments").insert({
      name: trimmedName,
      comment: trimmedComment,
      slug: postSlug,
      is_approved: false,
    });

    setLoading(false);

    if (error) {
      toast.error("Failed to submit comment.");
    } else {
      localStorage.setItem("comment_last_submit", Date.now().toString());
      toast.success("Comment submitted! Pending approval.");
      setName("");
      setComment("");
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-muted/50 p-6 rounded-xl space-y-6 border border-gray-200 mt-12"
    >
      <h4 className="text-xl font-semibold text-gray-800">
        💬 Leave a Comment
      </h4>

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Your Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          maxLength={100}
          className="rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Your Comment <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="comment"
          placeholder="Share your thoughts..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          disabled={loading}
          maxLength={2000}
          className="rounded-md"
        />
        <p className="text-xs text-gray-400 text-right">{comment.length}/2000</p>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors cursor-pointer"
      >
        {loading ? "Submitting..." : "Post Comment"}
      </Button>
    </form>
  );
}
