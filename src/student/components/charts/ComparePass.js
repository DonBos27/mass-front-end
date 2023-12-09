const comparePass = {
    type: "radialBar",
    height: 220,
    series: [10],
    colors: ["#F26522"],

    options: {
        plotOptions: {
            radialBar: {
                hollow: {
                    margin: 0,
                    size: "70%",
                    background: "#293450",
                },
                dataLabels: {
                    showOn: "always",
                    name: {
                        show: true,
                        fontSize: "13px",
                        fontWeight: "700",
                        offsetY: -5,
                        color: "#fff",
                    },
                    value: {
                        color: "#fff",
                        fontSize: "20px",
                        fontWeight: "700",
                        offsetY: 5,
                        show: true,
                    },
                },
                track: {
                    background: "#293450",
                    strokeWidth: "100%",
                },
            },
        },
        labels: ["Tests"],


    },
};

export default comparePass;
