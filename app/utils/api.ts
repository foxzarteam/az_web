export async function fetchData<T>(url: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    const data = await response.json();
    return data || fallback;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return fallback;
  }
}
