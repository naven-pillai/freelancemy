"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { BlogStatus } from "@/types/blog";
import { fieldClass, helpClass } from "./styles";

type PublishSettingsProps = {
  status: BlogStatus;
  onStatusChange: (newStatus: BlogStatus) => void;

  /**
   * The post's publish date as an ISO string, or null if not yet set (e.g. a
   * brand-new draft). When null, publishing uses "now". When set, the writer's
   * chosen date wins so posts can be backdated.
   */
  publishedAt: string | null;
  onPublishedAtChange: (isoString: string | null) => void;

  isFeatured: boolean;
  onFeaturedChange: (value: boolean) => void;
};

/** ISO string → YYYY-MM-DD for the <input type="date"> value. */
function toDateInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

/** YYYY-MM-DD → ISO string, anchored at midday UTC so the day doesn't shift
 *  when displayed in different timezones. */
function fromDateInputValue(dateStr: string): string | null {
  if (!dateStr) return null;
  const parsed = new Date(`${dateStr}T12:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export default function PublishSettings({
  status,
  onStatusChange,
  publishedAt,
  onPublishedAtChange,
  isFeatured,
  onFeaturedChange,
}: PublishSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={status}
          onValueChange={(v) => onStatusChange(v as BlogStatus)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="publish-date">Publish date</Label>
        <div className="flex gap-2">
          <Input
            id="publish-date"
            type="date"
            value={toDateInputValue(publishedAt)}
            onChange={(e) => onPublishedAtChange(fromDateInputValue(e.target.value))}
            className={`${fieldClass} flex-1`}
          />
          {publishedAt && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-9"
              onClick={() => onPublishedAtChange(null)}
            >
              Clear
            </Button>
          )}
        </div>
        <p className={helpClass}>
          {publishedAt
            ? "Displays as the 'Published date' on the post."
            : "Leave blank — today's date is used when you publish."}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <Label htmlFor="is_featured">Featured</Label>
          <p className={helpClass}>Mark as an editor&apos;s pick.</p>
        </div>
        <button
          id="is_featured"
          type="button"
          role="switch"
          aria-checked={isFeatured}
          onClick={() => onFeaturedChange(!isFeatured)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
            isFeatured ? "bg-emerald-500" : "bg-gray-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              isFeatured ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
