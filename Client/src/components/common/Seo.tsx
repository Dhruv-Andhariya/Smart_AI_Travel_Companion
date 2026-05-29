import { useEffect } from "react";
import { appDescription, siteName } from "@/lib/constants";

type SeoProps = {
  title?: string;
  description?: string;
};

export function Seo({ title, description = appDescription }: SeoProps) {
  useEffect(() => {
    document.title = title ? `${title} · ${siteName}` : siteName;

    const ensureMeta = (name: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = name;
        document.head.appendChild(tag);
      }
      return tag;
    };

    ensureMeta("description").content = description;
    ensureMeta("theme-color").content = "#0b1120";
  }, [title, description]);

  return null;
}