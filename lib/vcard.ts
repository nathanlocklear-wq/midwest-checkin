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

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim());

  for (const line of lines) {

    if (line.startsWith("N")) {
      const value = line.split(":")[1] ?? "";

      const parts = value.split(";");

      data.lastName = parts[0] ?? "";
      data.firstName = parts[1] ?? "";
    }


    if (line.startsWith("FN")) {
      const value = line.split(":")[1] ?? "";

      if (!data.firstName && !data.lastName) {
        const names = value.split(" ");

        data.firstName = names[0] ?? "";
        data.lastName = names.slice(1).join(" ");
      }
    }


    if (line.startsWith("EMAIL")) {
      const value = line.split(":")[1] ?? "";

      data.email = value
        .trim()
        .toLowerCase();
    }


    if (line.startsWith("ORG")) {
      const value = line.split(":")[1] ?? "";

      data.company = value.replace(/;/g, " ").trim();
    }


    if (line.startsWith("TITLE")) {
      const value = line.split(":")[1] ?? "";

      data.title = value.trim();
    }

  }

  if (!data.email) {
    return null;
  }

  return data;
}