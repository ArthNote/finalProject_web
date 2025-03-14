"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
  CalendarIcon,
  Tag,
  Users,
} from "lucide-react";
import {
  format,
  addDays,
  subDays,
  isToday,
  setHours,
  setMinutes,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EventItem } from "@/components/calendar/EventItem";
import { MOCK_EVENTS, EventType } from "@/components/calendar/calendarData";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const CURRENT_TIME = new Date();
const CURRENT_HOUR = CURRENT_TIME.getHours();

const TimelineCalendar = () => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [openSidebar, setOpenSidebar] = React.useState(true);
  const [selectedEvent, setSelectedEvent] = React.useState<EventType | null>(
    null
  );
  const [events, setEvents] = React.useState<EventType[]>(MOCK_EVENTS);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Changed to MutableRefObject to match EventItem's expectation
  const timelineRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (scrollContainerRef.current && isToday(selectedDate)) {
      const currentTimePosition = ((CURRENT_HOUR * 60) / (24 * 60)) * 1440;
      scrollContainerRef.current.scrollTop = Math.max(
        0,
        currentTimePosition - 100
      );
    }
  }, [selectedDate]);

  const handlePreviousDay = () => {
    setSelectedDate((prev) => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date());

    // Scroll to current time
    if (scrollContainerRef.current) {
      const currentTimePosition = ((CURRENT_HOUR * 60) / (24 * 60)) * 1440;
      scrollContainerRef.current.scrollTop = Math.max(
        0,
        currentTimePosition - 100
      );
    }
  };

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  // Filter events for the selected date
  const eventsForSelectedDay = events.filter(
    (event) =>
      format(event.start, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );

  // Update event after drag or resize
  const updateEvent = (updatedEvent: EventType) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  };

  return (
    <div className="flex h-full">
      {/* Main Calendar */}
      <div className="flex flex-col flex-1 h-full bg-white dark:bg-background">
        {/* Date Navigation */}
        <div className="flex flex-col md:flex-row items-center px-6 py-4 border-b gap-y-3 relative">
          {/* Date Controls */}
          <div className="flex items-center gap-2.5 md:mx-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviousDay}
              className="h-7 w-7 hover:bg-neutral-100 dark:hover:bg-neutral-800/30"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <button
              onClick={!isToday(selectedDate) ? handleToday : undefined}
              className={cn(
                "flex flex-col items-center min-w-[140px] px-2 rounded-md transition-colors",
                !isToday(selectedDate) &&
                  "hover:bg-neutral-100 dark:hover:bg-neutral-800/30 cursor-pointer"
              )}
            >
              <h3 className="text-[13px] font-medium tracking-tight">
                {format(selectedDate, "EEEE")}
              </h3>
              <p
                className={cn(
                  "text-[11px] leading-tight",
                  isToday(selectedDate)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {format(selectedDate, "MMMM d")}
              </p>
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextDay}
              className="h-7 w-7 hover:bg-neutral-100 dark:hover:bg-neutral-800/30"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <ScrollArea
          className="flex-1 [&>div>div]:!block"
          ref={scrollContainerRef}
        >
          <div className="relative px-2">
            {/* Current Time Indicator */}
            {isToday(selectedDate) && (
              <>
                <div
                  className="absolute left-[60px] w-1.5 h-1.5 rounded-full bg-primary z-10 shadow-[0_0_6px_var(--shadow-color)]"
                  style={
                    {
                      top: `${
                        ((CURRENT_TIME.getHours() * 60 +
                          CURRENT_TIME.getMinutes()) /
                          (24 * 60)) *
                        100
                      }%`,
                      transform: "translate(-50%, -50%)",
                      "--shadow-color": "hsl(var(--primary) / 0.5)",
                    } as React.CSSProperties
                  }
                />
                <div
                  className="absolute left-[68px] right-6 h-[1.5px] bg-gradient-to-r from-primary to-transparent z-10"
                  style={{
                    top: `${
                      ((CURRENT_TIME.getHours() * 60 +
                        CURRENT_TIME.getMinutes()) /
                        (24 * 60)) *
                      100
                    }%`,
                  }}
                />
              </>
            )}

            {/* Events Layer */}
            <div
              className="absolute left-[68px] right-6 top-0 bottom-0 pointer-events-none z-10"
              ref={timelineRef}
            >
              {eventsForSelectedDay.map((event) => (
                <EventItem
                  key={event.id}
                  event={event}
                  selectedDate={selectedDate}
                  timelineRef={timelineRef}
                  onSelect={setSelectedEvent}
                  onUpdate={updateEvent}
                />
              ))}
            </div>

            {/* Time Slots */}
            <div className="relative min-h-[1440px] pr-6">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className={`flex items-start h-[60px] relative group transition-colors
                    ${
                      hour === CURRENT_HOUR && isToday(selectedDate)
                        ? "bg-gradient-to-r from-primary/5 to-transparent"
                        : ""
                    }`}
                >
                  <div
                    className={`w-[60px] pr-4 py-2 text-[11px] font-medium tracking-wide text-right sticky left-0
                      ${
                        hour === CURRENT_HOUR && isToday(selectedDate)
                          ? "text-primary"
                          : "text-muted-foreground"
                      } 
                      bg-white dark:bg-background`}
                  >
                    {hour === 0
                      ? "12 AM"
                      : hour < 12
                      ? `${hour} AM`
                      : hour === 12
                      ? "12 PM"
                      : `${hour - 12} PM`}
                  </div>
                  <div className="flex-1 relative">
                    {hour > 0 && (
                      <div className="absolute left-0 right-0 top-0 h-[1px] border-t-0 bg-neutral-100 dark:bg-neutral-800" />
                    )}
                    {/* 30 minute mark */}
                    <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-neutral-100 dark:border-neutral-800" />
                    {/* Hover effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <div className="absolute inset-0 bg-gradient-to-r from-neutral-50 to-transparent dark:from-neutral-800/30 dark:to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Event Details Sheet */}
        <Sheet
          open={!!selectedEvent}
          onOpenChange={(open) => !open && setSelectedEvent(null)}
        >
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="flex justify-between items-center">
                <span>Event Details</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </SheetTitle>
            </SheetHeader>
            {selectedEvent && (
              <div className="mt-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    {selectedEvent.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm">
                        {format(selectedEvent.start, "EEEE, MMMM d")}
                      </p>
                      <p className="text-sm">
                        {format(selectedEvent.start, "h:mm a")} -{" "}
                        {format(selectedEvent.end, "h:mm a")}
                      </p>
                    </div>
                  </div>

                  {selectedEvent.location && (
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{selectedEvent.location}</span>
                    </div>
                  )}
                </div>

                {selectedEvent.attendees &&
                  selectedEvent.attendees.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-2" /> Attendees
                      </h3>
                      <div className="space-y-2">
                        {selectedEvent.attendees.map((attendee, i) => (
                          <div key={i} className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={attendee.avatar} />
                              <AvatarFallback>
                                {attendee.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{attendee.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {selectedEvent?.tags && selectedEvent.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Tag className="h-4 w-4 mr-2" /> Tags
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedEvent.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" variant="outline">
                    Edit
                  </Button>
                  <Button className="flex-1" variant="destructive">
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default TimelineCalendar;
