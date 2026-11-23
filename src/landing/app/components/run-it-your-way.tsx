import { landingLinks } from "~/landing-links";

const PLATFORMS = [
  { name: "Web", href: landingLinks.signIn },
  { name: "macOS", href: landingLinks.downloadMac },
  { name: "iOS", href: landingLinks.downloadIos },
  { name: "Android", href: landingLinks.downloadAndroid },
  { name: "CLI", href: landingLinks.cli },
];

export function RunItYourWay() {
  return (
    <section id="run" className="wrap run">
      <h2>Run it your way.</h2>
      <div className="run-grid">
        <div id="get" className="panel">
          <p className="label label-accent">Cloud</p>
          <h3>Sign up and start planning.</h3>
          <p className="panel-copy">
            We host it, keep it up to date and back it up. The hosted version is
            built to respect you and your privacy. Use it on the web, or
            download the apps for your computer and phone.
          </p>
          <dl className="facts">
            <div>
              <dt>Sign in</dt>
              <dd>Google, Apple or email</dd>
            </div>
          </dl>
          <div className="downloads">
            <span className="label label-faint">Get Thrive for</span>
            <div className="button-row">
              {PLATFORMS.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.href}
                  className="button button-outline button-small"
                >
                  {platform.name}
                </a>
              ))}
            </div>
            <span className="downloads-note">Windows and Linux coming</span>
          </div>
          <div className="button-row panel-actions">
            <a href={landingLinks.signIn} className="button button-primary">
              Get started
            </a>
          </div>
        </div>
        <div id="self-host" className="panel">
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
