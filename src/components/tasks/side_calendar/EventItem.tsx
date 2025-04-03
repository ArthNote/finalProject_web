import React from "react";
import { format, differenceInMinutes, startOfDay, addMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import { GripVertical, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TaskType } from "@/types/task";
import { useCalendarStore } from "@/lib/state/useCalendarStore";
import { useLocale } from "next-intl";
import { enUS, fr } from "date-fns/locale";

// Get the color based on priority
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-amber-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-blue-500";
  }
};

interface EventItemProps {
  event: TaskType;
  selectedDate: Date;
  timelineRef: React.MutableRefObject<HTMLDivElement | null>;
  onSelect: (event: TaskType) => void;
  onUpdate: (updatedEvent: TaskType) => void;
}

export const EventItem: React.FC<EventItemProps> = ({
  event,
  selectedDate,
  timelineRef,
  onSelect,
  onUpdate,
}) => {
  const locale = useLocale() as "fr" | "en" ;
  const eventRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [resizing, setResizing] = React.useState(false);
  const [initialPos, setInitialPos] = React.useState({ x: 0, y: 0 });
  const [initialEventPos, setInitialEventPos] = React.useState({
    top: 0,
    height: 0,
  });
  const clickTimer = React.useRef<NodeJS.Timeout | null>(null);
  const clickCount = React.useRef(0);

  // Get the double-clicking flag and setter from store
  const setIsDoubleClicking = useCalendarStore(
    (state) => state.setIsDoubleClicking
  );

  // Calculate the initial position and height as a percentage of the day
  const calculateEventPosition = () => {
    const dayStart = startOfDay(selectedDate);

    // Use startTime if available, otherwise use dueDate
    const eventStart = event.startTime
      ? new Date(event.startTime)
      : new Date(event.date || "");

    // Calculate end time: use endTime if available, or calculate from duration, or default to 1 hour
    const eventEnd = event.endTime
      ? new Date(event.endTime)
      : event.duration
      ? addMinutes(eventStart, event.duration)
      : addMinutes(eventStart, 60);

    const minutesSinceMidnight = differenceInMinutes(eventStart, dayStart);
    const durationMinutes = differenceInMinutes(eventEnd, eventStart);

    const topPercent = (minutesSinceMidnight / (24 * 60)) * 100;
    const heightPercent = (durationMinutes / (24 * 60)) * 100;

    return {
      top: `${topPercent}%`,
      height: `${Math.max(heightPercent, 1)}%`, // Reduced minimum height for better fitting
      durationMinutes, // Add this to help determine content
    };
  };

  const eventPosition = calculateEventPosition();

  // Function to format duration for display
  const getDurationText = () => {
    const minutes = eventPosition.durationMinutes;
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours}h ${remainingMinutes}m`
        : `${hours}h`;
    }
    return `${minutes}m`;
  };

  // Convert position back to time (when dragging or resizing ends)
  const positionToTime = (topPercent: number, heightPercent: number) => {
    const totalMinutes = 24 * 60;
    const startMinutes = Math.round((topPercent / 100) * totalMinutes);
    const durationMinutes = Math.round((heightPercent / 100) * totalMinutes);

    const dayStart = startOfDay(selectedDate);
    const newStart = addMinutes(dayStart, startMinutes);
    const newEnd = addMinutes(dayStart, startMinutes + durationMinutes);

    return {
      startTime: newStart.toISOString(),
      endTime: newEnd.toISOString(),
      duration: durationMinutes,
    };
  };

  // Clear any existing click timer
  const clearClickTimer = () => {
    if (clickTimer.current !== null) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
  };

  // Reset click count
  const resetClickCount = () => {
    clearClickTimer();
    clickCount.current = 0;
    setIsDoubleClicking(false);
  };

  // Event handlers for dragging
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0 || resizing) return; // Only left click and not while resizing

    // Don't start dragging when clicking on resize handle
    if ((e.target as HTMLElement).closest(".resize-handle")) {
      return;
    }

    e.preventDefault();

    // Check if we're in a double-click scenario
    if (clickCount.current >= 1) {
      // Set the double-clicking flag to true to prevent updates
      setIsDoubleClicking(true);
      clickCount.current += 1;

      if (clickCount.current >= 2) {
        // This is a double-click, so don't start dragging
        setTimeout(() => {
          resetClickCount();
        }, 300);
        return;
      }
    }

    setDragging(true);

    // Record the initial mouse position
    setInitialPos({ x: e.clientX, y: e.clientY });

    if (eventRef.current && timelineRef.current) {
      const rect = eventRef.current.getBoundingClientRect();
      const timelineRect = timelineRef.current.getBoundingClientRect();

      // Calculate top position as a percentage of the timeline height
      const topPercent =
        ((rect.top - timelineRect.top) / timelineRect.height) * 100;
      const heightPercent = (rect.height / timelineRect.height) * 100;

      setInitialEventPos({ top: topPercent, height: heightPercent });
    }

    // Add document-level handlers
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!dragging || !eventRef.current || !timelineRef.current) return;

    const deltaY = e.clientY - initialPos.y;
    const timelineHeight = timelineRef.current.clientHeight;

    // Calculate the new top position as a percentage
    const deltaPercent = (deltaY / timelineHeight) * 100;
    let newTopPercent = initialEventPos.top + deltaPercent;

    // Clamp to timeline bounds (0% to 100% - height)
    newTopPercent = Math.max(
      0,
      Math.min(100 - initialEventPos.height, newTopPercent)
    );

    // Apply the new position with a smooth transition
    eventRef.current.style.transition = "none";
    eventRef.current.style.top = `${newTopPercent}%`;
  };

  const handleDragEnd = () => {
    if (!dragging || !eventRef.current || !timelineRef.current) return;

    setDragging(false);

    // Reset the double-clicking flag
    setIsDoubleClicking(false);

    // Get the final position
    const rect = eventRef.current.getBoundingClientRect();
    const timelineRect = timelineRef.current.getBoundingClientRect();

    const finalTopPercent =
      ((rect.top - timelineRect.top) / timelineRect.height) * 100;
    const finalHeightPercent = (rect.height / timelineRect.height) * 100;

    // Convert position to time and update the event
    const newTimes = positionToTime(finalTopPercent, finalHeightPercent);

    // Reset transition and update the event data
    eventRef.current.style.transition = "";

    onUpdate({
      ...event,
      startTime: new Date(newTimes.startTime),
      endTime: new Date(newTimes.endTime),
      date: new Date(newTimes.startTime), // Keep dueDate synchronized with startTime
      duration: newTimes.duration,
    });

    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
  };

  // Event handlers for resizing
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (dragging) return;

    // Don't start resizing on double-click
    if (clickCount.current >= 1) {
      setIsDoubleClicking(true);
      return;
    }

    setResizing(true);

    setInitialPos({ x: e.clientX, y: e.clientY });

    if (eventRef.current && timelineRef.current) {
      const rect = eventRef.current.getBoundingClientRect();
      const timelineRect = timelineRef.current.getBoundingClientRect();

      const topPercent =
        ((rect.top - timelineRect.top) / timelineRect.height) * 100;
      const heightPercent = (rect.height / timelineRect.height) * 100;

      setInitialEventPos({ top: topPercent, height: heightPercent });
    }

    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizing || !eventRef.current || !timelineRef.current) return;

    const deltaY = e.clientY - initialPos.y;
    const timelineHeight = timelineRef.current.clientHeight;

    // Calculate the height change as a percentage
    const deltaPercent = (deltaY / timelineHeight) * 100;

    // Calculate what percentage equals 15 minutes (our minimum)
    // 15 minutes is 15/(24*60) = 15/1440 = 0.0104 of a day, or 1.04% of the timeline
    const fifteenMinPercent = (15 / (24 * 60)) * 100;

    // Ensure minimum height equals 15 minutes
    let newHeightPercent = Math.max(
      fifteenMinPercent,
      initialEventPos.height + deltaPercent
    );

    // Ensure the event doesn't extend past the end of the day
    newHeightPercent = Math.min(100 - initialEventPos.top, newHeightPercent);

    // Apply the new height with a smooth transition
    eventRef.current.style.transition = "none";
    eventRef.current.style.height = `${newHeightPercent}%`;
  };

  const handleResizeEnd = () => {
    if (!resizing || !eventRef.current || !timelineRef.current) return;

    setResizing(false);

    // Reset the double-clicking flag
    setIsDoubleClicking(false);

    // Get the final position and size
    const rect = eventRef.current.getBoundingClientRect();
    const timelineRect = timelineRef.current.getBoundingClientRect();

    const finalTopPercent =
      ((rect.top - timelineRect.top) / timelineRect.height) * 100;
    const finalHeightPercent = (rect.height / timelineRect.height) * 100;

    // Convert position to time and update the event
    const newTimes = positionToTime(finalTopPercent, finalHeightPercent);

    // Reset transition and update the event data
    eventRef.current.style.transition = "";

    onUpdate({
      ...event,
      startTime: new Date(newTimes.startTime),
      endTime: new Date(newTimes.endTime),
      date: new Date(newTimes.startTime), // Keep dueDate synchronized with startTime
      duration: newTimes.duration,
    });

    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
  };

  // Handle event clicks with better double-click detection
  const handleEventClick = (e: React.MouseEvent) => {
    if (dragging || resizing) return;

    // Don't trigger when clicking on the handles
    if (
      (e.target as HTMLElement).closest(".drag-handle") ||
      (e.target as HTMLElement).closest(".resize-handle")
    ) {
      return;
    }

    e.preventDefault();

    // Increment click count
    clickCount.current += 1;

    // Clear any existing timer
    clearClickTimer();

    // If this might be a double-click, set the flag
    if (clickCount.current >= 1) {
      setIsDoubleClicking(true);
    }

    // Set a timer to check if this is a single or double click
    clickTimer.current = setTimeout(() => {
      // If single click, just select the event
      if (clickCount.current === 1) {
        setIsDoubleClicking(false);
        onSelect(event);
      }
      // For double-click, keep the flag set for a bit longer then reset
      else if (clickCount.current >= 2) {
        setTimeout(() => {
          setIsDoubleClicking(false);
        }, 300);
      }
      // Reset click count after handling
      clickCount.current = 0;
    }, 300); // 300ms is standard double-click time threshold
  };

  // Clean up timers when component unmounts
  React.useEffect(() => {
    return () => {
      clearClickTimer();
      setIsDoubleClicking(false);
    };
  }, [setIsDoubleClicking]);

  return (
    <div
      ref={eventRef}
      className={cn(
        "absolute left-0 right-7 rounded-md shadow-sm pointer-events-auto",
        "transition-shadow duration-150",
        dragging && "opacity-80 cursor-grabbing shadow-md z-30",
        resizing && "opacity-90 z-30",
        !dragging && !resizing && "hover:shadow-md cursor-pointer",
        event.completed
          ? "bg-gray-400 opacity-60"
          : getPriorityColor(event.priority)
      )}
      style={{
        top: eventPosition.top,
        height: eventPosition.height,
      }}
      onMouseDown={handleDragStart}
      onClick={handleEventClick}
    >
      {/* Content container with padding to leave space for resize handle */}
      <div className="p-2 pb-6 h-full">
        <div className="flex flex-col h-full text-white relative">
          {/* Render different content based on the duration */}
          {eventPosition.durationMinutes <= 15 ? (
            // Ultra-minimal version for very short events (15 min or less) - maintain consistent font size
            <div className="text-xs font-medium truncate h-full flex items-center">
              {event.title}
            </div>
          ) : eventPosition.durationMinutes <= 30 ? (
            // Minimal version for short events (16-30 min) - same font size as above
            <div className="text-xs font-medium truncate">{event.title}</div>
          ) : (
            // Full version for longer events
            <>
              {/* Drag handle */}
              <div className="drag-handle absolute top-0 right-0 p-1 cursor-grab opacity-50 hover:opacity-100">
                <GripVertical className="h-3 w-3" />
              </div>

              <div className="text-xs font-medium flex items-center justify-between">
                <span>
                  {format(
                    new Date(event.startTime || event.date || ""),
                    "h:mm a",
                    {
                      locale: locale === "fr" ? fr : enUS,
                    }
                  )}
                </span>
                {event.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
              </div>

              <div className="font-medium text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                {event.title}
              </div>

              {/* Only show these for events longer than 45 minutes */}
              {eventPosition.durationMinutes > 45 && (
                <>
                  {/* Display duration */}
                  <div className="text-xs flex items-center mt-0.5">
                    <Clock className="h-3 w-3 mr-1 opacity-80" />
                    <span>{getDurationText()}</span>
                  </div>

                  {/* Display task category */}
                  {event.category && (
                    <Badge
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white text-xs mt-1 w-fit"
                    >
                      {event.category}
                    </Badge>
                  )}

                  {/* Display task tags */}
                  {event.tags &&
                    event.tags.length > 0 &&
                    eventPosition.durationMinutes > 60 && (
                      <div className="flex mt-auto pt-1 gap-1 flex-wrap">
                        {event.tags.slice(0, 2).map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-1.5 py-0.5 bg-white/20 rounded-sm"
                          >
                            {tag}
                          </span>
                        ))}
                        {event.tags.length > 2 && (
                          <span className="text-[10px] opacity-80">
                            +{event.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Much larger resize handle - occupies the bottom 10px of the task */}
      <div
        className={cn(
          "resize-handle absolute bottom-0 left-0 right-0 h-8 cursor-ns-resize",
          "transition-all duration-150 rounded-b-md",
          resizing ? "bg-white/20" : "hover:bg-white/10"
        )}
        onMouseDown={handleResizeStart}
      >
        <div className="absolute left-0 right-0 bottom-2 flex justify-center">
          <div
            className={cn(
              "w-20 h-2 rounded-full transition-all duration-150",
              resizing
                ? "bg-white/70"
                : "bg-white/30 hover:bg-white/50 hover:h-3"
            )}
          />
        </div>
      </div>
    </div>
  );
};
