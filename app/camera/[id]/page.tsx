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

async function getCamera(id: string) {
  const { data, error } = await supabase
    .from("cameras")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Camera;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const camera = await getCamera(id);

  if (!camera) {
    return {
      title: "ライブカメラが見つかりません｜やまがたいま",
    };
  }

  const pageUrl = `${siteUrl}/camera/${camera.id}`;

  const title =
    `${camera.name}｜${camera.city}の現在の様子｜やまがたいま`;

  const description =
    camera.description ||
    `${camera.city}にある「${camera.name}」のライブカメラです。山形県内の現在の天気や現地の様子をライブ映像で確認できます。`;

  const ogImage = camera.youtube_id
    ? `https://img.youtube.com/vi/${camera.youtube_id}/maxresdefault.jpg`
    : `${siteUrl}/ogp.png?v=2`;

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
          url: ogImage,
          alt: `${camera.name}｜やまがたいま`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CameraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const camera = await getCamera(id);

  if (!camera) {
    notFound();
  }

  const thumbnailUrl = camera.youtube_id
    ? `https://img.youtube.com/vi/${camera.youtube_id}/hqdefault.jpg`
    : null;

  const pageUrl = `${siteUrl}/camera/${camera.id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: camera.name,
    description:
      camera.description ||
      `${camera.city}の現在の様子を確認できるライブカメラページです。`,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "やまがたいま",
      url: siteUrl,
    },
    about: {
      "@type": "Place",
      name: camera.city,
      geo: {
        "@type": "GeoCoordinates",
        latitude: camera.latitude,
        longitude: camera.longitude,
      },
    },
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white">

        {thumbnailUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{
              backgroundImage: `url("${thumbnailUrl}")`,
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-black text-sky-300 transition hover:text-white"
          >
            ← 山形ライブマップへ戻る
          </Link>

          <div className="mt-8 max-w-3xl">

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/category/${encodeURIComponent(
                  camera.category
                )}`}
                className="rounded-full bg-sky-500 px-3 py-1.5 text-xs font-black text-white"
              >
                {camera.category}
              </Link>

              <Link
                href={`/area/${encodeURIComponent(
                  camera.city
                )}`}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black text-slate-200 backdrop-blur"
              >
                📍 {camera.city}
              </Link>
            </div>

            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              {camera.name}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              {camera.city}の現在の様子をライブカメラで確認できます。
              お出かけ前の天候や現地状況のチェックにご利用ください。
            </p>

          </div>

        </div>
      </section>


      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">

        {/* LIVE VIEW */}
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black tracking-[0.2em] text-red-500">
                LIVE VIEW
              </p>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                現在の様子
              </h2>
            </div>

            {camera.stream_url && (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-black text-red-600">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>

                LIVE
              </span>
            )}
          </div>

          <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-slate-950 shadow-xl shadow-slate-900/10">

            <div className="relative aspect-video">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={`${camera.name}のライブカメラ`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-900 to-slate-950 text-5xl">
                  📷
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

              {camera.stream_url && (
                <a
                  href={camera.stream_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/95 text-2xl text-slate-950 shadow-2xl transition hover:scale-110 hover:bg-sky-400">
                    ▶
                  </span>
                </a>
              )}

            </div>

            {camera.stream_url ? (
              <div className="p-4 sm:p-5">
                <a
                  href={camera.stream_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-4 text-base font-black text-white transition hover:bg-sky-400"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs">
                    ▶
                  </span>

                  ライブ映像を見る
                </a>
              </div>
            ) : (
              <div className="p-5 text-center text-sm font-bold text-slate-400">
                現在ライブ映像のURLを準備中です
              </div>
            )}

          </div>
        </section>


        {/* INFO */}
        <section className="mt-14 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <p className="text-xs font-black tracking-[0.2em] text-sky-600">
              CAMERA INFORMATION
            </p>

            <h2 className="mt-2 text-2xl font-black">
              ライブカメラ情報
            </h2>

            <div className="mt-6 divide-y divide-slate-100">

              <div className="grid grid-cols-3 gap-4 py-4">
                <span className="text-sm font-bold text-slate-400">
                  カメラ名
                </span>

                <span className="col-span-2 text-sm font-black text-slate-700">
                  {camera.name}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4">
                <span className="text-sm font-bold text-slate-400">
                  エリア
                </span>

                <span className="col-span-2 text-sm font-black text-slate-700">
                  {camera.city}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4">
                <span className="text-sm font-bold text-slate-400">
                  カテゴリ
                </span>

                <span className="col-span-2 text-sm font-black text-slate-700">
                  {camera.category}
                </span>
              </div>

            </div>


            <div className="mt-7 rounded-2xl bg-slate-50 p-5">

              <h2 className="font-black text-slate-900">
                {camera.name}について
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                {camera.description ||
                  `${camera.name}は、${camera.city}周辺の現在の様子を確認できるライブカメラです。天候や現地の状況確認、観光やお出かけ前の参考としてご利用ください。`}
              </p>

            </div>

          </div>


          {/* RELATED LINKS */}
          <aside className="rounded-[28px] bg-slate-950 p-6 text-white sm:p-8">

            <p className="text-xs font-black tracking-[0.2em] text-sky-300">
              EXPLORE
            </p>

            <h2 className="mt-2 text-2xl font-black">
              もっと山形を探す
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              同じエリアやカテゴリのライブカメラもチェックできます。
            </p>

            <div className="mt-6 grid gap-3">

              <Link
                href={`/area/${encodeURIComponent(
                  camera.city
                )}`}
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-black transition hover:bg-white/10"
              >
                <span>
                  📍 {camera.city}のカメラ
                </span>

                <span className="text-sky-300 transition group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href={`/category/${encodeURIComponent(
                  camera.category
                )}`}
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-black transition hover:bg-white/10"
              >
                <span>
                  📷 {camera.category}のカメラ
                </span>

                <span className="text-sky-300 transition group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/#live-map"
                className="group flex items-center justify-between rounded-2xl bg-sky-500 px-4 py-4 text-sm font-black transition hover:bg-sky-400"
              >
                <span>
                  🗺️ 山形ライブマップ
                </span>

                <span className="transition group-hover:translate-x-1">
                  →
                </span>
              </Link>

            </div>

          </aside>

        </section>

      </div>
    </main>
  );
}