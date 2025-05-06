import { consts } from "../constants";

interface ScheduleResponse {
  message: string;
  success: boolean;
}

export interface ScheduleParams {
  taskSelectionMode: "unscheduled" | "reschedule" | "full";
  timePeriodType: "today" | "tomorrow" | "this_week" | "custom";
  customRangeStart?: Date;
  customRangeEnd?: Date;
  respectFixedAppointments: boolean;
  addBreaksEnabled: boolean;
  optimizeFocusTimeEnabled: boolean;
  includePastTasks: boolean;
  schedulerModeId?: string;
  isBuiltIn?: boolean;
}

export async function scheduleTasks(
  params: ScheduleParams
): Promise<ScheduleResponse> {
  try {
    const queryParams = new URLSearchParams();

    queryParams.append("taskSelectionMode", params.taskSelectionMode);
    queryParams.append("timePeriodType", params.timePeriodType);
    queryParams.append(
      "respectFixedAppointments",
      params.respectFixedAppointments.toString()
    );
    queryParams.append("addBreaksEnabled", params.addBreaksEnabled.toString());
    queryParams.append(
      "optimizeFocusTimeEnabled",
      params.optimizeFocusTimeEnabled.toString()
    );
    queryParams.append("includePastTasks", params.includePastTasks.toString());

    // Add custom range dates if specified
    if (params.timePeriodType === "custom") {
      if (!params.customRangeStart || !params.customRangeEnd) {
        throw new Error("Custom time period requires start and end dates");
      }
      queryParams.append(
        "customRangeStart",
        params.customRangeStart.toISOString()
      );
      queryParams.append("customRangeEnd", params.customRangeEnd.toISOString());
    }

    // Add scheduler mode info if specified
    if (params.schedulerModeId) {
      queryParams.append("schedulerModeId", params.schedulerModeId);
      if (params.isBuiltIn !== undefined) {
        queryParams.append("isBuiltIn", params.isBuiltIn.toString());
      }
    }

    const response = await fetch(
      `${consts.backend}/schedule?${queryParams.toString()}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to schedule tasks");
    }

    return await response.json();
  } catch (error) {
    console.error("Error scheduling tasks:", error);
    throw error;
  }
}
