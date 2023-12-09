import React from "react";
import Chart from "react-apexcharts";
import MaleRegisterd from "./charts/MaleStudent";
import { Card } from "@material-tailwind/react";
function TimeSpandChart() {
  return (
    <div>
      <Card className="">
        <Chart {...MaleRegisterd} />
      </Card>
    </div>
  );
}

export default TimeSpandChart;
