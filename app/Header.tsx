import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">

        {/* ロゴ */}
        <Link
          href="/"
          className="group"
        >
          <p className="text-xl font-black tracking-tight text-slate-900 transition group-hover:text-sky-600">
            やまがたいま
          </p>

          <p className="mt-0.5 hidden text-[11px] font-medium text-slate-400 sm:block">
            山形の「いま」が見えるライブマップ
          </p>
        </Link>

        {/* ナビ */}
        <nav className="flex items-center gap-2 sm:gap-3">

          <Link
            href="/#live-map"
            className="rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-sky-600"
          >
            地図
          </Link>

          <Link
            href="/#live-cameras"
            className="rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-sky-600"
          >
            カメラ
          </Link>

          <Link
            href="/#search"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-600"
          >
            探す
          </Link>

        </nav>

      </div>
    </header>
  );
}