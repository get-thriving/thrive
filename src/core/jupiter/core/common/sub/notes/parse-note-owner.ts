/** Parsed ``EntityLink`` string from the API (``theType:refId:purpose``). */
export type ParsedNoteOwner = {
  theType: string;
  refId: string;
  purpose: string;
};

export function parseNoteOwner(owner: string): ParsedNoteOwner {
  const parts = owner.split(":");
  if (parts.length < 3) {
    throw new Error(`Invalid note owner link: ${owner}`);
  }
  const purpose = parts[parts.length - 1]!;
  const refId = parts[parts.length - 2]!;
  const theType = parts.slice(0, -2).join(":");
  return { theType, refId, purpose };
}
