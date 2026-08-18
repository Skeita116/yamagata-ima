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

function getCategoryIcon(category: string) {
  if (category.includes("温泉")) return "♨️";
  if (category.includes("スキー")) return "❄️";
  if (category.includes("空港")) return "✈️";
  if (category.includes("観光")) return "🏔️";
  if (category.includes("道路")) return "🚗";

  return "📷";
}

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
      {/* ========================================
          SEARCH
      ======================================== */}
      <section
        id="search"
        className="scroll-mt-28"
      >
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg shadow-slate-900/5">

          <div className="bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 p-6 text-white sm:p-8">

            <p className="text-xs font-black tracking-[0.2em] text-sky-100">
              FIND A CAMERA
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              山形の「いま」を探す
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-sky-100">
              市町村・観光地・カメラ名から、
              見たいライブカメラを検索できます。
            </p>

            {/* 検索 */}
            <div className="relative mt-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                🔍
              </span>

              <input
                id="camera-search"
                type="text"
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
                placeholder="例：蔵王、山形市、空港..."
                className="
                  w-full
                  rounded-2xl
                  border
                  border-white/20
                  bg-white
                  py-4
                  pl-12
                  pr-4
                  text-sm
                  font-medium
                  text-slate-900
                  shadow-xl
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:ring-4
                  focus:ring-white/20
                "
              />
            </div>

          </div>


          {/* カテゴリ */}
          <div className="p-5 sm:p-6">

            <div className="flex items-center justify-between gap-4">

              <div>
                <p className="text-xs font-black tracking-[0.18em] text-sky-600">
                  CATEGORY
                </p>

                <p className="mt-1 text-sm font-bold text-slate-500">
                  目的から絞り込む
                </p>
              </div>

              <div className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
                {filteredCameras.length}件
              </div>

            </div>

            <div className="mt-4 flex flex-wrap gap-2">

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
                        ? "inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-black text-white shadow-md"
                        : "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                    }
                  >
                    {category !== "すべて" && (
                      <span>
                        {getCategoryIcon(
                          category
                        )}
                      </span>
                    )}

                    {category}
                  </button>
                );
              })}

            </div>

          </div>

        </div>
      </section>


      {/* ========================================
          MAP
      ======================================== */}
      <section
        id="live-map"
        className="mt-16 scroll-mt-28"
      >
        <div className="mb-6 flex items-end justify-between gap-4">

          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100">
                📍
              </span>

              <p className="text-xs font-black tracking-[0.2em] text-sky-600">
                LIVE MAP
              </p>
            </div>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              山形ライブマップ
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              地図のピンから、現在のライブカメラを探せます。
            </p>
          </div>

          <div className="hidden rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white sm:block">
            {filteredCameras.length}地点
          </div>

        </div>

        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/5">

          <div className="overflow-hidden rounded-[24px]">
            <Map
              cameras={filteredCameras}
            />
          </div>

        </div>
      </section>


      {/* ========================================
          CAMERA LIST
      ======================================== */}
      <section
        id="live-cameras"
        className="mt-20 scroll-mt-28"
      >
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-100">
                📹
              </span>

              <p className="text-xs font-black tracking-[0.2em] text-red-500">
                LIVE CAMERAS
              </p>
            </div>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              ライブカメラ一覧
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              条件に一致する
              <span className="mx-1 font-black text-slate-900">
                {filteredCameras.length}
              </span>
              件を表示しています。
            </p>
          </div>

          {(searchText !== "" ||
            selectedCategory !==
              "すべて") && (
            <button
              type="button"
              onClick={() => {
                setSearchText("");
                setSelectedCategory(
                  "すべて"
                );
              }}
              className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 shadow-sm transition hover:bg-slate-100"
            >
              条件をリセット
            </button>
          )}

        </div>


        {/* 0件 */}
        {filteredCameras.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
              🔍
            </div>

            <p className="mt-5 text-lg font-black text-slate-800">
              カメラが見つかりませんでした
            </p>

            <p className="mt-2 text-sm text-slate-500">
              キーワードやカテゴリを変更してみてください。
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchText("");
                setSelectedCategory(
                  "すべて"
                );
              }}
              className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-sky-600"
            >
              すべて表示する
            </button>

          </div>
        ) : (

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {filteredCameras.map(
              (camera) => {

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
                      rounded-[26px]
                      border
                      border-slate-200
                      bg-white
                      shadow-sm
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:border-sky-200
                      hover:shadow-xl
                      hover:shadow-slate-900/10
                    "
                  >

                    {/* サムネイル */}
                    <Link
                      href={`/camera/${camera.id}`}
                      className="relative block aspect-video overflow-hidden bg-slate-200"
                    >

                      {thumbnailUrl ? (
                        <img
                          src={
                            thumbnailUrl
                          }
                          alt={
                            camera.name
                          }
                          className="
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-500
                            group-hover:scale-105
                          "
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-100 to-slate-200">
                          <span className="text-4xl">
                            📷
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

                      {camera.stream_url && (
                        <div className="absolute left-3 top-3">

                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-[10px] font-black text-white shadow-lg">

                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                            </span>

                            LIVE

                          </span>

                        </div>
                      )}

                      <div className="absolute bottom-3 right-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-sm font-black text-slate-900 shadow-lg backdrop-blur transition group-hover:bg-sky-400">
                          →
                        </span>
                      </div>

                    </Link>


                    {/* 本文 */}
                    <div className="p-5">

                      {/* タグ */}
                      <div className="flex flex-wrap items-center gap-2">

                        <Link
                          href={`/category/${encodeURIComponent(
                            camera.category
                          )}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-[11px] font-black text-sky-700 transition hover:bg-sky-100"
                        >
                          <span>
                            {getCategoryIcon(
                              camera.category
                            )}
                          </span>

                          {
                            camera.category
                          }
                        </Link>

                        <Link
                          href={`/area/${encodeURIComponent(
                            camera.city
                          )}`}
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-500 transition hover:bg-slate-200"
                        >
                          📍 {camera.city}
                        </Link>

                      </div>


                      {/* 名前 */}
                      <Link
                        href={`/camera/${camera.id}`}
                      >
                        <h3 className="mt-4 text-lg font-black leading-7 text-slate-900 transition group-hover:text-sky-600">
                          {camera.name}
                        </h3>
                      </Link>


                      {/* 説明 */}
                      {camera.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                          {
                            camera.description
                          }
                        </p>
                      )}


                      {/* CTA */}
                      {camera.stream_url ? (
                        <a
                          href={
                            camera.stream_url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            void recordCameraClick(
                              camera
                            );
                          }}
                          className="
                            mt-5
                            inline-flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            bg-slate-950
                            px-4
                            py-3.5
                            text-sm
                            font-black
                            text-white
                            transition
                            hover:bg-sky-600
                          "
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px]">
                            ▶
                          </span>

                          ライブ映像を見る
                        </a>
                      ) : (
                        <div className="mt-5 rounded-2xl bg-slate-100 px-4 py-3.5 text-center text-sm font-bold text-slate-400">
                          配信URL準備中
                        </div>
                      )}


                      {/* 詳細 */}
                      <Link
                        href={`/camera/${camera.id}`}
                        className="mt-3 flex items-center justify-center text-xs font-black text-sky-600 transition hover:text-sky-800"
                      >
                        カメラの詳細を見る →
                      </Link>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </section>
    </>
  );
}