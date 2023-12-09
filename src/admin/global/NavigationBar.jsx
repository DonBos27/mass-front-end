import React, { useEffect, useState } from "react";
import {
  Navbar,
  Typography,
  IconButton,
  Button,
  Input,
  Avatar,
  Drawer,
  Menu,
  MenuList,
  MenuItem,
  MenuHandler,
  Badge,
} from "@material-tailwind/react";
import {
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/configFirebase";
import { doc, onSnapshot } from "firebase/firestore";

function NavigationBar({ title }) {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState([]);
  const [lecturerId, setLecturerId] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    if (authUser) {
      const email = authUser.email;
      console.log("Email:", email);
      const unsubscribe = onSnapshot(doc(db, "users", email), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          console.log("Fetched data from Firestore:", data);
          // console.log("Time spent:", calculateTimeSpent(email));
          setUserData(data);
          setLecturerId(data.name);
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [authUser]);

  const handleOpenDrawer = () => {
    setOpenSettings(true);
  };

  const handleCloseDrawer = () => {
    setOpenSettings(false);
  };

  return (
    <div className="m-0 max-h-auto w-full">
      <Navbar className="top-0 z-10 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4 bg-transparent border-transparent shadow-transparent">
        <div className="w-full flex items-center justify-between gap-y-4 text-blue-gray-900">
          <Typography
            as="a"
            href="#"
            variant="h6"
            className="mr-4 ml-0 cursor-pointer py-1.5"
          >
            {title}
          </Typography>
          <div className=" flex gap-1 md:mr-4">
            {/* <IconButton
              variant="text"
              color="blue-gray"
              onClick={handleOpenDrawer}
            >
              <Cog6ToothIcon className="h-6 w-6" />
            </IconButton> */}
            {/* <Badge content="1" withBorder className="bg-primary">
              <Menu placement="bottom-end">
                <MenuHandler>
                  <IconButton variant="text" color="blue-gray">
                    <BellIcon className="h-6 w-6" />
                  </IconButton>
                </MenuHandler>
                <MenuList>
                  <MenuItem>Menu Item 1</MenuItem>
                  <MenuItem>Menu Item 2</MenuItem>
                  <MenuItem>Menu Item 3</MenuItem>
                </MenuList>
              </Menu>
            </Badge> */}
            {/* <IconButton variant="text" color="blue-gray">
              {userData.image ? (
                <Avatar
                  size="xs"
                  alt="avatar"
                  src={userData.image}
                  className="border shadow-xl shadow-green-900/20 mt-10 mx-auto "
                />
              ) : (
                <UserCircleIcon className="h-6 w-6" />
              )}
            </IconButton> */}
          </div>
        </div>
      </Navbar>
      <Drawer
        placement="right"
        open={openSettings}
        onClose={handleCloseDrawer}
        className="p-4"
      >
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            Settings
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={handleCloseDrawer}
          >
            <CloseIcon className="h-6 w-6" />
          </IconButton>
        </div>
      </Drawer>
    </div>
  );
}

export default NavigationBar;
