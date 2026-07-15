import { supabase } from "./supabase";

export type Attendee = {
  id: string;

  first_name: string;
  last_name: string;
  full_name: string;

  email: string;
  company: string;

  ticket_type: string;

  presenting: boolean;

  shirt_size: string;

  shirt_type: "SPECIAL" | "STANDARD" | "LATE" | "NONE";

  shirt_reasons: string[];

  badge_still_needed: boolean;

  badge_printed_at: string | null;

  checked_in: boolean;
  checked_in_at: string | null;
};

export async function getAttendees() {
  const { data, error } = await supabase
    .from("attendees")
    .select("*")
    .order("last_name", { ascending: true });

  if (error) throw error;

  return (data ?? []) as Attendee[];
}

export async function searchAttendees(search: string) {
  const value = search.trim();

  if (!value) return [];

  const { data, error } = await supabase
    .from("attendees")
    .select("*")
    .or(
      [
        `full_name.ilike.%${value}%`,
        `email.ilike.%${value}%`,
        `company.ilike.%${value}%`,
      ].join(",")
    )
    .order("last_name", { ascending: true })
    .limit(25);

  if (error) throw error;

  return (data ?? []) as Attendee[];
}

export async function findAttendee(email: string) {
  const { data, error } = await supabase
    .from("attendees")
    .select("*")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error || !data) return null;

  return data as Attendee;
}

export async function checkInAttendee(id: string) {
  const { data, error } = await supabase
    .from("attendees")
    .update({
      checked_in: true,
      checked_in_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as Attendee;
}

export async function undoCheckInAttendee(id: string) {
  const { data, error } = await supabase
    .from("attendees")
    .update({
      checked_in: false,
      checked_in_at: null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as Attendee;
}

export async function refreshAttendees() {
  return getAttendees();
}

export async function getDuplicateAttendees() {
  const attendees = await getAttendees();

  const map = new Map<string, Attendee[]>();

  attendees.forEach((attendee) => {
    const email = attendee.email.trim().toLowerCase();

    if (!email) return;

    if (!map.has(email)) {
      map.set(email, []);
    }

    map.get(email)!.push(attendee);
  });

  return [...map.values()].filter(
    (group) => group.length > 1
  );
}

export async function getBadgeStillNeededCount() {
  const { count, error } = await supabase
    .from("attendees")
    .select("*", { count: "exact", head: true })
    .eq("badge_still_needed", true);

  if (error) throw error;

  return count ?? 0;
}

export async function getCheckedInCount() {
  const { count, error } = await supabase
    .from("attendees")
    .select("*", { count: "exact", head: true })
    .eq("checked_in", true);

  if (error) throw error;

  return count ?? 0;
}

export async function markBadgePrinted(id: string) {
  const { data, error } = await supabase
    .from("attendees")
    .update({
      badge_still_needed: false,
      badge_printed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as Attendee;
}