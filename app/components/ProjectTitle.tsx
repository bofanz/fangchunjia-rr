import { useStore } from "@nanostores/react";
import { motion } from "motion/react";
import { useLocation, useMatches } from "react-router";
import { $activePos, $activeProject } from "~/stores/ui";

const DETAIL_LANDING = { top: 112, left: 32 };
const PINK = "#ff008f";

export default function ProjectTitle() {
  const location = useLocation();
  const matches = useMatches();
  const activePos = useStore($activePos);
  const activeProject = useStore($activeProject);

  const isDetailPage =
    location.pathname.startsWith("/projects/") &&
    location.pathname !== "/projects";

  const detailMatch = matches.find(
    (m) => m.id === "routes/_layout.projects.$slug",
  );
  const routeTitle = (detailMatch?.data as any)?.project?.title as
    | string
    | undefined;

  const title = activeProject?.title ?? routeTitle;

  if (!title) return null;
  if (!isDetailPage && !activePos) return null;

  const targetPos = activePos
    ? { top: activePos!.top, left: activePos!.left }
    : DETAIL_LANDING;

  const hasListOrigin = !!activePos;

  return (
    <motion.div
      initial={{
        top: hasListOrigin ? activePos!.top : DETAIL_LANDING.top,
        left: hasListOrigin ? activePos!.left : DETAIL_LANDING.left,
        color: hasListOrigin ? PINK : "#000000",
        opacity: 1,
      }}
      animate={{
        top: targetPos.top,
        left: targetPos.left,
        color: PINK,
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
      style={{ position: "fixed", zIndex: 50, pointerEvents: "none" }}
      className="project-title font-medium mb-0 py-0"
    >
      <h1>{title}</h1>
    </motion.div>
  );
}
