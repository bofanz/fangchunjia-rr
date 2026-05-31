// app/routes/projects.$slug.tsx
import { useLoaderData, data } from "react-router";
import { useEffect } from "react";
import type { Route } from "./+types/_layout.projects.$slug";
import { client } from "~/lib/sanity";

import type { SanityDocument } from "@sanity/client";
import groq from "groq";
import MediaGrid from "~/components/MediaGrid";
import ProjectDescription from "~/components/ProjectDescription";
import ReactLenis, { useLenis } from "lenis/react";
import Close from "~/components/Close";
import { PortableText } from "@portabletext/react";
import { $activeProject, $scrollY } from "~/stores/ui";
import { motion } from "motion/react";
import { useStore } from "@nanostores/react";

interface Project extends SanityDocument {
  title: string;
  subtitle?: string | null;
  description: any;
  year: number;
  slug: { current: string };
  externalLink?: string;
  cover: {
    mediaType: string;
    image?: { asset?: { _ref: string } };
    vimeoId?: number | string;
  };
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
        image { asset { _ref } },
        vimeoId
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
  const activeProject = useStore($activeProject);

  useEffect(() => {
    if (!activeProject) {
      console.log(activeProject);
      $activeProject.set({
        id: project._id,
        title: project.title,
        subtitle: project.subtitle ?? null,
        slug: project.slug,
        year: project.year,
        categoryId: project.category?._id ?? "",
        cover: project.cover as any,
      });
    }
  }, []);

  useLenis(({ scroll }) => {
    $scrollY.set(scroll);
  });

  const accentColor = project.accentColor?.hex;

  return (
    <div>
      <ReactLenis root options={{ lerp: 0.1, duration: 1.5, syncTouch: true }}>
        {/* Spacer — holds document flow and description overlay; Gallery cover shows through */}
        <div
          className="w-full relative"
          style={{ height: "calc(100dvh - 32px)" }}
        >
          <motion.div
            className="grid grid-cols-3 absolute inset-0 p-4 gap-4"
            initial={{
              opacity: 0,
              // filter: "blur(70px)",
            }}
            animate={{
              opacity: 1,
              // filter: "blue(0px)",
              transition: {
                delay: 1.2,
              },
            }}
          >
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
          </motion.div>
        </div>

        {/* Images section — follows cover in natural flow */}
        <div className="bg-[#e7e7e7] p-8 px-32">
          <MediaGrid grid={project.grid} />
        </div>
      </ReactLenis>
      <Close color={accentColor} />
    </div>
  );
}
