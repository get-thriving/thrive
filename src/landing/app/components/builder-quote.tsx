import { landingLinks } from "~/landing-links";

export function BuilderQuote() {
  return (
    <section aria-label="From the builder" className="wrap builder">
      <blockquote>
        <p>
          “It&apos;s no exaggeration to say I&apos;m running my life via
          Thrive.”
        </p>
        <footer>
          Horia Coman · builds Thrive and plans his own life in it
        </footer>
      </blockquote>
      <div className="builder-side">
        <p className="panel-copy">
          Thrive is built in the open. Ask questions, suggest features and
          follow along.
        </p>
        <div className="button-row">
          <a href={landingLinks.community} className="button button-outline">
            Join the Discord
          </a>
          <a href={landingLinks.source} className="button button-outline">
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
