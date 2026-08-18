import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <p className="text-xs font-black tracking-[0.2em] text-sky-300">
            CONTACT
          </p>

          <h1 className="mt-3 text-4xl font-black">
            お問い合わせ
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-300">
            掲載情報の修正・追加などについてはこちらから。
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <h2 className="text-xl font-black">
            お問い合わせ内容
          </h2>

          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="font-black">📷 ライブカメラの掲載依頼</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="font-black">✏️ 掲載情報の修正</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="font-black">🗑️ 掲載削除のご相談</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="font-black">💬 その他のお問い合わせ</p>
            </div>
          </div>

          <p className="mt-7 text-sm leading-7 text-slate-600">
            お問い合わせフォームは現在準備中です。
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white transition hover:bg-sky-600"
          >
            トップページへ戻る →
          </Link>
        </section>
      </div>
    </main>
  );
}