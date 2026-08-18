import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type PopularCamera = {
  camera_id: number;
  camera_name: string;
  city: string;
  category: string;
  youtube_id: string | null;
  click_count: number;
};

export default async function PopularCameras() {
  const { data, error } = await supabase.rpc(
    "get_popular_cameras",
    {
      days_count: 30,
      limit_count: 5,
    }
  );

  /* =========================================
     エラー
  ========================================= */
  if (error) {
    return (
      <section
        id="ranking"
        className="scroll-mt-28"
      >
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <p className="font-black text-red-700">
            ランキング取得エラー
          </p>

          <p className="mt-2 break-words text-sm text-red-600">
            {error.message}
          </p>
        </div>
      </section>
    );
  }

  const cameras = (data ?? []) as PopularCamera[];

  /* =========================================
     データなし
  ========================================= */
  if (cameras.length === 0) {
    return (
      <section
        id="ranking"
        className="scroll-mt-28"
      >
        <p className="text-xs font-black tracking-[0.2em] text-amber-500">
          RANKING
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          いま人気のライブカメラ
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          ランキングデータを集計中です。
        </p>
      </section>
    );
  }

  const first = cameras[0];
  const others = cameras.slice(1);

  return (
    <section
      id="ranking"
      className="scroll-mt-28"
    >
      {/* =====================================
          見出し
      ===================================== */}
      <div className="mb-7">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100">
            🏆
          </span>

          <p className="text-xs font-black tracking-[0.2em] text-amber-600">
            RANKING
          </p>
        </div>

        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          いま人気の
          <br className="sm:hidden" />
          ライブカメラ
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          過去30日間の閲覧データから、
          いま注目されている山形のライブカメラをご紹介。
        </p>
      </div>


      {/* =====================================
          1位
      ===================================== */}
      <Link
        href={`/camera/${first.camera_id}`}
        className="
          group
          relative
          block
          overflow-hidden
          rounded-[28px]
          bg-slate-950
          shadow-xl
          shadow-slate-900/10
        "
      >
        {/* サムネイル */}
        <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[21/9]">

          {first.youtube_id ? (
            <img
              src={`https://img.youtube.com/vi/${first.youtube_id}/hqdefault.jpg`}
              alt={first.camera_name}
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
            <div className="h-full w-full bg-gradient-to-br from-sky-800 to-slate-950" />
          )}

          {/* 暗めのグラデーション */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* 1位 */}
          <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-6 sm:top-6">

            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-2xl shadow-lg">
              🥇
            </span>

            <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-slate-900 backdrop-blur">
              人気 No.1
            </span>

          </div>


          {/* LIVE */}
          <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500 px-3 py-1.5 text-xs font-black text-white shadow-lg">

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>

              LIVE

            </span>
          </div>


          {/* 情報 */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">

            <div className="mb-3 flex flex-wrap items-center gap-2">

              <span className="rounded-full bg-sky-500 px-3 py-1 text-xs font-black text-white">
                {first.category}
              </span>

              <span className="text-xs font-bold text-slate-200">
                📍 {first.city}
              </span>

            </div>

            <div className="flex items-end justify-between gap-4">

              <h3 className="text-xl font-black leading-tight text-white sm:text-3xl">
                {first.camera_name}
              </h3>

              <span className="hidden shrink-0 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-900 transition group-hover:bg-sky-400 sm:block">
                見てみる →
              </span>

            </div>

          </div>

        </div>
      </Link>


      {/* =====================================
          2〜5位
      ===================================== */}
      {others.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">

          {others.map((camera, index) => {
            const rank = index + 2;

            const medal =
              rank === 2
                ? "🥈"
                : rank === 3
                ? "🥉"
                : `${rank}`;

            return (
              <Link
                key={camera.camera_id}
                href={`/camera/${camera.camera_id}`}
                className="
                  group
                  flex
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                  transition
                  hover:-translate-y-1
                  hover:border-sky-200
                  hover:shadow-lg
                "
              >
                {/* サムネイル */}
                <div className="relative w-32 shrink-0 overflow-hidden bg-slate-200 sm:w-36">

                  {camera.youtube_id ? (
                    <img
                      src={`https://img.youtube.com/vi/${camera.youtube_id}/hqdefault.jpg`}
                      alt={camera.camera_name}
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
                    <div className="h-full min-h-28 w-full bg-gradient-to-br from-sky-200 to-slate-300" />
                  )}

                  <div className="absolute inset-0 bg-slate-950/10" />

                  {/* 順位 */}
                  <div className="absolute left-2 top-2">
                    <span className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-white/95 px-2 text-base font-black shadow backdrop-blur">
                      {medal}
                    </span>
                  </div>

                </div>


                {/* 情報 */}
                <div className="flex min-w-0 flex-1 flex-col justify-center p-4">

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-black text-sky-700">
                      {camera.category}
                    </span>

                    <span className="text-[11px] font-bold text-slate-400">
                      {camera.city}
                    </span>

                  </div>

                  <h3 className="mt-2 line-clamp-2 text-sm font-black leading-5 text-slate-900 sm:text-base">
                    {camera.camera_name}
                  </h3>

                  <p className="mt-2 text-xs font-bold text-sky-600">
                    ライブ映像を見る →
                  </p>

                </div>

              </Link>
            );
          })}

        </div>
      )}


      {/* =====================================
          注釈
      ===================================== */}
      <p className="mt-4 text-right text-[11px] text-slate-400">
        ※ 過去30日間の閲覧データをもとに集計
      </p>

    </section>
  );
}