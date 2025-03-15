import React from "react";
import { Calendar, Check, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const GridView = () => {
  return (
    <div>
      <h3 className="font-medium text-base mb-4">Grid View</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm">Sample Task {i}</h4>
                <Badge
                  variant="outline"
                  className={`
                  ${
                    i % 3 === 0
                      ? "border-red-300 text-red-500 bg-red-50 dark:bg-red-500/10"
                      : i % 3 === 1
                      ? "border-amber-300 text-amber-500 bg-amber-50 dark:bg-amber-500/10"
                      : "border-green-300 text-green-500 bg-green-50 dark:bg-green-500/10"
                  }
                `}
                >
                  {i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 pb-2">
              <p className="text-sm text-muted-foreground">
                This is a sample task description for demonstrating the grid
                view layout
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-2 flex justify-between items-center text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Jun {10 + i}, 2023
              </span>
              <Badge variant="secondary" className="text-xs">
                Work
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GridView;
