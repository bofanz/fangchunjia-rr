import { Link } from "react-router";

export default function Close({ color }: { color?: string }) {
  return (
    <Link
      // TODO
      to={"/projects"}
      relative="path"
      viewTransition
      className="cursor-pointer transition text-sm font-medium"
      style={{ color: color }}
    >
      (back)
    </Link>
  );
}
