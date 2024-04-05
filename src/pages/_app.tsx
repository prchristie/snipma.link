import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import ToastProvider from "~/components/Toast/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ToastProvider>
        <main className={`font-sans ${inter.variable}`}>
          <Component {...pageProps} />
        </main>
      </ToastProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
