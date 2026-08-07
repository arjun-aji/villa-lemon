import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import "../globals.css";
import Preloader from "@/components/Preloader";
import { BookingModalProvider } from "@/context/BookingModalContext";
import BookingModal from "@/components/BookingModal";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: {
      default: t("title"),
      template: "%s | Villa Lemon",
    },
    description: t("description"),
    metadataBase: new URL("https://villalemon.in"),
    alternates: {
      canonical: `/${locale}`,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://villalemon.in/${locale}`,
      siteName: "Villa Lemon",
      images: [
        {
          url: "/assets/hero.png",
          width: 1200,
          height: 630,
          alt: "Villa Lemon - Your Private Escape in Nature",
        },
      ],
      locale: locale === "en" ? "en_US" : locale === "de" ? "de_DE" : locale === "fr" ? "fr_FR" : "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/assets/hero.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "de" }, { locale: "fr" }, { locale: "ru" }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": "Villa Lemon",
    "description": "Premium luxury villa rental and wellness experience platform.",
    "image": "https://villalemon.in/assets/hero.png",
    "url": "https://villalemon.in",
    "telephone": "+1-555-LEMON-VILLA",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Greenery Hills Road",
      "addressLocality": "Nature Retreat",
      "addressRegion": "Kerala",
      "postalCode": "685601",
      "addressCountry": "IN"
    },
    "priceRange": "$$$$",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Private Swimming Pool",
        "value": "true"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Yoga Pavilion",
        "value": "true"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Free Wi-Fi",
        "value": "true"
      }
    ]
  };

  return (
    <html
      lang={locale}
      className={`${cormorantGaramond.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#121212] text-[#fbf9f6] select-none">
        <NextIntlClientProvider messages={messages}>
          <BookingModalProvider>
            <Preloader />
            {children}
            <BookingModal />
          </BookingModalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
