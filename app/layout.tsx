import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "마감 알리미",
  description: "과제와 시험 마감을 D-day로 한눈에",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}