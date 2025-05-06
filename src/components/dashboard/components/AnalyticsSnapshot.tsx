"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { getTaskAnalytics } from "@/lib/api/tasks";

const AnalyticsSnapshot = () => {
  const t = useTranslations("dashboard.analytics");
  const [timeframe, setTimeframe] = useState("week");

  // Fetch task analytics data
  const { data, isLoading } = useQuery({
    queryKey: ["task-analytics", timeframe],
    queryFn: async () => {
      const response = await getTaskAnalytics(timeframe);

      // Process data for chart
      return response.data.map((item) => ({
        date: format(parseISO(item.date), "MMM d"),
        completed: item.completed,
        created: item.created,
      }));
    },
  });

  // Loading state
  if (isLoading) {
    return <div className="animate-pulse h-48 bg-muted rounded" />;
  }

  return (
    <div className="space-y-4">
      <Tabs value={timeframe} onValueChange={setTimeframe} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="week">{t("week")}</TabsTrigger>
          <TabsTrigger value="month">{t("month")}</TabsTrigger>
          <TabsTrigger value="quarter">{t("quarter")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="date"
              fontSize={11}
              tick={{ fill: "var(--muted-foreground)" }}
            />
            <YAxis
              fontSize={11}
              tick={{ fill: "var(--muted-foreground)" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                borderRadius: "6px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line
              name={t("tasksCreated")}
              type="monotone"
              dataKey="created"
              stroke="#2563eb" // Blue
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              name={t("tasksCompleted")}
              type="monotone"
              dataKey="completed"
              stroke="#10b981" // Green
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* <Button
        variant="outline"
        size="sm"
        className="w-full text-xs text-muted-foreground gap-1"
      >
        {t("viewDetailedAnalytics")}
        <ChevronRight className="h-3 w-3" />
      </Button> */}
    </div>
  );
};

export default AnalyticsSnapshot;
