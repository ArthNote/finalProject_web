import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Gift, Target, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const GoalsSkeleton = () => {
  return (
    <div className="w-full space-y-8">
      {/* Hero Section with Level and Quote */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 p-4 sm:p-0">
        {/* Level Card */}
        <Card className="col-span-1 lg:col-span-3 relative overflow-hidden border-2 border-primary/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mt-10 -mr-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -mb-8 -ml-8" />

          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center">
                  <Trophy className="mr-2 h-6 w-6 text-yellow-500/60" />
                  <Skeleton className="h-8 w-24" />
                </CardTitle>
                <CardDescription className="text-base">
                  <Skeleton className="h-5 w-72 mt-2" />
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="text-lg px-3 py-1 bg-primary/10 border-primary/20"
              >
                <Zap className="mr-2 h-5 w-5 text-yellow-500/60" />
                <Skeleton className="h-5 w-12 ml-1" />
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Level Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-48" />
            </div>

            {/* Next Level Rewards */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium flex items-center">
                <Gift className="mr-2 h-4 w-4 text-primary/60" />
                <Skeleton className="h-4 w-36" />
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="bg-muted/50 border border-primary/10"
                  >
                    <CardContent className="p-4 flex items-start space-x-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="space-y-1 w-full">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-3 w-full mt-1" />
                        <Skeleton className="h-3 w-3/4 mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Skeleton className="h-6 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-8 w-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <Skeleton className="h-4 w-24 mx-auto" />
              <Skeleton className="h-3 w-36 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center space-x-4 mb-6 p-4 sm:p-0">
        <div className="hidden sm:flex items-center space-x-4">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="sm:hidden flex items-center space-x-4 w-full">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <CardTitle>
                <Skeleton className="h-6 w-40" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-64 mt-2" />
              </CardDescription>
            </div>
            <Skeleton className="h-10 w-32 mt-2 sm:mt-0" />
          </CardHeader>
          <CardContent>
            <div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="border border-muted">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div className="flex items-start space-x-3 flex-1">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <div className="pt-2">
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                      </div>
                      <Skeleton className="h-9 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoalsSkeleton;
