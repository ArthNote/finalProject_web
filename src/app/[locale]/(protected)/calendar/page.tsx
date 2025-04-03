import CalendarView from "@/components/calendar/calendar";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar | Task Management",
  description: "View and manage your schedule and upcoming tasks",
};

export default function CalendarPage() {
  return (
    <div className="relative h-[calc(100vh-4rem)] w-full p-4 sm:p-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      <CalendarView />
    </div>
  );
}
