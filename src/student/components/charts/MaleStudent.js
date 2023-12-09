const maleRegisterd = {
    height: 400,
    series: [
        {
            type: "line",
            name: "Timespent",
            data: [80, 70, 75, 80, 70, 60, 60],
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
                stops: [0, 90, 100]
            }
        },
        stroke: {
            curve: "smooth"
        },
        xaxis: {
            categories: [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
            ],
        },
    },
};
export default maleRegisterd;
