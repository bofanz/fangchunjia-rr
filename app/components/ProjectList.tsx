import { motion, type Variants } from "motion/react";
import type { Category, ProjectInfo } from "../types";
import { useRef } from "react";
import { Link } from "react-router";
import { $activePos, $activeProject, $hoveredProject } from "~/stores/ui";

export default function ProjectList({
  projects,
  categories: _categories,
}: {
  projects: ProjectInfo[];
  categories: Category[];
}) {
  const projectListItemRefs = useRef<Map<string, HTMLElement>>(new Map());

  const handleProjectClick = (p: ProjectInfo) => {
    $activeProject.set(p);
    const el = projectListItemRefs.current.get(p.title);
    if (el) {
      const rect = el.getBoundingClientRect();
      $activePos.set({ top: rect.top, left: rect.left });
    }
  };

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
      onMouseLeave={() => $hoveredProject.set(null)}
    >
      {projects.map((p) => (
        <motion.li key={p.slug.current} variants={item}>
          <div
            className="relative group w-fit"
            onMouseEnter={() => $hoveredProject.set(p)}
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
                className="flex gap-2 active:text-fangchunjia-pink font-medium mb-0 py-0 [mix-blend-mode:difference]"
              >
                <div className="w-fit group-hover:text-fangchunjia-pink transition duration-800">
                  <span className="block px-1 -ml-1 leading-[22px]">
                    {p.title}
                  </span>
                </div>
                {p.subtitle && (
                  <div className="opacity-0 group-hover:opacity-100 group-hover:text-fangchunjia-pink transition duration-800">
                    <span className="block px-1 leading-[22px]">
                      {p.subtitle}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
