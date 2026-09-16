export type ApiResult<T> = { data: T | null; count?: number; error: { message: string } | null };
export async function staffRequest<T>(action: string, params: Record<string, unknown> = {}): Promise<ApiResult<T>> {
  try {
    const response = await fetch("/api/staff", {
      method: "POST", credentials: "same-origin", cache: "no-store",
      headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ...params }),
    });
    const result = await response.json();
    if (!response.ok) return { data: null, error: { message: result.error?.message || "Unable to complete request" } };
    return result as ApiResult<T>;
  } catch { return { data: null, error: { message: "Unable to reach the server. Please try again." } }; }
}
