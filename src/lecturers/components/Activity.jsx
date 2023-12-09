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
import { useAuth } from "../../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/configFirebase";

function Activity() {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState([]);
  const [lecturerId, setLecturerId] = useState(null);

  useEffect(() => {
    if (authUser) {
      const useruid = authUser.uid;
      console.log("Email:", useruid);
      const unsubscribe = onSnapshot(doc(db, "calendarPost", useruid), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          console.log("Fetched data from Firestore:", data);
          const dataModules = data.lecturerPost;
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
          console.log(formattedPosts);
          console.log(
            "Modules:",
            formattedPosts.map((item) => item.start)
          );
        }
      });

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
            Activities
          </Typography>
        </CardHeader>
        <CardBody className="p-0">
          {userData.map((item) => (
            <ul className="flex flex-col gap-4 m-2" key={item.uid}>
              <li className="flex items-center gap-4">
                <span className="rounded-full border border-white/20 bg-white/20 p-1">
                  <ArrowRightAltIcon />
                </span>
                <Typography className="font-normal">
                  {item.formattedEndDate}{" "}
                </Typography>
                <Typography className="font-normal">{item.title}</Typography>
              </li>
            </ul>
          ))}
        </CardBody>
        {/* <CardFooter className="mt-12 p-0">
        </CardFooter> */}
      </Card>
    </div>
  );
}

export default Activity;
