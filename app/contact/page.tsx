import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-700/30 via-slate-950 to-slate-950" />

        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-black tracking-[0.2em] text-sky-300">
            CONTACT
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            お問い合わせ
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            ライブカメラの掲載依頼、掲載情報の修正・削除、
            その他のお問い合わせはこちらからお送りください。
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">

          {/* 案内 */}
          <aside className="rounded-[28px] bg-slate-950 p-6 text-white sm:p-8">
            <p className="text-xs font-black tracking-[0.2em] text-sky-300">
              SUPPORT
            </p>

            <h2 className="mt-3 text-2xl font-black">
              こんな内容を受け付けています
            </h2>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="font-black">
                  📷 ライブカメラの掲載依頼
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="font-black">
                  ✏️ 掲載情報の修正
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="font-black">
                  🗑️ 掲載削除の依頼
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="font-black">
                  💬 その他のお問い合わせ
                </p>
              </div>
            </div>

            <p className="mt-6 text-xs leading-6 text-slate-500">
              ※ お問い合わせ内容は確認のため保存されます。
            </p>
          </aside>

          {/* フォーム */}
          <ContactForm />

        </div>
      </div>

    </main>
  );
}