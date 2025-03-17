import React from "react";
import { format, differenceInMinutes, startOfDay, addMinutes } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import { EventType } from "./calendarData";

interface EventItemProps {
  event: EventType;
  selectedDate: Date;
  timelineRef: React.MutableRefObject<HTMLDivElement | null>;
  onSelect: (event: EventType) => void;
  onUpdate: (updatedEvent: EventType) => void;
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
    const minutesSinceMidnight = differenceInMinutes(event.start, dayStart);
    const durationMinutes = differenceInMinutes(event.end, event.start);

    const topPercent = (minutesSinceMidnight / (24 * 60)) * 100;
    const heightPercent = (durationMinutes / (24 * 60)) * 100;

    return {
      top: `${topPercent}%`,
      height: `${heightPercent}%`,
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

    return { start: newStart, end: newEnd };
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
      start: newTimes.start,
      end: newTimes.end,
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
    let newHeightPercent = Math.max(2.5, initialEventPos.height + deltaPercent); // Minimum 2.5% (36 min)

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
      start: newTimes.start,
      end: newTimes.end,
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

  return (
    <div
      ref={eventRef}
      className={cn(
        "absolute left-0 right-7 rounded-md p-2 shadow-sm pointer-events-auto",
        "transition-shadow duration-150",
        dragging && "opacity-80 cursor-grabbing shadow-md z-30",
        resizing && "opacity-90 z-30",
        !dragging && !resizing && "hover:shadow-md cursor-pointer",
        event.color
      )}
      style={{
        top: eventPosition.top,
        height: eventPosition.height,
      }}
      onMouseDown={handleDragStart}
      onClick={handleEventClick}
    >
      <div className="flex flex-col h-full text-white relative">
        {/* Drag handle */}
        <div className="drag-handle absolute top-0 right-0 p-1 cursor-grab opacity-50 hover:opacity-100">
          <GripVertical className="h-3 w-3" />
        </div>

        <div className="text-xs font-medium">
          {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
        </div>
        <div className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
          {event.title}
        </div>
        {event.location && (
          <div className="text-xs opacity-80 mt-1 overflow-hidden text-ellipsis">
            {event.location}
          </div>
        )}
        {event.attendees && event.attendees.length > 0 && (
          <div className="flex mt-auto pt-1">
            {event.attendees.slice(0, 2).map((attendee, i) => (
              <Avatar
                key={i}
                className="h-5 w-5 border border-white -ml-1 first:ml-0"
              >
                <AvatarImage src={attendee.avatar} />
                <AvatarFallback className="text-[10px]">
                  {attendee.name[0]}
                </AvatarFallback>
              </Avatar>
            ))}
            {event.attendees.length > 2 && (
              <span className="text-xs ml-1 my-auto">
                +{event.attendees.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Resize handle */}
        <div
          className="resize-handle absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize flex items-center justify-center"
          onMouseDown={handleResizeStart}
        >
          <div className="w-16 h-1 bg-white/30 rounded-full hover:bg-white/50" />
        </div>
      </div>
    </div>
  );
};
