"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function CommentForm({ postSlug }: { postSlug: string }) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !comment) {
      toast.error("Name and comment are required.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("comments").insert({
      name,
      comment,
      post_slug: postSlug,
      approved: false,
    });

    setLoading(false);

    if (error) {
      toast.error("Failed to submit comment.");
    } else {
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

      {/* Name */}
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
          className="rounded-md"
        />
      </div>

      {/* Comment */}
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
          className="rounded-md"
        />
      </div>

      {/* Submit Button */}
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
