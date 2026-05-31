import { motion, type Variants } from "motion/react";
import type { Category, ProjectInfo } from "../types";
import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { $activePos, $activeProject, $hoveredProject } from "~/stores/ui";
import { useStore } from "@nanostores/react";

export default function ProjectList({
  projects,
  categories: _categories,
}: {
  projects: ProjectInfo[];
  categories: Category[];
}) {
  const committed = useRef<string | null>(null);
  const hoveredProject = useStore($hoveredProject);

  const apply = (c: string | null) =>
    c
      ? document.documentElement.style.setProperty("--accent", c)
      : document.documentElement.style.removeProperty("--accent");

  const projectListItemRefs = useRef<Map<string, HTMLElement>>(new Map());

  const handleProjectClick = (p: ProjectInfo) => {
    $activeProject.set(p);
    const el = projectListItemRefs.current.get(p.title);
    if (el) {
      const rect = el.getBoundingClientRect();
      $activePos.set({ top: rect.top, left: rect.left });
    }
    committed.current = p.accentColor?.hex || "#000";
    apply(p.accentColor?.hex || "#000");
  };

  useEffect(() => {
    apply("#000000");
  }, []);

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.02 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
      className="project-list"
      onMouseLeave={() => {
        $hoveredProject.set(null);
        apply(committed.current);
      }}
    >
      {projects.map((p) => (
        <motion.li key={p.slug.current} variants={item}>
          <div
            className="relative group w-fit"
            onMouseEnter={() => {
              $hoveredProject.set(p);
              console.log(p.accentColor?.hex);
              apply(p.accentColor?.hex);
            }}
          >
            <Link
              to={`/projects/${p.slug.current}`}
              viewTransition
              className="cursor-pointer h-full w-fit block relative z-10"
              onClick={() => handleProjectClick(p)}
            >
              <div
                ref={(el) => {
                  if (el) projectListItemRefs.current.set(p.title, el);
                }}
                className="flex gap-2 font-medium mb-0 py-0 text-md"
              >
                <div
                  className="w-fit opacity-60 group-hover:opacity-100 text-accent"
                  style={{
                    opacity:
                      hoveredProject === null ||
                      p.slug.current === hoveredProject?.slug?.current
                        ? "1"
                        : "0.6",
                  }}
                >
                  <span className="block px-1 -ml-1 leading-[22px] ">
                    {p.title}
                  </span>
                </div>
                {/* {p.subtitle && (
                  <div className="opacity-0 group-hover:opacity-100 group-hover:[text-shadow:0_0_4px_#ffffff] text-white transition duration-800">
                    <span className="block px-1 leading-[22px]">
                      {p.subtitle}
                    </span>
                  </div>
                )} */}
              </div>
            </Link>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
