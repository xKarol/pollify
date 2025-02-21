import { Icon } from "@pollify/ui";
import React from "react";

import { BaseLayout } from "../layouts";

const HomePage = () => {
  return (
    <BaseLayout>
      <Icon.Loader2 className="m-auto animate-spin" />
    </BaseLayout>
  );
};

export default HomePage;
