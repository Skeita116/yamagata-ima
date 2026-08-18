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
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

        <Link
          href="/"
          className="text-sm font-bold text-sky-600 transition hover:text-sky-800"
        >
          ← 山形ライブマップへ戻る
        </Link>

        <section className="mt-8">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
            CATEGORY
          </p>

          <h1 className="mt-2 text-3xl font-black leading-tight text-slate-900 sm:text-5xl">
            山形県の{decodedCategory}ライブカメラ
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            山形県内の{decodedCategory}に関するライブカメラを一覧で確認できます。
            現地の天気や混雑状況、お出かけ前の様子確認にご利用ください。
          </p>
        </section>

        <section className="mt-8 grid gap-3 sm:max-w-xl sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400">
              掲載カメラ
            </p>

            <p className="mt-2 text-3xl font-black text-slate-900">
              {cameras.length}
              <span className="ml-1 text-sm font-bold text-slate-400">
                地点
              </span>
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400">
              掲載エリア
            </p>

            <p className="mt-2 text-3xl font-black text-slate-900">
              {cities.length}
              <span className="ml-1 text-sm font-bold text-slate-400">
                市町村
              </span>
            </p>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
              LIVE CAMERAS
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-900">
              {decodedCategory}ライブカメラ一覧
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cameras.map((camera) => {
              const thumbnailUrl = camera.youtube_id
                ? `https://img.youtube.com/vi/${camera.youtube_id}/hqdefault.jpg`
                : null;

              return (
                <article
                  key={camera.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-video bg-slate-200">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={camera.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        サムネイル準備中
                      </div>
                    )}

                    {camera.stream_url && (
                      <span className="absolute left-3 top-3 rounded-md bg-red-600 px-2 py-1 text-xs font-black text-white">
                        LIVE
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                        {camera.category}
                      </span>

                      <Link
                        href={`/area/${encodeURIComponent(
                          camera.city
                        )}`}
                        className="text-xs font-bold text-slate-400 transition hover:text-sky-600"
                      >
                        📍 {camera.city}
                      </Link>
                    </div>

                    <h2 className="text-lg font-black leading-7 text-slate-900">
                      {camera.name}
                    </h2>

                    {camera.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {camera.description}
                      </p>
                    )}

                    <Link
                      href={`/camera/${camera.id}`}
                      className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-sky-600"
                    >
                      詳細を見る →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-slate-900 p-6 text-white sm:p-8">
          <p className="text-sm font-bold text-sky-300">
            やまがたいま
          </p>

          <h2 className="mt-2 text-2xl font-black">
            山形県内のライブカメラを探す
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-300">
            山形県内の観光地・温泉・空港・スキー場などのライブカメラを地図から探せます。
          </p>

          <Link
            href="/"
            className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-900"
          >
            山形ライブマップを見る →
          </Link>
        </section>

      </div>
    </main>
  );
}