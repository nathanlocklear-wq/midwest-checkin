export const attendeeColumns = "id,first_name,last_name,full_name,email,company,ticket_type,presenting,shirt_size,shirt_type,shirt_reasons,badge_still_needed,badge_printed_at,checked_in,checked_in_at";
export class InvalidInput extends Error {}
function reject(): never { throw new InvalidInput("Invalid request"); }
export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return reject();
  return value as Record<string, unknown>;
}
export function keys(value: Record<string, unknown>, allowed: string[]) {
  if (Object.keys(value).some(key => !allowed.includes(key))) reject();
}
export function text(value: unknown, max = 500): string {
  if (typeof value !== "string" || value.length > max || /[\u0000-\u001f]/.test(value)) return reject();
  return value.trim();
}
export function id(value: unknown) {
  const result = text(value, 36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(result)) reject();
  return result;
}
export function boolean(value: unknown): boolean {
  if (typeof value !== "boolean") return reject();
  return value;
}
export function date(value: unknown) {
  const result = text(value, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result) || Number.isNaN(Date.parse(result)) || new Date(result).toISOString().slice(0,10) !== result) reject();
  return result;
}
export function patch(value: unknown) {
  const data = record(value);
  keys(data, ["company","email","shirt_size","presenting","badge_still_needed"]);
  if (!Object.keys(data).length) reject();
  return Object.fromEntries(Object.entries(data).map(([key,value]) => [
    key, ["presenting","badge_still_needed"].includes(key) ? boolean(value) : text(value),
  ]));
}
export function importedRows(value: unknown) {
  if (!Array.isArray(value) || !value.length || value.length > 5000) return reject();
  return value.map(value => {
    const row = record(value);
    keys(row, attendeeColumns.split(","));
    const shirtType = text(row.shirt_type, 10);
    if (!["SPECIAL","STANDARD","LATE","NONE"].includes(shirtType)) reject();
    if (!Array.isArray(row.shirt_reasons) || row.shirt_reasons.length > 10) reject();
    return {
      first_name: text(row.first_name), last_name: text(row.last_name), full_name: text(row.full_name),
      email: text(row.email).toLowerCase(), company: text(row.company), ticket_type: text(row.ticket_type),
      presenting: boolean(row.presenting), shirt_size: text(row.shirt_size, 100), shirt_type: shirtType,
      shirt_reasons: (row.shirt_reasons as unknown[]).map(reason => text(reason,100)),
      badge_still_needed: boolean(row.badge_still_needed),
      checked_in: false, checked_in_at: null, badge_printed_at: null,
    };
  });
}
