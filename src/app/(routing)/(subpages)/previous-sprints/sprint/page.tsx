import TaskList from "@/components/TaskList";
import { Task } from "@/interfaces/Tasks";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";

function page() {
    const tasks: Task[] = [
        {
          id: "f18565fe-f123-4ec8-8024-c09150ddf5a7",
          name: "Main page",
          assignedTo: ["Hasan"],
          startDate: "2025-07-14T06:40:17.522Z",
          priority: "Medium",
          dueDate: "2025-07-14T06:40:17.522Z",
          description: "Claradix main page",
          status: "To Do",
          tags: ["string"],
          images: [],
          progress: 0,
          estimatedTime: null,
          actualTime: 0,
          createdAt: "2025-07-14T06:41:20.838Z",
          updatedAt: "2025-07-14T06:41:20.838Z",
          projectId: "c8c619a5-45f2-468a-9992-52abd1dde412",
          sprintId: null,
          subtasks: [
            {
              id: "888185f2-f0e9-45ab-a984-665130f7de51",
              title: "Main logo",
              description: "string",
              status: "To Do",
              priority: "Medium",
              assignedTo: "string",
              estimatedTime: 0,
              actualTime: 0,
              dueDate: "2025-07-14T06:41:52.113Z",
              order: 0,
              createdAt: "2025-07-14T06:42:05.163Z",
              updatedAt: "2025-07-14T06:42:05.163Z",
              taskId: "f18565fe-f123-4ec8-8024-c09150ddf5a7",
            },
          ],
          project: {
            id: "c8c619a5-45f2-468a-9992-52abd1dde412",
            title: "Claradix",
            description: "Test",
            ownerUserId: 2,
            projectAvatarUrl: "https://via.placeholder.com/150",
            assignedTo: [2],
            archived: false,
            createdAt: "2025-07-14T06:41:20.838Z",
            tasks: [],
          },
          sprint: null,
        },
        {
          id: "f18565fe-f123-4ec8-8024-c09150ddfsada5a7",
          name: "Main page",
          assignedTo: ["Hasan"],
          startDate: "2025-07-14T06:40:17.522Z",
          priority: "Medium",
          dueDate: "2025-07-14T06:40:17.522Z",
          description: "Claradix main page",
          status: "To Do",
          tags: ["string"],
          images: [],
          progress: 0,
          estimatedTime: null,
          actualTime: 0,
          createdAt: "2025-07-14T06:41:20.838Z",
          updatedAt: "2025-07-14T06:41:20.838Z",
          projectId: "c8c619a5-45f2-468a-9992-52abd1dde412",
          sprintId: null,
          subtasks: [
            {
              id: "888185f2-f0e9-45ab-a984-665130f7de51",
              title: "Main logo",
              description: "string",
              status: "To Do",
              priority: "Medium",
              assignedTo: "string",
              estimatedTime: 0,
              actualTime: 0,
              dueDate: "2025-07-14T06:41:52.113Z",
              order: 0,
              createdAt: "2025-07-14T06:42:05.163Z",
              updatedAt: "2025-07-14T06:42:05.163Z",
              taskId: "f18565fe-f123-4ec8-8024-c09150ddf5a7",
            },
          ],
          project: {
            id: "c8c619a5-45f2-468a-9992-52abd1dde412",
            title: "Claradix",
            description: "Test",
            ownerUserId: 2,
            projectAvatarUrl: "https://via.placeholder.com/150",
            assignedTo: [2],
            archived: false,
            createdAt: "2025-07-14T06:41:20.838Z",
            tasks: [],
          },
          sprint: null,
        },
      ]
  return (
    // Removed unused img variable
    <div className="flex flex-col min-h-0 gap-5">
      <div className="flex gap-4">
        <button className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full shadow">
          <FaBars />
          Filter
        </button>
        <div className="flex items-center bg-white/10 px-4 py-2 rounded-full shadow w-80">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            className="bg-transparent outline-none text-white w-full"
            placeholder="Search"
          />
        </div>
        <button className="bg-lime-400 ml-auto hover:bg-lime-500 text-white font-semibold py-2 px-6 rounded-full transition-all">
          Start new
        </button>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xl">Sprint</span>
        <span>14.06.2025 - 21.06.2025</span>
      </div>
      <div className="px-2 scrollbar overflow-x-scroll">
        <TaskList addable={false} tasks={tasks}/>
      </div>
    </div>
  );
}

export default page;
