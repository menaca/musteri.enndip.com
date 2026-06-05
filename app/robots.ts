import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = publicEnv.siteUrl.replace(/\/+$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Korumalı / kişiye özel akışlar dizinlenmez.
        disallow: ["/api/", "/account", "/my-listings", "/preferences", "/notifications", "/listing/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
