import React from "react";
import Sidebar from "../global/Sidebar";
import NavbarLecturer from "../global/NavbarLecturer";
import AnnouncementsLecturer from "../components/AnnouncementsLecturer";

function Bookings() {
  return (
    <div className="flex">
      <div className="w-1/4">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full mx-2 mt-4 h-screen">
        <NavbarLecturer title={"Announcements"} />
        <div className="mt-0">
          <AnnouncementsLecturer />
        </div>
      </div>
    </div>
  );
}

export default Bookings;
