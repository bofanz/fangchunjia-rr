import { AnimatePresence, motion } from "motion/react";
import Branding from "./Branding";
import Nav from "./Nav";
import { useLocation } from "react-router";

export interface NavItem {
  title: string;
  id: string;
  to: string;
}

export default function Header({
  navItems,
  onClickBranding,
  pathname,
}: {
  navItems: NavItem[];
  onClickBranding: Function;
  pathname: string;
}) {
  const location = useLocation();
  const initialPosition = navItems.findIndex((e) => location.pathname === e.to);

  return (
    <div
      className="fixed z-300 flex"
      style={{ viewTransitionName: "site-header" }}
    >
      <div
        onClick={() => {
          onClickBranding();
        }}
      >
        <Branding />
      </div>
      {/* <AnimatePresence>
        {initialPosition !== -1 && (
          <motion.div
            className=""
            key="nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1 } }}
            exit={{ opacity: 0 }}
          >
            
          </motion.div>
        )}
      </AnimatePresence> */}
      <Nav items={navItems} pathname={pathname} />
    </div>
  );
}
