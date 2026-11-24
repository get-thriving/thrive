import { Logo } from "~/components/logo";
import { landingLinks } from "~/landing-links";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap site-header-inner">
        <a href="/" aria-label="Thrive home" className="brand">
          <Logo size={22} />
          <span>Thrive</span>
        </a>
        <nav aria-label="Main" className="site-nav">
          <a href="/#features">Features</a>
          <a href="/#get">Get Thrive</a>
          <a href="/#self-host">Self-host</a>
          <a href={landingLinks.docs}>Docs</a>
          <a href={landingLinks.community}>Discord</a>
          <a href={landingLinks.source}>GitHub</a>
        </nav>
        <div className="site-actions">
          <a
            href={landingLinks.signIn}
            className="button button-quiet button-small"
          >
            Sign in
          </a>
          <a
            href={landingLinks.signIn}
            className="button button-primary button-small"
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}
