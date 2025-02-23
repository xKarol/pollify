import React from "react";

import Footer from "../components/footer";
import { Header } from "../components/header";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="*:mb-24 lg:*:mb-32 [&>*:first-child]:mt-8 lg:[&>*:first-child]:mt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
