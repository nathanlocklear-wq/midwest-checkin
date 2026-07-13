import { Attendee } from "@/types/attendee";

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current.trim());

  return result;
}

export function parseEventbriteCsv(csv: string): Attendee[] {
  const lines = csv
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    return [];
  }

  const headers = splitCsvLine(lines[0]);

  const column = (name: string) => headers.indexOf(name);

  const attendees: Attendee[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);

    const firstName = cols[column("First Name")] ?? "";
    const lastName = cols[column("Last Name")] ?? "";
    const email = cols[column("Email")] ?? "";
    const company = cols[column("Company")] ?? "";
    const ticketType = cols[column("Ticket Type")] ?? "";
    const shirtSize = cols[column("T-Shirt Size")] ?? "";

    const presenting =
      (cols[column("Are you presenting?")] ?? "")
        .trim()
        .toLowerCase() === "yes";

    const id =
      cols[column("Attendee #")] || crypto.randomUUID();

    attendees.push({
      id,

      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`.trim(),

      email,
      company,

      ticketType,

      shirtSize,

      presenting,

      // Temporary defaults.
      // These will be replaced after the HubSpot membership merge.
      shirtType: "STANDARD",
      shirtReasons: [],

      checkedIn: false,
    });
  }

  return attendees;
}