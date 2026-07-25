import { Tags, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/categories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
            <Tags className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Category {id}
          </h1>
        </div>
      </div>

      {/* ── Detail card ── */}
      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>
            View and manage this category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Category ID: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{id}</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
