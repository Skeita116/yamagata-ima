import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import CameraExplorer from "./CameraExplorerClient";
import PopularCameras from "./PopularCamerasServer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Home() {
  const { data: cameras, error } = await supabase
    .from("cameras")
    .select("*")
    .order("id", { ascending: true });

  const cameraList = cameras ?? [];

  const cameraCount = cameraList.length;

  const categoryCount = new Set(
    cameraList
      .map((camera) => camera.category)
      .filter(Boolean)
  ).size;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden bg-slate-950">

        {/* 背景画像
            スマホ：画像全体を見せる
            PC：画面いっぱいに表示
        */}
        <div
          className="
            absolute
            inset-0
            bg-contain
            bg-top
            bg-no-repeat
            sm:bg-cover
            sm:bg-center
          "
          style={{
            backgroundImage: "url('/ogp.png')",
          }}
        />

        {/* スマホでは画像の下側を自然につなぐ */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/45 to-slate-950 sm:hidden" />

        {/* PC：左側を濃く */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/20 sm:block" />

        {/* 下方向のグラデーション */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/10" />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-48 sm:px-6 sm:py-24 lg:py-32">

          <div className="max-w-2xl">

            {/* ラベル */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-slate-950/50 px-4 py-2 backdrop-blur sm:bg-sky-400/10">

              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>

              <span className="text-[10px] font-black tracking-[0.16em] text-sky-200 sm:text-xs">
                YAMAGATA LIVE CAMERA MAP
              </span>

            </div>

            {/* キャッチコピー */}
            <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
              山形の
              <span className="text-amber-400">
                「いま」
              </span>
              が
              <br />
              見える。
            </h1>

            <p className="mt-6 max-w-xl text-sm font-medium leading-7 text-slate-200 sm:text-lg sm:leading-8">
              観光地・空港・温泉・スキー場など、
              山形県内のライブカメラを地図からチェック。
              お出かけ前に、現地の「いま」を見てみよう。
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

              <Link
                href="/#live-map"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-2xl
                  bg-sky-500
                  px-6
                  py-4
                  text-sm
                  font-black
                  text-white
                  shadow-xl
                  shadow-sky-500/20
                  transition
                  hover:-translate-y-0.5
                  hover:bg-sky-400
                "
              >
                📍 ライブマップを見る
                <span className="ml-2">
                  →
                </span>
              </Link>

              <Link
                href="/#ranking"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/20
                  bg-white/10
                  px-6
                  py-4
                  text-sm
                  font-black
                  text-white
                  backdrop-blur
                  transition
                  hover:bg-white/20
                "
              >
                🏆 人気を見る
              </Link>

            </div>

            {/* 数字 */}
            <div className="mt-10 flex items-center gap-8">

              <div>
                <p className="text-3xl font-black text-white sm:text-4xl">
                  {cameraCount}
                </p>

                <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-300">
                  LIVE CAMERAS
                </p>
              </div>

              <div className="h-12 w-px bg-white/20" />

              <div>
                <p className="text-3xl font-black text-white sm:text-4xl">
                  {categoryCount}
                </p>

                <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-300">
                  CATEGORIES
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          CATEGORY SHORTCUT
      ===================================================== */}
      <section className="bg-slate-950 pb-12">

        <div className="mx-auto max-w-6xl px-4 sm:px-6">

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

            <Link
              href="/category/温泉"
              className="
                group
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-4
                text-white
                backdrop-blur
                transition
                hover:-translate-y-1
                hover:border-sky-400/30
                hover:bg-white/10
              "
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-2xl">
                ♨️
              </div>

              <p className="mt-3 font-black">
                温泉
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                温泉地のいまを見る
              </p>
            </Link>

            <Link
              href="/category/スキー場"
              className="
                group
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-4
                text-white
                backdrop-blur
                transition
                hover:-translate-y-1
                hover:border-sky-400/30
                hover:bg-white/10
              "
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-2xl">
                ❄️
              </div>

              <p className="mt-3 font-black">
                スキー場
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                ゲレンデの様子
              </p>
            </Link>

            <Link
              href="/category/空港"
              className="
                group
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-4
                text-white
                backdrop-blur
                transition
                hover:-translate-y-1
                hover:border-sky-400/30
                hover:bg-white/10
              "
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-2xl">
                ✈️
              </div>

              <p className="mt-3 font-black">
                空港
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                空港周辺をチェック
              </p>
            </Link>

            <Link
              href="/category/観光"
              className="
                group
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-4
                text-white
                backdrop-blur
                transition
                hover:-translate-y-1
                hover:border-sky-400/30
                hover:bg-white/10
              "
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-2xl">
                🏔️
              </div>

              <p className="mt-3 font-black">
                観光
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                観光地のいまを見る
              </p>
            </Link>

          </div>
        </div>
      </section>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <section className="relative bg-slate-50">

        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sky-50 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">

          {/* 人気ランキング */}
          <PopularCameras />

          {/* Supabaseエラー */}
          {error && (
            <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-700">
              データ取得エラー：{error.message}
            </div>
          )}

          {/* 検索・地図・一覧 */}
          {!error && (
            <div className="mt-16">
              <CameraExplorer cameras={cameraList} />
            </div>
          )}

        </div>
      </section>

    </main>
  );
}