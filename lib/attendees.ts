import { staffRequest } from "./staff-api";

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
  const {data,error} = await staffRequest<Attendee[]>("list");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function searchAttendees(search: string) {
  const {data,error} = await staffRequest<Attendee[]>("search", {search:search.trim().slice(0,100)});
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function findAttendee(email: string) {
  const {data,error} = await staffRequest<Attendee>("find", {email:email.trim().toLowerCase()});
  if (error) throw new Error(error.message);
  return data;
}

export async function checkInAttendee(id: string) {
  const {data,error} = await staffRequest<Attendee>("checkin", {id,checked:true});
  if (error || !data) throw new Error(error?.message ?? "Attendee not found");
  return data;
}

export async function undoCheckInAttendee(id: string) {
  const {data,error} = await staffRequest<Attendee>("checkin", {id,checked:false});
  if (error || !data) throw new Error(error?.message ?? "Attendee not found");
  return data;
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
  const {count,error} = await staffRequest<null>("count", {filter:"badge_still_needed"});
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function getCheckedInCount() {
  const {count,error} = await staffRequest<null>("count", {filter:"checked_in"});
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function markBadgePrinted(id: string) {
  const {data,error} = await staffRequest<Attendee>("badge", {id});
  if (error || !data) throw new Error(error?.message ?? "Attendee not found");
  return data;
}