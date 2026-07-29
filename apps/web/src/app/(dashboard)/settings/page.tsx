/**
 * Страница настроек профиля (`/settings`).
 * Отображает секции: Профиль, Уведомления, Внешний вид и Безопасность
 * с соответствующими полями и значениями.
 */
"use client";

import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

const sections = [
  {
    title: "Profile",
    description: "Manage your personal information",
    icon: User,
    items: [
      { label: "Full Name", value: "Alex Johnson" },
      { label: "Email", value: "alex@example.com" },
      { label: "Currency", value: "USD ($)" },
    ],
  },
  {
    title: "Notifications",
    description: "Configure how you receive alerts",
    icon: Bell,
    items: [
      { label: "Email Notifications", value: "Enabled" },
      { label: "Budget Alerts", value: "Enabled" },
      { label: "Weekly Report", value: "Disabled" },
    ],
  },
  {
    title: "Appearance",
    description: "Customize the look and feel",
    icon: Palette,
    items: [
      { label: "Theme", value: "Light" },
      { label: "Language", value: "English" },
    ],
  },
  {
    title: "Security",
    description: "Password and authentication settings",
    icon: Shield,
    items: [
      { label: "Password", value: "Last changed 3 months ago" },
      { label: "Two-Factor Auth", value: "Not enabled" },
    ],
  },
];

/**
 * Страница настроек аккаунта и приложения.
 *
 * @returns JSX-разметка страницы настроек.
 */
export default function SettingsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
            <Settings className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        </div>
        <p className="mt-1 text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      {/* ── Settings Sections ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="animate-slide-up">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {section.title}
                    </CardTitle>
                    <CardDescription>
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
                    >
                      <span className="text-sm">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {item.value}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
