import { useEffect, useRef } from "react";
import Player from "@vimeo/player";

export function VimeoPlayer({ url }) {
  const ref = useRef(null);

  useEffect(() => {
    const videoId = url.split("/").pop();

    const player = new Player(ref.current, {
      id: videoId,
      width: 640,
    });

    player.on("play", () => {
    });

    return () => player.destroy();
  }, [url]);

  return <div ref={ref} />;
}