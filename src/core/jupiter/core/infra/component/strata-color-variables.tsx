import { strataColorVariablesCss } from "#/core/infra/component/strata-tokens";

/**
 * The variables the colors are, for both schemes. Which one is on is the
 * `data-color-scheme` of the `<html>` element. In the document rather than a
 * global style, so they are there before anything is drawn.
 */
export function StrataColorVariables() {
  return (
    <style dangerouslySetInnerHTML={{ __html: strataColorVariablesCss() }} />
  );
}
