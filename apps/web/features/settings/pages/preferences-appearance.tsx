import { RadioGroup, RadioGroupItem } from "@pollify/ui";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

import { SettingsHeader, ThemeCard } from "../components";
import { BaseLayout } from "../layouts";

const themes = ["light", "dark", "system"] as const;

export default function AccountGeneralPage() {
  return (
    <BaseLayout>
      <SettingsHeader
        heading="Appearance"
        description="Manage your account preferences"
      />
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <ThemesCards />
        {/* TODO add sekeleton on server */}
      </div>
    </BaseLayout>
  );
}

function ThemesCards() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <RadioGroup
      defaultValue={theme}
      onValueChange={(theme) => setTheme(theme)}
      asChild>
      <React.Fragment>
        {themes.map((themeName) => (
          <ThemeCard
            key={themeName}
            variant={themeName}
            isActive={theme === themeName}
            RadioInput={<RadioGroupItem value={themeName} />}
          />
        ))}
      </React.Fragment>
    </RadioGroup>
  );
}
