"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { Loader2 } from "lucide-react";
import { FirebaseClientProvider } from "@/firebase";

function Redirector() {
  const router = useRouter();
  const { user: isAuthenticated, isUserLoading: loading } = useUser();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function Home() {
  return (
    <FirebaseClientProvider>
        <Redirector />
    </FirebaseClientProvider>
  )
}
