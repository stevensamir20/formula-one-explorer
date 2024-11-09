import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import {
  fetchRaceDetails,
  selectRaceDetails,
} from "../../state/slices/raceDetailsSlice";
import { RaceRow } from "../../types/RaceDetails.types";

// Components
import { Alert, Breadcrumbs, Stack, Typography } from "@mui/material";
import TableComponent from "../../components/TableComponent";
import Loader from "../../components/Loader";
import LineChart from "../../components/LineChart";
import RadarChart from "../../components/RadarChart";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const RaceDetails: React.FC = () => {
  const { seasonId, raceId } = useParams<{
    seasonId: string;
    raceId: string;
  }>();
  const dispatch = useDispatch<AppDispatch>();

  const { raceResult, raceName, loading, error } = useSelector(
    (state: RootState) => selectRaceDetails(state)
  );

  const [raceRows, setRaceRows] = useState<RaceRow[]>([]);
  const [pinnedDrivers, setPinnedDrivers] = useState<string[]>([]);

  useEffect(() => {
    if (seasonId && raceId) {
      dispatch(fetchRaceDetails({ seasonId, raceId }));
    }
  }, [dispatch, seasonId, raceId]);

  useEffect(() => {
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
  }, [raceResult]);

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

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      {raceRows.length !== 0 && (
        <Stack spacing={4} mt={5}>
          <Stack>
            <Typography variant="h2" className="container-title">
              {raceName}
            </Typography>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
              sx={{
                "& a": { color: "black" },
                "& p": { color: "#9d1414" },
              }}
            >
              <Link to="/">Seasons</Link>
              <Link to={`/seasons/${seasonId}`}>{seasonId} Races</Link>
              <Typography>{raceName}</Typography>
            </Breadcrumbs>
          </Stack>

          <TableComponent
            headings={{
              position: "Position",
              driverName: "Driver Name",
              nationality: "Nationality",
              team: "Team",
              pin: "Highlight",
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
          {pinnedDrivers.length === 0 && (
            <Alert data-testid="error-highlight" severity="error">
              Highlight drivers from the table to see their performace chart!
            </Alert>
          )}
          <Stack
            direction={{ md: "column", lg: "row" }}
            alignItems="center"
            justifyContent="center"
            spacing={8}
          >
            <LineChart raceResult={raceResult} />
            <RadarChart raceResult={raceResult} drivers={pinnedDrivers} />
          </Stack>
        </Stack>
      )}
      {error && (
        <Alert data-testid="error" severity="error" sx={{ mt: 5 }}>
          Error! {error}
        </Alert>
      )}
    </>
  );
};

export default RaceDetails;
