import { TooltipProvider } from "@pollify/ui";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import type { NextPage } from "next";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import SEO from "../config/next-seo";
import { queryClientConfig } from "../config/query-client";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("@tanstack/react-query-devtools/build/lib/index.prod.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    })
  )
);

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));
  const [showDevtools, setShowDevtools] = useState(false);
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  return (
    <>
      <DefaultSeo {...SEO} />
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <SessionProvider session={session}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <style jsx global>{`
                :root {
                  --font-inter: ${inter.style.fontFamily};
                }
              `}</style>
              <TooltipProvider>
                {getLayout(<Component {...pageProps} />)}
                <div>
                  <Toaster position="bottom-right" />
                </div>
                <Analytics />
                <ReactQueryDevtools initialIsOpen={false} />
                {showDevtools && (
                  <React.Suspense fallback={null}>
                    <ReactQueryDevtoolsProduction />
                  </React.Suspense>
                )}
              </TooltipProvider>
            </ThemeProvider>
          </SessionProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}
