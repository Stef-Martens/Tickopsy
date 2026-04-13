import "./globals.css";
import { Space_Grotesk, Source_Sans_3 } from "next/font/google";

const headlineFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Tickopsy</title>
        <meta
          name="google-site-verification"
          content="w0woJ6eBrKtPILWxJHO6NUYmP0AYTKNivq18Jt45siY"
        />
      </head>
      <body className={`${headlineFont.variable} ${bodyFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
