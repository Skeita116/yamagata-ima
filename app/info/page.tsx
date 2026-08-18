export default function InfoPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <p className="text-xs font-black tracking-[0.2em] text-sky-300">
            INFORMATION
          </p>

          <h1 className="mt-3 text-4xl font-black">
            掲載情報について
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <h2 className="text-xl font-black">
            ライブカメラ情報について
          </h2>

          <p className="mt-4 text-sm leading-8 text-slate-600">
            当サイトでは、インターネット上で公開されているライブカメラ情報を
            利用しやすい形で紹介しています。
          </p>

          <p className="mt-4 text-sm leading-8 text-slate-600">
            ライブ映像そのものは各配信元が管理・提供しており、
            やまがたいまが映像を配信しているものではありません。
          </p>

          <h2 className="mt-10 text-xl font-black">
            情報の正確性について
          </h2>

          <p className="mt-4 text-sm leading-8 text-slate-600">
            掲載内容については確認を行っていますが、
            配信停止、URL変更、映像内容の変更などにより、
            一時的に正しく表示されない場合があります。
          </p>

          <h2 className="mt-10 text-xl font-black">
            掲載・修正について
          </h2>

          <p className="mt-4 text-sm leading-8 text-slate-600">
            掲載情報の修正、削除、追加をご希望の場合は、
            お問い合わせページからご連絡ください。
          </p>
        </section>
      </div>
    </main>
  );
}