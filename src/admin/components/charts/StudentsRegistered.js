const studentsRegistered = {
  type: "bar",
  height: 220,
  series: [
    {
      name: "Views",
      data: [90, 80, 95, 62, 70, 60, 80],
    },
  ],
  options: {
    colors: "#5E72E4",
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

export default studentsRegistered;
