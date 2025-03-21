import React from "react";
import { format, differenceInMinutes, startOfDay, addMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import { GripVertical, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TaskType } from "@/lib/taskService";

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
  const eventRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [resizing, setResizing] = React.useState(false);
  const [initialPos, setInitialPos] = React.useState({ x: 0, y: 0 });
  const [initialEventPos, setInitialEventPos] = React.useState({
    top: 0,
    height: 0,
  });

  // Calculate the initial position and height as a percentage of the day
  const calculateEventPosition = () => {
    const dayStart = startOfDay(selectedDate);

    // Use startTime if available, otherwise use dueDate
    const eventStart = event.startTime
      ? new Date(event.startTime)
      : new Date(event.dueDate);

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

  // Event handlers for dragging
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0 || resizing) return; // Only left click and not while resizing

    // Don't start dragging when clicking on resize handle
    if ((e.target as HTMLElement).closest(".resize-handle")) {
      return;
    }

    e.preventDefault();
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
      startTime: newTimes.startTime,
      endTime: newTimes.endTime,
      dueDate: newTimes.startTime, // Keep dueDate synchronized with startTime
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
    // Allow much smaller minimum height (0.7% which is ~10 minutes)
    let newHeightPercent = Math.max(0.7, initialEventPos.height + deltaPercent);

    // Ensure the event doesn't extend past the end of the day
    newHeightPercent = Math.min(100 - initialEventPos.top, newHeightPercent);

    // Apply the new height with a smooth transition
    eventRef.current.style.transition = "none";
    eventRef.current.style.height = `${newHeightPercent}%`;
  };

  const handleResizeEnd = () => {
    if (!resizing || !eventRef.current || !timelineRef.current) return;

    setResizing(false);

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
      startTime: newTimes.startTime,
      endTime: newTimes.endTime,
      dueDate: newTimes.startTime, // Keep dueDate synchronized with startTime
      duration: newTimes.duration,
    });

    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
  };

  // Handle event selection
  const handleEventClick = (e: React.MouseEvent) => {
    if (dragging || resizing) return;

    // Don't trigger when clicking on the handles
    if (
      (e.target as HTMLElement).closest(".drag-handle") ||
      (e.target as HTMLElement).closest(".resize-handle")
    ) {
      return;
    }

    onSelect(event);
  };

  // Get display times
  const startTime = event.startTime
    ? new Date(event.startTime)
    : new Date(event.dueDate);
  const endTime = event.endTime
    ? new Date(event.endTime)
    : event.duration
    ? addMinutes(startTime, event.duration)
    : addMinutes(startTime, 60);

  // Format duration for display
  const getDurationText = () => {
    const durationMinutes =
      event.duration || differenceInMinutes(endTime, startTime);

    if (durationMinutes < 60) {
      return `${durationMinutes}m`;
    }

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
  };

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

  return (
    <div
      ref={eventRef}
      className={cn(
        "absolute left-0 right-7 rounded-md shadow-sm pointer-events-auto p-2",
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
              <span>{format(startTime, "h:mm a")}</span>
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

      {/* Add resize handle for all events, regardless of duration */}
      <div
        className="resize-handle absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize flex items-center justify-center"
        onMouseDown={handleResizeStart}
      >
        <div className="w-16 h-1 bg-white/30 rounded-full hover:bg-white/50" />
      </div>
    </div>
  );
};
