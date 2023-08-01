import { Link, Outlet, useLocation } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { scenarios } from "./scenarios.$scenario";

export default function Scenarios() {
  return (
    <div>
      {/* <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur"> */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        {/* <div className="container flex h-16 items-center"> */}
        <div className="container">
          <MainNav />
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export function MainNav() {
  const pathname = useLocation().pathname;

  return (
    <div className="flex">
      <Link to="/scenarios" className="mr-6">
        <img src="/continue-well-logo.jpg" alt="ContinueWell" className="h-16"/>
      </Link>
      <nav className="flex items-center space-x-6 font-medium mr-auto" >
        {scenarios.map((scenario) => {
          return (
            <Link
              key={scenario.dynamicSegment}
              to={`/scenarios/${scenario.dynamicSegment}`}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname?.startsWith(`/scenarios/${scenario.dynamicSegment}`)
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {scenario.title}
            </Link>
          );
        })}
      </nav>
      <img src="/sjrh-logo.png" alt="SJRH" className="h-16"/>
    </div>
  );
}
