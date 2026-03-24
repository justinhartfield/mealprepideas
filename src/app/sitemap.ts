import type { MetadataRoute } from "next";
import { getAllRecipes } from "@/data/recipe-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mealprepideas.netlify.app";
  const now = new Date().toISOString();
  const recipes = getAllRecipes();

  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
  ];

  for (const recipe of recipes) {
    entries.push({
      url: `${baseUrl}/recipe/${recipe.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}
