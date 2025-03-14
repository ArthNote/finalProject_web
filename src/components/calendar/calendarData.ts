import { addDays, setHours, setMinutes } from "date-fns";

// Event type definition
export type EventType = {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  color: string;
  attendees?: { name: string; avatar: string }[];
  tags?: string[];
  location?: string;
};

// Mock data for events
export const MOCK_EVENTS: EventType[] = [
  {
    id: "1",
    title: "Product Meeting",
    description: "Discuss new features for the dashboard",
    start: setMinutes(setHours(new Date(), 10), 0),
    end: setMinutes(setHours(new Date(), 11), 50),
    color: "bg-blue-500",
    attendees: [
      { name: "John Doe", avatar: "https://github.com/shadcn.png" },
      { name: "Jane Smith", avatar: "https://github.com/radix-ui.png" },
    ],
    tags: ["Meeting", "Product"],
    location: "Main Conference Room",
  },
  {
    id: "2",
    title: "Design Review",
    description: "Review the new design system components",
    start: setMinutes(setHours(new Date(), 13), 0),
    end: setMinutes(setHours(new Date(), 14), 0),
    color: "bg-purple-500",
    attendees: [
      { name: "Alice Johnson", avatar: "https://github.com/shadcn.png" },
      { name: "Bob Brown", avatar: "https://github.com/radix-ui.png" },
    ],
    tags: ["Design", "Review"],
    location: "Design Studio",
  },
  {
    id: "3",
    title: "Team Lunch",
    description: "Monthly team lunch",
    start: setMinutes(setHours(addDays(new Date(), 1), 12), 0),
    end: setMinutes(setHours(addDays(new Date(), 1), 13), 30),
    color: "bg-green-500",
    attendees: [
      { name: "Sarah Wilson", avatar: "https://github.com/shadcn.png" },
      { name: "Mike Thomas", avatar: "https://github.com/radix-ui.png" },
    ],
    tags: ["Team", "Social"],
    location: "Sushi Restaurant",
  },
  {
    id: "4",
    title: "Client Call",
    description: "Quarterly review with Acme Inc.",
    start: setMinutes(setHours(addDays(new Date(), 1), 15), 0),
    end: setMinutes(setHours(addDays(new Date(), 1), 16), 0),
    color: "bg-amber-500",
    attendees: [
      { name: "Emily Davis", avatar: "https://github.com/shadcn.png" },
    ],
    tags: ["Client", "Call"],
    location: "Zoom Meeting",
  },
];
