import { urlFor } from "~/lib/sanity";
import { useStore } from "@nanostores/react";
import { $activeProject, $hoveredProject } from "~/stores/ui";
import type { ProjectInfo } from "~/types";
import VimeoPlayer from "./VimeoPlayer";

export default function Gallery({ projects }: { projects: ProjectInfo[] }) {
  const hoveredProject = useStore($hoveredProject);
  const activeProject = useStore($activeProject);
  const project = hoveredProject || activeProject || null;
  // console.log(project);
  console.log(activeProject);
  return (
    <div className="relative w-full h-full pointer-events-none">
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
            {cover?.mediaType === "video" && (
              <VimeoPlayer
                videoId={cover.vimeoId}
                options={{ autoplay: true, background: true }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
