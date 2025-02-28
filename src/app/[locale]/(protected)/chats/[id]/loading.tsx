import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import {
  ChevronLeft,
  MoreVertical,
  Phone,
  Video,
  Search,
  Paperclip,
  Smile,
  AtSign,
} from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="container py-6 h-[calc(100vh-4rem)]">
      <Card className="grid lg:grid-cols-[1fr,280px] h-full overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <CardHeader className="px-4 py-2 border-b space-y-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" disabled>
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" disabled>
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" disabled>
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" disabled>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages Section */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`flex gap-3 ${i % 2 === 0 ? "justify-end" : ""}`}>
                  {i % 2 !== 0 && (
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                  )}
                  <div className={`space-y-2 ${i % 2 === 0 ? "items-end" : "items-start"}`}>
                    {i % 2 !== 0 && <Skeleton className="h-4 w-24" />}
                    <Skeleton className={`h-${10 + (i % 2) * 4} w-[${180 + (i % 3) * 40}px] rounded-lg`} />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <CardFooter className="p-4 border-t">
            <div className="flex items-center gap-2 w-full">
              <Button variant="ghost" size="icon" disabled>
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" disabled>
                <AtSign className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" disabled>
                <Smile className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardFooter>
        </div>

        {/* Right Sidebar - Info Panel */}
        <div className="hidden lg:block border-l">
          <CardHeader>
            <div className="text-center">
              <Skeleton className="h-20 w-20 rounded-full mx-auto" />
              <Skeleton className="h-6 w-40 mx-auto mt-2" />
              <Skeleton className="h-4 w-56 mx-auto mt-1" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Skeleton className="h-5 w-16 mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2 p-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-2 w-2 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-16 mb-2" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-9 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default LoadingPage;
