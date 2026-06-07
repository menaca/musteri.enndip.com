export class BffError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "BffError";
  }
}

/** Tarayıcı → same-origin BFF JSON. Token cookie'de kalır. */
export async function bffFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new BffError(0, "Sunucuya ulaşılamadı.");
  }

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : `İstek başarısız (${res.status}).`;
    throw new BffError(res.status, message);
  }

  return data as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
