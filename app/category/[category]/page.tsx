import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const siteUrl = "https://yamagata-ima.vercel.app";

type Camera = {
  id: number;
  name: string;
  city: string;
  stream_url: string | null;
  youtube_id: string | null;
  latitude: number;
  longitude: number;
  category: string;
  description?: string | null;
};

async function getCamerasByCategory(category: string) {
  const decodedCategory = decodeURIComponent(category);

  const { data, error } = await supabase
    .from("cameras")
    .select("*")
    .eq("category", decodedCategory)
    .order("id", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as Camera[];
}

function getCategoryIcon(category: string) {
  if (category.includes("温泉")) return "♨️";
  if (category.includes("スキー")) return "❄️";
  if (category.includes("空港")) return "✈️";
  if (category.includes("観光")) return "🏔️";
  if (category.includes("道路")) return "🚗";

  return "📷";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  const cameras = await getCamerasByCategory(category);

  const pageUrl = `${siteUrl}/category/${encodeURIComponent(
    decodedCategory
  )}`;

  const title =
    `山形県の${decodedCategory}ライブカメラ一覧｜やまがたいま`;

  const description =
    `山形県内の${decodedCategory}ライブカメラを一覧で確認できます。現在の天気や現地の様子、観光やお出かけ前の状況確認にご利用ください。`;

  if (cameras.length === 0) {
    return {
      title,
      description,
    };
  }

  return {
    title,
    description,

    alternates: {
      canonical: pageUrl,
    },

    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "やまがたいま",
      type: "website",
      locale: "ja_JP",

      images: [
        {
          url: `${siteUrl}/ogp.png?v=2`,
          width: 1200,
          height: 630,
          alt: `山形県の${decodedCategory}ライブカメラ｜やまがたいま`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/ogp.png?v=2`],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  const cameras = await getCamerasByCategory(category);

  if (cameras.length === 0) {
    notFound();
  }

  const cities = Array.from(
    new Set(cameras.map((camera) => camera.city))
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white">

        <div className="absolute inset-0 bg-gradient-to-br from-sky-700/40 via-slate-950 to-slate-950" />

        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-black text-sky-300 transition hover:text-white"
          >
            ← 山形ライブマップへ戻る
          </Link>

          <div className="mt-8 max-w-3xl">

            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-2xl">
                {getCategoryIcon(decodedCategory)}
              </span>

              <p className="text-xs font-black tracking-[0.2em] text-sky-300">
                CATEGORY
              </p>
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
              山形県の
              <span className="text-sky-300">
                {decodedCategory}
              </span>
              <br className="sm:hidden" />
              ライブカメラ
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              山形県内の{decodedCategory}に関するライブカメラをまとめてチェック。
              現地の天気・混雑状況・お出かけ前の様子確認にご利用ください。
            </p>

            <div className="mt-8 flex gap-8">

              <div>
                <p className="text-3xl font-black">
                  {cameras.length}
                </p>

                <p className="mt-1 text-[10px] font-black tracking-widest text-slate-400">
                  LIVE CAMERAS
                </p>
              </div>

              <div className="h-12 w-px bg-white/15" />

              <div>
                <p className="text-3xl font-black">
                  {cities.length}
                </p>

                <p className="mt-1 text-[10px] font-black tracking-widest text-slate-400">
                  AREAS
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* CONTENT */}
      <section className="relative">

        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sky-50 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">

          {/* AREA LINKS */}
          <section>

            <p className="text-xs font-black tracking-[0.2em] text-sky-600">
              AREA
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              エリアから探す
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {decodedCategory}ライブカメラがある市町村から探せます。
            </p>

            <div className="mt-5 flex flex-wrap gap-2">

              {cities.map((city) => (
                <Link
                  key={city}
                  href={`/area/${encodeURIComponent(city)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-600 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                >
                  📍 {city}
                </Link>
              ))}

            </div>

          </section>


          {/* CAMERA LIST */}
          <section className="mt-14">

            <div className="mb-7">

              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-100">
                  📹
                </span>

                <p className="text-xs font-black tracking-[0.2em] text-red-500">
                  LIVE CAMERAS
                </p>
              </div>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                {decodedCategory}ライブカメラ一覧
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {cameras.length}地点のライブカメラを掲載しています。
              </p>

            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {cameras.map((camera) => {
                const thumbnailUrl =
                  camera.youtube_id
                    ? `https://img.youtube.com/vi/${camera.youtube_id}/hqdefault.jpg`
                    : null;

                return (
                  <article
                    key={camera.id}
                    className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl"
                  >

                    {/* THUMBNAIL */}
                    <Link
                      href={`/camera/${camera.id}`}
                      className="relative block aspect-video overflow-hidden bg-slate-200"
                    >

                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={camera.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-100 to-slate-200 text-4xl">
                          📷
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

                      {camera.stream_url && (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-[10px] font-black text-white shadow-lg">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                          </span>

                          LIVE
                        </span>
                      )}

                    </Link>


                    {/* BODY */}
                    <div className="p-5">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-[11px] font-black text-sky-700">
                          {getCategoryIcon(camera.category)}
                          {camera.category}
                        </span>

                        <Link
                          href={`/area/${encodeURIComponent(camera.city)}`}
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-500 transition hover:bg-slate-200"
                        >
                          📍 {camera.city}
                        </Link>

                      </div>

                      <Link href={`/camera/${camera.id}`}>
                        <h3 className="mt-4 text-lg font-black leading-7 text-slate-900 transition group-hover:text-sky-600">
                          {camera.name}
                        </h3>
                      </Link>

                      {camera.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                          {camera.description}
                        </p>
                      )}

                      <Link
                        href={`/camera/${camera.id}`}
                        className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-black text-white transition hover:bg-sky-600"
                      >
                        カメラを見る →
                      </Link>

                    </div>
                  </article>
                );
              })}

            </div>

          </section>


          {/* BACK TO MAP */}
          <section className="mt-16 rounded-[30px] bg-slate-950 p-7 text-white sm:p-10">

            <p className="text-xs font-black tracking-[0.2em] text-sky-300">
              YAMAGATA LIVE MAP
            </p>

            <h2 className="mt-3 text-3xl font-black">
              山形県全体から探す
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              他のカテゴリや市町村も、山形ライブマップから探せます。
            </p>

            <Link
              href="/#live-map"
              className="mt-6 inline-flex rounded-2xl bg-sky-500 px-5 py-3.5 text-sm font-black transition hover:bg-sky-400"
            >
              📍 ライブマップを見る →
            </Link>

          </section>

        </div>

      </section>

    </main>
  );
}