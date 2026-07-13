import { Attendee } from "@/types/attendee";

const STORAGE_KEY = "midwest-checkin-attendees";

export function saveAttendees(attendees: Attendee[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attendees));
}

export function loadAttendees(): Attendee[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return [];

  return JSON.parse(data);
}

export function updateAttendee(id: string) {
  const attendees = loadAttendees();

  const updated = attendees.map((attendee) => {
    if (attendee.id !== id) return attendee;

    return {
      ...attendee,
      checkedIn: true,
      checkedInAt: new Date().toLocaleTimeString(),
    };
  });

  saveAttendees(updated);

  return updated;
}

export function clearAttendees() {
  localStorage.removeItem(STORAGE_KEY);
}