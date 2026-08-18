import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">

        {/* ロゴ */}
        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-lg shadow-lg shadow-sky-500/20 transition group-hover:scale-105">
            📍
          </div>

          <div>
            <p className="text-lg font-black tracking-tight text-white sm:text-xl">
              やまがたいま
            </p>

            <p className="hidden text-[10px] font-bold tracking-[0.18em] text-sky-300 sm:block">
              YAMAGATA LIVE CAMERA MAP
            </p>
          </div>
        </Link>


        {/* ナビ */}
        <nav className="flex items-center gap-1 sm:gap-2">

          <Link
            href="/#ranking"
            className="
              hidden
              rounded-xl
              px-3
              py-2
              text-sm
              font-bold
              text-slate-300
              transition
              hover:bg-white/10
              hover:text-white
              sm:inline-flex
            "
          >
            人気
          </Link>

          <Link
            href="/#live-map"
            className="
              rounded-xl
              px-3
              py-2
              text-sm
              font-bold
              text-slate-300
              transition
              hover:bg-white/10
              hover:text-white
            "
          >
            地図
          </Link>

          <Link
            href="/#live-cameras"
            className="
              hidden
              rounded-xl
              px-3
              py-2
              text-sm
              font-bold
              text-slate-300
              transition
              hover:bg-white/10
              hover:text-white
              sm:inline-flex
            "
          >
            カメラ
          </Link>

          <Link
            href="/#search"
            className="
              ml-1
              inline-flex
              items-center
              rounded-xl
              bg-sky-500
              px-4
              py-2
              text-sm
              font-black
              text-white
              shadow-lg
              shadow-sky-500/20
              transition
              hover:bg-sky-400
            "
          >
            🔍 探す
          </Link>

        </nav>
      </div>
    </header>
  );
}