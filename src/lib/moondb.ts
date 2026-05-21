const API = process.env.NEXT_PUBLIC_MOONDB_API!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_MOONDB_PUBLIC_KEY!;

export class MoonDBError extends Error {
  code: string;
  field?: string;
  suggestion?: string;

  constructor(err: { code: string; message: string; field?: string; suggestion?: string }) {
    super(err.message);
    this.code = err.code;
    this.field = err.field;
    this.suggestion = err.suggestion;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  isPublic?: boolean;
};

export async function moondb(
  path: string,
  opts: RequestOptions = {}
) {
  const { method = "GET", body, token, isPublic } = opts;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (isPublic) {
    headers["X-Public-Key"] = PUBLIC_KEY;
  }

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();
  if (!res.ok) {
    if (json.error?.code) throw new MoonDBError(json.error);
    throw new Error(json.error?.message || "Request failed");
  }
  return json;
}

export { API, PUBLIC_KEY };
