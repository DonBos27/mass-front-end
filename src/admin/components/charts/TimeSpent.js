import calculateTimeSpent from "./calculateTime";
import { useAuth } from "../../../context/AuthContext";



const timeSpentChartData = {

    // This function is called every 5 seconds to update the chart

    height: 220,
    series: [
        {
            update: async function () {
                const { currentUser } = useAuth();
                console.log("Current user:", currentUser)
                const timeSpent = await calculateTimeSpent(currentUser);
                console.log("Time spent in minutes:", timeSpent);

                // Update the chart data
                this.updateSeries([
                    {
                        data: [timeSpent],
                    },
                ]);
            },
            type: "line", 
            data: [50],
        },
    ],
    options: {
        colors: ["blue"],
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
            categories: [1, "Day 2", "Day 3", "Day 4", "Day 5"], // Example labels for x-axis
        },
    },
};

export default timeSpentChartData;

