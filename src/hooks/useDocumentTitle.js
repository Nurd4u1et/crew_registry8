import { useEffect } from "react";

export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Crew Registry` : "Crew Registry";
  }, [title]);
}

