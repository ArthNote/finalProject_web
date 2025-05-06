import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface TimeFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onTimeChange?: (value: string) => void;
}

const TimeField = React.forwardRef<HTMLInputElement, TimeFieldProps>(
  ({ className, onTimeChange, onChange, ...props }, ref) => {
    // Custom handler to call both the regular onChange and our time-specific handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
      if (onTimeChange) {
        onTimeChange(e.target.value);
      }
    };

    return (
      <Input
        type="time"
        className={cn(className)}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    );
  }
);

TimeField.displayName = "TimeField";

export { TimeField };
