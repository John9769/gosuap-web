import "./globals.css";

export const metadata = {
  title: "GoSuap Agent Portal",
  description: "Agen Rasmi GoSuap",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ms">
      <body className="m-0 p-0 antialiased">
        {children}
      </body>
    </html>
  );
}