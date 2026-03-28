"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Failed to load blog data
      </h2>
      <p className="text-sm text-gray-500 max-w-md mb-6">
        {error.message || "Could not load blog posts. Please try again."}
      </p>
      <div className="flex gap-3">
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
        <Button onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
