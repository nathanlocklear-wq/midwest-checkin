import { ShirtType } from "@/types/attendee";

export interface ShirtResult {
  shirtType: ShirtType;
  shirtReasons: string[];
}

interface ShirtInputs {
  paymentMethod?: string;
  ticketType: string;
  presenting?: string;
}

export function determineShirt({
  paymentMethod = "",
  ticketType,
  presenting = "",
}: ShirtInputs): ShirtResult {
  const payment = paymentMethod.toLowerCase();
  const ticket = ticketType.toLowerCase();
  const isPresenting = presenting.trim().toLowerCase() === "yes";

  // 1. District+
  if (payment.includes("district+")) {
    return {
      shirtType: "SPECIAL",
      shirtReasons: ["District+"],
    };
  }

  // 2. Attendee+
  if (payment.includes("attendee+")) {
    return {
      shirtType: "SPECIAL",
      shirtReasons: ["Attendee+"],
    };
  }

  // 3. Presenter Ticket
  if (ticket.includes("presenter")) {
    return {
      shirtType: "SPECIAL",
      shirtReasons: ["Presenter Ticket"],
    };
  }

  // 4. Committee Ticket
  if (ticket.includes("committee")) {
    return {
      shirtType: "SPECIAL",
      shirtReasons: ["Committee Ticket"],
    };
  }

  // 5. Are you presenting?
  if (isPresenting) {
    return {
      shirtType: "SPECIAL",
      shirtReasons: ["Presenter"],
    };
  }

  // 6. Sponsor
  if (ticket.includes("sponsor")) {
    return {
      shirtType: "NONE",
      shirtReasons: ["Sponsor"],
    };
  }

  // 7. Late
  if (ticket.includes("late")) {
    return {
      shirtType: "LATE",
      shirtReasons: ["Late Registration"],
    };
  }

  // 8. Standard
  return {
    shirtType: "STANDARD",
    shirtReasons: [],
  };
}