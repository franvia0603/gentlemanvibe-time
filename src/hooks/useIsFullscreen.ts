"use client";

import { useEffect, useState } from "react";

interface FullscreenCapableDocument extends Document {
  webkitFullscreenElement?: Element | null;
}

function isFullscreenActive() {
  const doc = document as FullscreenCapableDocument;
  return Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);
}

/** 현재 문서가 풀스크린 상태인지 추적한다 (Safari webkit 접두사 포함). */
export function useIsFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(isFullscreenActive());
    handleChange();
    document.addEventListener("fullscreenchange", handleChange);
    document.addEventListener("webkitfullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      document.removeEventListener("webkitfullscreenchange", handleChange);
    };
  }, []);

  return isFullscreen;
}
