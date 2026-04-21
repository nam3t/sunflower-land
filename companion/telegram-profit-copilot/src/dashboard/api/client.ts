export async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Dashboard API failed: ${response.status}`);
  }

  return (await response.json()) as T;
}
