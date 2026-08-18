import Link from "next/link";

const categories = [
  {
    name: "温泉",
    icon: "♨️",
  },
  {
    name: "スキー場",
    icon: "❄️",
  },
  {
    name: "空港",
    icon: "✈️",
  },
  {
    name: "観光",
    icon: "🏔️",
  },
];

const areas = [
  "山形市",
  "酒田市",
  "鶴岡市",
  "東根市",
  "新庄市",
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">
      {/* 背景装飾 */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        {/* 上段 */}
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* ブランド */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-xl shadow-lg shadow-sky-500/20">
                📍
              </div>

              <div>
                <p className="text-xl font-black tracking-tight">
                  やまがたいま
                </p>

                <p className="mt-1 text-[10px] font-black tracking-[0.18em] text-sky-300">
                  YAMAGATA LIVE CAMERA MAP
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              山形県内の観光地・空港・温泉・スキー場などの
              ライブカメラを、地図から探せるWebサービスです。
              お出かけ前に、山形の「いま」をチェック。
            </p>

            {/* CTA */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/#live-map"
                className="inline-flex items-center rounded-xl bg-sky-500 px-4 py-3 text-sm font-black text-white transition hover:bg-sky-400"
              >
                📍 ライブマップ
              </Link>

              <Link
                href="/#ranking"
                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-slate-200 transition hover:bg-white/10"
              >
                🏆 人気を見る
              </Link>
            </div>
          </div>

          {/* カテゴリ */}
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-sky-300">
              CATEGORY
            </p>

            <h2 className="mt-2 text-lg font-black">
              目的から探す
            </h2>

            <div className="mt-5 grid gap-2">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/category/${encodeURIComponent(
                    category.name
                  )}`}
                  className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                      {category.icon}
                    </span>

                    {category.name}
                  </span>

                  <span className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-sky-300">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* エリア */}
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-sky-300">
              AREA
            </p>

            <h2 className="mt-2 text-lg font-black">
              エリアから探す
            </h2>

            <div className="mt-5 grid gap-2">
              {areas.map((area) => (
                <Link
                  key={area}
                  href={`/area/${encodeURIComponent(
                    area
                  )}`}
                  className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  <span>
                    📍 {area}
                  </span>

                  <span className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-sky-300">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 区切り */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

        {/* サイト情報リンク */}
        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <Link
            href="/about"
            className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
          >
            <p className="text-sm font-black text-white">
              このサイトについて
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              やまがたいまの目的やサービスについて
            </p>

            <p className="mt-3 text-xs font-black text-sky-300">
              詳しく見る →
            </p>
          </Link>

          <Link
            href="/info"
            className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
          >
            <p className="text-sm font-black text-white">
              掲載情報について
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              ライブカメラ情報や掲載方針について
            </p>

            <p className="mt-3 text-xs font-black text-sky-300">
              詳しく見る →
            </p>
          </Link>

          <Link
            href="/contact"
            className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
          >
            <p className="text-sm font-black text-white">
              お問い合わせ
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              掲載依頼・修正・削除などはこちら
            </p>

            <p className="mt-3 text-xs font-black text-sky-300">
              お問い合わせ →
            </p>
          </Link>
        </div>

        {/* 下段 */}
        <div className="border-t border-slate-800 pt-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">
                © 2026 やまがたいま
              </p>

              <p className="mt-1 text-[11px] text-slate-600">
                山形県の「いま」を、もっと身近に。
              </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-3">
              <Link
                href="/"
                className="text-xs font-bold text-slate-500 transition hover:text-white"
              >
                TOP
              </Link>

              <Link
                href="/#search"
                className="text-xs font-bold text-slate-500 transition hover:text-white"
              >
                カメラを探す
              </Link>

              <Link
                href="/#live-map"
                className="text-xs font-bold text-slate-500 transition hover:text-white"
              >
                ライブマップ
              </Link>

              <Link
                href="/about"
                className="text-xs font-bold text-slate-500 transition hover:text-white"
              >
                このサイトについて
              </Link>

              <Link
                href="/info"
                className="text-xs font-bold text-slate-500 transition hover:text-white"
              >
                掲載情報について
              </Link>

              <Link
                href="/contact"
                className="text-xs font-bold text-slate-500 transition hover:text-white"
              >
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}