"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { fieldClass, helpClass } from "./styles";

export default function SlugInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="slug">Slug</Label>
      <Input
        id="slug"
        placeholder="auto-generated-url-slug"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
      />
      <p className={helpClass}>
        Auto-generated from the title (you can still edit it). Lowercase letters,
        numbers and hyphens only.
      </p>
    </div>
  );
}
