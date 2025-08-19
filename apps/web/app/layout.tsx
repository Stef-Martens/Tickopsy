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
          content="googlef66dd02b00cbff9a"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
