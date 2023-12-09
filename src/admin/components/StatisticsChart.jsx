import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import StudentsRegistered from "./charts/StudentsRegistered";
import MaleRegisterd from "./charts/MaleStudent";
import ComparePass from "./charts/ComparePass";
import StateGender from "./charts/StateGender";
import StateFemaleCount from "./charts/StateFemaleCount";

function StatisticsChart() {
  const dataMale = StateGender();
  const dataFemale = StateFemaleCount();
  const maleRegisterd = {
    height: 220,
    series: [
      {
        type: "line",
        name: "Males",
        data: [], // Initialize with an empty array
      },
      {
        type: "area",
        name: "Females",
        data: [], // Initialize with an empty array
      },
    ],
    options: {
      colors: ["blue", "#FF92A5"],
      chart: {
        toolbar: {
          show: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.5,
          stops: [0, 90, 100],
        },
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: ["15", "16", "17", "18", "19", "20", "21", "22", "23"],
      },
    },
  };

  const allData = dataMale + dataFemale;
  console.log("all data :", allData);

  // percentage of male students registered in the department per year
  const malePercentage = (dataMale / allData) * 100;
  const femalePercentage = (dataFemale / allData) * 100;

  // round up the percentage to 2 decimal places\
  const maleRegisteredRound = malePercentage.toFixed(0);
  const femaleRegisteredRound = femalePercentage.toFixed(0);

  maleRegisterd.series[0].data = [75, 77, 78, 66, 65, 68, 68, 59, maleRegisteredRound];
  maleRegisterd.series[1].data = [
    25,
    23,
    22,
    34,
    35,
    32,
    32,
    41,
    femaleRegisteredRound,
  ];
  console.log("data :", maleRegisterd);

  const menu = [
    {
      id: 1,
      title: "Percentage of Students Enrolled",
      description:
        "This describe the number of students enrolled in the department per year",
      data: StudentsRegistered,
    },
    {
      id: 2,
      title: "Percentage of male and female students",
      description:
        "This describe the number of males students and females students in the department per year",
      data: maleRegisterd,
    },
    {
      id: 3,
      title: "Percentage of students who passed/registered",
      description:
        "This describe the number of students who passed and registered in the department per year",
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
