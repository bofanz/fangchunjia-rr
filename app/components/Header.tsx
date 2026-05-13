import Branding from "./Branding";
import Nav from "./Nav";

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
  return (
    <div className="fixed z-300 hidden sm:flex">
      <div
        onClick={() => {
          onClickBranding();
        }}
      >
        <Branding />
      </div>
      <Nav items={navItems} pathname={pathname} />
    </div>
  );
}
