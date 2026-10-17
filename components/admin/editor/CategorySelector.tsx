"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { fieldClass } from "./styles";

const NONE = "__none__";
const ADD_NEW = "__add_new__";

type CategorySelectorProps = {
  value: string | null;
  onChange: (category: string | null) => void;
  /** Category names already used by other posts. */
  options: string[];
  onOptionsChange: (next: string[]) => void;
};

/**
 * Categories on this site are plain text on each post (no categories table),
 * so the dropdown is built from the names already in use plus an inline
 * "add new" input. The chosen name is stored as the post's primary category.
 */
export default function CategorySelector({
  value,
  onChange,
  options,
  onOptionsChange,
}: CategorySelectorProps) {
  const [customCategory, setCustomCategory] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // The current value may be a name no other post uses any more — keep it listed.
  const listed = value && !options.includes(value) ? [...options, value] : options;

  const handleAddCategory = () => {
    const name = customCategory.trim();
    if (name.length < 2) {
      toast.error("Category name must be at least 2 characters");
      return;
    }
    const existing = listed.find((c) => c.toLowerCase() === name.toLowerCase());
    if (existing) {
      onChange(existing);
    } else {
      onOptionsChange([...options, name].sort((a, b) => a.localeCompare(b)));
      onChange(name);
    }
    setCustomCategory("");
    setIsAdding(false);
  };

  return (
    <div className="space-y-2">
      <Label>Category</Label>

      {!isAdding ? (
        <Select
          value={value ?? ""}
          onValueChange={(val) => {
            if (val === ADD_NEW) {
              setIsAdding(true);
            } else if (val === NONE) {
              onChange(null);
            } else {
              onChange(val);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>No category</SelectItem>
            {listed.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
            <SelectItem value={ADD_NEW}>+ Add new category</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="New category name"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCategory();
              }
            }}
            className={fieldClass}
            autoFocus
          />
          <Button size="sm" className="h-9" onClick={handleAddCategory}>
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-9"
            onClick={() => {
              setIsAdding(false);
              setCustomCategory("");
            }}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
