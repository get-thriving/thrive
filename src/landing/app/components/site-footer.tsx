import { Logo } from "~/components/logo";
import { landingLinks } from "~/landing-links";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer-inner">
        <div className="footer-grid">
          <div className="footer-about">
            <span className="footer-brand">
              <Logo size={18} />
              <strong>Thrive</strong>
            </span>
            <span className="footer-tagline">A tool for life planning.</span>
            <a href={landingLinks.supportMailto} className="footer-mail">
              {landingLinks.supportEmail}
            </a>
          </div>
          <nav aria-label="Product" className="footer-nav">
            <span className="label label-faint">Product</span>
            <a href="/#features">Features</a>
            <a href="/#get">Get Thrive</a>
            <a href="/#self-host">Self-host</a>
            <a href={landingLinks.docs}>Docs</a>
          </nav>
          <nav aria-label="Community" className="footer-nav">
            <span className="label label-faint">Community</span>
            <a href={landingLinks.community}>Discord</a>
            <a href={landingLinks.source}>GitHub</a>
          </nav>
          <nav aria-label="Legal" className="footer-nav">
            <span className="label label-faint">Legal</span>
            <a href="/terms-conditions">Terms and conditions</a>
            <a href="/privacy-policy">Privacy policy</a>
          </nav>
        </div>
        <p className="footer-legal">© 2026 Thrive · Made by Horia Coman</p>
      </div>
    </footer>
  );
}
