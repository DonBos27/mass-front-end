import React from "react";
import Sidebar from "../global/Sidebar";
import NavbarLecturer from "../global/NavbarLecturer";
import CalendarLecturer from "../components/CalendarLecturer";
import ModulesLecturer from "../components/ModulesLecturer";
import { Typography } from "@material-tailwind/react";
import StatisticsCardLecturer from "../components/StatisticsCardLecturer";
import Activity from "../components/Activity";
import ProfileCard from "../components/ProfileCard";

function DashBoardLecturer() {
  return (
    <div className="flex">
      <div className="w-1/4">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full mx-5 mt-4 h-screen">
        <NavbarLecturer title={"Home"} />
        <div className="flex my-3">
          <div className="w-3/4">
            <StatisticsCardLecturer />
            <div className=" bg-white rounded-lg mb-5">
              <Typography className="text-4xl font-bold py-5 px-6">
                Schedule
              </Typography>
              <div className="pb-3">
                <CalendarLecturer />
              </div>
            </div>
          </div>
          <div className="m-10 w-1/4 flex flex-col">
            <div className="mb-10">
              <ProfileCard />
            </div>
            <div className="mb-10">
              <Activity />
            </div>
          </div>
        </div>

        {/* <div className="m-6">
          <Typography className="text-4xl font-bold py-5">Modules</Typography>
          <ModulesLecturer />
        </div> */}
      </div>
    </div>
  );
}

export default DashBoardLecturer;
