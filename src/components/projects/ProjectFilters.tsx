"use client";

import { useTranslations } from "next-intl";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectFiltersProps, SortBy } from "../../types/projectTypes";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ProjectFilters({
  status,
  priority,
  sortBy,
  onStatusChange,
  onPriorityChange,
  onSortChange,
}: ProjectFiltersProps) {
  const t = useTranslations("Projects.filters");

  const handleSortChange = (value: string) => {
    onSortChange(value as SortBy);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Status filter */}
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[140px] md:w-[160px]">
          <SelectValue placeholder={t("status.label")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("status.options.all")}</SelectItem>
          <SelectItem value="not-started">
            {t("status.options.not-started")}
          </SelectItem>
          <SelectItem value="active">{t("status.options.active")}</SelectItem>
          <SelectItem value="on-hold">{t("status.options.on-hold")}</SelectItem>
          <SelectItem value="completed">
            {t("status.options.completed")}
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Priority filter */}
      <Select value={priority} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-full sm:w-[140px] md:w-[160px]">
          <SelectValue placeholder={t("priority.label")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("priority.options.all")}</SelectItem>
          <SelectItem value="low">{t("priority.options.low")}</SelectItem>
          <SelectItem value="medium">{t("priority.options.medium")}</SelectItem>
          <SelectItem value="high">{t("priority.options.high")}</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort options */}
      <Select value={sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-full sm:w-[140px] md:w-[160px]">
          <SelectValue placeholder={t("sort.label")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updatedAt">
            {t("sort.options.lastUpdated")}
          </SelectItem>
          <SelectItem value="dueDate">{t("sort.options.dueDate")}</SelectItem>
          <SelectItem value="name">{t("sort.options.name")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
