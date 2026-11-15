/**
 * The ids of the open views after one is opened or closed, in the order they
 * were opened. On a phone, where a view takes the place of the panel's content,
 * opening one closes the others; elsewhere they are columns and can be open
 * together.
 */
export function strataPanelViewsToggle(
  open: readonly string[],
  id: string,
  phone: boolean,
): string[] {
  if (open.includes(id)) {
    return open.filter((other) => other !== id);
  }
  return phone ? [id] : [...open, id];
}
