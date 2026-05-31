// app/components/VimeoPlayer.tsx
import { useEffect, useRef } from "react";
import Player from "@vimeo/player";

type VimeoOptions = NonNullable<ConstructorParameters<typeof Player>[1]>;

type VimeoPlayerProps = {
  videoId: number | string;
  options?: Omit<VimeoOptions, "id" | "url">;
  onReady?: (player: Player) => void;
};

export default function VimeoPlayer({
  videoId,
  options,
  onReady,
}: VimeoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const player = new Player(containerRef.current, {
      id: Number(videoId),
      responsive: true, // fills the container width, keeps aspect ratio
      ...options,
    });

    playerRef.current = player;
    if (onReady) player.ready().then(() => onReady(player));

    // Cleanup also covers React 18 StrictMode's double-invoke in dev
    return () => {
      player.destroy();
      playerRef.current = null;
    };
    // re-create the player only when the video changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  return <div ref={containerRef} />;
}
