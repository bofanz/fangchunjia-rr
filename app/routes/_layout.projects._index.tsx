// app/routes/projects.tsx
import { useLoaderData } from "react-router";
import type { Route } from "./+types/_layout.projects._index";
import { client } from "~/lib/sanity";
import groq from "groq";
import ProjectList from "~/components/ProjectList";
import { $hoveredProject } from "~/stores/ui";
import { useEffect, useRef } from "react";
import ReactLenis from "lenis/react";
import type { ProjectInfo } from "~/types";
import { motion } from "motion/react";

export async function loader({}: Route.LoaderArgs) {
  const raw = await client.fetch<any[]>(groq`
    *[_type == "project"] | order(year desc) {
      _id,
      title,
      subtitle,
      year,
      slug,
      cover,
      accentColor,
      lightDark,
      category-> { _id, title }
    }
  `);
  const projects: ProjectInfo[] = raw.map((p) => ({
    ...p,
    id: p._id,
    categoryId: p.category?._id ?? "",
    subtitle: p.subtitle ?? null,
  }));
  return { projects };
}

export default function Projects() {
  const { projects } = useLoaderData<typeof loader>();
  const categories = [
    { id: "experimental", name: "Exp" },
    { id: "collaborations", name: "Collab" },
  ];
  useEffect(() => {
    $hoveredProject.set(null);
  }, []);

  console.log(projects);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3 } }}
    >
      <ReactLenis root options={{ lerp: 0.1, duration: 1.5, syncTouch: true }}>
        <div className="p-4 pt-28">
          <section className="">
            <div className="">
              <ProjectList projects={projects} categories={categories} />
            </div>
          </section>
        </div>
      </ReactLenis>
    </motion.div>
  );
}
