"use client";
import React, { useEffect, useMemo, useState } from "react";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import Image from "next/image";
import img from "@/../public/images/avatar.svg";
import filter from "@/shared/assets/icons/sort.png";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  position: {
    id: string;
    description: string;
    name: string;
  };
};

// Task interface
interface Task {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string[];
  startDate: string;
  dueDate: string;
  estimatedTime: number | null;
  actualTime: number;
  tags: string[];
  progress: number;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  sprintId: string | null;
  sprint: string | null;
}

// Sprint interface
interface Sprint {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  goal: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  assignedTo: string[];
  assignees: string[];
  storyPoints?: { done: number; total: number };
}

// Project interface
interface Project {
  id: string;
  title: string;
  description: string;
  customerId: string;
  archived: boolean;
  createdAt?: string;
  updatedAt?: string;
  assignedTo?: string[];
  customer?: {
    id: string;
    name: string;
    company: string;
    email: string;
  };
}

// Epic interface
interface Epic {
  id: string;
  name: string;
  description: string | null;
  status: string;
  priority: string;
  startDate: string | null;
  endDate: string;
  archived: boolean;
  goal: string;
  progress: number;
  storyPoints: number;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  assignedTo?: string[];
  project: {
    id: string;
    title: string;
    description: string;
    customerId: string;
    archived: boolean;
  };
}

// Union type for all possible related items
type ArchiveRelatedItem = Task | Sprint | Project | Epic;

type ArchiveItem = {
  type: "task" | "sprint" | "project" | "epic";
  id: string;
  relationId: string;
  relateditem: ArchiveRelatedItem;
  archivedBy?: string | number | null;
  archivedAt?: string;
};

// Type guards to identify the item type
function isTask(item: ArchiveRelatedItem): item is Task {
  return 'priority' in item && typeof (item as Task).priority === 'string' && 
         ['Low', 'Medium', 'High', 'Critical'].includes((item as Task).priority);
}

function isSprint(item: ArchiveRelatedItem): item is Sprint {
  return 'goal' in item && 'endDate' in item && !('title' in item);
}

function isProject(item: ArchiveRelatedItem): item is Project {
  return 'title' in item && 'customerId' in item;
}

function isEpic(item: ArchiveRelatedItem): item is Epic {
  return 'storyPoints' in item && typeof (item as Epic).storyPoints === 'number' && 'goal' in item;
}

// Helper function to get display name
function getDisplayName(item: ArchiveRelatedItem): string {
  if (isProject(item)) {
    return item.title;
  }
  if (isTask(item) || isSprint(item) || isEpic(item)) {
    return item.name;
  }
  return "Unknown Item";
}

// Helper function to get description
function getDescription(item: ArchiveRelatedItem): string {
  return item.description || "";
}

// Helper function to get assignees
function getAssignees(item: ArchiveRelatedItem): string[] {
  if (isTask(item) || isSprint(item)) {
    return item.assignedTo || [];
  }
  if (isProject(item) || isEpic(item)) {
    return (item as Project | Epic).assignedTo || [];
  }
  return [];
}

// Helper function to get archived/updated date
function getArchivedDate(item: ArchiveItem): string {
  // First check if there's an archivedAt on the main item
  if (item.archivedAt) {
    return item.archivedAt;
  }
  
  // Then check the related item's updatedAt
  const relatedItem = item.relateditem;
  if ('updatedAt' in relatedItem && relatedItem.updatedAt) {
    return relatedItem.updatedAt;
  }
  
  // Finally check createdAt
  if ('createdAt' in relatedItem && relatedItem.createdAt) {
    return relatedItem.createdAt;
  }
  
  return "";
}

