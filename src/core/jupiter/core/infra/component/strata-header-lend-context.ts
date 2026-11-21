import { createContext } from "react";

/**
 * Whether the header of the column a page's content is in has room for the
 * controls of the first card of that content (ADR 0021): then the card has no
 * header row of its own, as the first section of a stack has none. False
 * outside a column's own content, such as in a view of it, a dialog or a page
 * with no column header. Known from the start, so the server draws what the
 * browser does.
 */
export const StrataHeaderLendContext = createContext<boolean>(false);
