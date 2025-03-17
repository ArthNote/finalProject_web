import React from "react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, X, CalendarIcon, Tag, Users } from "lucide-react";
import { EventType } from "./calendarData";

interface EventDetailsSheetProps {
  event: EventType | null;
  onOpenChange: (open: boolean) => void;
}

const EventDetailsSheet: React.FC<EventDetailsSheetProps> = ({
  event,
  onOpenChange,
}) => {
  return (
    <Sheet open={!!event} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex justify-between items-center">
            <span>Event Details</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        {event && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {event.description}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm">
                    {format(event.start, "EEEE, MMMM d")}
                  </p>
                  <p className="text-sm">
                    {format(event.start, "h:mm a")} -{" "}
                    {format(event.end, "h:mm a")}
                  </p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{event.location}</span>
                </div>
              )}
            </div>

            {event.attendees && event.attendees.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2" /> Attendees
                </h3>
                <div className="space-y-2">
                  {event.attendees.map((attendee, i) => (
                    <div key={i} className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={attendee.avatar} />
                        <AvatarFallback>{attendee.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{attendee.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {event?.tags && event.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Tag className="h-4 w-4 mr-2" /> Tags
                </h3>
                <div className="flex flex-wrap gap-1">
                  {event.tags.map((tag, i) => (
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
  );
};

export default EventDetailsSheet;