function formatDate(dateLike?: string | null) {
  if (!dateLike) return "-";
  try {
    return new Date(dateLike).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}

function getUserFullName(user?: User | null): string {
  if (!user) return "";
  return `${user.firstName || ""} ${user.lastName || ""}`.trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q || q.length < 3) return <>{text}</>;
  try {
    const regex = new RegExp(escapeRegExp(q), "ig");
    const parts = text.split(regex);
    const matches = text.match(regex) || [];
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < matches.length && (
              <span className="bg-yellow-400/30 text-white rounded px-0.5">
                {matches[index]}
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  } catch {
    return <>{text}</>;
  }
}

function Avatar({ user }: { user?: User | null }) {
  return (
    <div
      title={user ? `${user.firstName} ${user.lastName}` : "Deleted user"}
  className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden"
    >
      <Image
        width={100}
        height={100}
        src={user?.avatarUrl || img}
        alt="User Avatar"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default function ArchiveTable() {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"all" | "epic" | "task" | "project" | "sprint" | "subtask">("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      clxRequest.get<ArchiveItem[]>("/archive/all").then((res) => {
        setItems(res);
        setLoading(false);
      });
      clxRequest.get<{items: User[]}>("/users").then((res) => {
        setUsers(res.items);
      });
    } catch (error) {
      console.error("Failed to fetch archive items or users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    console.log(items, users)
  }, [items.length, users.length]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const hasQuery = normalizedQuery.length >= 3;
    return items.filter((item) => {
      const matchesType =
        typeFilter === "all" || item.type?.toLowerCase() === typeFilter;
      if (!matchesType) return false;

      if (!hasQuery) return true;

      const typeText = (item.type || "").toLowerCase();
      const idText = (item.id || "").toLowerCase();
      const relationIdText = (item.relationId || "").toLowerCase();
      const name = getDisplayName(item.relateditem).toLowerCase();
      const description = getDescription(item.relateditem).toLowerCase();
      const archivedDate = getArchivedDate(item);
      const archivedAtRaw = archivedDate.toLowerCase();
      const archivedAtFmt = formatDate(archivedDate).toLowerCase();

      const archivedByUser = findUser(item.archivedBy ?? null);
      const archivedByName = getUserFullName(archivedByUser).toLowerCase();

      const assigneeNames = getAssignees(item.relateditem)
        .map((uid) => getUserFullName(findUser(uid)))
        .join(" ")
        .toLowerCase();

      return [
        typeText,
        idText,
        relationIdText,
        name,
        description,
        assigneeNames,
        archivedByName,
        archivedAtRaw,
        archivedAtFmt,
      ].some((field) => field.includes(normalizedQuery));
    });
  }, [items, query, typeFilter]);

  function findUser(id?: string | number | null): User | undefined {
    if (id === null || id === undefined) return undefined;
    const numericId = typeof id === "string" ? Number(id) : id;
    if (Number.isNaN(numericId)) return undefined;
    return users.find((u) => u.id === numericId);
  }

  return (
    <div className="flex flex-col gap-3 overflow-y-scroll scrollbar pr-2">
      {/* Top bar */}
      <div className="flex items-center justify-between relative">
        <div className="w-[280px] h-9 rounded-full bg-[#ffffff1a] flex items-center px-3 text-sm text-gray-300">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all details (min 3 chars)..."
            className="bg-transparent outline-none w-full placeholder:text-gray-400"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen((v) => !v)}
            className="h-9 px-4 bg-[#ffffff1a] flex items-center gap-2 rounded-full text-sm text-gray-300"
          >
            <Image src={filter} alt="filter" />
            {typeFilter === "all" ? "Filter" : `Filter: ${typeFilter}`}
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-[#ffffff1a] text-gray-200 rounded-xl shadow-lg overflow-hidden z-10" style={{boxShadow: "0px 4px 10px 0px #0000001A", backdropFilter: 'blur(20px)'}}>
              {[
                { key: "all", label: "All" },
                { key: "task", label: "Task" },
                { key: "epic", label: "Epic" },
                { key: "project", label: "Project" },
                { key: "sprint", label: "Sprint" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    setTypeFilter(opt.key as typeof typeFilter);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-[#ffffff14] ${
                    typeFilter === (opt.key as typeof typeFilter)
                      ? "bg-[#ffffff1a]"
                      : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="grid gap-4 p-4 bg-[#ffffff1a] items-center rounded-2xl text-gray-300 text-sm font-medium grid-cols-[1fr_2fr_1fr_1fr_1fr]">
        <div>Archived item</div>
        <div>Summary</div>
        <div>Assignee</div>
        <div>Date archived</div>
        <div>Archived by</div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2.5">
        {loading ? (
          <div className="w-full h-[80px] bg-[#ffffff1a] rounded-2xl flex items-center justify-center text-gray-300">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="w-full h-[80px] bg-[#ffffff1a] rounded-2xl flex items-center justify-center text-gray-300">No archived items</div>
        ) : (
          filtered.map((item) => {
            const assignees = getAssignees(item.relateditem);
            const archivedDate = getArchivedDate(item);
            const archivedByUser = findUser(item.archivedBy ?? null);
            const displayName = getDisplayName(item.relateditem);
            const description = getDescription(item.relateditem);
            const summaryText = displayName || description || "-";
            
            return (
              <div
                key={item.id}
                className="grid items-center gap-4 rounded-2xl bg-[#ffffff1a] py-4 px-3 grid-cols-[1fr_2fr_1fr_1fr_1fr]"
              >
                <div className="text-gray-200 capitalize">
                  <HighlightedText text={item.type} query={query} />
                </div>
                <div className="text-gray-200 truncate" title={summaryText}>
                  <HighlightedText text={summaryText} query={query} />
                </div>
                <div>
                  <div className="flex -space-x-2">
                    {assignees.length > 2 ? (
                      <>
                        {assignees.slice(0, 2).map((uid, idx) => (
                          <Avatar key={`${uid}-${idx}`} user={findUser(uid)} />
                        ))}
                        <div
                          className="w-7 h-7 rounded-full border-2 border-white bg-gray-400 text-[10px] text-white flex items-center justify-center font-semibold"
                          title={assignees
                            .map((uid) => findUser(uid))
                            .filter(Boolean)
                            .map((u) => `${(u as User).firstName} ${(u as User).lastName}`)
                            .slice(2)
                            .join(", ")}
                        >
                          +{assignees.length - 2}
                        </div>
                      </>
                    ) : (
                      assignees.map((uid, idx) => <Avatar key={`${uid}-${idx}`} user={findUser(uid)} />)
                    )}
                  </div>
                </div>
                <div className="text-gray-200">
                  <HighlightedText text={formatDate(archivedDate)} query={query} />
                </div>
                <div>
                  {archivedByUser ? (
                    <Avatar user={archivedByUser} />
                  ) : (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden">
                      <Image width={100} height={100} src={img} alt="User Avatar" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}