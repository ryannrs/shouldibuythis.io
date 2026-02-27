import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/access", "/analyze", "/results"],
    },
    sitemap: "https://shouldibuythis.io/sitemap.xml",
  };
}
