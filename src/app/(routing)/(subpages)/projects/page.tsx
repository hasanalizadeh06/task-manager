"use client";
import React from 'react'
import { useEffect, useState } from "react";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { ProjectsResponse } from "@/interfaces/Tasks";
import { CreateProjectDialog } from '@/components/CreateProject';
import Link from 'next/link';
import { CustomerResponse } from '@/interfaces/Customer';

function Page() {
  const [projects, setProjects] = useState<ProjectsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const getProjects = () => {
    clxRequest
      .get<ProjectsResponse>("/projects?page=1&limit=1000")
      .then((res) => setProjects(res))
      .finally(() => setLoading(false));
    clxRequest
      .get<CustomerResponse[]>("/customers?page=1&limit=1000")
      .then((res) => { setCustomers(res); });
  }
  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="flex flex-col min-h-0">
      <div className="flex gap-4 mb-5">
        <button className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full shadow">
          Filter
        </button>
        <div className="flex items-center bg-white/10 px-4 py-2 rounded-full shadow w-80">
          <input
            className="bg-transparent outline-none text-white w-full"
            placeholder="Search"
          />
        </div>
        <div className="ml-auto">
          <CreateProjectDialog onProjectCreated={getProjects} isCollapsed={false} />
        </div>
      </div>
      <div className="scrollbar pr-2 overflow-x-scroll grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : projects?.items.length ? (
          projects.items.map((project) => (
            <Link
              href={`/projects/${project.title}`}
              key={project.id}
              className="bg-white/10 rounded-xl shadow-lg cursor-pointer hover:bg-white/20 p-4 flex flex-col"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-lime-400 text-lg">
                  {project.title}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-white">Description:</span>
                <span className="text-gray-300 text-sm">
                  {project.description.length > 20
                    ? `${project.description.slice(0, 20)}...`
                    : project.description}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">Customer:</span>
                <span className="text-gray-300 text-sm">
                  {customers.find(c => c.id === project.customerId)?.name || "N/A"}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-white">No projects found.</div>
        )}
      </div>
    </div>
  );
}

export default Page;