"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { UserProvider } from "@/lib/user-context";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <UserProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </ThemeProvider>
    </UserProvider>
  );
}
