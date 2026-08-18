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
    ? `https://img.youtube.com/vi/${camera.youtube_id}/maxresdefault.jpg`
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
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="text-sm font-bold text-sky-600 transition hover:text-sky-800"
        >
          ← ライブカメラ一覧へ戻る
        </Link>

        <section className="mt-8">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
              {camera.category}
            </span>

            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 shadow-sm">
              📍 {camera.city}
            </span>
          </div>

          <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
            {camera.name}
          </h1>

          <p className="mt-3 text-slate-500">
            {camera.city}の現在の様子をライブカメラで確認できます。
          </p>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl bg-slate-200 shadow-sm">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={`${camera.name}のライブカメラ`}
              className="aspect-video w-full object-cover"
            />
          ) : (
            <div className="flex aspect-video items-center justify-center text-slate-400">
              ライブカメラ画像
            </div>
          )}
        </section>

        <section className="mt-6">
          {camera.stream_url ? (
            <a
              href={camera.stream_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-2xl bg-red-600 px-6 py-4 text-lg font-black text-white shadow-sm transition hover:bg-red-700"
            >
              ▶ ライブ映像を見る
            </a>
          ) : (
            <div className="rounded-2xl bg-slate-200 px-6 py-4 text-center font-bold text-slate-500">
              現在ライブ映像のURLを準備中です
            </div>
          )}
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
            CAMERA INFORMATION
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-900">
            ライブカメラ情報
          </h2>

          <div className="mt-6 divide-y divide-slate-100">
            <div className="grid grid-cols-3 py-4">
              <span className="text-sm font-bold text-slate-400">
                カメラ名
              </span>

              <span className="col-span-2 text-sm font-bold text-slate-700">
                {camera.name}
              </span>
            </div>

            <div className="grid grid-cols-3 py-4">
              <span className="text-sm font-bold text-slate-400">
                エリア
              </span>

              <span className="col-span-2 text-sm font-bold text-slate-700">
                {camera.city}
              </span>
            </div>

            <div className="grid grid-cols-3 py-4">
              <span className="text-sm font-bold text-slate-400">
                カテゴリ
              </span>

              <span className="col-span-2 text-sm font-bold text-slate-700">
                {camera.category}
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <h2 className="font-black text-slate-900">
              {camera.name}について
            </h2>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
              {camera.description ||
                `${camera.name}は、${camera.city}周辺の現在の様子を確認できるライブカメラです。天候や現地の状況確認、観光やお出かけ前の参考としてご利用ください。`}
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-3xl bg-slate-900 p-6 text-white sm:p-8">
          <p className="text-sm font-bold text-sky-300">
            やまがたいま
          </p>

          <h2 className="mt-2 text-2xl font-black">
            山形の「いま」を見てみよう。
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-300">
            山形県内の観光地・空港・温泉・スキー場などのライブカメラを地図から探せるWebサービスです。
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