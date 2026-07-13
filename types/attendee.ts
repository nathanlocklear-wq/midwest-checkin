export type ShirtType =
  | "SPECIAL"
  | "STANDARD"
  | "LATE"
  | "NONE";

export interface Attendee {
  // Unique attendee ID (Eventbrite Attendee #)
  id: string;

  // Basic information
  firstName: string;
  lastName: string;
  fullName: string;

  email: string;
  company: string;

  // Registration
  ticketType: string;

  // Conference
  shirtSize: string;

  // Eventbrite "Are you presenting?"
  presenting: boolean;

  // Calculated by determineShirt()
  shirtType: ShirtType;
  shirtReasons: string[];

  // Check-in
  checkedIn: boolean;
  checkedInAt?: string;
}