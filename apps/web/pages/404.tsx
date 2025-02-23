import { Button } from "@pollify/ui";
import { NextSeo } from "next-seo";
import Link from "next/link";

import { routes } from "../config/routes";
import { BaseLayout } from "../layouts";
import { getLayout } from "../utils/get-layout";

export default function Custom404() {
  return (
    <>
      <NextSeo title="Page not found" description={undefined} nofollow />
      <section className="flex h-[calc(100vh-128px-68px)] flex-col items-center justify-center">
        <div className="flex max-w-md flex-col items-center space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-primary">404</span>
            <h1 className="text-xl font-medium">Page not found</h1>
          </div>
          <Button asChild className="mt-4 rounded-full" variant="secondary">
            <Link href={routes.HOME}>Go back</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

Custom404.getLayout = getLayout(BaseLayout);
