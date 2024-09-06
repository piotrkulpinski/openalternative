import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  CircleHelpIcon,
  CircleIcon,
  CircleXIcon,
  TimerIcon,
} from "lucide-react"

/**
 * Returns the appropriate status icon based on the provided status.
 * @param status - The status of the task.
 * @returns A React component representing the status icon.
 */
export function getStatusIcon(status: Task["status"]) {
  const statusIcons = {
    canceled: CircleXIcon,
    done: CheckCircleIcon,
    "in-progress": TimerIcon,
    todo: CircleHelpIcon,
  }

  return statusIcons[status] || CircleIcon
}

/**
 * Returns the appropriate priority icon based on the provided priority.
 * @param priority - The priority of the task.
 * @returns A React component representing the priority icon.
 */
export function getPriorityIcon(priority: Task["priority"]) {
  const priorityIcons = {
    high: ArrowUpIcon,
    low: ArrowDownIcon,
    medium: ArrowRightIcon,
  }

  return priorityIcons[priority] || CircleIcon
}
