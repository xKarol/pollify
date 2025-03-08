import { cn } from "@pollify/lib";
import { Icon, Sheet, SheetContent, SheetTrigger } from "@pollify/ui";
import React, { useEffect, useState } from "react";
import { useMedia } from "react-use";

import { DashboardMobileHeader } from "../../../components/dashboard-mobile-header";
import { Sidebar } from "../components";

type Props = React.ComponentPropsWithoutRef<"div">;

export default function BaseLayout({ className, children, ...props }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isNotMobile = useMedia("(min-width: 768px)", true);

  useEffect(() => {
    setIsOpen(false);
  }, [isNotMobile, setIsOpen]);

  return (
    <main className={cn("flex", className)} {...props}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <DashboardMobileHeader
          MenuComponent={
            <SheetTrigger>
              <Icon.Menu />
            </SheetTrigger>
          }
          className="md:hidden"
          onOpen={() => setIsOpen(true)}
        />

        <SheetContent side="left" className="w-fit p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>
      <Sidebar className={cn("hidden md:flex", isOpen && "hidden")} />
      <div className="container mt-12 flex max-w-7xl flex-1 flex-col space-y-6 pb-6 md:mt-0">
        {children}
      </div>
    </main>
  );
}
