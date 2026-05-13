import { motion, type Variants } from "motion/react";
import type { Category, ProjectInfo } from "../types";
import { useEffect, useRef } from "react";
import { Link, NavLink } from "react-router";
import { useStore } from "@nanostores/react";
import { $activePos, $activeProject, $hoveredProject } from "~/stores/ui";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export default function ProjectList({
  projects,
  categories,
}: {
  projects: ProjectInfo[];
  categories: Category[];
}) {
  // const activeProject = useStore($activeProject);
  // const activePos = useStore($activePos);
  const categoriesAndProjects = categories.map((c) => ({
    ...c,
    projects: projects
      .filter((p) => "CAT#" + p.categoryId === c.id)
      .sort((a, b) => b.year - a.year),
  }));

  const isNotTouchDevice = true;

  const projectListItemRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  // const projectListItemTextRefs = useRef<Map<string, HTMLSpanElement>>(
  //   new Map(),
  // );

  const handleProjectClick = (p: ProjectInfo) => {
    const el = projectListItemRefs.current.get(p.title);
    if (el) {
      const rect = el.getBoundingClientRect();
      $activePos.set({ top: rect.top, left: rect.left });
      $activeProject.set(p);
    }
  };

  const handleProjectHover = (p: ProjectInfo | null) => {
    $hoveredProject.set(p);
  };

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.02,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
    },
  };

  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
      className="project-list"
    >
      {projects.map((p) => (
        <motion.li key={p.slug.current} variants={item}>
          <Link
            to={`/projects/${p.slug.current}`}
            className="cursor-pointer h-full w-fit block"
            onClick={() => handleProjectClick(p)}
            // viewTransition
          >
            <motion.div
              // whileHover={{
              //   color: "var(--color-fangchunjia-pink)",
              //   mixBlendMode: "normal",
              //   backgroundColor: "white",
              //   transition: { duration: 0.1 },
              // }}
              ref={(el) => {
                if (el) projectListItemRefs.current.set(p.title, el);
              }}
              className="group flex gap-2 active:text-fangchunjia-pink font-medium mb-0 py-0 [mix-blend-mode:difference]"
              onMouseEnter={
                isNotTouchDevice ? () => handleProjectHover(p) : undefined
              }
              onMouseLeave={
                isNotTouchDevice ? () => handleProjectHover(null) : undefined
              }
            >
              <div className="group-hover:bg-white w-fit group-hover:text-fangchunjia-pink transition duration-800">
                <span className="block px-1 -ml-1 leading-[22px]">
                  {p.title}
                </span>
              </div>
              {p.subtitle && (
                <div className="opacity-0 group-hover:opacity-100 group-hover:bg-white group-hover:text-fangchunjia-pink transition duration-800">
                  <span className="block px-1 leading-[22px]">
                    {p.subtitle}
                  </span>
                </div>
              )}
            </motion.div>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}
