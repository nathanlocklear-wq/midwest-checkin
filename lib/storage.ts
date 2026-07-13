import type { Attendee } from "@/lib/attendees";

const STORAGE_KEY = "midwest-checkin-attendees";

export function loadAttendees(): Attendee[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) return [];

    return JSON.parse(data) as Attendee[];
  } catch (error) {
    console.error("Failed to load attendees:", error);
    return [];
  }
}

export function saveAttendees(attendees: Attendee[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(attendees)
  );
}

export function replaceAttendees(attendees: Attendee[]) {
  saveAttendees(attendees);
}

export function clearAttendees() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
}

export function getAttendee(id: string) {
  return loadAttendees().find(
    (attendee) => attendee.id === id
  );
}

export function findAttendeeByEmail(email: string) {
  return loadAttendees().find(
    (attendee) =>
      attendee.email.trim().toLowerCase() ===
      email.trim().toLowerCase()
  );
}

export function checkInAttendee(
  id: string
): Attendee[] {
  const attendees = loadAttendees();

  const updated = attendees.map((attendee) => {
    if (attendee.id !== id) {
      return attendee;
    }

    if (attendee.checked_in) {
      return attendee;
    }

    return {
      ...attendee,
      checked_in: true,
      checked_in_at: new Date().toISOString(),
    };
  });

  saveAttendees(updated);

  return updated;
}

export function checkInAttendeeByEmail(
  email: string
): Attendee | undefined {
  const attendees = loadAttendees();

  let checkedInAttendee: Attendee | undefined;

  const updated = attendees.map((attendee) => {
    if (
      attendee.email.trim().toLowerCase() !==
      email.trim().toLowerCase()
    ) {
      return attendee;
    }

    if (attendee.checked_in) {
      checkedInAttendee = attendee;
      return attendee;
    }

    checkedInAttendee = {
      ...attendee,
      checked_in: true,
      checked_in_at: new Date().toISOString(),
    };

    return checkedInAttendee;
  });

  saveAttendees(updated);

  return checkedInAttendee;
}

export function undoCheckIn(
  id: string
): Attendee[] {
  const attendees = loadAttendees();

  const updated = attendees.map((attendee) => {
    if (attendee.id !== id) {
      return attendee;
    }

    return {
      ...attendee,
      checked_in: false,
      checked_in_at: null,
    };
  });

  saveAttendees(updated);

  return updated;
}