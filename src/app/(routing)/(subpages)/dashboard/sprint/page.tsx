import React from 'react'

function page() {
    const mockTasks = [
        {
            name: "Create common structure for dashboard",
            assignedOnStart: true,
            assignedAfterStart: false,
            status: "Done",
        },
        {
            name: "Create common structure for dashboard",
            assignedOnStart: true,
            assignedAfterStart: false,
            status: "In progress",
        },
        {
            name: "Create common structure for dashboard",
            assignedOnStart: true,
            assignedAfterStart: false,
            status: "Done",
        },
        {
            name: "Create common structure for dashboard",
            assignedOnStart: true,
            assignedAfterStart: false,
            status: "Done",
        },
        {
            name: "Create common structure for dashboard",
            assignedOnStart: true,
            assignedAfterStart: false,
            status: "Done",
        },
        {
            name: "Create common structure for dashboard",
            assignedOnStart: true,
            assignedAfterStart: false,
            status: "In progress",
        },
    ];

  return (
    <div className="flex gap-5 h-full flex-col overflow-y-scroll scrollbar pr-2">
      {/* Stats Cards */}
      <div className="flex justify-center items-center gap-6">
        <div className="bg-white/10 rounded-xl px-8 py-6 flex flex-col items-start min-w-[180px]">
          <span className="text-sm text-nowrap font-semibold text-white/80">Tasks at Start</span>
          <span className="text-3xl font-bold text-[#00c951]">17</span>
        </div>
        <div className="bg-white/10 rounded-xl px-8 py-6 flex flex-col items-start min-w-[180px]">
          <span className="text-sm text-nowrap font-semibold text-white/80">Completed</span>
          <span className="text-3xl font-bold text-[#00c951]">9</span>
        </div>
        <div className="bg-white/10 rounded-xl px-8 py-6 flex flex-col items-start min-w-[180px]">
          <span className="text-sm text-nowrap font-semibold text-white/80">Incomplete</span>
          <span className="text-3xl font-bold text-[#00c951]">5</span>
        </div>
        <div className="bg-white/10 rounded-xl px-8 py-6 flex flex-col items-start min-w-[180px]">
          <span className="text-sm text-nowrap font-semibold text-white/80">In progress</span>
          <span className="text-3xl font-bold text-[#00c951]">3</span>
        </div>
        <div className="bg-white/10 rounded-xl px-8 py-6 flex flex-col items-start min-w-[180px]">
          <span className="text-sm text-nowrap font-semibold text-white/80">Added After Start</span>
          <span className="text-3xl font-bold text-[#00c951]">2</span>
        </div>
      </div>
      {/* Table Card */}
      <div className="bg-white/10 rounded-2xl p-8 w-full max-w-6xl mx-auto">
        <div className="flex gap-8 mb-6">
          <div className="flex flex-col flex-1">
            <label className="text-white/80 mb-2">View sprint by User</label>
            <select className="bg-white/10 rounded-lg px-4 py-2 text-white/80 outline-none">
              <option>Emin</option>
              <option>Jane</option>
              <option>John</option>
            </select>
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-white/80 mb-2">Number of tasks</label>
            <input
              className="bg-white/10 rounded-lg px-4 py-2 text-white/80 outline-none"
              value="8"
              readOnly
            />
          </div>
        </div>
        <div>
          <div className="grid grid-cols-5 gap-4 font-medium bg-white/10 rounded-xl px-4 py-3 text-white/80">
            <div className="col-span-2">Task name</div>
            <div className="col-span-1">Assigned on Start</div>
            <div className="col-span-1">Assigned after Start</div>
            <div className="col-span-1">Status</div>
          </div>
          <div className='flex flex-col gap-4 mt-4'>
            {mockTasks.map((task, idx) => (
              <div
                key={idx}
                className="grid grid-cols-5 gap-4 bg-white/10 px-4 py-3 rounded-xl border-white/5 text-white/90"
              >
                <div className='col-span-2'>{task.name}</div>
                <div className='col-span-1'>{task.assignedOnStart ? "Yes" : "No"}</div>
                <div className='col-span-1'>{task.assignedAfterStart ? "Yes" : "No"}</div>
                <div className='col-span-1'>{task.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default page