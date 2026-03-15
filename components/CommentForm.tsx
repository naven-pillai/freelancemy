"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitComment, type CommentFormState } from "@/app/[slug]/actions";

const COMMENT_COOLDOWN_MS = 60_000; // 1 minute — UX guard (server action is the real gate)

export default function CommentForm({ postSlug }: { postSlug: string }) {
  const router = useRouter();
  const boundAction = submitComment.bind(null, postSlug);
  const [state, formAction, isPending] = useActionState<CommentFormState, FormData>(
    boundAction,
    null
  );

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value.trim();
    const comment = (form.elements.namedItem("comment") as HTMLTextAreaElement)?.value.trim();

    if (!name || !comment) {
      e.preventDefault();
      toast.error("Name and comment are required.");
      return;
    }

    // Client-side cooldown — convenience only, not a security boundary
    const lastSubmit = localStorage.getItem("comment_last_submit");
    if (lastSubmit && Date.now() - parseInt(lastSubmit) < COMMENT_COOLDOWN_MS) {
      e.preventDefault();
      const remaining = Math.ceil(
        (COMMENT_COOLDOWN_MS - (Date.now() - parseInt(lastSubmit))) / 1000
      );
      toast.error(`Please wait ${remaining}s before submitting another comment.`);
      return;
    }

    localStorage.setItem("comment_last_submit", Date.now().toString());
  };

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="bg-muted/50 p-6 rounded-xl space-y-6 border border-gray-200 mt-12"
    >
      <h4 className="text-xl font-semibold text-gray-800">
        <span aria-hidden="true">💬 </span>Leave a Comment
      </h4>

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Your Name <span className="text-red-500" title="Required">*</span>
        </label>
        <Input
          id="name"
          name="name"
          placeholder="John Doe"
          disabled={isPending}
          maxLength={100}
          className="rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Your Comment <span className="text-red-500" title="Required">*</span>
        </label>
        <Textarea
          id="comment"
          name="comment"
          placeholder="Share your thoughts..."
          rows={5}
          disabled={isPending}
          maxLength={2000}
          className="rounded-md"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors cursor-pointer"
      >
        {isPending ? "Submitting..." : "Post Comment"}
      </Button>
    </form>
  );
}
