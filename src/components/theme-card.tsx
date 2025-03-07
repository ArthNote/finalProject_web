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
        card: "relative overflow-hidden bg-white", // Base style for system theme
        border: "border-zinc-400",
        dots: "bg-zinc-500",
        mockContent: "bg-zinc-300",
        darkOverlay: "absolute top-0 right-0 w-1/2 h-full bg-zinc-950 z-10",
        darkContent: "absolute top-0 right-0 w-1/2 h-full z-20",
      };
    }
    return {
      card: theme === "dark" ? "bg-zinc-950" : "bg-white", // Simple dark background
      border: theme === "dark" ? "border-zinc-800" : "border-zinc-200",
      dots: theme === "dark" ? "bg-zinc-600" : "bg-zinc-300",
      mockContent: theme === "dark" ? "bg-zinc-800" : "bg-zinc-300",
      darkOverlay: "",
      darkContent: "",
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
      {/* Dark overlay for system theme */}
      {theme === "system" && <div className={styles.darkOverlay} />}

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

      {/* Dark side content for system theme */}
      {theme === "system" && (
        <div className={styles.darkContent}>
          <div className="border-b border-zinc-800 h-8">
            <div className="flex gap-1.5 px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="w-1/2 h-4 rounded bg-zinc-800" />
            <div className="w-full h-3 rounded bg-zinc-800" />
            <div className="w-4/5 h-3 rounded bg-zinc-800" />
          </div>
        </div>
      )}
    </Card>
  );
}
