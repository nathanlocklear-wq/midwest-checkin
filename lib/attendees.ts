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

  shirt_type: string;

  shirt_reasons: string[];

  checked_in: boolean;
  checked_in_at: string | null;
};

export async function getAttendees() {
  const { data, error } = await supabase
    .from("attendees")
    .select("*")
    .order("last_name");

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
    .order("last_name")
    .limit(25);

  if (error) throw error;

  return (data ?? []) as Attendee[];
}

export async function findAttendee(email: string) {
  const { data, error } = await supabase
    .from("attendees")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return null;

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