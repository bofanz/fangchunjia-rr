import { urlFor } from "~/lib/sanity";
import VimeoPlayer from "./VimeoPlayer";
import type { ProjectInfo } from "~/routes/_layout.projects._index";

export default function Screen({
  item,
}: {
  item: Pick<ProjectInfo, "slug" | "cover"> | null;
}) {
  if (!item) return null;
  return (
    <div className="w-full h-full pointer-events-none">
      {item.cover.mediaType === "image" && item.cover.image?.asset?._ref && (
        <img
          src={urlFor(item.cover.image.asset._ref).url()}
          className="w-full h-full object-cover"
        />
      )}
      {item.cover.mediaType === "video" && item.cover.vimeoId !== undefined && (
        <VimeoPlayer
          videoId={item.cover.vimeoId}
          options={{ autoplay: true, background: true }}
        />
      )}
    </div>
  );
}
