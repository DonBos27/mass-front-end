import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { calculateTimeSpent } from "./charts/calculateTime";
// import { useAuth } from "../../context/AuthContext";

function Timespent({ currentUser }) {
  const [chartData, setChartData] = useState({
    height: 220,
    series: [
      {
        type: "column",
        name: "Time spent",
        data: [80, 70, 75, 80, 70, 60],
      },
      {
        type: "area",
        name: "Average",
        data: [62, 62, 62, 62, 62, 62],
      },
    ],
    options: {
      colors: ["#F26522","#2E1A46"],
      plotOptions: {
        bar: {
          columnWidth: "50%",
          borderRadius: 1,
        },
      },
    //   chart: {
    //     toolbar: {
    //       show: true,
    //     },
    //   },
      dataLabels: {
        enabled: false,
      },
    //   fill: {
    //     type: "gradient",
    //     gradient: {
    //       shadeIntensity: 1,
    //       opacityFrom: 0.7,
    //       opacityTo: 0.5,
    //       stops: [0, 90, 100],
    //     },
    //   },
    //   stroke: {
    //     curve: "smooth",
    //   },
      xaxis: {
        categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // Example labels for x-axis
      },
    },
  });

  //   const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        if (!currentUser) {
          console.log("No user");
          return;
        }

        // Assuming calculateTimeSpent works correctly
        const timeSpent = await calculateTimeSpent(currentUser.email);

        // console.log("Time spent:", timeSpent);

        // setChartData((prevChartData) => ({
        //   ...prevChartData,
        //   series: [
        //     {
        //       name: "Time Spent",
        //       data: [timeSpent],
        //     },
        //   ],
        // }));
        // console.log(chartData);
      } catch (error) {
        console.error("Error fetching time spent:", error);
      }
    }

    fetchData();
  }, [currentUser]); // Only depend on currentUser

  return (
    <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-1 xl:grid-cols-1">
      <Card className="">
        <CardHeader color="white" className="relative h-56">
          <Chart
            options={chartData.options}
            series={chartData.series}
            // type="bar"
            // height="350"
            // width="100%"
          />
        </CardHeader>
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            Time spent on MASS
          </Typography>
          <Typography>
            This describe the time(in minute) you spent on MASS per day
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
}

export default Timespent;
