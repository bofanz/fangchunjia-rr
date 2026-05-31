import { useEffect, useRef, useState } from "react";
import {
  Outlet,
  useLocation,
  useMatches,
  useRouteLoaderData,
} from "react-router";
import { useStore } from "@nanostores/react";
import { motion } from "motion/react";
import Gallery from "~/components/Gallery";
import { urlFor } from "~/lib/sanity";
import Header from "~/components/Header";
import ProjectTitle from "~/components/ProjectTitle";
import Purikura from "~/components/Purikura";
import Quote from "~/components/Quote";
import {
  $activePos,
  $activeProject,
  $hoveredProject,
  $scrollY,
} from "~/stores/ui";
import type {
  ProjectInfo,
  loader as projectsLoader,
} from "~/routes/_layout.projects._index";
import type { loader as projectLoader } from "~/routes/_layout.projects.$slug";
import Screen from "~/components/Screen";

export function ProjectsLayout() {
  const matches = useMatches();
  const isDetailPage = matches.some(
    (match) => match.id === "layout.projects.$slug",
  );
  // console.log(isDetailPage);
  // const projectsData = useRouteLoaderData<typeof projectsLoader>(
  //   "routes/_layout.projects._index",
  // );
  // const projects = projectsData?.projects;
  // const projectData = useRouteLoaderData<typeof projectLoader>(
  //   "routes/_layout.projects.$slug",
  // );
  // const project = projectData?.project;
  const galleryWrapperRef = useRef<HTMLDivElement>(null);
  const hoveredProject = useStore($hoveredProject);
  const activeProject = useStore($activeProject);

  // Scrolling of Gallery on /projects/$slug and restoring on /projects
  useEffect(() => {
    if (!isDetailPage) {
      if (galleryWrapperRef.current)
        galleryWrapperRef.current.style.transform = "";
      $scrollY.set(0);
      return;
    }
    return $scrollY.listen((y) => {
      if (!galleryWrapperRef.current) return;
      const maxTranslate = window.innerHeight - 32;
      galleryWrapperRef.current.style.transform = `translateY(-${Math.min(y, maxTranslate)}px)`;
    });
  }, [isDetailPage]);

  const onScreenProject = activeProject || hoveredProject || null;

  const displayItem = onScreenProject
    ? { slug: onScreenProject.slug, cover: onScreenProject.cover }
    : null;

  return (
    <>
      <motion.div
        ref={galleryWrapperRef}
        className="fixed top-0 left-0 right-0 overflow-hidden project-image"
        animate={{
          height: isDetailPage ? "calc(100dvh - 32px)" : "100dvh",
        }}
        transition={
          isDetailPage
            ? { duration: 1, delay: 0.5, ease: [0.76, 0, 0.24, 1] }
            : { duration: 0 }
        }
      >
        <Screen item={displayItem} />
      </motion.div>
    </>
  );
}
// 2. At /projects.$slug from /projects
// 3. At /projects.$slug directly
// 4. At /projects from /projects.$slug

export default function Layout({ pathname }: { pathname: string }) {
  const location = useLocation();
  // const isDetailPage = /^\/projects\/.+/.test(location.pathname);
  const activeProject = useStore($activeProject);
  const hoveredProject = useStore($hoveredProject);
  const galleryWrapperRef = useRef<HTMLDivElement>(null);
  const [isPurikuraVisible, setIsPurikuraVisible] = useState<boolean>(false);
  // const projectsData = useRouteLoaderData<typeof projectsLoader>(
  //   "routes/_layout.projects._index",
  // );
  // const projectData = useRouteLoaderData<typeof projectLoader>(
  //   "routes/_layout.projects.$slug",
  // );
  // const [cachedProjects, setCachedProjects] = useState(
  //   projectsData?.projects ?? null,
  // );

  // useEffect(() => {
  //   if (projectsData?.projects) {
  //     setCachedProjects(projectsData.projects);
  //   }
  // }, [projectsData?.projects]);

  // useEffect(() => {
  //   if (location.pathname === "/projects") {
  //     const timer = setTimeout(() => {
  //       $activeProject.set(null);
  //       $activePos.set(null);
  //     }, 650);
  //     return () => clearTimeout(timer);
  //   }
  //   if (!location.pathname.startsWith("/projects")) {
  //     $activeProject.set(null);
  //     $activePos.set(null);
  //   }
  // }, [location.pathname]);

  // useEffect(() => {
  //   if (!isDetailPage) {
  //     if (galleryWrapperRef.current)
  //       galleryWrapperRef.current.style.transform = "";
  //     $scrollY.set(0);
  //     return;
  //   }
  //   return $scrollY.listen((y) => {
  //     if (!galleryWrapperRef.current) return;
  //     const maxTranslate = window.innerHeight - 32;
  //     galleryWrapperRef.current.style.transform = `translateY(-${Math.min(y, maxTranslate)}px)`;
  //   });
  // }, [isDetailPage]);

  const navItems = [
    { title: "Home", to: "/home", id: "home" },
    { title: "About", to: "/about", id: "about" },
    { title: "Projects", to: "/projects", id: "projects" },
  ];

  return (
    <>
      {/* {cachedProjects ? (
        <>
          <motion.div
            ref={galleryWrapperRef}
            className="fixed top-0 left-0 right-0 overflow-hidden project-image"
            animate={{
              height:
                isDetailPage && activeProject
                  ? "calc(100dvh - 32px)"
                  : "100dvh",
            }}
            transition={
              isDetailPage && activeProject
                ? { duration: 1, delay: 0.5, ease: [0.76, 0, 0.24, 1] }
                : { duration: 0 }
            }
          >
            <Gallery
              items={cachedProjects.map((p) => ({
                id: p.slug.current,
                mediaType: p.cover.mediaType,
                ...(p.cover.mediaType === "image" && {
                  sanityRef: p.cover.asset?._ref,
                }),
                ...(p.cover.mediaType === "video" && {
                  vimeoId: p.cover.vimeoId,
                }),
              }))}
              showItem={(item) => item.id === hoveredProject?.slug.current}
            />
          </motion.div>
          <div className="">
            <ProjectTitle project={cachedProjects} />
          </div>
        </>
      ) : (
        <>
          <motion.div
            ref={galleryWrapperRef}
            className="fixed top-0 left-0 right-0 overflow-hidden project-image"
            animate={{
              height:
                isDetailPage && activeProject
                  ? "calc(100dvh - 32px)"
                  : "100dvh",
            }}
            transition={
              isDetailPage && activeProject
                ? { duration: 1, delay: 0.5, ease: [0.76, 0, 0.24, 1] }
                : { duration: 0 }
            }
          >
            <Gallery
              items={[
                {
                  id: projectData?.project.slug.current,
                  mediaType: projectData?.project.cover.mediaType,
                  ...(projectData?.project.cover.mediaType === "image" && {
                    sanityRef: projectData?.project.cover.asset._ref,
                  }),
                  ...(projectData?.project.cover.mediaType === "video" && {
                    vimeoId: projectData?.project.cover.vimeoId,
                  }),
                },
              ]}
              showItem={() => true}
            />
          </motion.div>
          <div className="">
            <ProjectTitle project={cachedProjects} />
          </div>
        </>
      )} */}
      <ProjectsLayout />
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
