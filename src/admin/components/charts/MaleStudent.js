
const maleRegisterd = {
    
    height: 220,
    series: [
        {
            type: "line",
            name: "Males",
            data: [],
        },
        {
            type: "area",
            name: "Females",
            data: [],
        }
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
                "15",
                "16",
                "17",
                "18",
                "19",
                "20",
                "21",
                "22",
                "23",
            ],
        },
    },
   
};
export default maleRegisterd;
