import Link from "next/link";
import { SearchX, Home } from "lucide-react";
import { Button } from "@/shared/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-muted p-4">
          <SearchX className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            Page not found
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>
      </div>
      <Button asChild className="gap-2">
        <Link href="/">
          <Home className="h-4 w-4" />
          Return Home
        </Link>
      </Button>
    </div>
  );
}
