// app/routes/projects.$slug.tsx
import { useLoaderData, data, Link } from "react-router";
import type { Route } from "./+types/_layout.projects.$slug";
import { client, urlFor } from "~/lib/sanity";
import { motion } from "motion/react";

import type { SanityDocument } from "@sanity/client";
import type { SanityImageSource } from "@sanity/image-url";
import groq from "groq";
// import Gallery from "~/components/Gallery";
import MediaGrid from "~/components/MediaGrid";
import ProjectDescription from "~/components/ProjectDescription";
import ReactLenis from "lenis/react";
import XGraphic from "~/components/graphics/XGraphic";
import Close from "~/components/Close";

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
    <motion.div
      initial={{ y: "100vh" }}
      animate={{
        y: 0,
        transition: { duration: 0.7, ease: "linear", delay: 0.3 },
      }}
      className="min-h-screen bg-white"
    >
      <ReactLenis root options={{ lerp: 0.1, duration: 1.5, syncTouch: true }}>
        <>
          <div className="fixed top-0 bottom-0 left-0 right-0 -z-1">
            {/* <Gallery media={[project.cover]} activeMediaKey={project.cover.key} /> */}
          </div>

          <div className="p-8 pt-28 w-full h-full">
            <section className="grid grid-cols-12">
              <div className="grid col-span-7 col-start-6 grid-cols-subgrid">
                <MediaGrid grid={project.grid} />
              </div>
              <ProjectDescription project={project} />
            </section>
          </div>
        </>
      </ReactLenis>
      <Close />
    </motion.div>
  );
}
