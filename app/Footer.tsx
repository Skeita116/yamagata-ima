import Link from "next/link";

const categories = [
  "空港",
  "温泉",
  "スキー場",
  "観光",
];

const areas = [
  "山形市",
  "酒田市",
  "東根市",
  "鶴岡市",
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-950 text-white">

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">

        <div className="grid gap-10 md:grid-cols-3">

          {/* サービス */}
          <div>
            <Link
              href="/"
              className="text-xl font-black"
            >
              やまがたいま
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              山形県内の観光地、空港、温泉、
              スキー場などのライブカメラを
              地図から探せるWebサービスです。
            </p>
          </div>

          {/* カテゴリ */}
          <div>
            <p className="text-sm font-black text-white">
              カテゴリから探す
            </p>

            <div className="mt-4 flex flex-col gap-3">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/category/${encodeURIComponent(category)}`}
                  className="text-sm text-slate-400 transition hover:text-sky-300"
                >
                  山形県の{category}ライブカメラ
                </Link>
              ))}
            </div>
          </div>

          {/* エリア */}
          <div>
            <p className="text-sm font-black text-white">
              エリアから探す
            </p>

            <div className="mt-4 flex flex-col gap-3">
              {areas.map((area) => (
                <Link
                  key={area}
                  href={`/area/${encodeURIComponent(area)}`}
                  className="text-sm text-slate-400 transition hover:text-sky-300"
                >
                  {area}のライブカメラ
                </Link>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-slate-800 pt-6">

          <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © 2026 やまがたいま
            </p>

            <p>
              山形県の「いま」をもっと身近に。
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}