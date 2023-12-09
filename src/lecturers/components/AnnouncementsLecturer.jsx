import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/configFirebase";
import {
  Timeline,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  Typography,
} from "@material-tailwind/react";
import { format } from "date-fns";
import CampaignIcon from "@mui/icons-material/Campaign";

function AnnouncementsLecturer() {
  const [userData, setUserData] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const email = user.email;
      // console.log("Email:", email);
      const unsubscribe = onSnapshot(doc(db, "users", email), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          // console.log("Fetched data from Firestore:", data);
          setUserData(data);
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const lecturerAnnouncements = await getDocs(
        collection(db, "announcements_lecturer")
      );
      // const studentAnnouncements = await getDocs(
      //   collection(db, "announcements_student")
      // );
      // const everyoneAnnouncements = await getDocs(
      //   collection(db, "announcements_everyone")
      // );
      const lecturerAnnouncementsDocs = [
        ...lecturerAnnouncements.docs,
        // ...studentAnnouncements.docs,
        // ...everyoneAnnouncements.docs,
      ];
      setAnnouncements(lecturerAnnouncementsDocs);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="">
      <div className="p-8">
        <Typography variant="h3" color="black">
          Announcements
        </Typography>
      </div>
      <div className="w-full ml-0 mb-5 mt-0">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div className="mr-5 mt-0 p-5" key={announcement.data().timestamp}>
              <Timeline >
                <TimelineItem className="h-28 ">
                  {/* <TimelineConnector className="!w-[78px]" /> */}
                  <TimelineHeader className="relative rounded-none hover:border-l-8 hover:border-primary  bg-transparent hover:bg-white py-0 pl-4 pr-0  shadow-blue-gray-900/5">
                    <TimelineIcon className="p-3" variant="ghost">
                      <CampaignIcon className="h-5 w-5" />
                    </TimelineIcon>
                    <div className="flex flex-col gap-2 p-5 w-full">
                      <div className="flex flex-row justify-between gap-2 items-center">
                        <div>
                          <Typography variant="h3" color="blue-gray">
                            {announcement.data().title}
                          </Typography>
                        </div>
                        <div>
                          {announcement.data().timestamp && (
                            <Typography
                              variant="small"
                              color="gray"
                              className="font-normal"
                            >
                              {format(
                                announcement.data().timestamp.toDate(),
                                "dd MMM h:mm a"
                              )}
                            </Typography>
                          )}
                        </div>
                      </div>

                      <Typography
                        variant="h6"
                        color="gray"
                        className="text-base font-normal"
                      >
                        {announcement.data().text}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="deep-orange"
                        className="text-base font-normal"
                      >
                        posted by {announcement.data().name}
                      </Typography>
                    </div>
                  </TimelineHeader>
                </TimelineItem>
              </Timeline>
            </div>
          ))
        ) : (
          <p className="p-8">No announcements to display</p>
        )}
      </div>
    </div>
  );
}

export default AnnouncementsLecturer;
