/** A paragraph, or a list when it is an array of items. */
export type LegalBlock = string | string[];

export interface LegalSection {
  heading?: string;
  blocks: LegalBlock[];
}

/** A page of the legal text: a title, an introduction and numbered sections. */
export function LegalPage(props: {
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <article className="wrap legal">
      <h1>{props.title}</h1>
      <p className="lead">{props.intro}</p>
      {props.sections.map((section, index) => (
        <section key={section.heading ?? index}>
          {section.heading ? <h2>{section.heading}</h2> : null}
          {section.blocks.map((block, blockIndex) =>
            typeof block === "string" ? (
              <p key={blockIndex}>{block}</p>
            ) : (
              <ul key={blockIndex}>
                {block.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ),
          )}
        </section>
      ))}
    </article>
  );
}
