import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function Home() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <section className="mb-16 max-w-2xl">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Projects in ML, data, and systems.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Each project below breaks down the tools used, how data moved through
            the pipeline, and what came out the other end — no fluff, just what
            was actually built and measured.
          </p>
        </section>

        {featured.length > 0 && (
          <section className="mb-14">
            <h2 className="mb-4 font-heading text-sm font-medium uppercase tracking-wider text-muted">
              Featured
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {featured.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-4 font-heading text-sm font-medium uppercase tracking-wider text-muted">
            All Projects
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted">
        Built with Next.js &amp; React Flow.
      </footer>
    </div>
  );
}
