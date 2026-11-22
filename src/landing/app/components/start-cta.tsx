import { landingLinks } from "~/landing-links";

export function StartCta() {
  return (
    <section id="start" className="wrap start">
      <div className="start-card">
        <div className="start-copy">
          <h2>Start with one goal.</h2>
          <p className="lead">
            Write down what you&apos;re working toward, plan this week around
            it, and let your habits and chores fill in the days.
          </p>
        </div>
        <div className="button-row">
          <a
            href={landingLinks.app}
            className="button button-primary button-large"
          >
            Get started
          </a>
          <a href="#run" className="button button-outline button-large">
            Self-host it
          </a>
        </div>
      </div>
    </section>
  );
}
