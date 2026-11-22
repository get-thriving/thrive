import { landingLinks } from "~/landing-links";

const PLATFORMS = [
  { name: "Web", href: landingLinks.app },
  { name: "macOS", href: landingLinks.downloadMac },
  { name: "iOS", href: landingLinks.downloadIos },
  { name: "Android", href: landingLinks.downloadAndroid },
  { name: "CLI", href: landingLinks.cli },
];

export function PlatformStrip() {
  return (
    <section aria-label="Platforms" className="wrap platforms">
      <div className="platforms-row">
        <span className="label label-faint">Get Thrive for</span>
        <div className="button-row platforms-list">
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
        <span className="platforms-note">Windows and Linux coming</span>
      </div>
    </section>
  );
}
