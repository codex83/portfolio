import Link from "next/link";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent"
    >
      <h3 className="font-heading text-lg font-medium text-foreground group-hover:text-accent-soft">
        {project.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.tagline}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tools
          .flatMap((g) => g.items)
          .slice(0, 4)
          .map((item) => (
            <span
              key={item}
              className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-[11px] text-muted"
            >
              {item}
            </span>
          ))}
      </div>
    </Link>
  );
}
