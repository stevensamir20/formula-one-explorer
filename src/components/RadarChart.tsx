import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { RaceResult } from "../types/RaceDetails.types";

interface Props {
  drivers: string[];
  raceResult: RaceResult[];
}

const RadarChart = ({ drivers, raceResult }: Props) => {
  const highestLaps = useMemo(
    () => Math.max(...raceResult.map((result) => parseInt(result.laps))),
    [raceResult]
  );
  const bestDriverPoints = useMemo(
    () => Math.max(...raceResult.map((result) => parseInt(result.points))),
    [raceResult]
  );
  const highestGridPosition = useMemo(
    () => Math.max(...raceResult.map((result) => parseInt(result.grid))),
    [raceResult]
  );
  const numberOfDrivers = useMemo(() => raceResult.length, [raceResult]);

  const pinnedDrivers = useMemo(
    () =>
      raceResult.filter((result) => drivers.includes(result.Driver.driverId)),
    [drivers, raceResult]
  );

  const series = pinnedDrivers.map((driver) => ({
    name: driver.Driver.givenName + " " + driver.Driver.familyName,
    data: [
      (parseInt(driver.laps) / highestLaps) * 100,
      (parseInt(driver.points) / bestDriverPoints) * 100,
      (parseInt(driver.grid) / highestGridPosition) * 100,
      ((numberOfDrivers - parseInt(driver.position) + 1) / numberOfDrivers) *
        100,
    ],
  }));

  const options = {
    chart: {
      height: 350,
      type: "radar" as const,
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        blur: 1,
        left: 1,
        top: 1,
      },
    },
    fill: {
      opacity: 0.1,
    },
    tooltip: {
      y: {
        title: {
          formatter: function () {
            return "";
          },
        },
        formatter: function (
          _val: number,
          {
            seriesIndex,
            dataPointIndex,
          }: { seriesIndex: number; dataPointIndex: number }
        ) {
          const driver = pinnedDrivers[seriesIndex];

          let label = "";
          if (dataPointIndex === 0) {
            label = `Laps: ${driver.laps}`;
          } else if (dataPointIndex === 1) {
            label = `Points: ${driver.points}`;
          } else if (dataPointIndex === 2) {
            label = `Grid Position: ${driver.grid}`;
          } else if (dataPointIndex === 3) {
            label = `Race Position: ${driver.position}`;
          }

          return `Driver: ${driver.Driver.familyName}<br>${label}
          `;
        },
      },
    },
    markers: {
      size: 4,
      strokeWidth: 2,
    },
    xaxis: {
      categories: [
        `Laps (${highestLaps})`,
        `Points (${bestDriverPoints})`,
        `Grid Position (${highestGridPosition})`,
        `Race Position (${numberOfDrivers})`,
      ],
    },
    yaxis: {
      show: false,
    },
  };

  if (drivers.length === 0) {
    return;
  }

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="radar"
      width={600}
      height={400}
      data-testid="radar-chart"
    />
  );
};

export default RadarChart;
