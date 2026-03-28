import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Call at the top of admin server pages to gate access.
 * Redirects to /admin/login if no authenticated user.
 */
export async function protectRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}
