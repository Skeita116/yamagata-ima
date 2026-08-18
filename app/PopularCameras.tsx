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

  if (error) {
    console.error("popular cameras error:", error);
    return null;
  }

  const cameras = (data ?? []) as PopularCamera[];

  if (cameras.length === 0) {
    return (
      <section className="mt-14">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
            RANKING
          </p>

          <h2 className="mt-1 text-2xl font-black text-slate-900">
            人気ライブカメラ
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            人気ランキングのデータを集計中です。
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="ranking"
      className="mt-14 scroll-mt-28"
    >
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
          RANKING
        </p>

        <h2 className="mt-1 text-2xl font-black text-slate-900">
          人気ライブカメラ TOP5
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          過去30日間の閲覧データをもとにランキングしています。
        </p>
      </div>

      <div className="grid gap-3">
        {cameras.map((camera, index) => {
          const rank = index + 1;

          const medal =
            rank === 1
              ? "🥇"
              : rank === 2
              ? "🥈"
              : rank === 3
              ? "🥉"
              : `${rank}位`;

          return (
            <article
              key={camera.camera_id}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* 順位 */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-xl font-black">
                {medal}
              </div>

              {/* カメラ情報 */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700">
                    {camera.category}
                  </span>

                  <span className="text-xs font-medium text-slate-400">
                    📍 {camera.city}
                  </span>
                </div>

                <h3 className="mt-2 truncate font-black text-slate-900">
                  {camera.camera_name}
                </h3>
              </div>

              {/* 詳細ページ */}
              <Link
                href={`/camera/${camera.camera_id}`}
                className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-600"
              >
                詳細 →
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}