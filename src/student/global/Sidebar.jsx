import React, { useEffect, useState } from "react";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PeopleIcon from "@mui/icons-material/People";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { CalendarMonth } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import UJLOGO from "../images/uj.png";
import GoodMorning from "../images/goodmorning.gif";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Alert,
} from "@material-tailwind/react";
import { CubeTransparentIcon } from "@heroicons/react/24/solid";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/configFirebase";
function Sidebar() {
  const [openAlert, setOpenAlert] = React.useState(true);
  const [userData, setUserData] = useState([]);
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  // Navigation Bar for students
  const menuItem = [
    {
      name: "Modules",
      icon: <HomeIcon />,
      path: "/modules",
    },
    {
      name: "Calendar",
      icon: <CalendarMonth />,
      path: "/calendar",
    },
    {
      name: "Notepad",
      icon: <BookmarkIcon />,
      path: "/Notepad",
    },
    {
      name: "Community",
      icon: <PeopleIcon />,
      path: "/community",
    },
    // {
    //   name: "Chart",
    //   icon: <LeaderboardIcon />,
    //   path: "/chart",
    // },
    // {
    //   name: "Test",
    //   icon: <LeaderboardIcon />,
    //   path: "/test",
    // },
    // {
    //   name: "Bookings",
    //   icon: <LibraryBooksIcon />,
    //   path: "/bookings",
    // },
    // {
    //   name: "Trello",
    //   icon: <FormatListBulletedIcon />,
    //   path: "/trello",
    // }
  ];

  useEffect(() => {
    if (user) {
      const email = user.uid;
      //console.log("Email:", email);
      const unsubscribe = onSnapshot(doc(db, "users", email), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          //console.log("Fetched data from Firestore:", data);
          setUserData(data);
          console.log("User Data:", userData);
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logOut();
      navigate("/");
      console.log("Logout");
    } catch (err) {
      console.log(err);
    }
  };

  // greeting message based on time you logged in
  const date = new Date();
  const hour = date.getHours();
  let greeting = "";
  let image = "";
  let description = "";
  const morningGreetings = [
    "Rise and shine! Embrace the new day with enthusiasm and positivity.",
    // "Good Morning! A new day, a new opportunity to make things happen.",
    // "Hello, sunshine! Wishing you a morning filled with joy and productivity.",
  ];

  const afternoonGreetings = [
    // "Good Afternoon! Take a break, recharge, and conquer the rest of the day!",
    // "The afternoon sun brings warmth and energy. You're halfway through – keep going!",
    "Hello there! Afternoons are for progress. You're doing great!",
  ];

  const eveningGreetings = [
    // "Good Evening! Reflect on the day's accomplishments and get ready for a peaceful night.",
    "As the day winds down, take a moment to relax and appreciate your efforts.",
    // "Good Night! Time to rest and recharge for another day of achievements.",
  ];
  function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
  if (hour < 12) {
    greeting = "Good Morning";
    image = GoodMorning;
    description = morningGreetings;
  } else if (hour < 18) {
    greeting = "Good Afternoon";
    image = "https://media.giphy.com/media/fWOk3E9VjiM2IccBFr/giphy.gif";
    description = getRandomElement(afternoonGreetings);
  } else {
    greeting = "Good Evening";
    image = "https://media.giphy.com/media/1hMmAbOE57QaVgCgc1/giphy.gif";
    description = getRandomElement(eveningGreetings);
  }
  return (
    <Card className="fixed inset-0 z-50  h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 m-4 shadow-xl shadow-blue-gray-900/5">
      <div className="my-auto mx-auto flex items-center gap-4 p-4">
        <img src={UJLOGO} alt="UJ LOGO" className="h-24 w-24 " />
      </div>
      <List className="my-auto ">
        {menuItem.map((item, index) => (
          <NavLink to={item.path} key={index} className="">
            <ListItem className="p-4 hover:bg-primary hover:text-white text-xl ">
              <ListItemPrefix className="">{item.icon}</ListItemPrefix>
              {item.name}
            </ListItem>
          </NavLink>
        ))}

        <ListItem
          className="mt-10 p-4 hover:bg-primary hover:text-white text-xl"
          onClick={handleLogout}
        >
          <ListItemPrefix>
            <LogoutIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
      <Alert
        open={openAlert}
        className="mt-auto "
        // onClose={() => setOpenAlert(false)}
      >
        {/* <CubeTransparentIcon className="mb-4 h-12 w-12" /> */}
        <img
          src={image}
          alt="Good Morning"
          className="mb-4 h-20 w-20 rounded-lg"
        />
        <Typography variant="h6" className="mb-1">
          {greeting}, {userData.name}!
        </Typography>
        <Typography variant="small" className="font-normal opacity-80">
          {description}
        </Typography>
        <div className="mt-4 flex gap-3">
          {/* <Typography
          as="a"
          href="#"
          variant="small"
          className="font-medium opacity-80"
          onClick={() => setOpenAlert(false)}
        >
          Dismiss
        </Typography> */}
        </div>
      </Alert>
    </Card>
  );
}

export default Sidebar;
