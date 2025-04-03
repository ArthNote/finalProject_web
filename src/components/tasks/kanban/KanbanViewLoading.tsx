import React from "react";
import TaskViewFiltersLoading from "../taskViewFiltersLoading";
import KanbanColumnLoading from "./KanbanColumnLoading";

const KanbanViewLoading = () => {
  return (
    <div className="space-y-6">
      <TaskViewFiltersLoading />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <KanbanColumnLoading key={index} />
        ))}
      </div>
    </div>
  );
};

export default KanbanViewLoading;
