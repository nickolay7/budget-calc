"use client";

import Link from "next/link";
import { Tags, Plus, Pencil } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { cn } from "@/shared/lib/cn";

const categoryColors = [
  { name: "Food & Dining", color: "bg-orange-500", count: 24 },
  { name: "Transportation", color: "bg-blue-500", count: 12 },
  { name: "Utilities", color: "bg-yellow-500", count: 6 },
  { name: "Entertainment", color: "bg-purple-500", count: 8 },
  { name: "Shopping", color: "bg-pink-500", count: 15 },
  { name: "Healthcare", color: "bg-emerald-500", count: 4 },
  { name: "Income", color: "bg-green-500", count: 10 },
  { name: "Other", color: "bg-gray-500", count: 3 },
];

export default function CategoriesPage() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
              <Tags className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          </div>
          <p className="mt-1 text-muted-foreground">
            Organize your transactions with custom categories
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* ── Category Grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categoryColors.map((cat) => (
          <Card
            key={cat.name}
            className="card-hover animate-slide-up overflow-hidden"
          >
            <div className={cn("h-1.5", cat.color)} />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div
                  className={cn("h-3 w-3 rounded-full", cat.color)}
                />
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
              <CardTitle className="mt-2 text-base">{cat.name}</CardTitle>
              <CardDescription>{cat.count} transactions</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* ── Empty state (hidden when categories exist) ── */}
      {categoryColors.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Tags className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <h3 className="text-lg font-semibold">No categories yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Create categories to organize your transactions and track your
              spending habits.
            </p>
            <Button className="mt-6 gap-1">
              <Plus className="h-4 w-4" />
              Create Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
