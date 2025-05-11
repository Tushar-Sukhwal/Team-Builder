/**
 * Enumeration for task statuses and priorities.
 * This enum defines the possible statuses and priorities for tasks in the application.
 */
export const TaskStatusEnum = {
  BACKLOG: "BACKLOG",
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  IN_REVIEW: "IN_REVIEW",
  DONE: "DONE",
} as const;

export const TaskPriorityEnum = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type TaskStatusEnumType = keyof typeof TaskStatusEnum; // Type for task status keys
export type TaskPriorityEnumType = keyof typeof TaskPriorityEnum; // Type for task priority keys
