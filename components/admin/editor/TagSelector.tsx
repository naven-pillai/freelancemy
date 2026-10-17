"use client";

import { useState, type KeyboardEvent } from "react";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { helpClass } from "./styles";

type TagSelectorProps = {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
};

export default function TagSelector({ tags, onTagsChange }: TagSelectorProps) {
  const [input, setInput] = useState("");

  const addTags = (raw: string) => {
    const newTags = raw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !tags.includes(t));
    if (newTags.length > 0) onTagsChange([...tags, ...newTags]);
    setInput("");
  };

  const removeTag = (tag: string) => onTagsChange(tags.filter((t) => t !== tag));

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTags(input);
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="tags-input">Tags</Label>
      <div className="flex flex-wrap gap-1.5 p-2 border border-gray-200 rounded-md bg-white min-h-[42px] focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-md"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-red-500 transition-colors"
              aria-label={`Remove tag ${tag}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          id="tags-input"
          className="flex-1 min-w-[140px] text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
          placeholder={tags.length === 0 ? "Type a tag and press Enter or comma…" : "Add more…"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (input.trim()) addTags(input);
          }}
        />
      </div>
      <p className={helpClass}>Press Enter or comma to add. Backspace removes the last tag.</p>
    </div>
  );
}
