import type { SampleColumn } from "~/components/sample-screen";

type EntryColumn = Extract<SampleColumn, { kind: "entry" }>;

/** A journal entry: the questions of the period, each with its answer. */
export function SampleEntryView(props: { column: EntryColumn }) {
  const { name, meta, answers } = props.column;
  return (
    <>
      <div className="sample-details-head">
        <span className="sample-details-name">{name}</span>
        <span className="sample-details-meta">{meta}</span>
      </div>
      {answers.map((answer) => (
        <div key={answer.question} className="sample-answer">
          <span className="sample-answer-question">{answer.question}</span>
          <p>{answer.answer}</p>
        </div>
      ))}
    </>
  );
}
