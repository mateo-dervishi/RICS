import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";

type NavRoute = {
  href: Route;
  label: string;
};

const routes: NavRoute[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/advisor", label: "Advisor" },
  { href: "/modules", label: "Modules" },
  { href: "/community", label: "Community" }
];

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href={"/" as Route} className="font-semibold">
            RICS Career Platform
          </Link>
          <nav className="flex items-center gap-3 text-sm text-muted-foreground">
            {routes.map((route) => (
              <Link key={route.href} href={route.href} className={cn("rounded-md px-3 py-1 hover:bg-muted hover:text-foreground")}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
