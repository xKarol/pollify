import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "sonner";

import { routes } from "../../../../config/routes";
import { AnalyticsPage } from "../../../../features/dashboard";
import { usePoll } from "../../../../hooks/use-poll";
import { useUnauthorizedRedirect } from "../../../../hooks/use-unauthorized-redirect";

export default function Page() {
  useUnauthorizedRedirect();

  const router = useRouter();
  const pollId = router.query.pollId as string;
  const { data, isError, isSuccess } = usePoll(pollId, {
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      toast.error("This poll does not exist.");
      router.push(routes.DASHBOARD.HOME);
    }
  }, [router, isError]);

  if (!pollId && !isSuccess) return null;

  return (
    <>
      <NextSeo
        title={isSuccess ? `Analytics - ${data.question}` : `Analytics`}
      />
      <AnalyticsPage pollId={pollId} />
    </>
  );
}
