"use client";

import React, { useRef, useState } from "react";
import FullCalendar, {
// @ts-expect-error: Gerekli tip uyuşmazlığı nedeniyle hata gizleniyor
  EventApi,
} from "@fullcalendar/react";
import { DateSelectArg, EventClickArg, EventContentArg, EventDropArg } from "@fullcalendar/core";
import { EventResizeDoneArg } from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import enLocale from "@fullcalendar/core/locales/en-au";

const AdvancedCalendar = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [events, setEvents] = useState<EventApi[]>([
    {
      id: "1",
      title: "🎯 Task: Meeting",
      start: "2025-07-25T10:00:00",
      end: "2025-07-25T11:00:00",
      color: "#3b82f6",
      extendedProps: {
        description: "A Zoom meeting will be held",
        type: "zoom",
      },
    } as EventApi,
  ]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt("Event Title:");
    if (title) {
      const newEvent = {
        id: String(Date.now()),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        color: "#10b981",
      };
      setEvents((prev) => [...prev, newEvent as EventApi]);
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (confirm(`Do you want to delete the event: "${clickInfo.event.title}"`)) {
      setEvents((prev) => prev.filter((e) => e.id !== clickInfo.event.id));
    }
  };

  const handleEventDrop = (info: EventDropArg) => {
    alert(`Event moved to new date: ${info.event.startStr}`);
  };

  const handleEventResize = (info: EventResizeDoneArg) => {
    alert(`Event duration changed: ${info.event.endStr}`);
  };

  const renderEventContent = (arg: EventContentArg) => (
    <div className="px-2 py-1 rounded text-white text-sm">
      <b>{arg.timeText}</b>
      <div>{arg.event.title}</div>
    </div>
  );

  return (
    <div className="p-4 shadow overflow-x-scroll scrollbar rounded-xl">
      <FullCalendar
        ref={calendarRef}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          interactionPlugin,
        ]}
        locale={enLocale}
        initialView="timeGridWeek"
        height="auto"
        editable={true}
        selectable={true}
        nowIndicator={true}
        events={events}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        eventContent={renderEventContent}
        dayMaxEvents={3}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        eventColor="#6366f1"
        dayHeaderClassNames="!bg-green-500 !bg-opacity-20 !text-white"
      />
    </div>
  );
};

export default AdvancedCalendar;