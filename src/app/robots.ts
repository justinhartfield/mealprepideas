import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/api/", "/_next/"],
      },
      { userAgent: "GPTBot", allow: ["/"] },
      { userAgent: "ClaudeBot", allow: ["/"] },
      { userAgent: "PerplexityBot", allow: ["/"] },
    ],
    sitemap: "https://mealprepideas.netlify.app/sitemap.xml",
  };
}
