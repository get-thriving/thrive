import { landingLinks } from "~/landing-links";

export function RunItYourWay() {
  return (
    <section id="run" className="wrap run">
      <h2>Run it your way.</h2>
      <div className="run-grid">
        <div className="panel">
          <p className="label label-accent">Cloud</p>
          <h3>Sign up and start planning.</h3>
          <p className="panel-copy">
            We host it, keep it up to date and back it up. The hosted version is
            built to respect you and your privacy.
          </p>
          <dl className="facts">
            <div>
              <dt>Apps</dt>
              <dd>Web, macOS, iOS and Android</dd>
            </div>
            <div>
              <dt>Sign in</dt>
              <dd>Google, Apple or email</dd>
            </div>
          </dl>
          <div className="button-row panel-actions">
            <a href={landingLinks.app} className="button button-primary">
              Get started
            </a>
          </div>
        </div>
        <div className="panel">
          <p className="label label-teal">Self-hosted</p>
          <h3>Run it on your own server.</h3>
          <p className="panel-copy">
            Thrive is open source. Run it with Docker, keep your data on your
            machine, and read every line of the code. The same apps connect to
            your server.
          </p>
          <div className="terminal">
            <span className="terminal-comment">
              # get the compose file from the self-hosting guide
            </span>
            <span>
              <span className="terminal-prompt">$</span> docker compose up -d
            </span>
          </div>
          <dl className="facts">
            <div>
              <dt>License</dt>
              <dd>MIT</dd>
            </div>
          </dl>
          <div className="button-row panel-actions">
            <a
              href={landingLinks.selfHostGuide}
              className="button button-outline"
            >
              Read the self-hosting guide
            </a>
            <a href={landingLinks.source} className="button button-outline">
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
