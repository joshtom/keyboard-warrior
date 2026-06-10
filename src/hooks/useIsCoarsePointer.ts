import { useEffect, useState } from "react";

const coarsePointerQuery = "(pointer: coarse), (max-width: 767px)";

function readIsCoarsePointer() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(coarsePointerQuery).matches;
}

export function useIsCoarsePointer() {
  const [isCoarsePointer, setIsCoarsePointer] = useState(readIsCoarsePointer);

  useEffect(() => {
    const mediaQuery = window.matchMedia(coarsePointerQuery);
    const handleChange = () => setIsCoarsePointer(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isCoarsePointer;
}
