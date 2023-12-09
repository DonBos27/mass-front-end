import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlughin from "@fullcalendar/interaction";
import "./CalendarLecturer.css";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/configFirebase";
import { useAuth } from "../../context/AuthContext";

function CalendarLecturer() {
  const [formattedEvents, setFormattedEvents] = useState([]);
  const { user } = useAuth();
  const lecturerEmail = user.uid;
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "modules"), (snapshot) => {
      if (!snapshot.empty) {
        const formattedEvents = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.timetable) {
            if (data.assignedTo === lecturerEmail) {
              data.timetable.forEach((occurrence) => {
                console.log(occurrence.assignedTo, lecturerEmail);
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
  }, [lecturerEmail]);

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
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        titleFormat={{ year: "numeric", month: "long", day: "numeric" }}
        height={"500px"}
      />
    </div>
  );
}

export default CalendarLecturer;
