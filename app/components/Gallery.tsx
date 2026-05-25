import { urlFor } from "~/lib/sanity";
import { useStore } from "@nanostores/react";
import { $activeProject, $hoveredProject } from "~/stores/ui";
import type { ProjectInfo } from "~/types";

export default function Gallery({ projects }: { projects: ProjectInfo[] }) {
  const hoveredProject = useStore($hoveredProject);
  const activeProject = useStore($activeProject);
  const project = hoveredProject || activeProject || null;
  console.log(project);
  return (
    <div className="relative w-full h-full pointer-events-none">
      <p className="fixed top-0 right-0 z-4000">{project?.slug.current}</p>
      {projects.map((p) => {
        const cover = p.cover as any;
        return (
          <div
            key={p.id}
            className={
              "absolute w-full h-full transition " +
              (p.id === project?.id ? "opacity-100" : "opacity-0")
            }
          >
            {cover?.mediaType === "image" && (
              <img
                src={urlFor(cover.image?.asset?._ref).url()}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
