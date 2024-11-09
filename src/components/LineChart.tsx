import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { RaceResult } from "../types/RaceDetails.types";

interface Props {
  raceResult: RaceResult[];
}

const LineChart = ({ raceResult }: Props) => {
  const [drivers, setDrivers] = useState<
    { driverName: string; laps: string; status: string; position: string }[]
  >([]);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const drivers = raceResult.map((result) => ({
      driverName: `${result.Driver.givenName} ${result.Driver.familyName}`,
      laps: result.laps,
      status: result.status,
      position: result.position,
    }));

    const colors = generateColors(drivers.length);

    setDrivers(drivers);
    setColors(colors);
  }, [raceResult]);

  const generateColors = (numColors: number) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const hue = Math.floor(Math.random() * 360);
      const color = `hsl(${hue}, 100%, 50%)`;
      colors.push(color);
    }
    return colors;
  };

  const chartData = {
    series: [
      {
        data: drivers.map((driver) => Number(driver.laps)),
      },
    ],
    options: {
      chart: {
        type: "bar" as const,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "80%",
          distributed: true,
          borderRadius: 4,
          borderRadiusApplication: "end" as const,
        },
      },
      colors: colors,
      dataLabels: {
        enabled: true,
        formatter: (
          _val: number,
          { dataPointIndex }: { dataPointIndex: number }
        ) => `${drivers[dataPointIndex].status}`,
        style: {
          colors: ["black"],
          fontSize: "12px",
        },
        offsetX: 10,
      },
      xaxis: {
        categories: drivers.map((driver) => driver.driverName),
      },
      legend: {
        show: false,
      },
      tooltip: {
        y: {
          title: {
            formatter: function () {
              return "";
            },
          },
          formatter: function (
            val: number,
            { dataPointIndex }: { dataPointIndex: number }
          ) {
            const driver = drivers[dataPointIndex];
            return `Laps: ${val}<br>Position: ${driver.position}`;
          },
        },
      },
    },
  };

  return (
    <ReactApexChart
      options={chartData.options}
      series={chartData.series}
      type="bar"
      width={400}
      height={drivers.length * 30}
      data-testid="line-chart"
    />
  );
};

export default LineChart;
