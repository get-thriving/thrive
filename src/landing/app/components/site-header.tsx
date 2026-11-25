import type { MouseEvent } from "react";

import { Logo } from "~/components/logo";
import { landingLinks } from "~/landing-links";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Get Thrive", href: "/#get" },
  { label: "Self-host", href: "/#self-host" },
  { label: "Docs", href: landingLinks.docs },
  { label: "Discord", href: landingLinks.community },
  { label: "GitHub", href: landingLinks.source },
];

/** A link in the phone menu closes it, as the page may be the one it points into. */
function closeMenu(event: MouseEvent<HTMLAnchorElement>) {
  event.currentTarget.closest("details")?.removeAttribute("open");
}

/**
 * The header. The links are inline from the tablet width up; on a phone they
 * fold into a menu, a `details` so it works without scripts. Only one of the
 * two is displayed, which the stylesheet decides.
 */
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap site-header-inner">
        <a href="/" aria-label="Thrive home" className="brand">
          <Logo size={22} />
          <span>Thrive</span>
        </a>
        <nav aria-label="Main" className="site-nav">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="site-actions">
          <a
            href={landingLinks.signIn}
            className="button button-quiet button-small site-signin"
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
        <details className="site-menu">
          <summary className="site-menu-button" aria-label="Menu">
            <span className="site-menu-icon" aria-hidden="true" />
          </summary>
          <nav aria-label="Main (menu)" className="site-menu-panel">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            ))}
            <a href={landingLinks.signIn} onClick={closeMenu}>
              Sign in
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
