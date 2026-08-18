import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const siteUrl = "https://yamagata-ima.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: cameras } = await supabase
    .from("cameras")
    .select("id, city, created_at")
    .order("id", { ascending: true });

  const cameraPages: MetadataRoute.Sitemap =
    cameras?.map((camera) => ({
      url: `${siteUrl}/camera/${camera.id}`,
      lastModified: camera.created_at
        ? new Date(camera.created_at)
        : new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    })) ?? [];

  const cities = Array.from(
    new Set(
      cameras
        ?.map((camera) => camera.city)
        .filter(Boolean) ?? []
    )
  );

  const areaPages: MetadataRoute.Sitemap =
    cities.map((city) => ({
      url: `${siteUrl}/area/${encodeURIComponent(city)}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    ...cameraPages,

    ...areaPages,
  ];
}