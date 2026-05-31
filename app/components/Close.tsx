import { Link } from "react-router";
import XGraphic from "./graphics/XGraphic";

export default function Close({ color }: { color: string }) {
  return (
    <div className="fixed top-0 right-0 p-4">
      <Link
        to={".."}
        relative="path"
        viewTransition
        className="cursor-pointer hover:text-fangchunjia-pink transition"
        style={{ color: color }}
      >
        <XGraphic />
      </Link>
    </div>
  );
}
