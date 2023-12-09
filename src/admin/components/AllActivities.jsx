import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/configFirebase";
import { useAuth } from "../../context/AuthContext";

function AllActivities() {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState([]);
  // const [lecturerId, setLecturerId] = useState(null);
  // if the events date is less than the current date, then don't display it on the list
  const filteredEvents = userData.filter((event) => event.start > new Date());

  useEffect(() => {
    if (authUser) {
      const email = authUser.email;
      console.log("Email:", email);
      const unsubscribe = onSnapshot(
        doc(db, "events", "eventsPosts"),
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            console.log("Fetched data from Firestore:", data);
            const dataModules = data.allLecturerPost;
            // console.log("Modules:", dataModules);
            const posts = dataModules.map((post) => ({
              ...post,
              start: post.start.toDate(),
              end: post.end.toDate(),
            }));

            // Convert dates to formatted strings
            const formattedPosts = posts.map((post) => ({
              ...post,
              formattedStartDate: post.start.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
              formattedEndDate: post.end.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
            }));
            setUserData(formattedPosts);
          }
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [authUser]);
  return (
    <div>
      <Card
        color="gray"
        variant="gradient"
        className="w-full p-12 bg-primary text-white"
      >
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 mb-8 rounded-none border-b border-white/10 pb-8 text-center"
        >
          <Typography
            variant="small"
            color="white"
            className="font-normal uppercase"
          >
            Lecturer Activities
          </Typography>
        </CardHeader>
        <CardBody className="p-0">
          {userData.length === 0 ? (
            <div className="flex flex-col items-center justify-center" key={userData.name}>
              <Typography className="text-2xl font-bold">
                No activities
              </Typography>
              <Typography className="text-lg font-normal">
                Please check back later
              </Typography>
            </div>
          ) : (
            filteredEvents.map((item) => (
              <ul className="flex flex-col gap-4 m-2" key={item.lecturerName}>
                <li className="flex items-center gap-4">
                  <span className="rounded-full border border-white/20 bg-white/20 p-1">
                    <ArrowRightAltIcon className="text-primary" />
                  </span>
                  <Typography className="font-normal">
                    {item.formattedEndDate}{" "}
                  </Typography>
                  <Typography className="font-normal text-white">
                    {item.title} by <b>{item.lecturerName}</b>
                  </Typography>
                </li>
              </ul>
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default AllActivities;
