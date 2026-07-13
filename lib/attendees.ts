import { supabase } from "./supabase";

export type Attendee = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  company: string | null;
  ticket_type?: string | null;
  shirt_type?: string | null;
  checked_in: boolean;
  checked_in_at: string | null;
};


export async function getAttendees() {
  const result = await supabase
    .from("attendees")
    .select("*");

  if (result.error) {
    console.log(
      "FULL SUPABASE ERROR:",
      JSON.stringify(result.error, null, 2)
    );

    throw new Error(result.error.message);
  }

  return (result.data ?? []) as Attendee[];
}


export async function findAttendee(email: string) {
  const { data, error } = await supabase
    .from("attendees")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Find attendee error:", error);
    return null;
  }

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

  if (error) {
    console.error("Check-in failed:", error);
    throw error;
  }

  return data as Attendee;
}