import type { Media } from "~/types";
import MediaRenderer from "./MediaRenderer";
import { urlFor } from "~/lib/sanity";
import { useStore } from "@nanostores/react";
import { $hoveredProject } from "~/stores/ui";

export default function Gallery({ media }: { media: string[] }) {
  const hoveredProject = useStore($hoveredProject);
  return (
    <div className="relative w-full h-full pointer-events-none">
      {/* {hoveredProject ? <p>{hoveredProject.slug.current}</p> : <p>None</p>} */}
      {media.map((m) => (
        <div
          key={m}
          className={
            "absolute w-full h-full transition " +
            (m === hoveredProject?.cover.asset._ref
              ? "opacity-100"
              : "opacity-0")
          }
        >
          <img src={urlFor(m).url()} className="w-full h-full object-cover" />
          {/* <MediaRenderer media={m} /> */}
        </div>
      ))}
    </div>
  );
}
