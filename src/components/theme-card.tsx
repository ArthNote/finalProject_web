import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ThemeCard({
  theme,
  selectedTheme,
  onSelect,
}: {
  theme: "light" | "dark" | "system";
  selectedTheme: string;
  onSelect: (theme: "light" | "dark" | "system") => void;
}) {
  const getThemeStyles = (theme: "light" | "dark" | "system") => {
    if (theme === "system") {
      return {
        card: "bg-linear-to-br from-white to-zinc-950",
        border: "border-zinc-400",
        dots: "bg-zinc-500",
        mockContent: "bg-linear-to-r from-zinc-300 to-zinc-700",
      };
    }
    return {
      card: theme === "dark" ? "bg-zinc-950" : "bg-white",
      border: theme === "dark" ? "border-zinc-800" : "border-zinc-200",
      dots: theme === "dark" ? "bg-zinc-700" : "bg-zinc-300",
      mockContent: theme === "dark" ? "bg-zinc-800" : "bg-zinc-200",
    };
  };

  const styles = getThemeStyles(theme);

  return (
    <Card
      className={cn(
        "relative cursor-pointer border-2 w-full h-48 transition-all",
        styles.card,
        selectedTheme === theme
          ? "border-primary"
          : "border-muted hover:border-muted-foreground"
      )}
      onClick={() => onSelect(theme)}
    >
      {/* Header mockup */}
      <div className={cn("w-full h-8 border-b", styles.border)}>
        <div className="flex gap-1.5 px-3 py-2">
          <div className={cn("w-2 h-2 rounded-full", styles.dots)} />
          <div className={cn("w-2 h-2 rounded-full", styles.dots)} />
          <div className={cn("w-2 h-2 rounded-full", styles.dots)} />
        </div>
      </div>

      {/* Content mockup */}
      <div className="p-4 space-y-3">
        <div className={cn("w-1/2 h-4 rounded", styles.mockContent)} />
        <div className={cn("w-full h-3 rounded", styles.mockContent)} />
        <div className={cn("w-4/5 h-3 rounded", styles.mockContent)} />
      </div>
    </Card>
  );
}
