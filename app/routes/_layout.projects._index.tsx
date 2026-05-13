// app/routes/projects.tsx
import { useLoaderData, useOutletContext } from "react-router";
import type { Route } from "./+types/_layout._smooth.projects._index";
import { client } from "~/lib/sanity";
import groq from "groq";
import Gallery from "~/components/Gallery";
import ProjectList from "~/components/ProjectList";
import { $hoveredProject } from "~/stores/ui";
import ProjectTitle from "~/components/ProjectTitle";
import { useEffect } from "react";
import ReactLenis from "lenis/react";

export async function loader({}: Route.LoaderArgs) {
  const projects = await client.fetch<any[]>(groq`
    *[_type == "project"] | order(year desc) {
      _id,
      title,
      subtitle,
      year,
      slug,
      cover,
      category-> { _id, title }
    }
  `);
  return { projects };
}

export default function Projects() {
  const { projects } = useLoaderData<typeof loader>();
  const categories = [
    { id: "experimental", name: "Exp" },
    { id: "collaborations", name: "Collab" },
  ];
  useEffect(() => {
    $hoveredProject.set(null); // ✅ runs after render, not during
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, syncTouch: true }}>
      <div className="p-8 pt-28">
        <ProjectTitle />
        <section className="">
          <div className="fixed top-0 bottom-0 left-0 right-0 -z-1 project-image">
            <Gallery
              media={projects
                .map((p) => p.cover.asset._ref)
                .filter((m) => m !== undefined && m !== null)}
            />
          </div>
          <div className="">
            <ProjectList projects={projects} categories={categories} />
            {/* Remove the duplicates */}
            {/* <ProjectList projects={projects} categories={categories} />
          <ProjectList projects={projects} categories={categories} />
          <ProjectList projects={projects} categories={categories} /> */}
          </div>
        </section>
      </div>
    </ReactLenis>
  );
}
