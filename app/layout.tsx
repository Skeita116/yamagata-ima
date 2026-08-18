import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const siteUrl = "https://yamagata-ima.vercel.app";
const ogImage = `${siteUrl}/ogp.png?v=2`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: "やまがたいま｜山形の「いま」が見えるライブマップ",

  description:
    "山形県内の観光地・空港・温泉・スキー場などのライブカメラを、地図から探せるWebサービスです。",

  // Google Search Console 所有権確認
  verification: {
    google: "X4qQjKG1zZvX2Nkd_8TDlsYmRa7xk43NqHy0e2T4Dwc",
  },

  // OGP
  openGraph: {
    title: "やまがたいま｜山形の「いま」が見えるライブマップ",

    description:
      "山形県内のライブカメラを地図から簡単にチェック。観光、空港、温泉、スキー場など山形の「いま」を見てみよう。",

    url: siteUrl,

    siteName: "やまがたいま",

    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "やまがたいま｜山形ライブカメラマップ",
        type: "image/png",
      },
    ],

    locale: "ja_JP",

    type: "website",
  },

  // X（Twitter）
  twitter: {
    card: "summary_large_image",

    title: "やまがたいま｜山形の「いま」が見えるライブマップ",

    description:
      "山形県内のライブカメラを地図からチェックできるWebサービス。",

    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}

        {/* Google Analytics */}
        <GoogleAnalytics gaId="G-M4KTTEW644" />
      </body>
    </html>
  );
}