import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/nav/Navbar";
import StoreProvider from "@/store/StoreProvider";
import getThemeCookie from "@/utils/getThemeCookie.mjs";
import { verifyToken } from "@/utils/verifyToken.mjs";
import { makeStore } from "@/store/store";
import { setUserData } from "@/store/slices/authSlice";
import { setTheme } from "@/store/slices/themeSlice";
// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeProvider from "@/components/providers/ThemeProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "হাজী হারুন এন্টারপ্রাইজ",
  description:
    "হাজী হারুন এন্টারপ্রাইজ একটি নির্ভরযোগ্য ইনভেস্টমেন্ট ম্যানেজমেন্ট কোম্পানি যা আপনার বিনিয়োগের জন্য সর্বোচ্চ রিটার্ন নিশ্চিত করতে পেশাদারী সেবা প্রদান করে।",
  openGraph: {
    title: "হাজী হারুন এন্টারপ্রাইজ",
    description:
      "হাজী হারুন এন্টারপ্রাইজ একটি শীর্ষস্থানীয় ইনভেস্টমেন্ট ম্যানেজমেন্ট কোম্পানি যা গ্রাহকদের আর্থিক সুরক্ষা এবং সফল বিনিয়োগের জন্য কৌশলগত পরামর্শ প্রদান করে।",
    images: [
      {
        url: "https://i.ibb.co.com/QmT02QB/hazi-harun-enterprise-logo.png",
        width: 800,
        height: 800,
        alt: "Hazi Harun Enterprise Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "হাজী হারুন এন্টারপ্রাইজ",
    description:
      "হাজী হারুন এন্টারপ্রাইজ আপনার বিনিয়োগের জন্য নির্ভরযোগ্য পেশাদার সেবা প্রদান করে, যা আপনার আর্থিক লক্ষ্য পূরণে সাহায্য করে।",
    image: "https://i.ibb.co.com/QmT02QB/hazi-harun-enterprise-logo.png",
  },
};

export default async function RootLayout({ children }) {
  let storedTheme = await getThemeCookie();
  let userData = await verifyToken();
  const store = makeStore();
  store.dispatch(setUserData(userData));
  store.dispatch(setTheme(storedTheme));
  const initialReduxState = store.getState();
  return (
    <StoreProvider initialReduxState={initialReduxState}>
      <ThemeProvider>
        <html lang="en" data-theme={storedTheme}>
        <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="./../../public/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="./../../public/android-chrome-512x512.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="./../../public/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="./../../public/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="./../../public/favicon-16x16.png"
        />
      </head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Navbar />
            <main className="pt-[64px] bg-[#f9fafc] min-h-full dark:bg-[#111828]">{children}</main>
          </body>
        </html>
      </ThemeProvider>
    </StoreProvider>
  );
}
