import { createClient } from "@supabase/supabase-js";
import CameraExplorer from "./CameraExplorer";
import PopularCameras from "./PopularCameras";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Home() {
  const { data: cameras, error } = await supabase
    .from("cameras")
    .select("*")
    .order("id", { ascending: true });

  const cameraCount = cameras?.length ?? 0;

  const categoryCount = new Set(
    cameras
      ?.map((camera) => camera.category)
      .filter(Boolean)
  ).size;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

        {/* ========================================
            メインコピー
        ======================================== */}
        <section className="mb-8">

          <p className="mb-3 inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
            YAMAGATA LIVE MAP
          </p>

          <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
            山形の「いま」を、
            <br className="sm:hidden" />
            ライブカメラで。
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            観光地、空港、温泉、スキー場など、
            山形県内のライブカメラを地図から簡単に探せます。
          </p>

        </section>


        {/* ========================================
            掲載数
        ======================================== */}
        <section className="mb-8 grid grid-cols-2 gap-3 sm:max-w-md">

          {/* 掲載カメラ */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <p className="text-xs font-medium text-slate-500">
              掲載カメラ
            </p>

            <p className="mt-1 text-3xl font-black">
              {cameraCount}

              <span className="ml-1 text-sm font-medium text-slate-500">
                地点
              </span>
            </p>

          </div>


          {/* カテゴリ */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <p className="text-xs font-medium text-slate-500">
              カテゴリ
            </p>

            <p className="mt-1 text-3xl font-black">
              {categoryCount}

              <span className="ml-1 text-sm font-medium text-slate-500">
                種類
              </span>
            </p>

          </div>

        </section>


        {/* ========================================
            人気ランキング
        ======================================== */}
        <PopularCameras />


        {/* ========================================
            Supabaseエラー
        ======================================== */}
        {error && (

          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            データ取得エラー：{error.message}
          </div>

        )}


        {/* ========================================
            検索・カテゴリ・地図・カメラ一覧
        ======================================== */}
        {!error && (

          <div className="mt-14">

            <CameraExplorer
              cameras={cameras ?? []}
            />

          </div>

        )}

      </div>

    </main>
  );
}