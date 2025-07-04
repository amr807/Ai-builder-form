import "./globals.css";
import ProviderSession from "@/components/providers/provider_session";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en">
      <body
        className={`antialiased`}
      > <ProviderSession>
        {children}</ProviderSession>
      </body>
    </html>
  );
}
