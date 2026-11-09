import { strataPathSegments } from "#/core/infra/component/shell/strata-path-segments";

export interface StrataPhoneTitle {
  /** The line above the title: where it is under, in mono. */
  trail: string;
  title: string;
}

const ROOT_TRAIL = "thrive /";

/**
 * What the phone's top bar says for a URL. Ids are not names, so the title is
 * the last part that is not one, `habits` for `habits/habits/3`, and the line
 * above it is the part before. A part that repeats the one before it, as the
 * app and its list do, is said once.
 */
export function strataPhoneTitle(pathname: string): StrataPhoneTitle {
  const segments = strataPathSegments(pathname).filter(
    (segment, index, all) => index === 0 || segment !== all[index - 1],
  );
  let last = segments.length - 1;
  while (last > 0 && /^\d+$/.test(segments[last])) {
    last -= 1;
  }
  if (last < 0) {
    return { trail: ROOT_TRAIL, title: "Home" };
  }
  return {
    trail: last > 0 ? `${segments[last - 1]} /` : ROOT_TRAIL,
    title: segments[last],
  };
}
