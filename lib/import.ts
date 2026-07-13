import { Attendee } from "@/types/attendee";
import { Membership } from "@/types/membership";
import { determineShirt } from "./shirts";

export function applyMemberships(
  attendees: Attendee[],
  memberships: Map<string, Membership>
): Attendee[] {
  return attendees.map((attendee) => {
    const membership = memberships.get(
      attendee.email.trim().toLowerCase()
    );

    const paymentMethod = membership?.paymentMethod ?? "";

    const shirt = determineShirt({
      paymentMethod,
      ticketType: attendee.ticketType,
      presenting: attendee.presenting ? "Yes" : "No",
    });

    return {
      ...attendee,

      shirtType: shirt.shirtType,
      shirtReasons: shirt.shirtReasons,
    };
  });
}