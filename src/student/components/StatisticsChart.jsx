import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import StudentsRegistered from "./charts/StudentsRegistered";
import ChartLabs from "./charts/ChartLabs";
import ComparePass from "./charts/ComparePass";

function StatisticsChart() {
  const menu = [
    {
      id: 1,
      title: "Percentage of number of Assigments",
      description:
        "This describe the number of assignments so far this year",
      data: StudentsRegistered,
    },
    {
      id: 2,
      title: "Percentage of number of Labs and Tutorials",
      description:
        "This describe the number of Labs and Tutorials so far this year",
      data: ChartLabs,
    },
    {
      id: 3,
      title: "Percentage of number of Tests and Exams",
      description:
        "This describe the number of Tests and Exams so far this year",
      data: ComparePass,
    },
  ];
  return (
    <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
      {menu.map((item) => (
        <Card className="" key={item.id}>
          <CardHeader color="white" className="relative h-56">
            <Chart {...item.data} />
          </CardHeader>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              {item.title}
            </Typography>
            <Typography>{item.description}</Typography>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default StatisticsChart;
