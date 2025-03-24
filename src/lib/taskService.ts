// Task type definition that can be used throughout the application

import { TaskType } from "@/types/task";

// Get today's date and format it
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

// Helper function to create ISO date strings with specific times
const createDateISOString = (
  date: Date,
  hours: number,
  minutes: number = 0
) => {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate.toISOString();
};

const createDateTime = (date: Date, hours: number, minutes: number = 0) => {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

// Sample task data - this could be replaced with API calls in a real app
export const sampleTasks: TaskType[] = [
  // Today's tasks
  {
    id: "1",
    title: "Morning standup meeting",
    description: "Daily team standup to discuss progress and blockers",
    priority: "medium",
    date: createDateTime(today, 9, 30),
    startTime: createDateTime(today, 9, 30),
    endTime: createDateTime(today, 10, 10),
    duration: 15, // 15 minutes
    completed: false,
    category: "Meetings",
    tags: ["daily", "team"],
    scheduled: true,
    resources: [],
  },
  {
    id: "2",
    title: "Client presentation",
    description: "Present Q3 marketing strategy to client",
    priority: "high",
    date: createDateTime(today, 11, 0),
    startTime: createDateTime(today, 11, 0),
    endTime: createDateTime(today, 12, 30),
    duration: 90, // 1.5 hours
    completed: false,
    category: "Client",
    tags: ["presentation", "important"],
    scheduled: true,
    resources: [],
  },
  {
    id: "3",
    title: "Lunch with team",
    description: "Team lunch at the Italian restaurant",
    priority: "low",
    date: createDateTime(today, 13, 0),
    startTime: createDateTime(today, 13, 0),
    endTime: createDateTime(today, 14, 0),
    duration: 60, // 1 hour
    completed: false,
    category: "Personal",
    tags: ["lunch", "social"],
    scheduled: true,
    resources: [],
  },
  {
    id: "4",
    title: "Code review session",
    description: "Review PR submissions and provide feedback",
    priority: "medium",
    date: createDateTime(today, 15, 0),
    startTime: createDateTime(today, 15, 0),
    endTime: createDateTime(today, 16, 30),
    duration: 90, // 1.5 hours
    completed: false,
    category: "Development",
    tags: ["code", "review"],
    scheduled: true,
    resources: [],
  },
  {
    id: "5",
    title: "Workout session",
    description: "Evening gym session - cardio and strength training",
    priority: "medium",
    date: createDateTime(today, 18, 0),
    startTime: createDateTime(today, 18, 0),
    endTime: createDateTime(today, 19, 30),
    duration: 90, // 1.5 hours
    completed: false,
    category: "Health",
    tags: ["workout", "personal"],
    scheduled: true,
    resources: [],
  },
  // Add four short tasks in the same hour for testing
  {
    id: "14",
    title: "Quick check-in call",
    description: "Brief check-in with the project manager",
    priority: "medium",
    date: createDateTime(today, 10, 0),
    startTime: createDateTime(today, 10, 0),
    endTime: createDateTime(today, 10, 15),
    duration: 15, // 15 minutes
    completed: false,
    category: "Calls",
    tags: ["quick", "check-in"],
    scheduled: true,
    resources: [],
  },
  {
    id: "15",
    title: "Review document",
    description: "Review project requirements document",
    priority: "high",
    date: createDateTime(today, 10, 15),
    startTime: createDateTime(today, 10, 15),
    endTime: createDateTime(today, 10, 30),
    duration: 15, // 15 minutes
    completed: false,
    category: "Documentation",
    tags: ["document", "review"],
    scheduled: true,
    resources: [],
  },
  {
    id: "16",
    title: "Email responses",
    description: "Respond to pending emails",
    priority: "medium",
    date: createDateTime(today, 10, 30),
    startTime: createDateTime(today, 10, 30),
    endTime: createDateTime(today, 10, 45),
    duration: 15, // 15 minutes
    completed: false,
    category: "Communication",
    tags: ["email", "respond"],
    scheduled: true,
    resources: [],
  },
  {
    id: "17",
    title: "Water break",
    description: "Take a quick water break",
    priority: "low",
    date: createDateTime(today, 10, 45),
    startTime: createDateTime(today, 10, 45),
    endTime: createDateTime(today, 11, 0),
    duration: 15, // 15 minutes
    completed: false,
    category: "Wellbeing",
    tags: ["break", "health"],
    scheduled: true,
    resources: [],
  },

  // Tomorrow's tasks
  {
    id: "6",
    title: "Project planning meeting",
    description: "Plan out next sprint and assign tasks",
    priority: "high",
    date: createDateTime(tomorrow, 10, 0),
    startTime: createDateTime(tomorrow, 10, 0),
    endTime: createDateTime(tomorrow, 12, 0),
    duration: 120, // 2 hours
    completed: false,
    category: "Planning",
    tags: ["sprint", "planning"],
    scheduled: true,
    resources: [],
  },
  {
    id: "7",
    title: "Database optimization",
    description: "Optimize database queries for better performance",
    priority: "medium",
    date: createDateTime(tomorrow, 13, 30),
    startTime: createDateTime(tomorrow, 13, 30),
    endTime: createDateTime(tomorrow, 15, 30),
    duration: 120, // 2 hours
    completed: false,
    category: "Development",
    tags: ["database", "optimization"],
    scheduled: true,
    resources: [],
  },
  {
    id: "8",
    title: "Client call - ABC Corp",
    description: "Follow-up call with ABC Corp regarding project timeline",
    priority: "high",
    date: createDateTime(tomorrow, 16, 0),
    startTime: createDateTime(tomorrow, 16, 0),
    endTime: createDateTime(tomorrow, 16, 45),
    duration: 45, // 45 minutes
    completed: false,
    category: "Client",
    tags: ["call", "follow-up"],
    scheduled: true,
    resources: [],
  },

  // Some completed tasks
  {
    id: "9",
    title: "Weekly report compilation",
    description: "Compile weekly progress report for management",
    priority: "medium",
    date: createDateTime(today, 14, 0),
    startTime: createDateTime(today, 14, 0),
    endTime: createDateTime(today, 15, 0),
    duration: 60, // 1 hour
    completed: true,
    category: "Reporting",
    tags: ["report", "weekly"],
    scheduled: true,
    resources: [],
  },
  {
    id: "10",
    title: "Morning meditation",
    description: "Start the day with a 15-minute meditation session",
    priority: "low",
    date: createDateTime(today, 8, 0),
    startTime: createDateTime(today, 8, 0),
    endTime: createDateTime(today, 8, 15),
    duration: 15, // 15 minutes
    completed: true,
    category: "Wellbeing",
    tags: ["meditation", "morning"],
    scheduled: true,
    resources: [],
  },

  {
    id: "20",
    title: "Morning meditation",
    description: "Start the day with a 15-minute meditation session",
    priority: "low",
    date: createDateTime(today, 8, 0),
    startTime: createDateTime(today, 8, 0),
    endTime: createDateTime(today, 8, 15),
    duration: 15, // 15 minutes
    completed: true,
    category: "Wellbeing",
    tags: ["meditation", "morning"],
    scheduled: true,
    resources: [],
  },

  // Unscheduled tasks
  {
    id: "11",
    title: "Update portfolio website",
    description: "Add recent projects and update skills section",
    priority: "low",
    date: createDateTime(today, 0, 0),
    startTime: null,
    endTime: null,
    duration: 180, // 3 hours (estimated)
    completed: false,
    category: "Personal",
    tags: ["website", "portfolio"],
    scheduled: false,
    resources: [],
  },
  {
    id: "12",
    title: "Research new technologies",
    description: "Research new frontend frameworks for potential adoption",
    priority: "medium",
    date: createDateTime(tomorrow, 0, 0),
    startTime: null,
    endTime: null,
    duration: 120, // 2 hours (estimated)
    completed: false,
    category: "Research",
    tags: ["technology", "research"],
    scheduled: false,
    resources: [],
  },
  {
    id: "13",
    title: "Prepare presentation slides",
    description: "Create slides for the upcoming conference",
    priority: "high",
    date: createDateTime(tomorrow, 0, 0),
    startTime: null,
    endTime: null,
    duration: 180, // 3 hours (estimated)
    completed: false,
    category: "Work",
    tags: ["presentation", "conference"],
    scheduled: false,
    resources: [],
  },
];

// Helper functions for working with tasks
export const getTask = (id: string) => {
  return sampleTasks.find((task) => task.id === id) || null;
};

export const updateTaskCompleted = (id: string, completed: boolean) => {
  // In a real app, this would make an API call
  // For now, we're just returning the updated task
  const task = getTask(id);
  if (task) {
    task.completed = completed;
    return task;
  }
  return null;
};

export const updateTaskScheduled = (id: string, scheduled: boolean) => {
  // In a real app, this would make an API call
  // For now, we're just returning the updated task
  const task = getTask(id);
  if (task) {
    task.scheduled = scheduled;
    return task;
  }
  return null;
};

// Calculate task duration in minutes
export const calculateTaskDuration = (startTime: Date, endTime: Date): number => {
  return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
};

// Update task times
export const updateTaskTimes = (id: string, startTime: Date, endTime: Date) => {
  const task = getTask(id);
  if (task) {
    task.startTime = startTime;
    task.endTime = endTime;
    task.date = startTime;
    task.duration = calculateTaskDuration(startTime, endTime);
    return task;
  }
  return null;
};
