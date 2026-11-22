import { FEATURE_GROUPS } from "~/components/feature-groups";

export function FeatureGrid() {
  return (
    <section id="features" className="wrap features">
      <div className="section-head">
        <h2>Plans, tasks and habits that know about each other.</h2>
        <p className="lead">
          Most tools hold one piece. In Thrive a habit can serve a goal, a chore
          lands in this week&apos;s plan on its own, and a big plan breaks down
          into tasks with due dates. Here&apos;s what&apos;s in it.
        </p>
      </div>
      <div className="feature-grid">
        {FEATURE_GROUPS.map((group) => (
          <div key={group.label} className="feature-group">
            <p className="label label-accent">{group.label}</p>
            {group.features.map((feature) => (
              <div key={feature.name} className="feature">
                <h3>{feature.name}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
