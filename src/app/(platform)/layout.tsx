"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/user-context";
import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type NavRoute = {
  href: Route;
  label: string;
};

const routes: NavRoute[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/competencies", label: "Competencies" },
  { href: "/experience", label: "Experience" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/cpd", label: "CPD" },
  { href: "/summary-of-experience", label: "Summary" },
  { href: "/documents", label: "Documents" },
  { href: "/interview", label: "Interview" },
  { href: "/resources", label: "Resources" }
];

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href={"/" as Route} className="font-semibold text-lg">
            RICS APC Assistant
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn("rounded-md px-3 py-2 hover:bg-muted hover:text-foreground transition-colors")}
              >
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.fullName || user?.email || "User"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/onboarding")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
