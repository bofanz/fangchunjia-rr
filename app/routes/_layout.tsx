import { useEffect, useState } from "react";
import { Outlet, useLocation, useRouteLoaderData } from "react-router";
import Gallery from "~/components/Gallery";
import Header from "~/components/Header";
import ProjectTitle from "~/components/ProjectTitle";
import Purikura from "~/components/Purikura";
import Quote from "~/components/Quote";
import { $activePos, $activeProject } from "~/stores/ui";
import type { loader as projectsLoader } from "~/routes/_layout.projects._index";

export default function Layout({ pathname }: { pathname: string }) {
  const location = useLocation();
  const [isPurikuraVisible, setIsPurikuraVisible] = useState<boolean>(false);
  const projectsData = useRouteLoaderData<typeof projectsLoader>(
    "routes/_layout.projects._index",
  );
  const [cachedProjects, setCachedProjects] = useState(
    projectsData?.projects ?? null,
  );

  useEffect(() => {
    if (projectsData?.projects) {
      setCachedProjects(projectsData.projects);
    }
  }, [projectsData?.projects]);

  useEffect(() => {
    if (location.pathname === "/projects") {
      const timer = setTimeout(() => {
        $activeProject.set(null);
        $activePos.set(null);
      }, 650);
      return () => clearTimeout(timer);
    }
    if (!location.pathname.startsWith("/projects")) {
      $activeProject.set(null);
      $activePos.set(null);
    }
  }, [location.pathname]);

  const navItems = [
    { title: "Home", to: "/home", id: "home" },
    { title: "About", to: "/about", id: "about" },
    { title: "Projects", to: "/projects", id: "projects" },
  ];

  return (
    <>
      {cachedProjects && (
        <>
          <div className="fixed top-0 bottom-0 left-0 right-0 project-image">
            <Gallery projects={cachedProjects} />
          </div>
          <div className="">
            <ProjectTitle project={cachedProjects} />
          </div>
        </>
      )}
      <Header
        navItems={navItems}
        pathname={pathname}
        onClickBranding={() => setIsPurikuraVisible(!isPurikuraVisible)}
      />
      {isPurikuraVisible && <Purikura />}
      <Quote />

      <main className="w-full h-full">
        <Outlet />
      </main>
    </>
  );
}
