import React from "react";
import {
  Navbar,
  Typography,
  IconButton,
  Button,
  Input,
  Breadcrumbs,
} from "@material-tailwind/react";
import {
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/configFirebase";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfilePic from "../images/profileicon.png";

function NavbarStudent({ title, Icon, handleProfile }) {
  const [userData, setUserData] = useState([]);
  const { user, logOut } = useAuth();
  useEffect(() => {
    if (user) {
      const email = user.email;
      //console.log("Email:", email);
      const unsubscribe = onSnapshot(doc(db, "users", email), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          //console.log("Fetched data from Firestore:", data);
          setUserData(data);
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [user]);
  return (
    <div className="m-0 max-h-auto w-full">
      <Navbar className="top-0 z-10 h-[80px] max-w-full flex items-center rounded-lg bg-transparent shadow-transparent border-transparent">
        <div className="w-full flex items-center justify-between gap-y-4 text-blue-gray-900">
          <Typography
            as="a"
            href="#"
            variant="h6"
            className="cursor-pointer py-1.5"
          >
            <div className="flex flex-col gap-3">
              <Breadcrumbs className="bg-gray-300">
                <Icon />
                <span>{title}</span>
              </Breadcrumbs>
              {/* <div className=" text-2xl">{title}</div> */}
            </div>
          </Typography>
          <div className=" flex gap-1 md:mr-0">
            {/* <IconButton variant="text" color="blue-gray">
              <Cog6ToothIcon className="h-6 w-6" />
            </IconButton>
            <IconButton variant="text" color="blue-gray">
              <BellIcon className="h-6 w-6" />
            </IconButton> */}
            <div
              onClick={handleProfile}
              className="w-10 h-10"
            >
              <img className="w-10 h-10 rounded-full cursor-pointer" src={userData.image ? userData.image : ProfilePic} alt="" />
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
}

export default NavbarStudent;
