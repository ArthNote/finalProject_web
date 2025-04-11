"use client";

import { Suspense } from "react";
import TeamPage from "@/components/team/team";
import { TeamProvider } from "@/components/team/team-context";

const Page = () => {
  return (
    <TeamProvider>
      <TeamPage />
    </TeamProvider>
  );
};

export default Page;
