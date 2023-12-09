import React, { useEffect, useState } from "react";
import {
  Navbar,
  Typography,
  IconButton,
  Button,
  Input,
  Avatar,
} from "@material-tailwind/react";
import {
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/configFirebase";
import { doc, onSnapshot } from "firebase/firestore";

function NavbarLecturer({ title }) {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState([]);
  const [lecturerId, setLecturerId] = useState(null);

  useEffect(() => {
    if (authUser) {
      const email = authUser.email;
      console.log("Email:", email);
      const unsubscribe = onSnapshot(doc(db, "users", email), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          console.log("Fetched data from Firestore:", data);
          console.log("Time spent:", calculateTimeSpent(email));
          setUserData(data);
          setLecturerId(data.name);
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [authUser]);

  return (
    <div className="m-0 max-h-auto w-full">
      <Navbar className="top-0 z-10 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4 bg-transparent border-transparent shadow-transparent">
        <div className="w-full flex items-center justify-between gap-y-4 text-blue-gray-900">
          <Typography
            as="a"
            href="#"
            variant="h6"
            className="mr-4 ml-2 cursor-pointer py-1.5"
          >
            {title}
          </Typography>
          <div className=" flex gap-1 md:mr-4">
            {/* <IconButton variant="text" color="blue-gray">
              <Cog6ToothIcon className="h-6 w-6" />
            </IconButton>
            <IconButton variant="text" color="blue-gray">
              <BellIcon className="h-6 w-6" />
            </IconButton> */}
            <IconButton variant="text" color="blue-gray">
              {userData.image ? (
                <Avatar
                  size="xl"
                  alt="avatar"
                  src={userData.image}
                  className="border shadow-xl h-10 w-10 shadow-green-900/20 mt-0 mx-auto "
                />
              ) : (
                <UserCircleIcon className="h-6 w-6" />
              )}
            </IconButton>
          </div>
        </div>
      </Navbar>
    </div>
  );
}

export default NavbarLecturer;
