import React from "react";
import { Spinner, Typography } from "@material-tailwind/react";

function SpinnerLoading() {
  return (
    <div>
      <Spinner className="h-28 w-28 text-primary" />
      <Typography className="text-gray-900/50 text-xl text-center mt-3">Loading...</Typography>
    </div>
  );
}

export default SpinnerLoading;
