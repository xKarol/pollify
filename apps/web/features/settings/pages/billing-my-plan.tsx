import { Alert, AlertTitle, Skeleton } from "@pollify/ui";
import { useSession } from "next-auth/react";
import React from "react";

import SettingsHeader from "../components/settings-header";
import { BaseLayout } from "../layouts";

export default function BillingMyPlanPage() {
  const { status, data: session } = useSession();
  return (
    <BaseLayout>
      <SettingsHeader
        heading="Billing"
        description="Manage your account billings"
      />
      {status !== "authenticated" ? (
        <Skeleton className="h-10" />
      ) : (
        <Alert variant="info">
          <AlertTitle>
            Your current plan is: <strong>{session.user.plan}</strong>
          </AlertTitle>
        </Alert>
      )}
    </BaseLayout>
  );
}
