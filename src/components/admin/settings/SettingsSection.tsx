"use client";

import React from "react";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import { clsx } from "clsx";

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}

export default function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <Card
      className={clsx(
        "border-0 shadow-lg hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100">
              <Icon className="h-5 w-5 text-purple-600" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
