const comparePass = {
    type: "bar",
    height: 220,
    series: [
        {
            name: "Register",
            data: [90, 80, 95, 62, 70, 60, 80],
        },
        {
            name: "Pass",
            data: [70, 60, 75, 42, 50, 40],
        }
    ],
    options: {
        colors: ["#F26522","#2E1A46"],
        plotOptions: {
            bar: {
                columnWidth: "50%",
                borderRadius: 1,
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: ["17", "18", "19", "20", "21", "22", "23"],
        },
    },
};

export default comparePass;
