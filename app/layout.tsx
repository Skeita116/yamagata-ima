import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yamagata-ima.vercel.app"),

  title: "やまがたいま｜山形の「いま」が見えるライブマップ",

  description:
    "山形県内の観光地・空港・温泉・スキー場などのライブカメラを、地図から探せるWebサービスです。",

  openGraph: {
    title: "やまがたいま｜山形の「いま」が見えるライブマップ",
    description:
      "山形県内のライブカメラを地図から簡単にチェック。観光、空港、温泉、スキー場など山形の「いま」を見てみよう。",
    url: "https://yamagata-ima.vercel.app",
    siteName: "やまがたいま",
    locale: "ja_JP",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "やまがたいま｜山形の「いま」が見えるライブマップ",
    description:
      "山形県内のライブカメラを地図からチェックできるWebサービス。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}