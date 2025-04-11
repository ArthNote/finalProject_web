import { BarChart3, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { ProgressAnalyticsProps } from "@/types/goals";



const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ stats }) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <h3 className="font-semibold text-xl flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-muted-foreground" /> Progress
          Analytics
        </h3>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Weekly Completion Rate */}
          <div className="border rounded-md p-4 hover:shadow-sm transition-shadow">
            <h4 className="font-medium text-sm mb-1">Weekly Goal Completion</h4>
            <div className="text-3xl font-bold">78%</div>
            <p className="text-xs text-green-500 font-medium mt-1 flex items-center">
              <ChevronRight className="h-4 w-4 -rotate-90" /> 12% from last week
            </p>

            <div className="h-24 mt-3 flex items-end justify-between gap-1">
              {[30, 45, 60, 75, 50, 85, 78].map((value, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t bg-gradient-to-t from-primary to-primary/80"
                  style={{ height: `${value}%` }}
                ></div>
              ))}
            </div>

            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
          </div>

          {/* Goal Completion By Type */}
          <div className="border rounded-md p-4 hover:shadow-sm transition-shadow">
            <h4 className="font-medium text-sm mb-1">
              Goal Completion By Type
            </h4>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-bold">65%</div>
                <p className="text-xs text-muted-foreground">monthly average</p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm flex items-center gap-1.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          stat.color === "blue"
                            ? "bg-blue-500"
                            : stat.color === "purple"
                            ? "bg-purple-500"
                            : "bg-amber-500"
                        }`}
                      ></div>
                      {stat.label}
                    </span>
                    <span className="text-sm font-medium flex items-center">
                      {stat.value}%
                      {stat.change && stat.change > 0 && (
                        <span className="text-xs text-green-500 ml-1.5">
                          +{stat.change}%
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        stat.color === "blue"
                          ? "bg-blue-500"
                          : stat.color === "purple"
                          ? "bg-purple-500"
                          : "bg-amber-500"
                      } rounded-full`}
                      style={{ width: `${stat.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Success Rate */}
          <div className="border rounded-md p-4 hover:shadow-sm transition-shadow">
            <h4 className="font-medium text-sm mb-1">Category Success Rate</h4>
            <div className="space-y-4 mt-3">
              {[
                { category: "Work", rate: 82, color: "bg-blue-500" },
                { category: "Personal", rate: 65, color: "bg-green-500" },
                { category: "Health", rate: 45, color: "bg-red-500" },
                { category: "Learning", rate: 90, color: "bg-purple-500" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{item.category}</span>
                    <span className="text-sm font-medium">{item.rate}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" className="w-full mt-4 text-xs">
              View Detailed Analytics
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
