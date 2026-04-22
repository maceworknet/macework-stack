"use client";

import { useState } from "react";

export function MediaDimensions({ src }: { src: string }) {
  const [dimensions, setDimensions] = useState("");

  if (!src) return <span>Ölçü yok</span>;

  return (
    <>
      <img
        src={src}
        alt=""
        className="hidden"
        onLoad={(event) => {
          const image = event.currentTarget;
          setDimensions(`${image.naturalWidth} x ${image.naturalHeight}`);
        }}
      />
      <span>{dimensions || "Ölçülüyor"}</span>
    </>
  );
}
