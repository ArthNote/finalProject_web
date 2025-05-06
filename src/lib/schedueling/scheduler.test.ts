import { TaskType } from "../../types/task";
import { scheduleTasks, DaySchedule } from "./scheduler";

describe("Scheduler with custom daily schedule", () => {
  const startDate = new Date("2025-04-28T00:00:00Z"); // Monday
  const endDate = new Date("2025-05-02T23:59:59Z");   // Friday

  const customSchedule: DaySchedule[] = [
    { 
      day: 1, 
      availableFrom: "08:00", 
      availableTo: "17:00",
      blockedIntervals: [
        { start: "12:00", end: "13:00" } // Lunch break
      ]
    },
    { 
      day: 3, 
      availableFrom: "10:00", 
      availableTo: "18:00",
      blockedIntervals: [
        { start: "14:00", end: "16:00" } // Blocked for meetings
      ]
    }
  ];

  const tasks: TaskType[] = [
    {
      id: "1",
      title: "Morning Task",
      priority: "high",
      duration: 60,
      date: new Date("2025-04-28T08:30:00Z"), // Monday 8:30 AM
      category: "work",
      completed: false,
      scheduled: false,
      startTime: null,
      endTime: null,
      status: "todo",
      parentId: null,
      resources: [],
      description: ""
    },
    {
      id: "2",
      title: "Lunch Time Task",
      priority: "medium",
      duration: 30,
      date: new Date("2025-04-28T12:00:00Z"), // Monday 12:00 PM (blocked)
      category: "work",
      completed: false,
      scheduled: false,
      startTime: null,
      endTime: null,
      status: "todo",
      parentId: null,
      resources: [],
      description: ""
    },
    {
      id: "3",
      title: "Afternoon Meeting",
      priority: "high",
      duration: 60,
      date: new Date("2025-04-30T14:30:00Z"), // Wednesday 2:30 PM (blocked)
      category: "meetings",
      completed: false,
      scheduled: false,
      startTime: null,
      endTime: null,
      status: "todo",
      parentId: null,
      resources: [],
      description: ""
    }
  ];

  test("respects daily schedule and blocked intervals", () => {
    const scheduledTasks = scheduleTasks(tasks, {
      dateRange: { start: startDate, end: endDate },
      dailySchedule: customSchedule,
      breakBetweenTasks: 15
    });

    // Check first task is scheduled during available hours
    const morningTask = scheduledTasks.find(t => t.id === "1");
    expect(morningTask?.startTime?.getHours()).toBeGreaterThanOrEqual(8);
    expect(morningTask?.endTime?.getHours()).toBeLessThanOrEqual(17);

    // Check lunch time task is rescheduled outside blocked interval
    const lunchTask = scheduledTasks.find(t => t.id === "2");
    expect(lunchTask?.startTime?.getHours()).not.toBe(12);

    // Check afternoon meeting is rescheduled outside blocked interval
    const meetingTask = scheduledTasks.find(t => t.id === "3");
    const meetingHour = meetingTask?.startTime?.getHours();
    expect(meetingHour).not.toBe(14);
    expect(meetingHour).not.toBe(15);
  });

  test("maintains breaks between tasks", () => {
    const scheduledTasks = scheduleTasks(tasks, {
      dateRange: { start: startDate, end: endDate },
      dailySchedule: customSchedule,
      breakBetweenTasks: 15
    });

    // Sort tasks by start time
    const sortedTasks = scheduledTasks
      .filter(t => t.startTime != null)
      .sort((a, b) => a.startTime!.getTime() - b.startTime!.getTime());

    // Check breaks between consecutive tasks
    for (let i = 0; i < sortedTasks.length - 1; i++) {
      const currentTask = sortedTasks[i];
      const nextTask = sortedTasks[i + 1];

      if (currentTask.startTime?.toDateString() === nextTask.startTime?.toDateString()) {
        const breakTime = (nextTask.startTime!.getTime() - currentTask.endTime!.getTime()) / 60000;
        expect(breakTime).toBeGreaterThanOrEqual(15);
      }
    }
  });
});
