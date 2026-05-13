import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { Outlet } from "react-router";
import Background from "~/components/Background";
import Header from "~/components/Header";
import Purikura from "~/components/Purikura";
import Quote from "~/components/Quote";

export default function Layout({ pathname }: { pathname: string }) {
  const [isPurikuraVisible, setIsPurikuraVisible] = useState<boolean>(false);
  const navItems = [
    { title: "Home", to: "/home", id: "home" },
    { title: "About", to: "/about", id: "about" },
    {
      title: "Projects",
      to: "/projects",
      id: "projects",
    },
  ];
  return (
    <>
      <Header
        navItems={navItems}
        pathname={pathname}
        onClickBranding={() => setIsPurikuraVisible(!isPurikuraVisible)}
      />
      {isPurikuraVisible && <Purikura />}
      <Quote />
      {/* <Background /> */}
      <main
        className="w-full h-full"
        // style={{ viewTransitionName: "page-content" }}
      >
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>
    </>
  );
}
