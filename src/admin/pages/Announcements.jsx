import React from "react";
import Sidebar from "../global/Sidebar";
import NavigationBar from "../global/NavigationBar";
import AnnouncementComponents from "../components/AnnouncementComponents";

function Announcements() {
  return (
    <div className="flex">
      <div className="w-1/4">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full mx-5 mt-4">
        <NavigationBar title={"Announcements"} />
        <div className="mt-0 mx-auto">
          <AnnouncementComponents />
        </div>
      </div>
    </div>
  );
}

export default Announcements;
