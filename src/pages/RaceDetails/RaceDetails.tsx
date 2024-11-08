import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import {
  fetchRaceDetails,
  selectRaceDetails,
} from "../../state/slices/raceDetailsSlice";
import { RaceRow } from "../../types/RaceDetails.types";

// Components
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
  const dispatch = useDispatch<AppDispatch>();

  const { raceResult, loading, error } = useSelector((state: RootState) =>
    selectRaceDetails(state)
  );

  const [raceRows, setRaceRows] = useState<RaceRow[]>([]);
  const [pinnedDrivers, setPinnedDrivers] = useState<string[]>([]);

  useEffect(() => {
    if (seasonId && raceId && !raceResult.length) {
      dispatch(fetchRaceDetails({ seasonId, raceId }));
    }

    if (raceResult.length > 0) {
      const raceRows = raceResult
        .map((result) => ({
          driverId: result.Driver.driverId,
          driverName: `${result.Driver.givenName} ${result.Driver.familyName}`,
          nationality: result.Driver.nationality,
          team: result.Constructor.name,
          position: result.position,
          laps: result.laps,
          status: result.status,
        }))
        .sort((a, b) => parseInt(a.position) - parseInt(b.position));
      setRaceRows(raceRows);
    }
  }, [dispatch, raceResult, seasonId, raceId]);

  const handleDriverPin = (driverId: string) => {
    setPinnedDrivers((prev: string[]) => {
      const isPinned = prev.includes(driverId);
      if (isPinned) {
        return prev.filter((id) => id !== driverId);
      } else {
        return [...prev, driverId];
      }
    });
  };

  return (
    <>
      {loading && <Loader />}
      {raceRows.length !== 0 && (
        <Stack spacing={6} alignItems="center" mt={5}>
          <TableComponent
            headings={{
              pin: "Highlight",
              driverName: "Driver Name",
              nationality: "Nationality",
              team: "Team",
              position: "Position",
            }}
            data={raceRows}
            itemPin={{
              key: "driverId",
              click: (driverId: string) => {
                handleDriverPin(driverId);
              },
            }}
            pinnedItems={pinnedDrivers}
          />
          {raceResult.length !== 0 && (
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={6}
              alignItems="center"
            >
              <LineChart raceResult={raceResult} />
              <RadarChart raceResult={raceResult} drivers={pinnedDrivers} />
            </Stack>
          )}
        </Stack>
      )}
      {error && <Alert severity="error">Error! {error}</Alert>}
    </>
  );
};

export default RaceDetails;
