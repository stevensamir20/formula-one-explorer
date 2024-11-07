import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { RaceResult, RaceRow, FetchData } from "../../types/RaceDetails.types";
import { Alert, Stack } from "@mui/material";
import TableComponent from "../../components/TableComponent";
import Loader from "../../components/Loader";
import LineChart from "../../components/LineChart";
import RadarChart from "../../components/RadarChart";

const RaceDetails = () => {
  const { seasonId, raceId } = useParams<{
    seasonId: string;
    raceId: string;
  }>();

  const [raceResult, setRaceResult] = useState<RaceResult[]>([]);
  const [raceRows, setRaceRows] = useState<RaceRow[]>([]);
  const [highlightedDrivers, setHighlightedDrivers] = useState<RaceResult[]>(
    []
  );

  const { data, error, loading } = useFetch(
    `${seasonId}/${raceId}/results.json`
  );

  useEffect(() => {
    if (data) {
      const raceData: RaceResult[] = (data as FetchData).MRData.RaceTable
        .Races[0].Results;
      setRaceResult(raceData);

      const raceRows = raceData
        .map((result) => ({
          driverId: result.Driver.driverId,
          driverName: `${result.Driver.givenName} ${result.Driver.familyName}`,
          nationality: result.Driver.nationality,
          team: result.Constructor.name,
          position: result.position,
          laps: result.laps,
          status: result.status,
          pin: false,
        }))
        .sort((a, b) => parseInt(a.position) - parseInt(b.position));
      setRaceRows(raceRows);
    }
  }, [data]);

  const handleDriverHighlight = (driverId: string) => {
    setRaceRows((prevRaceRows) =>
      prevRaceRows.map((row) =>
        row.driverId === driverId ? { ...row, pin: !row.pin } : row
      )
    );

    setHighlightedDrivers((prevHighlightedDrivers) => {
      const isHighlighted = prevHighlightedDrivers.some(
        (driver) => driver.Driver.driverId === driverId
      );
      if (isHighlighted) {
        return prevHighlightedDrivers.filter(
          (driver) => driver.Driver.driverId !== driverId
        );
      } else {
        const driver = raceResult.find(
          (result) => result.Driver.driverId === driverId
        );
        if (driver) {
          return [...prevHighlightedDrivers, driver];
        }
        return prevHighlightedDrivers;
      }
    });
  };

  return (
    <>
      {loading && <Loader />}
      {raceRows.length !== 0 && (
        <Stack spacing={6} alignItems="center" mt={5}>
          <TableComponent
            columns={{
              pin: "Highlight",
              driverName: "Driver Name",
              nationality: "Nationality",
              team: "Team",
              position: "Position",
            }}
            data={raceRows}
            rowPin={{
              key: "driverId",
              click: (driverId: string) => {
                handleDriverHighlight(driverId);
              },
            }}
          />
          {raceResult.length !== 0 && (
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={6}
              alignItems="center"
            >
              <LineChart raceResult={raceResult} />
              <RadarChart
                raceResult={raceResult}
                drivers={highlightedDrivers}
              />
            </Stack>
          )}
        </Stack>
      )}
      {error && <Alert severity="error">Error! {error}</Alert>}
    </>
  );
};

export default RaceDetails;
