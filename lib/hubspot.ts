import { Membership } from "@/types/membership";

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current.trim());

  return result;
}

export function parseHubSpotCsv(csv: string): Map<string, Membership> {
  const lines = csv
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    return new Map();
  }

  const headers = splitCsvLine(lines[0]);

  const emailIndex = headers.indexOf("Email");
  const paymentIndex = headers.indexOf("Payment Method");

  const memberships = new Map<string, Membership>();

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);

    const email = (cols[emailIndex] ?? "").trim().toLowerCase();

    if (!email) continue;

    memberships.set(email, {
      email,
      paymentMethod: cols[paymentIndex] ?? "",
    });
  }

  return memberships;
}