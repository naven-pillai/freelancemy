"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function AdminError({
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
        Something went wrong
      </h2>
      <p className="text-sm text-gray-500 max-w-md mb-6">
        {error.message || "An unexpected error occurred in the admin panel."}
      </p>
      <Button onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
