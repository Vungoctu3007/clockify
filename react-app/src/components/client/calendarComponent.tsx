import React, { useEffect, useRef, useState } from "react";
import "../../css/calendar.css";
import { Calendar } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import AddEventModal from "../addEventModal";
import { getAllTimeEntryByUserId } from "@/services/timeEntryService";
import { TimeEntry } from "@/types/timeEntry";
import { updateTimeEntry } from "@/services/timeEntryService";
import { useDispatch } from "react-redux";
import { setToast } from "@/redux/slice/toastSlice";

interface CalendarEvent {
  time_entry_id?: number;
  title: string;
  start: string;
  end: string;
  borderColor: string;
  textColor: string;
  extendedProps?: {
    description: string;
    project_id: number;
    task_id: number;
  };
}

const CalendarComponent: React.FC = () => {
  const calendarEl = useRef<HTMLDivElement | null>(null);
  const calendarInstance = useRef<Calendar | null>(null);
  const [view, setView] = useState("timeGridWeek");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllTimeEntryByUserId();
        const transformedEvents = data.data.map((event: CalendarEvent) => {
          const offsetVN = 7 * 60 * 60 * 1000;

          const startDate = new Date(new Date(event.start).getTime() + offsetVN);
          const endDate = new Date(new Date(event.end).getTime() + offsetVN);
          return {
            id: event.time_entry_id?.toString(),
            ...event,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          };
        });
        setEvents(transformedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (calendarEl.current) {
      const calendar = new Calendar(calendarEl.current, {
        plugins: [interactionPlugin, timeGridPlugin],
        initialView: view,
        initialDate: currentDate,
        events: events,
        allDaySlot: false,
        slotMinTime: "00:00:00",
        slotMaxTime: "24:00:00",
        slotDuration: "01:00:00",
        snapDuration: "00:01:00",
        slotLabelInterval: "01:00",
        slotLabelFormat: {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          meridiem: "short",
        },
        editable: true,
        droppable: true,
        selectable: true,
        headerToolbar: false,
        eventDrop: async (info) => {
          const event = info.event;
          if (event.start && event.id) {
            const newStart = new Date(event.start.getTime()).toISOString();
            const newEnd = event.end
              ? new Date(event.end.getTime()).toISOString()
              : newStart;

            const updatedEvent: TimeEntry = {
              start_time: newStart,
              end_time: newEnd,
              description: event.extendedProps?.description || "",
              project_id: event.extendedProps?.project_id || null,
              task_id: event.extendedProps?.task_id || null,
            };

            try {
              const response = await updateTimeEntry(Number(event.id), updatedEvent);
              if (response.success && response.data) {
                setEvents((prevEvents) =>
                  prevEvents.map((e) =>
                    e.time_entry_id === Number(event.id)
                      ? {
                          ...e,
                          start: newStart,
                          end: newEnd,
                        }
                      : e
                  )
                );
                dispatch(setToast({ message: "Update event successfully", type: "success" }));
              } else {
                info.revert();
                console.error("Failed to update event:", response.message);
              }
            } catch (error) {
              info.revert();
              console.error("Error updating event on drop:", error);
            }
          }
        },
        eventResize: async (info) => {
          const event = info.event;
          if (event.start && event.end && event.id) {
            const newStart = new Date(event.start.getTime()).toISOString();
            const newEnd = new Date(event.end.getTime()).toISOString();

            const updatedEvent: TimeEntry = {
              start_time: newStart,
              end_time: newEnd,
              description: event.extendedProps?.description || "",
              project_id: event.extendedProps?.project_id || null,
              task_id: event.extendedProps?.task_id || null,
            };

            try {
              const response = await updateTimeEntry(Number(event.id), updatedEvent);
              if (response.success && response.data) {
                setEvents((prevEvents) =>
                  prevEvents.map((e) =>
                    e.time_entry_id === Number(event.id)
                      ? {
                          ...e,
                          start: newStart,
                          end: newEnd,
                        }
                      : e
                  )
                );
                dispatch(setToast({ message: "Update event successfully", type: "success" }));
              } else {
                info.revert();
                dispatch(setToast({ message: "Failed to resize event", type: "error" }));
              }
            } catch (error) {
              info.revert();
              console.error("Error resizing event:", error);
            }
          }
        },
        select: (info) => {
          const offsetVN = 7 * 60 * 60 * 1000;
          const vnStart = new Date(info.start.getTime() - offsetVN);
          const vnEnd = new Date(info.end.getTime() - offsetVN);

          setSelectedStart(vnStart);
          setSelectedEnd(vnEnd);
          setSelectedEvent(null);
          setIsModalOpen(true);
        },
        eventClick: (info) => {
          const event = info.event;
          const offsetVN = 7 * 60 * 60 * 1000;
          const start = new Date(event.start!.getTime() - offsetVN);
          const end = event.end ? new Date(event.end.getTime() - offsetVN) : null;

          const selectedEvent: CalendarEvent = {
            time_entry_id: event.id ? Number(event.id) : undefined,
            title: event.title,
            start: event.start!.toISOString(),
            end: event.end ? event.end.toISOString() : "",
            borderColor: event.borderColor || "gray",
            textColor: event.textColor || "black",
            extendedProps: {
              description: event.extendedProps?.description || "",
              project_id: event.extendedProps?.project_id || null,
              task_id: event.extendedProps?.task_id || null,
            },
          };

          setSelectedStart(start);
          setSelectedEnd(end);
          setSelectedEvent(selectedEvent);
          setIsModalOpen(true);
        },
        datesSet: (dateInfo) => {
          setCurrentDate(dateInfo.start);
        },
        eventTimeFormat: {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          meridiem: "short",
        },
        timeZone: "Asia/Ho_Chi_Minh",
      });

      calendar.render();
      calendarInstance.current = calendar;
      calendar.setOption("events", events);
    }

    return () => {
      if (calendarEl.current) {
        calendarEl.current.innerHTML = "";
      }
    };
  }, [events, view]);

  const handleViewChange = (newView: string) => {
    setView(newView);
    if (calendarInstance.current) {
      calendarInstance.current.changeView(newView);
      calendarInstance.current.setOption("events", events);
    }
    if (newView === "timeGridDay") {
      setCurrentDate(new Date());
      if (calendarInstance.current) {
        calendarInstance.current.gotoDate(new Date());
      }
    }
  };

  const handlePrev = () => {
    if (calendarInstance.current) {
      calendarInstance.current.prev();
    }
  };

  const handleNext = () => {
    if (calendarInstance.current) {
      calendarInstance.current.next();
    }
  };

  const addEvent = (newEvent: CalendarEvent) => {
    if (newEvent.time_entry_id) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.time_entry_id === newEvent.time_entry_id ? newEvent : event
        )
      );
    } else {
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
  };

  const handleEventDeleted = (timeEntryId: number) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.time_entry_id !== timeEntryId)
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="p-2 text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={handleNext} className="p-2 text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => handleViewChange("timeGridWeek")}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${view === "timeGridWeek" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            WEEK
          </button>
          <button
            onClick={() => handleViewChange("timeGridDay")}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${view === "timeGridDay" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            DAY
          </button>
        </div>
        <div className="flex items-center gap-2">
          <select className="p-2 border rounded-lg text-sm text-gray-600">
            <option>Teammates</option>
            <option>Team Member 1</option>
            <option>Team Member 2</option>
          </select>
          <span className="text-sm text-gray-600">This week</span>
        </div>
      </div>

      <div ref={calendarEl} className="fc-custom" />

      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        startTime={selectedStart}
        endTime={selectedEnd}
        onEventAdded={addEvent}
        onEventDeleted={handleEventDeleted}
        selectedEvent={selectedEvent}
      />
    </div>
  );
};

export default CalendarComponent;
