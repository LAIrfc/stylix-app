import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { I18nProvider } from "@/lib/i18n/context";
import { CartProvider } from "@/lib/cart/CartContext";
import { OrderProvider } from "@/lib/order/OrderContext";
import { AnalyticsPageView } from "@/lib/analytics/AnalyticsPageView";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stylix — AI-Powered Jewelry Styling",
  description:
    "Luxury jewelry styling platform: AI stylist, virtual try-on, and intelligent matching for every occasion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen font-sans">
        <I18nProvider>
          <CartProvider>
            <OrderProvider>
              <AnalyticsPageView />
              <SiteHeader />
              <main>{children}</main>
              <SiteFooter />
            </OrderProvider>
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
