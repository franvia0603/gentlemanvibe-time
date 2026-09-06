import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/pomodoro", priority: 0.8 },
  { path: "/stopwatch", priority: 0.8 },
  { path: "/timer", priority: 0.8 },
  { path: "/world", priority: 0.8 },
  { path: "/about", priority: 0.5 },
  { path: "/privacy-policy", priority: 0.3 },
  { path: "/contact", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
