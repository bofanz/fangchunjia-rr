// app/routes/projects.$slug.tsx
import { useLoaderData, data } from "react-router";
import type { Route } from "./+types/_layout._smooth.projects.$slug";
import { client, urlFor } from "~/lib/sanity";

import type { SanityDocument } from "@sanity/client";
import type { SanityImageSource } from "@sanity/image-url";
import groq from "groq";
import Gallery from "~/components/Gallery";
import ProjectTitle from "~/components/ProjectTitle";
import MediaGrid from "~/components/MediaGrid";
import ProjectDescription from "~/components/ProjectDescription";
import ReactLenis from "lenis/react";

interface Project extends SanityDocument {
  title: string;
  year: number;
  slug: { current: string };
  externalLink?: string;
  cover: SanityImageSource;
  category: { _id: string; title: string };
  grid: any[];
}

export async function loader({ params }: Route.LoaderArgs) {
  const project = await client.fetch<Project>(
    groq`
    *[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      subtitle,
      year,
      slug,
      externalLink,
      cover,
      description,
      category-> { _id, title },
      grid[] {
        _type,
        _key,
        colSpanMobile,
        colSpanTablet,
        colSpanDesktop,
        // imageGridBlock fields
        _type == "imageGridBlock" => {
          image,
          caption,
        },
        // videoGridBlock fields  
        _type == "videoGridBlock" => {
          url,
          caption
        },
        // audioGridBlock fields
        _type == "audioGridBlock" => {
          url,
          caption
        },
        // richTextGridBlock fields
        _type == "richTextGridBlock" => {
          content
        }
      }
    }
  `,
    { slug: params.slug },
  );

  if (!project) {
    throw data("Project not found", { status: 404 });
  }
  return { project };
}

export default function ProjectDetail() {
  const { project } = useLoaderData<typeof loader>();
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, syncTouch: true }}>
      <>
        <ProjectTitle />
        <div
          className="fixed top-0 bottom-0 left-0 right-0 -z-1"
          // style="transform: scale(1)"
        >
          {/* <Gallery media={[project.cover]} activeMediaKey={project.cover.key} /> */}
        </div>

        {/* <ProjectText project={project} /> */}

        <div className="p-8 pt-28 bg-white w-full h-full">
          <section className="grid grid-cols-12">
            <div className="grid col-span-7 col-start-6 grid-cols-subgrid">
              <MediaGrid
                grid={project.grid}
                // mediaLayout={project.mediaLayout}
              />
            </div>
            <ProjectDescription project={project} />
          </section>
        </div>
      </>
    </ReactLenis>
  );
}
