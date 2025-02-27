import React, { useEffect, useRef } from 'react';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import '../../css/calendar.css';

const CalendarComponent: React.FC = () => {
  const calendarEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (calendarEl.current) {
      const calendar = new Calendar(calendarEl.current, {
        plugins: [dayGridPlugin, interactionPlugin, resourceTimeGridPlugin],
        allDaySlot: false,
        initialView: 'timeGridWeek',
        events: [
          {
            title: 'Algorithm',
            start: '2025-02-17T02:30:00',
            end: '2025-02-17T04:30:00',
          },
          {
            title: 'Algorithm',
            start: '2025-02-17T05:00:00',
            end: '2025-02-17T07:30:00',
          },
        ],
        editable: true,
        droppable: true,
        selectable: true,
        eventDrop: function (info) {
            if (info.event.start) {
              alert(`${info.event.title} đã được thả vào ${info.event.start.toISOString()}`);
            }
          },
          eventResize: function (info) {
            if (info.event.start) {
              alert(`${info.event.title} đã thay đổi thời gian.`);
            }
          },

        select: (info) => {
          const title = prompt('Enter event title');
          if (title) {
            calendar.addEvent({
              title: title,
              start: info.start,
              end: info.end,
            });
          }
        },
      });

      calendar.render();
    }

    return () => {
      if (calendarEl.current) {
        calendarEl.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div>
      <h1>Quản lý Thời gian với Resource View</h1>
      <div ref={calendarEl}></div>
    </div>
  );
};

export default CalendarComponent;
