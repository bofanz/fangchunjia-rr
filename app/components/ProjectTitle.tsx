import { useStore } from "@nanostores/react";
import { motion } from "motion/react";
import { useLocation, useRouteLoaderData } from "react-router";
import { $activePos, $activeProject } from "~/stores/ui";
import type { loader as slugLoader } from "~/routes/_layout.projects.$slug";
import type { ProjectInfo } from "~/types";

const DETAIL_LANDING = { top: 112, left: 32 };

export default function ProjectTitle({ project }: { project: ProjectInfo }) {
  const location = useLocation();
  const activePos = useStore($activePos);
  const activeProject = useStore($activeProject);
  // const slugData = useRouteLoaderData<typeof slugLoader>(
  //   "routes/_layout.projects.$slug",
  // );

  const isDetailPage =
    location.pathname.startsWith("/projects/") &&
    location.pathname !== "/projects";

  // const title = activeProject?.title ?? slugData?.project?.title;

  // if (!title) return null;
  // if (!isDetailPage && !activePos) return null;

  const targetPos = activePos
    ? { top: activePos!.top, left: activePos!.left }
    : DETAIL_LANDING;

  const hasListOrigin = !!activePos;

  return (
    <motion.div
      initial={{
        top: hasListOrigin ? activePos!.top : DETAIL_LANDING.top,
        left: hasListOrigin ? activePos!.left : DETAIL_LANDING.left,
        // color: hasListOrigin ? PINK : "#000000",
        opacity: 1,
      }}
      animate={{
        top: targetPos.top,
        left: targetPos.left,
        // color: PINK,
        opacity: isDetailPage ? 1 : 0,
      }}
      transition={{
        top: { duration: 0.55, ease: [0.76, 0, 0.24, 1] },
        left: { duration: 0.55, ease: [0.76, 0, 0.24, 1] },
        color: { duration: 0.55, ease: [0.76, 0, 0.24, 1] },
        opacity: {
          duration: 0.3,
          ease: "easeOut",
          delay: isDetailPage ? 0 : 0.4,
        },
      }}
      style={{
        position: "fixed",
        zIndex: 50,
        pointerEvents: "none",
        viewTransitionName: "project-title",
      }}
      className="[text-shadow:0_0_2px_#DABBFF80] text-[#DABBFF] font-medium text-2xl mb-0 py-0 blur-[2px]"
    >
      <h1>{project.title}</h1>
    </motion.div>
  );
}
