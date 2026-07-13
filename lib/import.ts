import type { Attendee } from "@/lib/attendees";
import type { Membership } from "@/types/membership";
import { determineShirt } from "./shirts";

export function applyMemberships(
  attendees: Attendee[],
  memberships: Map<string, Membership>
): Attendee[] {
  return attendees.map((attendee) => {
    const membership = memberships.get(
      attendee.email.trim().toLowerCase()
    );

    const paymentMethod =
      membership?.paymentMethod ?? "";

    const shirt = determineShirt({
      paymentMethod,
      ticketType: attendee.ticket_type ?? "",
      presenting: "No",
    });

    return {
      ...attendee,

      shirt_type: shirt.shirtType,
    };
  });
}