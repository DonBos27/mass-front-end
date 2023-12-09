import React, { useEffect, useState } from "react";
import Sidebar from "../global/Sidebar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import NavbarStudent from "../global/NavbarStudent";
import { CalendarMonth } from "@mui/icons-material";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/configFirebase";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  CardBody,
  CardHeader,
  Dialog,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import UJLogo from "../images/uj.png";

function Calendar({ handleProfile }) {
  const [event, setEvent] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scope, setScope] = useState("");
  const [type, setType] = useState("");
  const [lecturerName, setLecturerName] = useState("");
  const [lecturerEmail, setLecturerEmail] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [open, setOpen] = useState(false);
  const [tabs, setTabs] = useState("Upcoming");
  const { user: authUser } = useAuth();
  const [allEvents, setAllEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "events", "eventsPosts"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const today = new Date();

        const posts = data.allLecturerPost.map((post) => ({
          ...post,
          start: post.start.toDate(),
          end: post.end.toDate(),
        }));

        setAllEvents(posts);

        const futurePosts = posts.filter(
          (post) => new Date(post.start) >= today
        );
        setUpcomingEvents(futurePosts);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleOpen = () => {
    setOpen((cur) => !cur);
    // console.log("Open Modal");
  };

  const handleEventClick = (arg) => {
    const { lecturerEmail } = arg.event.extendedProps;
    // console.log(lecturerEmail);
    const lecturerID = authUser.email;
    // console.log(lecturerID);

    const title = arg.event.title;
    const { uid, description, start, end, scope, type, lecturerName } =
      arg.event.extendedProps;

    //console.log(title, description, scope, type, lecturerName);

    const startDate = new Date(arg.event.start);
    const endDate = new Date(arg.event.end);
    //console.log(startDate, endDate);

    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const day = startDate.getDate();
    const hours = startDate.getHours();
    const minutes = startDate.getMinutes();

    const yearEnd = endDate.getFullYear();
    const monthEnd = endDate.getMonth();
    const dayEnd = endDate.getDate();
    const hoursEnd = endDate.getHours();
    const minutesEnd = endDate.getMinutes();

    const formattedDateEnd = `${yearEnd}-${(monthEnd + 1)
      .toString()
      .padStart(2, "0")}-${dayEnd.toString().padStart(2, "0")}T${hoursEnd
      .toString()
      .padStart(2, "0")}:${minutesEnd.toString().padStart(2, "0")}`;

    const formattedDate = `${year}-${(month + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}T${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    // console.log(formattedDate);
    // console.log(formattedDateEnd);

    setTitle(title);
    // console.log("Title:", title);
    setDescription(description);
    // console.log("Description:", description);
    setScope(scope);
    // console.log("Scope:", scope);
    setType(type);
    setSelectedStartDate(formattedDate);
    setSelectedEndDate(formattedDateEnd);
    setLecturerName(lecturerName);

    handleOpen();
  };

  const eventContent = (arg) => {
    const title = arg.event.title;
    const { description, start, end, scope, type, lecturerName } =
      arg.event.extendedProps;

    const startDate = new Date(arg.event.start);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset the time part, to only compare the date.

    const isPastEvent = startDate < today;

    const baseStyles = {
      padding: "3px",
      borderRadius: "5px",
      cursor: "pointer",
      backgroundColor: arg.event.backgroundColor,
      color: "white",
    };

    // If the event date has passed, gray out the event.
    const styles = isPastEvent
      ? {
          ...baseStyles,
          opacity: 0.5,
          backgroundColor: "#cccccc",
          color: "black",
        }
      : baseStyles;

    return (
      <div style={styles} className="text-center w-full">
        <i>
          <span className="font-bold text-lg">{lecturerName}</span> <br />
          <b>{truncate(title, 25)}</b>
        </i>
        <p className="w-full p-2">{truncate(description, 15)}</p>
      </div>
    );
  };

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  const daysleft = (date) => {
    const today = new Date();
    const eventDate = new Date(date);
    if (eventDate < today) return null; // Return null if eventDate is in the past

    const diffTime = Math.abs(eventDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="flex">
      <div className="w-1/4">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full mr-4 mb-4 mt-4 h-full">
        <NavbarStudent
          Icon={CalendarMonth}
          title={"Calendar"}
          handleProfile={handleProfile}
        />
        <div className="bg-white mt-4 rounded-lg">
          <div className="flex flex-1">
            <div className="m-5 w">
              <Card className="w-[450px]">
                <CardHeader
                  color="gray"
                  floated={false}
                  shadow={false}
                  className="m-0 grid place-items-center rounded-b-none py-8 px-4 text-center"
                >
                  <div className="mb-4 rounded-full border border-white/10 bg-white/10 text-white">
                    <img src={UJLogo} alt="UJ Logo" className="rounded-full" />
                  </div>
                  <Typography variant="h4" color="white">
                    MASS
                  </Typography>
                </CardHeader>
                <CardBody>
                  <Tabs value="Upcoming" className="overflow-visible">
                    <TabsHeader className="relative z-0 ">
                      <Tab value="Upcoming" onClick={() => setTabs("Upcoming")}>
                        UPCOMING ACTIVITIES
                      </Tab>
                      <Tab value="DaysLeft" onClick={() => setType("DaysLeft")}>
                        DAYS LEFT
                      </Tab>
                    </TabsHeader>
                    <TabsBody
                      className="!overflow-x-hidden !overflow-y-visible"
                      animate={{
                        initial: {
                          x: type === "Upcoming" ? 400 : -400,
                        },
                        mount: {
                          x: 0,
                        },
                        unmount: {
                          x: type === "Upcoming" ? 400 : -400,
                        },
                      }}
                    >
                      <TabPanel value="Upcoming" className="p-0">
                        {upcomingEvents.map((item, index) => (
                          <div key={index} className="flex flex-col gap-2 p-2">
                            <div className="flex flex-row justify-between">
                              <Typography variant="h6" color="gray">
                                {item.title}
                              </Typography>
                              <Typography variant="h6" color="gray">
                                {item.moduleCode}
                              </Typography>
                            </div>
                          </div>
                        ))}
                      </TabPanel>

                      <TabPanel value="DaysLeft" className="p-0">
                        {upcomingEvents.map((item, index) => {
                          const remainingDays = daysleft(item.start);
                          return (
                            <div
                              key={index}
                              className="flex flex-col gap-2 p-2"
                            >
                              <div className="flex flex-row justify-between">
                                <Typography variant="h6" color="gray">
                                  {item.title}
                                </Typography>
                                <Typography variant="h6" color="gray">
                                  {remainingDays} days left
                                </Typography>
                              </div>
                            </div>
                          );
                        })}
                      </TabPanel>
                    </TabsBody>
                  </Tabs>
                </CardBody>
              </Card>
            </div>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              weekends={false}
              events={allEvents}
              height="800px"
              eventContent={eventContent}
              eventClick={handleEventClick}
            />
          </div>
        </div>
        <Dialog
          size="xs"
          open={open}
          handler={handleOpen}
          className="bg-transparent shadow-none"
        >
          <Card className="mx-auto w-full max-w-[24rem]">
            <CardHeader
              variant="gradient"
              className="mb-4 grid h-28 place-items-center bg-primary"
            >
              <Typography variant="h3" color="white">
                {title}
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h6" color="gray">
                Description: {description}
              </Typography>
              <Typography variant="h6" color="gray">
                Scope: {scope}
              </Typography>
              <Typography variant="h6" color="gray">
                Type of assessment: {type}
              </Typography>
              <Typography variant="h6" color="gray">
                Lecturer Name : {lecturerName}
              </Typography>
              <Typography variant="h6" color="gray">
                From: {selectedStartDate}
              </Typography>
              <Typography variant="h6" color="gray">
                To: {selectedEndDate}
              </Typography>
            </CardBody>
          </Card>
        </Dialog>
      </div>
    </div>
  );
}

export default Calendar;
