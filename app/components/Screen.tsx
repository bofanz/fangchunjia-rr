import { AnimatePresence, motion } from "motion/react";
import { urlFor } from "~/lib/sanity";
import VimeoPlayer from "./VimeoPlayer";
import type { ProjectInfo } from "~/routes/_layout.projects._index";

export default function Screen({
  item,
}: {
  item: Pick<ProjectInfo, "slug" | "cover"> | null;
}) {
  return (
    <div className="w-full h-full pointer-events-none relative">
      <AnimatePresence>
        {item?.cover.mediaType === "image" && item.cover.image?.asset?._ref && (
          <motion.img
            key={item.slug.current}
            src={urlFor(item.cover.image.asset._ref).url()}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
        {item?.cover.mediaType === "video" &&
          item.cover.vimeoId !== undefined && (
            <motion.div
              key={item.slug.current}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <VimeoPlayer
                videoId={item.cover.vimeoId}
                options={{ autoplay: true, background: true, preload: "auto" }}
              />
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
