import type { Attendee } from "@/lib/attendees";

export function mergeAttendees(
  eventbrite: any[],
  hubspot: any[]
): Attendee[] {
  const memberLookup = new Map<string, any>();

  // Create HubSpot lookup by email
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

    const paymentMethod = String(
      member?.["Payment Method"] || ""
    );

    const ticketType = String(
      person["Ticket Type"] || ""
    );

    const presenting =
      String(person["Are you presenting?"] || "")
        .trim()
        .toLowerCase() === "yes";


    if (
      paymentMethod
        .toLowerCase()
        .includes("district+")
    ) {
      reasons.push("District+");
    }


    if (
      paymentMethod
        .toLowerCase()
        .includes("attendee+")
    ) {
      reasons.push("Attendee+");
    }


    if (
      ticketType
        .toLowerCase()
        .includes("presenter")
    ) {
      reasons.push("Presenter");
    }


    if (
      ticketType
        .toLowerCase()
        .includes("committee")
    ) {
      reasons.push("Committee");
    }


    if (
      presenting &&
      !reasons.includes("Presenter")
    ) {
      reasons.push("Presenting");
    }


    let shirtType:
      | "SPECIAL"
      | "STANDARD"
      | "LATE"
      | "NONE";


    if (reasons.length > 0) {
      shirtType = "SPECIAL";
    } else if (
      ticketType
        .toLowerCase()
        .includes("sponsor")
    ) {
      shirtType = "NONE";
    } else if (
      ticketType
        .toLowerCase()
        .includes("late")
    ) {
      shirtType = "LATE";
    } else {
      shirtType = "STANDARD";
    }


    return {
      id: crypto.randomUUID(),

      first_name:
        person["First Name"] || "",

      last_name:
        person["Last Name"] || "",

      full_name:
        `${person["First Name"] || ""} ${
          person["Last Name"] || ""
        }`.trim(),

      email,

      company:
        person.Company || null,

      ticket_type:
        ticketType,

      shirt_type:
        shirtType,

      checked_in:
        false,

      checked_in_at:
        null,
    };
  });
}