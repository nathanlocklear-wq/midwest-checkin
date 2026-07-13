export interface VCardData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  title: string;
}

export function parseVCard(text: string): VCardData | null {
  if (!text.includes("BEGIN:VCARD")) {
    return null;
  }

  const data: VCardData = {
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    title: "",
  };

  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    if (line.startsWith("N:")) {
      const value = line.substring(2);
      const [last, first] = value.split(";");

      data.firstName = first ?? "";
      data.lastName = last ?? "";
    }

    if (line.startsWith("EMAIL:")) {
      data.email = line.substring(6).trim().toLowerCase();
    }

    if (line.startsWith("ORG:")) {
      data.company = line.substring(4);
    }

    if (line.startsWith("TITLE:")) {
      data.title = line.substring(6);
    }
  }

  return data;
}