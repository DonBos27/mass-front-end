import React from "react";
import Sidebar from "../global/Sidebar";
import NavbarLecturer from "../global/NavbarLecturer";
import { Typography } from "@material-tailwind/react";
import ModulesLecturer from "../components/ModulesLecturer";

function Modules() {
  return (
    <div className="flex">
      <div className="w-1/4">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full mx-5 mt-4 h-screen">
        <NavbarLecturer title={"Modules"} />
        <div className="m-6">
          {/* <Typography className="text-4xl font-bold py-5">Modules</Typography> */}
          <ModulesLecturer />
        </div>
      </div>
    </div>
  );
}

export default Modules;
