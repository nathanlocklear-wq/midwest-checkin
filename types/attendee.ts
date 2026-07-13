export type ShirtType =
  | "SPECIAL"
  | "STANDARD"
  | "LATE"
  | "NONE";

export interface Attendee {
  id: string;

  firstName: string;
  lastName: string;
  fullName: string;

  email: string;
  company: string;

  ticketType: string;

  shirtSize: string;

  shirtType: ShirtType;

  shirtReasons: string[];

  checkedIn: boolean;

  checkedInAt?: string;
}