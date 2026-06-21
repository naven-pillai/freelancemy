"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Check,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ExternalLink,
  Reply,
} from "lucide-react";
import { relativeTime } from "@/lib/utils";

type Comment = {
  id: string;
  name: string;
  comment: string;
  slug: string;
  is_approved: boolean | null;
  created_at: string | null;
  admin_reply: string | null;
  admin_reply_at: string | null;
};

const ITEMS_PER_PAGE = 10;

export default function CommentsClient({
  comments,
  titleBySlug = {},
}: {
  comments: Comment[];
  titleBySlug?: Record<string, string>;
}) {
  const router = useRouter();
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [pendingPage, setPendingPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);
  const [replyTarget, setReplyTarget] = useState<Comment | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySaving, setReplySaving] = useState(false);

  const pending = useMemo(() => comments.filter((c) => !c.is_approved), [comments]);
  const approved = useMemo(() => comments.filter((c) => c.is_approved), [comments]);

  function addLoading(id: string) {
    setLoadingIds((prev) => new Set(prev).add(id));
  }

  function removeLoading(id: string) {
    setLoadingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  async function handleAction(id: string, action: "approve" | "reject" | "delete") {
    addLoading(id);
    setError("");

    try {
      const res = await fetch("/api/comments", {
        method: action === "delete" ? "DELETE" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          action === "delete"
            ? { id }
            : { id, is_approved: action === "approve" }
        ),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || `Failed to ${action} comment`);
        return;
      }

      router.refresh();
    } catch {
      setError("Network error — please try again");
    } finally {
      removeLoading(id);
    }
  }

  function openReply(comment: Comment) {
    setReplyTarget(comment);
    setReplyText(comment.admin_reply ?? "");
  }

  async function handleReplySave(value: string = replyText) {
    if (!replyTarget) return;
    setReplySaving(true);
    setError("");

    try {
      const res = await fetch("/api/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: replyTarget.id, admin_reply: value }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save reply");
        return;
      }

      setReplyTarget(null);
      setReplyText("");
      router.refresh();
    } catch {
      setError("Network error — please try again");
    } finally {
      setReplySaving(false);
    }
  }

  function paginate(items: Comment[], page: number) {
    const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
    const paginated = items.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    );
    return { paginated, totalPages };
  }

  function renderPagination(
    totalPages: number,
    page: number,
    setPage: (p: number) => void
  ) {
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <span className="text-xs text-gray-400">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    );
  }

  function renderEmpty(label: string) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <MessageSquare className="h-5 w-5 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-900 mb-1">
          {label === "pending" ? "All caught up" : "No approved comments"}
        </p>
        <p className="text-xs text-gray-400">
          {label === "pending"
            ? "No comments waiting for review"
            : "Approved comments will appear here"}
        </p>
      </div>
    );
  }

  function renderTable(
    items: Comment[],
    page: number,
    setPage: (p: number) => void,
    label: string
  ) {
    if (!items.length) return renderEmpty(label);

    const { paginated, totalPages } = paginate(items, page);

    return (
      <>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80">
              <TableHead className="">
                Author
              </TableHead>
              <TableHead className="">
                Comment
              </TableHead>
              <TableHead className="">
                Post
              </TableHead>
              <TableHead className=" hidden md:table-cell">
                When
              </TableHead>
              <TableHead className=" text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((c) => (
              <TableRow
                key={c.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <TableCell className="">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-semibold text-gray-600">
                        {c.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 text-sm whitespace-nowrap">
                      {c.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className=" max-w-xs text-sm text-gray-600">
                  <span className="line-clamp-2">{c.comment}</span>
                </TableCell>
                <TableCell className="">
                  <a
                    href={`/${c.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`/${c.slug}`}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-[11px] font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors max-w-[16rem]"
                  >
                    <span className="truncate">{titleBySlug[c.slug] ?? `/${c.slug}`}</span>
                    <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                  </a>
                </TableCell>
                <TableCell className=" hidden md:table-cell text-xs text-gray-400 whitespace-nowrap">
                  {relativeTime(c.created_at)}
                </TableCell>
                <TableCell className=" text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    {!c.is_approved && (
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={loadingIds.has(c.id)}
                        onClick={() => handleAction(c.id, "approve")}
                        title="Approve"
                      >
                        <Check className="h-4 w-4 text-emerald-600" />
                      </Button>
                    )}
                    {!c.is_approved && (
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={loadingIds.has(c.id)}
                        onClick={() => handleAction(c.id, "reject")}
                        title="Reject"
                      >
                        <X className="h-4 w-4 text-amber-500" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openReply(c)}
                      title={c.admin_reply ? "Edit reply" : "Reply"}
                    >
                      <Reply
                        className={
                          c.admin_reply
                            ? "h-4 w-4 text-indigo-600"
                            : "h-4 w-4 text-gray-400"
                        }
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={loadingIds.has(c.id)}
                      onClick={() => handleAction(c.id, "delete")}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {renderPagination(totalPages, page, setPage)}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Comments</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and moderate user comments
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approved.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            {renderTable(pending, pendingPage, setPendingPage, "pending")}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            {renderTable(approved, approvedPage, setApprovedPage, "approved")}
          </div>
        </TabsContent>
      </Tabs>

      {/* Reply dialog */}
      <Dialog open={!!replyTarget} onOpenChange={() => setReplyTarget(null)}>
        <DialogContent onClose={() => setReplyTarget(null)}>
          <DialogHeader>
            <DialogTitle>Reply to {replyTarget?.name}</DialogTitle>
            <DialogDescription className="line-clamp-3">
              {replyTarget?.comment}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply as the author…"
            rows={5}
            maxLength={2000}
            disabled={replySaving}
            className="mt-4 rounded-md"
          />
          <DialogFooter>
            {replyTarget?.admin_reply && (
              <Button
                variant="ghost"
                onClick={() => handleReplySave("")}
                disabled={replySaving}
                className="text-red-500 hover:text-red-600"
              >
                Remove reply
              </Button>
            )}
            <Button variant="ghost" onClick={() => setReplyTarget(null)} disabled={replySaving}>
              Cancel
            </Button>
            <Button onClick={() => handleReplySave()} disabled={replySaving || !replyText.trim()}>
              {replySaving ? "Saving…" : "Save reply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
