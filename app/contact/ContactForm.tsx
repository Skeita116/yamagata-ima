"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("ライブカメラの掲載依頼");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSending(true);
    setSuccess(false);
    setErrorMessage("");

    const { error } = await supabase
      .from("contacts")
      .insert({
        name,
        email,
        subject,
        message,
      });

    if (error) {
      console.error(error);
      setErrorMessage(
        "送信に失敗しました。時間をおいてもう一度お試しください。"
      );
      setSending(false);
      return;
    }

    setSuccess(true);

    setName("");
    setEmail("");
    setSubject("ライブカメラの掲載依頼");
    setMessage("");

    setSending(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-9"
    >
      <div>
        <p className="text-xs font-black tracking-[0.2em] text-sky-600">
          CONTACT FORM
        </p>

        <h2 className="mt-2 text-2xl font-black">
          お問い合わせフォーム
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          ライブカメラの掲載依頼、情報修正、削除依頼などをお送りいただけます。
        </p>
      </div>

      <div className="mt-8 grid gap-6">

        {/* 名前 */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-black text-slate-700"
          >
            お名前
            <span className="ml-2 text-xs text-red-500">
              必須
            </span>
          </label>

          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="山形 太郎"
            className="
              w-full
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              px-4
              py-3.5
              text-sm
              outline-none
              transition
              focus:border-sky-400
              focus:bg-white
              focus:ring-4
              focus:ring-sky-100
            "
          />
        </div>

        {/* メール */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-black text-slate-700"
          >
            メールアドレス
            <span className="ml-2 text-xs text-red-500">
              必須
            </span>
          </label>

          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="example@example.com"
            className="
              w-full
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              px-4
              py-3.5
              text-sm
              outline-none
              transition
              focus:border-sky-400
              focus:bg-white
              focus:ring-4
              focus:ring-sky-100
            "
          />
        </div>

        {/* 種別 */}
        <div>
          <label
            htmlFor="subject"
            className="mb-2 block text-sm font-black text-slate-700"
          >
            お問い合わせ種別
          </label>

          <select
            id="subject"
            value={subject}
            onChange={(event) =>
              setSubject(event.target.value)
            }
            className="
              w-full
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              px-4
              py-3.5
              text-sm
              outline-none
              transition
              focus:border-sky-400
              focus:bg-white
              focus:ring-4
              focus:ring-sky-100
            "
          >
            <option>
              ライブカメラの掲載依頼
            </option>

            <option>
              掲載情報の修正
            </option>

            <option>
              掲載削除の依頼
            </option>

            <option>
              その他のお問い合わせ
            </option>
          </select>
        </div>

        {/* 本文 */}
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-black text-slate-700"
          >
            お問い合わせ内容
            <span className="ml-2 text-xs text-red-500">
              必須
            </span>
          </label>

          <textarea
            id="message"
            required
            rows={8}
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            placeholder="お問い合わせ内容をご記入ください。"
            className="
              w-full
              resize-none
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              px-4
              py-3.5
              text-sm
              leading-7
              outline-none
              transition
              focus:border-sky-400
              focus:bg-white
              focus:ring-4
              focus:ring-sky-100
            "
          />
        </div>

      </div>

      {/* 成功 */}
      {success && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="font-black text-emerald-700">
            お問い合わせを送信しました。
          </p>

          <p className="mt-1 text-sm text-emerald-600">
            内容を確認のうえ対応いたします。
          </p>
        </div>
      )}

      {/* エラー */}
      {errorMessage && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="font-black text-red-700">
            {errorMessage}
          </p>
        </div>
      )}

      {/* 送信 */}
      <button
        type="submit"
        disabled={sending}
        className="
          mt-7
          inline-flex
          w-full
          items-center
          justify-center
          rounded-2xl
          bg-slate-950
          px-6
          py-4
          text-sm
          font-black
          text-white
          transition
          hover:bg-sky-600
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {sending
          ? "送信中..."
          : "お問い合わせを送信する →"}
      </button>
    </form>
  );
}