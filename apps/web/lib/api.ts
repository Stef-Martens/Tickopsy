export async function apiFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      success: false,
      error: data.error || "Unknown error",
      errorCode: data.code || "UNKNOWN_ERROR",
    };
  }

  return { success: true, data };
}
