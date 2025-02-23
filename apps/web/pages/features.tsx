import { Features } from "../components/features";
import { BaseLayout } from "../layouts";
import { getLayout } from "../utils/get-layout";

export default function FeaturesPage() {
  return (
    <>
      <Features />
    </>
  );
}

FeaturesPage.getLayout = getLayout(BaseLayout);
