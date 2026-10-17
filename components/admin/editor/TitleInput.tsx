"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { fieldClass } from "./styles";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function TitleInput({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        placeholder="Enter blog title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
      />
    </div>
  );
}
