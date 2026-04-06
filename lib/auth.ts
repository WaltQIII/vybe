import { createServerSupabaseClient } from "./supabase-server";
import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function getUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(
  existingClient?: SupabaseClient,
  existingUser?: User
) {
  const supabase = existingClient ?? (await createServerSupabaseClient());

  let user = existingUser ?? null;
  if (!user) {
    const {
      data: { user: fetchedUser },
    } = await supabase.auth.getUser();
    user = fetchedUser;
  }

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile) return profile;

  // Profile missing (e.g. trigger didn't fire during signup) — create it
  // from the auth metadata that was saved at sign-up time.
  const meta = user.user_metadata ?? {};
  const username =
    meta.username || user.email?.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_") || user.id.slice(0, 8);
  const displayName = meta.display_name || username;

  const { data: newProfile } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      username,
      display_name: displayName,
    })
    .select()
    .single();

  return newProfile;
}

export async function requireAuth() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { user, supabase };
}
