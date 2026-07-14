import type { Attendee } from "@/lib/attendees";

export function mergeAttendees(
  eventbrite: any[],
  hubspot: any[]
): Attendee[] {
  const memberLookup = new Map<string, any>();

  hubspot.forEach((member) => {
    const email = String(member.Email || "")
      .trim()
      .toLowerCase();

    if (email) {
      memberLookup.set(email, member);
    }
  });

  return eventbrite.map((person) => {
    const email = String(person.Email || "")
      .trim()
      .toLowerCase();

    const member = memberLookup.get(email);

    const ticketType = String(
      person["Ticket Type"] || ""
    ).trim();

    const paymentMethod = String(
      member?.["Payment Method"] || ""
    ).trim();

    const presenting =
      String(person["Are you presenting?"] || "")
        .trim()
        .toLowerCase() === "yes";

    const ticketLower = ticketType.toLowerCase();
    const paymentLower = paymentMethod.toLowerCase();

    const reasons: string[] = [];

    if (paymentLower.includes("district+")) {
      reasons.push("District+ Membership");
    }

    if (paymentLower.includes("attendee+")) {
      reasons.push("Attendee+ Membership");
    }

    if (ticketLower.includes("committee")) {
      reasons.push("Committee");
    }

    if (ticketLower.includes("presenter")) {
      reasons.push("Presenter Ticket");
    }

    if (
      presenting &&
      !reasons.includes("Presenter Ticket")
    ) {
      reasons.push("Marked as Presenter");
    }

    let shirtType: Attendee["shirt_type"] = "STANDARD";

    if (reasons.length > 0) {
      shirtType = "SPECIAL";
    } else if (ticketLower.includes("sponsor")) {
      shirtType = "NONE";
    } else if (ticketLower.includes("late")) {
      shirtType = "LATE";
    }

    const shirtSize = String(
      person["T-Shirt Size"] ??
        person["Shirt Size"] ??
        member?.["Shirt Size"] ??
        ""
    ).trim();

    return {
      id: crypto.randomUUID(),

      first_name: String(
        person["First Name"] ?? ""
      ).trim(),

      last_name: String(
        person["Last Name"] ?? ""
      ).trim(),

      full_name:
        `${person["First Name"] ?? ""} ${
          person["Last Name"] ?? ""
        }`.trim(),

      email,

      company: String(
        person.Company ?? ""
      ).trim(),

      ticket_type: ticketType,

      presenting,

      shirt_size: shirtSize,

      shirt_type: shirtType,

      shirt_reasons: reasons,

      checked_in: false,

      checked_in_at: null,
    };
  });
}