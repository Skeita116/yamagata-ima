"use client";

import { useMemo, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Map from "./Map";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

type CameraExplorerProps = {
  cameras: Camera[];
};

export default function CameraExplorer({
  cameras,
}: CameraExplorerProps) {
  const [selectedCategory, setSelectedCategory] =
    useState("すべて");

  const [searchText, setSearchText] =
    useState("");

  const categories = useMemo(() => {
    const values = cameras
      .map((camera) => camera.category)
      .filter(Boolean);

    return [
      "すべて",
      ...Array.from(new Set(values)),
    ];
  }, [cameras]);

  const filteredCameras = useMemo(() => {
    const keyword = searchText
      .trim()
      .toLowerCase();

    return cameras.filter((camera) => {
      const categoryMatch =
        selectedCategory === "すべて" ||
        camera.category === selectedCategory;

      const searchMatch =
        keyword === "" ||
        camera.name
          ?.toLowerCase()
          .includes(keyword) ||
        camera.city
          ?.toLowerCase()
          .includes(keyword) ||
        camera.category
          ?.toLowerCase()
          .includes(keyword);

      return categoryMatch && searchMatch;
    });
  }, [
    cameras,
    selectedCategory,
    searchText,
  ]);

  const recordCameraClick = async (
    camera: Camera
  ) => {
    // GA4へ送信
    sendGAEvent(
      "event",
      "camera_click",
      {
        camera_name: camera.name,
        city: camera.city,
        category: camera.category,
        camera_id: camera.id,
      }
    );

    // Supabaseへ保存
    const { error } = await supabase
      .from("camera_clicks")
      .insert({
        camera_id: camera.id,
        camera_name: camera.name,
        city: camera.city,
        category: camera.category,
      });

    if (error) {
      console.error(
        "camera_clicks insert error:",
        error
      );
    }
  };

  return (
    <>
      {/* 検索 */}
      <section
        id="search"
        className="mb-6 scroll-mt-28"
      >
        <label
          htmlFor="camera-search"
          className="mb-2 block text-sm font-bold text-slate-700"
        >
          ライブカメラを探す
        </label>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>

          <input
            id="camera-search"
            type="text"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            placeholder="市町村・観光地・カメラ名で検索"
            className="
              w-full
              rounded-2xl
              border
              border-slate-200
              bg-white
              py-4
              pl-12
              pr-4
              text-sm
              outline-none
              transition
              focus:border-sky-400
              focus:ring-4
              focus:ring-sky-100
            "
          />
        </div>
      </section>

      {/* カテゴリ絞り込み */}
      <section className="mb-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-sky-600">
          CATEGORY
        </p>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const active =
              selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={
                  active
                    ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-sm"
                    : "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-sky-400 hover:text-sky-600"
                }
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      {/* 地図 */}
      <section
        id="live-map"
        className="scroll-mt-28"
      >
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
              LIVE MAP
            </p>

            <h2 className="mt-1 text-2xl font-black">
              山形ライブマップ
            </h2>
          </div>

          <div className="rounded-full bg-white px-3 py-1.5 text-sm font-bold text-slate-600 shadow-sm">
            {filteredCameras.length}地点
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <Map cameras={filteredCameras} />
        </div>
      </section>

      {/* カメラ一覧 */}
      <section
        id="live-cameras"
        className="mt-14 scroll-mt-28"
      >
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
            LIVE CAMERAS
          </p>

          <h2 className="mt-1 text-2xl font-black">
            ライブカメラ一覧
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            条件に一致する
            {filteredCameras.length}
            件のライブカメラを表示しています。
          </p>
        </div>

        {filteredCameras.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-lg font-bold text-slate-700">
              カメラが見つかりませんでした
            </p>

            <p className="mt-2 text-sm text-slate-500">
              検索条件を変更してみてください。
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchText("");
                setSelectedCategory("すべて");
              }}
              className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
            >
              条件をリセット
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCameras.map((camera) => {
              const thumbnailUrl =
                camera.youtube_id
                  ? `https://img.youtube.com/vi/${camera.youtube_id}/hqdefault.jpg`
                  : null;

              return (
                <article
                  key={camera.id}
                  className="
                    group
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    transition
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                >
                  {/* サムネイル */}
                  <div className="relative aspect-video bg-slate-200">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={camera.name}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition
                          duration-300
                          group-hover:scale-105
                        "
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        サムネイル準備中
                      </div>
                    )}

                    {camera.stream_url && (
                      <span className="absolute left-3 top-3 rounded-md bg-red-600 px-2 py-1 text-xs font-black text-white shadow">
                        LIVE
                      </span>
                    )}
                  </div>

                  {/* カード本文 */}
                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      {/* カテゴリ */}
                      <Link
                        href={`/category/${encodeURIComponent(
                          camera.category
                        )}`}
                        className="
                          rounded-full
                          bg-sky-50
                          px-3
                          py-1
                          text-xs
                          font-bold
                          text-sky-700
                          transition
                          hover:bg-sky-100
                        "
                      >
                        {camera.category}
                      </Link>

                      {/* 市町村 */}
                      <Link
                        href={`/area/${encodeURIComponent(
                          camera.city
                        )}`}
                        className="
                          text-xs
                          font-medium
                          text-slate-400
                          transition
                          hover:text-sky-600
                        "
                      >
                        📍 {camera.city}
                      </Link>
                    </div>

                    <h3 className="text-lg font-black leading-7 text-slate-900">
                      {camera.name}
                    </h3>

                    {camera.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {camera.description}
                      </p>
                    )}

                    {/* 詳細 */}
                    <Link
                      href={`/camera/${camera.id}`}
                      className="
                        mt-5
                        inline-flex
                        w-full
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-3
                        text-sm
                        font-bold
                        text-slate-700
                        transition
                        hover:border-sky-400
                        hover:text-sky-600
                      "
                    >
                      詳細を見る
                      <span className="ml-2">
                        →
                      </span>
                    </Link>

                    {/* 市町村一覧 */}
                    <Link
                      href={`/area/${encodeURIComponent(
                        camera.city
                      )}`}
                      className="
                        mt-2
                        inline-flex
                        w-full
                        items-center
                        justify-center
                        rounded-xl
                        bg-sky-50
                        px-4
                        py-3
                        text-sm
                        font-bold
                        text-sky-700
                        transition
                        hover:bg-sky-100
                      "
                    >
                      {camera.city}のカメラ一覧を見る
                      <span className="ml-2">
                        →
                      </span>
                    </Link>

                    {/* カテゴリ一覧 */}
                    <Link
                      href={`/category/${encodeURIComponent(
                        camera.category
                      )}`}
                      className="
                        mt-2
                        inline-flex
                        w-full
                        items-center
                        justify-center
                        rounded-xl
                        bg-emerald-50
                        px-4
                        py-3
                        text-sm
                        font-bold
                        text-emerald-700
                        transition
                        hover:bg-emerald-100
                      "
                    >
                      {camera.category}のカメラ一覧を見る
                      <span className="ml-2">
                        →
                      </span>
                    </Link>

                    {/* ライブ映像 */}
                    {camera.stream_url ? (
                      <a
                        href={camera.stream_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          void recordCameraClick(
                            camera
                          );
                        }}
                        className="
                          mt-2
                          inline-flex
                          w-full
                          items-center
                          justify-center
                          rounded-xl
                          bg-slate-900
                          px-4
                          py-3
                          text-sm
                          font-bold
                          text-white
                          transition
                          hover:bg-sky-600
                        "
                      >
                        ▶ ライブ映像を見る
                      </a>
                    ) : (
                      <div className="mt-2 rounded-xl bg-slate-100 px-4 py-3 text-center text-sm text-slate-400">
                        配信URL準備中
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}