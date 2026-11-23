import { BuilderQuote } from "~/components/builder-quote";
import { FeatureGrid } from "~/components/feature-grid";
import { Hero } from "~/components/hero";
import { PlatformStrip } from "~/components/platform-strip";
import { ProductScreens } from "~/components/product-screens";
import { RunItYourWay } from "~/components/run-it-your-way";
import { StartCta } from "~/components/start-cta";

const DESCRIPTION =
  "Thrive is a tool for life planning. It provides goals management, task tracking, habit building, chores management, lists, metrics, a personal relationship manager, and much more all in a unified package.";

export function meta() {
  return [
    { title: "Thrive | Life Planning" },
    { name: "description", content: DESCRIPTION },
    { property: "og:title", content: "Thrive | Life Planning" },
    { property: "og:description", content: DESCRIPTION },
  ];
}

export default function Home() {
  return (
    <>
      <Hero />
      <ProductScreens />
      <FeatureGrid />
      <RunItYourWay />
      <PlatformStrip />
      <BuilderQuote />
      <StartCta />
    </>
  );
}
