import React, { useEffect, useState } from "react";
import Sidebar from "../global/Sidebar";
import NavigationBar from "../global/NavigationBar";
import StatisticsCard from "../components/StatisticsCard";
import StatisticsChart from "../components/StatisticsChart";
import WelcomeCard from "../components/WelcomeCard";
// import CalendarLecturer from "../../lecturers/components/CalendarLecturer";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db, usersCollection } from "../../firebase/configFirebase";
import { Typography } from "@material-tailwind/react";
import TimetablesModules from "../components/TimetablesModules";
import Timespent from "../components/Timespent";
import AllActivities from "../components/AllActivities";

function Dashboard() {
  const { user, logIn } = useAuth();
  // fetch data from firestore
  // const [userData, setUserData] = useState(null);

  // const unsub = onSnapshot(doc(usersCollection, `${user.email}`), (doc) => {
  // });

  // const handleLogin = async () => {
  //   try {
  //     if (user) {
  //       const userDocRef = doc(db, "users", user.email);
  //       console.log(userDocRef);
  //       await updateDoc(userDocRef, {
  //         timeIn: Timestamp.fromDate(new Date()),
  //       });
  //     }
  //     console.log("Login");
  //   } catch (err) {
  //     console.log(err);
  //     console.log("Failed to Login");
  //   }
  // };
  // useEffect(() => {
  //   handleLogin();
  // }, []);

  return (
    <div className="flex">
      <div className="w-1/4">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full mx-5 mt-4">
        <NavigationBar title={"Dashboard"} />
        <div className="flex flex-col">
          <StatisticsCard />
          <div className="flex mt-3 mx-0 justify-evenly">
            <div className=" bg-white rounded-lg mb-5 w-2/3">
              <Typography className="text-4xl font-bold py-5 px-6">
                Timetable
              </Typography>
              <div className="pb-0">
                <TimetablesModules />
              </div>
            </div>
            <div className="w-1/3 ml-5">
              <WelcomeCard />
              {/* <div className="mt-5">
                <WelcomeCard />
              </div> */}
            </div>
          </div>
        </div>
        <div className="mt-12">
          <StatisticsChart />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
