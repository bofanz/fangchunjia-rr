// app/routes/projects.$slug.tsx
import { useLoaderData, data } from "react-router";
import type { Route } from "./+types/_layout.projects.$slug";
import { client, urlFor } from "~/lib/sanity";
import { motion } from "motion/react";

import type { SanityDocument } from "@sanity/client";
import groq from "groq";
import MediaGrid from "~/components/MediaGrid";
import ProjectDescription from "~/components/ProjectDescription";
import ReactLenis from "lenis/react";
import Close from "~/components/Close";
import { PortableText } from "@portabletext/react";

interface Project extends SanityDocument {
  title: string;
  subtitle?: string | null;
  description: any;
  year: number;
  slug: { current: string };
  externalLink?: string;
  cover: { mediaType: string; image?: { asset?: { _ref: string } } };
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
      cover {
        mediaType,
        image { asset { _ref } }
      },
      accentColor,
      description,
      category-> { _id, title },
      grid[] {
        _type,
        _key,
        colSpanMobile,
        colSpanTablet,
        colSpanDesktop,
        _type == "imageGridBlock" => {
          image,
          caption,
        },
        _type == "videoGridBlock" => {
          url,
          caption
        },
        _type == "audioGridBlock" => {
          url,
          caption
        },
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
  const cover = project.cover;
  console.log(project);

  const accentColor = project.accentColor?.hex;

  return (
    <div>
      <ReactLenis root options={{ lerp: 0.1, duration: 1.5, syncTouch: true }}>
        {/* Cover — in-flow, starts full height, shrinks to reveal images below */}
        <motion.div
          className="w-full relative"
          initial={{ height: "100dvh" }}
          animate={{ height: "calc(100dvh - 32px)" }}
          transition={{ duration: 1, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="w-full h-full">
            {cover?.mediaType === "image" && cover.image?.asset?._ref && (
              <img
                src={urlFor(cover.image.asset._ref).url()}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="grid grid-cols-3 absolute inset-0 p-4 gap-4">
            <div
              className="col-span-1 col-start-2 flex flex-col justify-end gap-4"
              style={{
                color: project.accentColor?.hex,
                textShadow: `0 0 1px ${project.accentColor?.hex}80`,
              }}
            >
              <div className="text-sm">
                <div className="mb-4">{project.subtitle}</div>
                <div className="leading-[16px]">
                  <PortableText value={project.description} />
                </div>
              </div>
              <div className="text-xs">(scroll down)</div>
            </div>
          </div>
        </motion.div>

        {/* Images section — follows cover in natural flow */}
        <div className="bg-[#e7e7e7] p-8 px-32">
          <MediaGrid grid={project.grid} />
        </div>
      </ReactLenis>
      <Close color={accentColor} />
    </div>
  );
}
