import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-black tracking-[0.2em] text-sky-300">
            ABOUT
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            やまがたいまについて
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            山形県内のライブカメラを、もっと探しやすく。
            「やまがたいま」は、観光やお出かけ前に現地の様子を確認できる
            ライブカメラマップです。
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <h2 className="text-2xl font-black">
            山形の「いま」を、もっと身近に。
          </h2>

          <p className="mt-5 text-sm leading-8 text-slate-600">
            山形県には、観光地、温泉、スキー場、空港、道路など、
            さまざまな場所にライブカメラがあります。
          </p>

          <p className="mt-4 text-sm leading-8 text-slate-600">
            やまがたいまでは、それらのライブカメラ情報を地図やカテゴリ、
            市町村から探せるようにまとめています。
          </p>

          <p className="mt-4 text-sm leading-8 text-slate-600">
            天気や積雪状況、観光地の様子などを確認するときに、
            気軽に使えるサービスを目指しています。
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-sky-50 p-5">
            <p className="text-2xl">📍</p>
            <h3 className="mt-3 font-black">地図から探せる</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              山形県内のライブカメラを地図から探せます。
            </p>
          </div>

          <div className="rounded-2xl bg-amber-50 p-5">
            <p className="text-2xl">🏆</p>
            <h3 className="mt-3 font-black">人気がわかる</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              閲覧データをもとに人気のライブカメラを紹介します。
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-5">
            <p className="text-2xl">🔍</p>
            <h3 className="mt-3 font-black">目的別に探せる</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              温泉、スキー場、空港などから絞り込めます。
            </p>
          </div>
        </section>

        <Link
          href="/"
          className="mt-10 inline-flex rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white transition hover:bg-sky-600"
        >
          山形ライブマップを見る →
        </Link>
      </div>
    </main>
  );
}