import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlughin from "@fullcalendar/interaction";
import { db } from "../../firebase/configFirebase";
import { collection, doc, onSnapshot } from "firebase/firestore";

function TimetablesModules() {
  const [formattedEvents, setFormattedEvents] = useState([]);
  useEffect(() => {
    // Fetch timetable data from Firestore
    const unsubscribe = onSnapshot(collection(db, "modules"), (snapshot) => {
      if (!snapshot.empty) {
        const formattedEvents = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.timetable) {
            data.timetable.forEach((occurrence) => {
              const today = new Date();
              const dayOfWeek = today.getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

              // Calculate the date of the next occurrence of this event in the current week
              const daysUntilNextOccurrence =
                dayOfWeek <= getDayOfWeek(occurrence.day)
                  ? getDayOfWeek(occurrence.day) - dayOfWeek
                  : 7 - dayOfWeek + getDayOfWeek(occurrence.day);

              const startDate = new Date(today);
              startDate.setDate(today.getDate() + daysUntilNextOccurrence);
              startDate.setHours(occurrence.startTime.split(":")[0]);
              startDate.setMinutes(occurrence.startTime.split(":")[1]);
              startDate.setSeconds(occurrence.startTime.split(":")[2]);

              const endDate = new Date(startDate);
              endDate.setHours(occurrence.endTime.split(":")[0]);
              endDate.setMinutes(occurrence.endTime.split(":")[1]);
              endDate.setSeconds(occurrence.endTime.split(":")[2]);

              formattedEvents.push({
                title: data.moduleCode,
                name: data.moduleName,
                start: startDate,
                end: endDate,
                location: occurrence.location,
                ...data,
              });
            });
          }
        });
        setFormattedEvents(formattedEvents);
        // console.log("Formatted events:", formattedEvents);
      } else {
        console.log("No documents found in the 'modules' collection.");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const eventContent = (eventInfo) => {
    return (
      <div className="text-center w-full">
        {/* <div className="text-sm font-medium">({eventInfo.event.title})</div> */}
        <div className=" flex justify-around">
          <span>
            {eventInfo.event.start.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </span>{" "}
          <p className="pt-4 text-sm font-medium">
            {eventInfo.event.extendedProps.name} ({eventInfo.event.title})
          </p>
          <span>
            {eventInfo.event.end.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </span>{" "}
        </div>
        <p>
          {eventInfo.event.extendedProps.lecturerName
            ? eventInfo.event.extendedProps.lecturerName
            : "No lecturer assigned"}{" "}
        </p>
        <div className="text-xs">{eventInfo.event.extendedProps.location}</div>
      </div>
    );
  };

  // Helper function to map day names to FullCalendar day of the week
  const getDayOfWeek = (day) => {
    switch (day) {
      case "Monday":
        return 1;
      case "Tuesday":
        return 2;
      case "Wednesday":
        return 3;
      case "Thursday":
        return 4;
      case "Friday":
        return 5;
      case "Saturday":
        return 6;
      case "Sunday":
        return 7;
      default:
        return 1;
    }
  };

  return (
    <div className="m-10 bg-white">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlughin]}
        initialView="timeGridDay"
        weekends={false}
        events={formattedEvents}
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "today",
        }}
        titleFormat={{ year: "numeric", month: "long", day: "numeric" }}
        height="350px"
        allDaySlot={false}
        // slotDuration={"00:15:00"}
        slotEventOverlap={false}
        nowIndicator={true}
        eventContent={eventContent}
      />
    </div>
  );
}

export default TimetablesModules;
