import { NextSeo } from "next-seo";

import { CreatePollForm } from "../components/create-poll-form";
import { BaseLayout } from "../layouts";
import { getLayout } from "../utils/get-layout";

export default function CreatePollPage() {
  return (
    <>
      <NextSeo title="Create your poll" />
      <div className="container max-w-4xl">
        <CreatePollForm />
      </div>
    </>
  );
}

CreatePollPage.getLayout = getLayout(BaseLayout);
