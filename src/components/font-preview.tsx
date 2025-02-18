import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { FontSetting } from "@/lib/fonts";

interface FontPreviewProps {
  font: FontSetting;
  label: string;
  sample: string;
  isSelected: boolean;
  onClick: () => void;
}

export function FontPreview({
  font,
  label,
  sample,
  isSelected,
  onClick,
}: FontPreviewProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "w-full h-auto flex-col items-start gap-2 p-4",
        isSelected && "border-2 border-primary",
        `font-${font}`
      )}
      onClick={onClick}
    >
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground text-left">{sample}</div>
    </Button>
  );
}
