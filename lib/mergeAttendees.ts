import { Attendee } from "@/types/attendee";

export function mergeAttendees(
  eventbrite: any[],
  hubspot: any[]
): Attendee[] {
  const memberLookup = new Map<string, any>();

  // Create lookup by email
  hubspot.forEach((member) => {
    const email = String(member.Email || "")
      .trim()
      .toLowerCase();

    if (email) {
      memberLookup.set(email, member);
    }
  });

  return eventbrite.map((person, index) => {
    const email = String(person.Email || "")
      .trim()
      .toLowerCase();

    const member = memberLookup.get(email);

    const reasons: string[] = [];

    const paymentMethod = String(member?.["Payment Method"] || "");

    const ticketType = String(person["Ticket Type"] || "");

    const presenting =
      String(person["Are you presenting?"] || "")
        .trim()
        .toLowerCase() === "yes";

    // Memberships
    if (paymentMethod.includes("District+")) {
      reasons.push("District+");
    }

    if (paymentMethod.includes("Attendee+")) {
      reasons.push("Attendee+");
    }

    // Ticket types
    if (ticketType.includes("Presenter")) {
      reasons.push("Presenter");
    }

    if (ticketType.includes("Committee")) {
      reasons.push("Committee");
    }

    // Presentation question
    if (presenting && !reasons.includes("Presenter")) {
      reasons.push("Presenting");
    }

    // Determine shirt type
    let shirtType: Attendee["shirtType"];

    if (reasons.length > 0) {
      // District+, Attendee+, Presenter, Committee,
      // or answered Yes to presenting
      shirtType = "SPECIAL";
    } else if (ticketType.includes("Sponsor")) {
      // Sponsors don't receive shirts
      shirtType = "NONE";
    } else if (ticketType.includes("LATE")) {
      // Late attendees don't receive shirts
      shirtType = "LATE";
    } else {
      // Normal in-person attendee
      shirtType = "STANDARD";
    }

    return {
      id: String(index),

      firstName: person["First Name"] || "",

      lastName: person["Last Name"] || "",

      fullName: `${person["First Name"] || ""} ${person["Last Name"] || ""}`.trim(),

      email,

      company: person.Company || "",

      ticketType,

      shirtSize: person["T-Shirt Size"] || "",

      shirtType,

      shirtReasons: reasons,

      checkedIn: false,
    };
  });
}