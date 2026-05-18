import "./globals.css";

export const metadata = {
  title: "GoSuap — Muslim Food Market Place",
  description: "Your Digital Foodie Companion — Direktori makanan Muslim Malaysia",
  manifest: "/manifest.json",
  themeColor: "#7cc620",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GoSuap",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ms">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7cc620" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GoSuap" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="m-0 p-0 antialiased">
        {children}
      </body>
    </html>
  );
}