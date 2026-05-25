import { Link } from "react-router";
import XGraphic from "./graphics/XGraphic";

export default function Close() {
  return (
    <div className="fixed top-0 right-0 p-4">
      <Link
        to={".."}
        relative="path"
        viewTransition
        className="cursor-pointer hover:text-fangchunjia-pink transition"
      >
        <XGraphic />
      </Link>
    </div>
  );
}
