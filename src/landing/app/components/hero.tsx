export function Hero() {
  return (
    <section id="top" className="wrap hero">
      <div className="hero-title">
        <p className="label label-muted">A tool for life planning</p>
        <h1>Everything you&apos;re working toward, on one screen.</h1>
      </div>
      <div className="hero-copy">
        <p className="lead">
          Thrive connects your goals, plans, tasks, habits, chores, journals and
          metrics, so today&apos;s list comes from what you decided matters. Use
          it in the cloud, or run it on your own server.
        </p>
        <div className="button-row">
          <a href="#start" className="button button-primary">
            Get started
          </a>
          <a href="#run" className="button button-outline">
            Self-host it
          </a>
        </div>
        <p className="hero-platforms">Web · macOS · iOS · Android · CLI</p>
      </div>
    </section>
  );
}
