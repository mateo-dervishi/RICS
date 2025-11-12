"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { Session } from "@supabase/supabase-js";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { Toaster } from "sonner";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface ProvidersProps {
  initialSession?: Session | null;
  children: React.ReactNode;
}

export function Providers({ children, initialSession }: ProvidersProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </ThemeProvider>
    </SessionContextProvider>
  );
}
