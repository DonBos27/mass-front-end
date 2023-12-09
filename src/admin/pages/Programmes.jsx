import React from "react";
import Sidebar from "../global/Sidebar";
import NavigationBar from "../global/NavigationBar";
import TabsProgram from "../components/TabsProgram";

function Programmes() {
  return (
    <div className="flex">
      <div className="w-1/4">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full mx-5 mt-4">
        <NavigationBar title={"Programmes"} />
        <div className="mt-12">
          <TabsProgram />
        </div>
      </div>
    </div>
  );
}

export default Programmes;
