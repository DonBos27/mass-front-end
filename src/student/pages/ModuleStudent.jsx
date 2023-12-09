import { Breadcrumbs, Card, Typography } from "@material-tailwind/react";
import NavbarStudent from "../global/NavbarStudent";
import Sidebar from "../global/Sidebar";
import HomeIcon from "@mui/icons-material/Home";
import ModulesSstudent from "../components/ModulesSstudent";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineIcon,
  TimelineHeader,
} from "@material-tailwind/react";
import CampaignIcon from "@mui/icons-material/Campaign";
import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/configFirebase";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";

function ModuleStudent({ handleProfile }) {
  const [userData, setUserData] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const email = user.email;
      // console.log("Email:", email);
      const unsubscribe = onSnapshot(doc(db, "users", email), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          // console.log("Fetched data from Firestore:", data);
          setTimeout(() => {
            setUserData(data);
            setIsLoading(false);
          }, 2000);
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
      const studentAnnouncements = await getDocs(
        collection(db, "announcements_student")
      );
      const everyoneAnnouncements = await getDocs(
        collection(db, "announcements_everyone")
      );

      const combinedAnnouncements = [
        ...lecturerAnnouncements.docs,
        ...studentAnnouncements.docs,
        ...everyoneAnnouncements.docs,
      ];

      // Sort the combinedAnnouncements array by timestamp if needed
      // combinedAnnouncements.sort((a, b) => {
      //   if (a.data().timestamp < b.data().timestamp) {
      //     return 1;
      //   } else {
      //     return -1;
      //   }

      const sortedAnnouncements = studentAnnouncements.docs.sort(
        (a, b) => b.data().timestamp - a.data().timestamp
      );
      setTimeout(() => {
        setAnnouncements(sortedAnnouncements);
        setIsLoading(false);
      }, 2000);
      // console.log("Announcements:", combinedAnnouncements)
      console.log("Announcements Lecturer:", lecturerAnnouncements.docs);
      console.log("Announcements Student:", studentAnnouncements.docs);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full mr-4 mb-4 mt-4 h-full">
        <NavbarStudent
          Icon={HomeIcon}
          title={"Modules"}
          handleProfile={handleProfile}
        />
        <Card className="w-full my-4 bg-transparent border-none shadow-none">
          <div className="p-8">
            <Typography variant="h3" color="black">
              Modules
            </Typography>
          </div>
          <ModulesSstudent />
        </Card>
        <div className="p-8">
          <Typography variant="h3" color="black">
            Announcements
          </Typography>
        </div>
        <div className="w-full mb-4 mt-0">
          { announcements.length > 0 ? (
            announcements.map((announcement, index) => (
              <div className="mb-4 mt-8" key={index}>
                <Timeline>
                  <TimelineItem className="h-28 ">
                    <TimelineConnector className="!w-[78px]" />
                    <TimelineHeader className="relative rounded-none hover:border-l-8 hover:border-primary  bg-transparent hover:bg-white py-3 pl-4 pr-8  shadow-blue-gray-900/5">
                      <TimelineIcon className="p-3" variant="ghost">
                        <CampaignIcon className="h-5 w-5" />
                      </TimelineIcon>
                      <div className="flex flex-col gap-2">
                        <Typography variant="h6" color="blue-gray">
                          {announcement.data().title}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="gary"
                          className="text-base font-normal"
                        >
                          {announcement.data().text}
                        </Typography>
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
                        <Typography
                          variant="h6"
                          color="gary"
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
        {/* </Card> */}
      </div>
    </div>
  );
}

export default ModuleStudent;
