import { Card, Typography } from "@material-tailwind/react";
import React from "react";
import ModulesSstudent from "./ModulesSstudent";

function ModuleList() {
  return (
    <div>
      <Card className=" h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 m-4 shadow-xl shadow-blue-gray-900/5">
        <div className="mb-2 p-4">
          <Typography variant="h3" color="blue-gray">
            Modules 
          </Typography>
        </div>
        <ModulesSstudent />
      </Card>
    </div>
  );
}

export default ModuleList;
