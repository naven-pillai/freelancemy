import { protectRoute } from "@/lib/protectRoute";
import { supabaseAdmin } from "@/lib/supabase/service";
import MessagesClient from "./MessagesClient";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export default async function MessagesPage() {
  await protectRoute();

  const { data: messages } = await supabaseAdmin
    .from("contact_messages" as string)
    .select("*")
    .order("created_at", { ascending: false });

  return <MessagesClient messages={(messages as Message[]) ?? []} />;
}
