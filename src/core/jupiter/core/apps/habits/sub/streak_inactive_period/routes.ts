export function habitLocation(habitId: string, search = ""): string {
  const query = search === "" || search.startsWith("?") ? search : `?${search}`;
  return `/app/workspace/apps/habits/habits/${habitId}${query}`;
}
