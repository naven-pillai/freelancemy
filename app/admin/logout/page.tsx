"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.signOut().then(() => {
      router.push("/admin/login");
      router.refresh();
    });
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-gray-500">Signing out...</p>
    </div>
  );
}
