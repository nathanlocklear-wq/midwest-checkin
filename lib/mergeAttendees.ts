import type { Attendee } from "@/lib/attendees";

export function mergeAttendees(
  eventbrite: any[],
  hubspot: any[],
  badgeCutoffDate: string
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

    const isDistrictPlus = paymentLower.includes("district+");
    const isAttendeePlus = paymentLower.includes("attendee+");

    const isCommittee = ticketLower.includes("committee");

    const isPresenter =
      ticketLower.includes("presenter") ||
      presenting;


    // LEGO Gift rules
    if (
      isDistrictPlus ||
      isAttendeePlus ||
      isCommittee ||
      isPresenter
    ) {
      reasons.push("🧱 LEGO Gift");
    }


    // Presenter Bag rules
    if (isPresenter) {
      reasons.push("🎤 Presenter Bag");
    }


    // Shirt rules
    let shirtType: Attendee["shirt_type"] = "STANDARD";

    if (isCommittee || isPresenter) {
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

const badgeCutoff = new Date(`${badgeCutoffDate}T23:59:59`);

const registeredAt = new Date(
  String(person["Order Date"] ?? "").trim()
);

const badgeStillNeeded =

  !isNaN(registeredAt.getTime()) &&
  registeredAt > badgeCutoff;

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

      badge_still_needed: badgeStillNeeded,

      badge_printed_at: null,

      shirt_reasons: reasons,

      checked_in: false,

      checked_in_at: null,
    };
  });
}