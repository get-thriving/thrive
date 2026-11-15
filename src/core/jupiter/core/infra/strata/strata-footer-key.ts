/** One entry of the footer: the key or keys, and what they do. */
export interface StrataFooterKey {
  /**
   * The keys as they are drawn, one chip each, such as `["h", "l"]`. Empty for
   * an instruction that is not a key, such as "type a label".
   */
  keys: string[];
  /** What the keys do, in a word or two. */
  label: string;
}
