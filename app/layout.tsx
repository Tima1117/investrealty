import type { Metadata } from "next";
import { Playfair_Display, Manrope, Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({ subsets: ["latin", "cyrillic"], weight: ["500", "600", "700", "800"], style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const body = Manrope({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700", "800"], variable: "--font-body", display: "swap" });
const georgian = Noto_Sans_Georgian({ subsets: ["georgian"], weight: ["400", "600", "800"], variable: "--font-georgian", display: "swap" });
const georgianSerif = Noto_Serif_Georgian({ subsets: ["georgian"], weight: ["500", "700"], variable: "--font-georgian-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://investrealty.vercel.app"),
  title: "Invest Realty — недвижимость в Батуми: новостройки, вторичка, пентхаусы, сопровождение сделки",
  description: "Агентство недвижимости Invest Realty в Батуми: подбор и покупка квартир у моря, продажа, коммерция, сделки удалённо, регистрация в Доме юстиции. 4.8 по 35 отзывам в Google. Офис: ул. Эквтиме Такаишвили, 44-50.",
  openGraph: {
    title: "Invest Realty — недвижимость в Батуми",
    description: "Студии от $59 900, квартиры и пентхаусы у моря, сопровождение сделки до выписки из реестра. 4.8 в Google.",
    url: "https://investrealty.vercel.app",
    siteName: "Invest Realty",
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/images/city-sea.webp", width: 1200, height: 1600 }],
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${display.variable} ${body.variable} ${georgian.variable} ${georgianSerif.variable}`}>{children}</body>
    </html>
  );
}
