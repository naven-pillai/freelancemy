import { protectRoute } from "@/lib/protectRoute";
import { supabaseAdmin } from "@/lib/supabase/service";
import {
  FileText,
  MessageSquare,
  Mail,
  Plus,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { relativeTime } from "@/lib/utils";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatHeaderDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminDashboard() {
  await protectRoute();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const isoSOM = startOfMonth.toISOString();

  const [
    blogsRes,
    commentsRes,
    messagesRes,
    publishedRes,
    pendingRes,
    blogsThisMonth,
    commentsThisMonth,
    blogDrafts,
  ] = await Promise.all([
    supabaseAdmin.from("blogs").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("comments").select("id", { count: "exact", head: true }),
    supabaseAdmin
      .from("contact_messages" as string)
      .select("id", { count: "exact", head: true }),
    supabaseAdmin
      .from("blogs")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabaseAdmin
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("is_approved", false),
    supabaseAdmin
      .from("blogs")
      .select("id", { count: "exact", head: true })
      .gte("created_at", isoSOM),
    supabaseAdmin
      .from("comments")
      .select("id", { count: "exact", head: true })
      .gte("created_at", isoSOM),
    supabaseAdmin
      .from("blogs")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft"),
  ]);

  const stats = [
    {
      label: "Blog Posts",
      count: blogsRes.count ?? 0,
      thisMonth: blogsThisMonth.count ?? 0,
      drafts: blogDrafts.count ?? 0,
      icon: FileText,
      href: "/admin/blog",
      color: "text-violet-600",
      bg: "bg-violet-50",
      accent: "bg-violet-600",
      border: "border-violet-100",
    },
    {
      label: "Comments",
      count: commentsRes.count ?? 0,
      thisMonth: commentsThisMonth.count ?? 0,
      drafts: pendingRes.count ?? 0,
      draftLabel: "pending",
      icon: MessageSquare,
      href: "/admin/comments",
      color: "text-blue-600",
      bg: "bg-blue-50",
      accent: "bg-blue-600",
      border: "border-blue-100",
    },
    {
      label: "Messages",
      count: messagesRes.count ?? 0,
      thisMonth: 0,
      drafts: 0,
      icon: Mail,
      href: "/admin/messages",
      color: "text-amber-600",
      bg: "bg-amber-50",
      accent: "bg-amber-600",
      border: "border-amber-100",
    },
  ];

  const { data: recentBlogs } = await supabaseAdmin
    .from("blogs")
    .select("id, title, slug, status, categories, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: pendingComments } = await supabaseAdmin
    .from("comments")
    .select("id, name, comment, slug, created_at")
    .eq("is_approved", false)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Greeting header */}
      <div>
        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
          {formatHeaderDate()}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
          {getGreeting()} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Here&apos;s what&apos;s happening with your site
        </p>
      </div>

      {/* Stat cards — kerja-remote style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const draftLabel =
            "draftLabel" in stat ? stat.draftLabel : "draft";
          return (
            <Link key={stat.label} href={stat.href}>
              <div
                className={`group bg-white rounded-2xl border ${stat.border} shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden`}
              >
                {/* Accent strip */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${stat.accent} rounded-l-2xl`}
                />

                {/* Top row: icon + badges */}
                <div className="flex items-center justify-between pl-3">
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {stat.thisMonth > 0 && (
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${stat.bg} ${stat.color}`}
                      >
                        +{stat.thisMonth} this month
                      </span>
                    )}
                    {stat.drafts > 0 && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                        {stat.drafts} {draftLabel}
                        {stat.drafts > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Count + label */}
                <div className="pl-3">
                  {stat.count === 0 ? (
                    <div>
                      <div className="text-2xl font-bold text-gray-300">
                        —
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        No {stat.label.toLowerCase()} yet
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl font-bold text-gray-900">
                        {stat.count}
                      </div>
                      <div className="text-sm text-gray-400 mt-0.5 flex items-center gap-1">
                        {stat.label}
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Quick Actions
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <span className="p-1 rounded-lg bg-violet-50">
              <FileText className="w-3.5 h-3.5 text-violet-600" />
            </span>
            <Plus className="w-3.5 h-3.5 text-gray-400" />
            New Post
          </Link>
          <Link
            href="/admin/comments"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <span className="p-1 rounded-lg bg-blue-50">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
            </span>
            Review Comments
            {(pendingRes.count ?? 0) > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                {pendingRes.count}
              </span>
            )}
          </Link>
          <Link
            href="/admin/messages"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <span className="p-1 rounded-lg bg-amber-50">
              <Mail className="w-3.5 h-3.5 text-amber-600" />
            </span>
            View Messages
          </Link>
        </div>
      </div>

      {/* Content panels */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent posts — 2/3 width */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              Recent Posts
            </h2>
            <Link
              href="/admin/blog"
              className="text-xs font-medium text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
            >
              View all
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {!recentBlogs?.length ? (
            <div className="flex flex-col items-center justify-center py-14 px-6">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                <FileText className="h-5 w-5 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                No posts yet
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Create your first blog post to get started
              </p>
              <Link
                href="/admin/blog/new"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700"
              >
                <Plus className="h-3 w-3" />
                Create post
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentBlogs.map((blog) => (
                <li key={blog.id}>
                  <Link
                    href={`/admin/blog/${blog.id}/edit`}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/60 transition-colors group"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {blog.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-gray-400">
                          {blog.categories?.[0] ?? "Uncategorized"}
                        </span>
                        <span className="text-gray-200">·</span>
                        <span className="text-[11px] text-gray-400">
                          {relativeTime(blog.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          blog.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {blog.status === "published" ? "Published" : "Draft"}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pending comments — 1/3 width */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-900">
                Pending
              </h2>
              {(pendingRes.count ?? 0) > 0 && (
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                  {pendingRes.count}
                </span>
              )}
            </div>
            <Link
              href="/admin/comments"
              className="text-xs font-medium text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
            >
              View all
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {!pendingComments?.length ? (
            <div className="flex flex-col items-center justify-center py-14 px-6">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                <MessageSquare className="h-5 w-5 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                All caught up
              </p>
              <p className="text-xs text-gray-400">
                No comments waiting for approval
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {pendingComments.map((c) => (
                <li
                  key={c.id}
                  className="px-6 py-3.5 hover:bg-gray-50/60 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-semibold text-gray-500">
                        {c.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {c.name}
                        </p>
                        <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                          {relativeTime(c.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {c.comment}
                      </p>
                      <span className="inline-flex items-center mt-1.5 px-1.5 py-0.5 rounded bg-gray-50 text-[10px] font-medium text-gray-400">
                        /{c.slug}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
