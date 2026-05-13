import { useStore } from "@nanostores/react";
import { $activePos, $activeProject } from "~/stores/ui";

export default function ProjectTitle() {
  const activePos = useStore($activePos);
  const activeProject = useStore($activeProject);

  return (
    <>
      {activeProject && activePos && (
        <div
          style={{
            position: "fixed",
            top: activePos.top,
            left: activePos.left,
          }}
          // onClick={() => history.back()}
          className="project-title flex gap-2 text-fangchunjia-pink font-medium mb-0 py-0"
        >
          <h1>{activeProject.title}</h1>
        </div>
      )}
    </>
  );
}
