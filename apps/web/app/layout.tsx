import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
