import type { Attendee } from "./attendees";

export type DuplicateGroup = {
  reason: string;
  attendees: Attendee[];
};

export function findDuplicates(
  attendees: Attendee[]
): DuplicateGroup[] {
  const groups: DuplicateGroup[] = [];

  const nameMap = new Map<string, Attendee[]>();

  attendees.forEach((attendee) => {
    const key = `${attendee.first_name} ${attendee.last_name}`
      .trim()
      .toLowerCase();

    if (!nameMap.has(key)) {
      nameMap.set(key, []);
    }

    nameMap.get(key)!.push(attendee);
  });

  nameMap.forEach((group) => {
    if (group.length > 1) {
      groups.push({
        reason: "Duplicate Name",
        attendees: group,
      });
    }
  });

  groups.sort((a, b) =>
    a.attendees[0].last_name.localeCompare(
      b.attendees[0].last_name
    )
  );

  return groups;
}