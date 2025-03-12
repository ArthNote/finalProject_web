import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const ProfileSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="grid gap-8 md:grid-cols-[150px_1fr]">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="h-3 w-full" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-full mt-2 block lg:hidden" />
        </div>
      </div>
    </div>
  );
};

export const SecuritySkeleton = () => {
  return (
    <div className="space-y-4">
      <div>
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-60" />
      </div>

      {/* Password section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6">
        <div>
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-9 w-28 mt-2 sm:mt-0" />
      </div>

      {/* Email verification section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6">
        <div>
          <Skeleton className="h-4 w-36 mb-2" />
          <Skeleton className="h-3 w-52" />
        </div>
        <Skeleton className="h-9 w-28 mt-2 sm:mt-0" />
      </div>

      {/* Two-factor section */}
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-6 w-10" />
      </div>

      {/* Connected accounts section */}
      <div>
        <Skeleton className="h-4 w-40 mb-4" />
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const SessionsSkeleton = () => {
  return (
    <div className="space-y-4">
      <div>
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-60" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex justify-between items-center p-4 rounded-lg border"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[180px]" />
            </div>
            <Skeleton className="h-8 w-[80px]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const DeleteAccountSkeleton = () => {
  return (
    <div className="space-y-4">
      <div>
        <Skeleton className="h-6 w-40 mb-1" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  );
};

export const AccountTabSkeleton = () => {
  return (
    <div className="space-y-8">
      <Skeleton className="h-7 w-48" />

      <ProfileSkeleton />

      <Separator className="my-6" />

      <SecuritySkeleton />

      <Separator className="my-6" />

      <SessionsSkeleton />

      <Separator className="my-6" />

      <DeleteAccountSkeleton />
    </div>
  );
};
