import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import FlowDiagram from "@/components/FlowDiagram";
import { getProject, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-14">
        <Link href="/" className="text-sm text-muted transition-colors hover:text-foreground">
          ← All projects
        </Link>

        <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground">
          {project.name}
        </h1>
        <p className="mt-2 text-lg text-muted">{project.tagline}</p>

        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
        >
          View on GitHub ↗
        </a>

        <section className="mt-10">
          <h2 className="font-heading text-sm font-medium uppercase tracking-wider text-muted">
            Problem &amp; Goal
          </h2>
          <p className="mt-3 leading-relaxed text-foreground/90">{project.problem}</p>
        </section>

        <section className="mt-10">
          <h2 className="font-heading text-sm font-medium uppercase tracking-wider text-muted">
            Tools &amp; Stack
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {project.tools.map((group) => (
              <div key={group.category}>
                <h3 className="text-xs font-medium text-muted">{group.category}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-foreground/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-heading text-sm font-medium uppercase tracking-wider text-muted">
            Data Flow
          </h2>
          <div className="mt-4">
            <FlowDiagram stages={project.flow} />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-heading text-sm font-medium uppercase tracking-wider text-muted">
            Results &amp; Findings
          </h2>
          <p className="mt-3 leading-relaxed text-foreground/90">{project.results}</p>
          {project.caveat && (
            <p className="mt-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted">
              ⚠ {project.caveat}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
